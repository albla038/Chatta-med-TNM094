from fastapi import FastAPI, HTTPException, status, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from .services import handle_question, handle_conversation, handle_upload_pdf, handle_upload_webpage, delete_document_by_prefix, fetch_all_ids
from .models import QuestionReqBody, ConversationData
from .vector_db import vector_db, find_vectors_with_query
from langchain_core.documents import Document
from uuid import uuid4
from typing import List


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

@app.get("/get_uploaded_vectorIDs")
async def get_uploaded_vectorIDs():
  try:
    ids = await fetch_all_ids()
    return PlainTextResponse(
      content="\n".join(ids),
      status_code=200
    )
  except Exception as e:
  # Return 400 Bad Request
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail={"error": type(e).__name__, "message": str(e)}
    )
