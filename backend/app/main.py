from fastapi import FastAPI, HTTPException, status, UploadFile, WebSocket, WebSocketDisconnect, Form
from fastapi.middleware.cors import CORSMiddleware
from .services import (
    handle_question, 
    handle_conversation,
    handle_conversation_stream,
    handle_upload_pdf, 
    handle_upload_webpage, 
    handle_upload_file,
    delete_document_by_prefix, 
    fetch_all_ids
)
from .models import QuestionReqBody, ConversationData, UploadFileData
from .vector_db import vector_db, find_vectors_with_query
from langchain_core.documents import Document
from uuid import uuid4
from typing import List, Annotated
from pydantic import ValidationError

import asyncio

app = FastAPI()

origins = [
  "http://localhost",
  "http://localhost:3000",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/")
async def root():
  return {"status": "ok", "message": "All systems up and running"}

@app.post("/llm/query")
async def llm_query(req_body: QuestionReqBody):
  response = await handle_question(req_body.query)
  return response

@app.post("/llm/conversation")
async def llm_conversation(req_body: List[ConversationData]):
  return await handle_conversation(req_body)
   
@app.post("/vector", status_code=status.HTTP_201_CREATED)
async def create_vector(query: str):
  document = Document(
    page_content=query,
    metadata={"source": "test"}
    )
  
  result = await vector_db.aadd_documents([document], ids=[str(uuid4())])
  return {"status": "ok", "message": "Vector created successfully", "data": result}

@app.get("/vector")
async def find_similar_vectors(query: str):
  result = await find_vectors_with_query(query, k=5, threshold=0.5)
  return {"status": "ok", "message": "Search successful", "data": result}

@app.post("/upload/pdf")
async def upload_pdf(file: UploadFile):
  chunks = await handle_upload_pdf(file)

  return {
    "status": "ok",
    "message": "File uploaded successfully",
    "filename": file.filename,
    "content_type": file.content_type,
    "chunks": chunks
  }

@app.post("/upload/pdfs")
async def upload_pdfs(files: list[UploadFile]):
  results = []
  for file in files:
    chunks = await handle_upload_pdf(file)
    results.append({"filename": file.filename, "chunks": chunks})

  return {
    "status": "ok",
    "message": "File uploaded successfully",
    "file_chunks": results,
  }

@app.post("/upload/url")
async def upload_url(page_url: str):
  try:
    result = await handle_upload_webpage(page_url)

  except Exception as e:
    # Return 400 Bad Request
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail={"error": type(e).__name__, "message": str(e)}
    )

  return result

@app.post("/upload/file")
async def upload_file(
  file: UploadFile,
  relative_path: Annotated[str | None, Form()] = None,
  namespace: str | None = None,
  chunk_size: int = 1000,
  chunk_overlap: int = 200,
  ):
  
  try:
    result = await handle_upload_file(file, relative_path, namespace, chunk_size, chunk_overlap)
    return result

  except Exception as e:
    # Return 400 Bad Request
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail={
        "status": "error",
        "error": type(e).__name__,
        "message": str(e)
      }
    )

@app.post("/upload/files")
async def upload_files(files: list[UploadFile]):
  try:
    results = []
    for file in files:
      result = await handle_upload_file(file)
      results.append(result)
      
    return results

  except Exception as e:
    # Return 400 Bad Request
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail={
        "status": "error",
        "error": type(e).__name__,
        "message": str(e)
      }
    )
  

@app.delete("/delete/document")
async def delete_document(filename_or_url: str, namespace: str | None = None):
  try:
      ids = await delete_document_by_prefix(filename_or_url, namespace)

      if namespace is None:
        namespace = "( default )"

      return {
      "status": "ok",
      "message": "Document deleted",
      "namespace": namespace,
      "Document id:s deleted": ids
    }
  except Exception as e:
    # Return 400 Bad Request
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail={"error": type(e).__name__, "message": str(e)}
    )

@app.delete("/delete/namespace")
async def delete_namespace(namespace: str | None = None):
  try:
    # TODO NOTE: If namespace = None, you may need to set it to "" (default)
    # Delete the namespace
    await vector_db.adelete(delete_all=True, namespace=namespace)

    if namespace is None:
      namespace = "( default )"

    return {
      "status": "ok",
      "message": f"Namespace '{namespace}' deleted successfully"
    }
  except Exception as e:
    # Return 400 Bad Request
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail={"error": type(e).__name__, "message": str(e)}
    )

@app.get("/vector/ids")
async def get_uploaded_ids(namespace: str | None = None):
  try:
    ids = await fetch_all_ids(namespace)
    if namespace is None:
      namespace = "( default )"
    num_of_ids = len(ids)
    return {
      "status": "ok",
      "namnespace": namespace,
      "num_of_ids": num_of_ids,
      "ids": ids
    }
  except Exception as e:
  # Return 500 Internal server error
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail={"error": type(e).__name__, "message": str(e)}
    )

@app.websocket("/ws/llm/conversation")
async def ws_llm_conversation(ws: WebSocket):
  # Accept and open the WebSocket connection
  await ws.accept()

  try:
    # Receive the incoming JSON data continuously
    while True:
      json_data = await ws.receive_json()

      # Validate the incoming JSON data against the Pydantic model (using unpacking operator **)
      try:
        data = [ConversationData(**item) for item in json_data]

        # Stream result back to the client
        content = ""
        # chunk_id: str
        async for chunk in handle_conversation_stream(data):
          chunk_id = chunk["id"]
          content += chunk["content"]
          # Send the chunk of data back to the client
          await ws.send_json({
            "type": "messageChunk",
            "id": chunk["id"],
            "content": content
          })
          # await asyncio.sleep(0.010) # 25ms between chunks
        
        # Send final type "done"
        await ws.send_json({
          "type": "done",
          "id": chunk_id,
          "content": content
        })
      
      except ValidationError as e:
        # Send an error message back to the client if validation fails
        await ws.send_json({"type": "error", "error": "Invalid data", "details": e.errors()})
        continue

      except Exception as e:
        # Handle any other exceptions that may occur during processing
        await ws.send_json({"type": "error", "error": "Unknown error", "details": str(e)})
        continue

  # Handle WebSocket disconnection
  except WebSocketDisconnect:
    # Remove saved state like client ids or perform any cleanup if necessary
    pass

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
  await websocket.accept()
  print("Client connected")

  try:
    while True:
      data = await websocket.receive_json()
      message_id = str(uuid4())
      await stream_assistant_message(websocket, message_id)
  except WebSocketDisconnect:
    print("Client disconnected")

async def stream_assistant_message(websocket: WebSocket, message_id: str):
  full_text = ["Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit.", "Sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua."] * 20
  current = ""

  for word in full_text:
    current += word + " "
    await websocket.send_json({
      "type": "messageChunk",
      "id": message_id,
      "content": current
    })
    await asyncio.sleep(0.005)  # 50ms between chunks

  # Send final "done" flag
  await websocket.send_json({
    "type": "done",
    "id": message_id,
    "content": current
  })
