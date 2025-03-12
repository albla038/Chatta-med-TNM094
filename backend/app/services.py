from .models import QuestionReqBody
from .llm import call_model
from fastapi import HTTPException, UploadFile
from langchain_community.document_loaders import PyPDFLoader 
import os

# Define file directory and create it if it doesn't exist
# This directory will be used to store uploaded PDF files
UPLOAD_DIR = "uploads/pdf"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def handle_question(req_body: QuestionReqBody): 
  # Retrive relevant text/inputs from vector database...
  model_reponse = await call_model(req_body.query, req_body.context)
  return {
    "content": model_reponse.content,
    "metadata": model_reponse.response_metadata
  }

async def handle_upload_pdf(file: UploadFile):
  if not file.filename.endswith(".pdf"):
    raise HTTPException(status_code=400, detail={"error": "Bad Request", "message": "Only PDF files are allowed"})
  
  # Create file path for the uploaded file
  file_path = os.path.join(UPLOAD_DIR, file.filename)

  # Save the uploaded file by reading it in chunks and writing it to the file path
  with open(file_path, "wb") as buffer:
    buffer.write(await file.read())

  # Load and extract text using PyPDFLoader
  loader = PyPDFLoader(file_path)
  pages = await loader.aload()

  return pages