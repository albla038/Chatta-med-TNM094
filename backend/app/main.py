from fastapi import FastAPI, HTTPException, status, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from .services import (
    handle_question, 
    handle_conversation,
    handle_conversation_stream,
    handle_assesment_paragraph,
    handle_assesment_pdf,
    handle_upload_pdf, 
    handle_upload_webpage, 
    handle_upload_file,
    delete_document_by_prefix, 
    fetch_all_ids
)
from .models import QuestionReqBody, ConversationData, AssesmentParagraph
from .vector_db import vector_db, find_vectors_with_query
from langchain_core.documents import Document
from uuid import uuid4
from typing import List
from pydantic import ValidationError

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

@app.post("/upload/files")
async def upload_files(files: list[UploadFile]):
  try:
    results = []
    for file in files:
      result = await handle_upload_file(file)
      results.append(result)
  except Exception as e:
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail={"error": type(e).__name__, "message": str(e)}
    )
  return results

@app.delete("/delete/document")
async def delete_document(filename_or_url: str):
  try:
      ids = await delete_document_by_prefix(filename_or_url)
      return {
      "status": "ok",
      "message": "Document deleted",
      "Document id:s deleted": ids
    }
  except Exception as e:
    # Return 400 Bad Request
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail={"error": type(e).__name__, "message": str(e)}
    )

@app.get("/vector/ids")
async def get_uploaded_ids():
  try:
    ids = await fetch_all_ids()
    return {
    "status": "ok",
    "All uploaded document id:s": ids
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
        async for chunk in handle_conversation_stream(data):
          # Send the chunk of data back to the client
          await ws.send_json({"status": "ok", "id": chunk["id"], "role": "assistant", "content": chunk["content"], "responseMetadata": chunk["response_metadata"]})
      
      except ValidationError as e:
        # Send an error message back to the client if validation fails
        await ws.send_json({"status": "error", "error": "Invalid data", "details": e.errors()})
        continue

      except Exception as e:
        # Handle any other exceptions that may occur during processing
        await ws.send_json({"status": "error", "error": str(e)})
        continue

  # Handle WebSocket disconnection
  except WebSocketDisconnect:
    # Remove saved state like client ids or perform any cleanup if necessary
    pass

@app.post("/assesment/llm/paragraph")
async def llm_assesment_paragraph(assesment_body: AssesmentParagraph):
  try:
    response = await handle_assesment_paragraph(assesment_body)
    return response
  except Exception as e:
    print(f"Error: {e}")


@app.post("/assesment/upload/pdf")
async def upload_pdf_for_assesment(file: UploadFile):
  try:
    paragraphs = await handle_assesment_pdf(file)
  except Exception as e:
      raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail={"error": type(e).__name__, "message": str(e)}
    )
  return paragraphs
  
