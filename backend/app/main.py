from fastapi import FastAPI, status, UploadFile
from .services import handle_question, handle_upload_pdf
from .models import QuestionReqBody
from .vector_db import vector_db
from .vector_db import retriever
from .vector_db import find_vectors_with_query
from langchain_core.documents import Document
from uuid import uuid4

app = FastAPI()

@app.get("/")
async def root():
  return {"status": "ok", "message": "All systems up and running"}

@app.post("/ask")
async def ask(req_body: QuestionReqBody):
  response = await handle_question(req_body)
  return response

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

# @app.post("/upload/text")
# async def upload_text():
#   pass

@app.post("/upload/pdf")
async def upload_pdf(file: UploadFile):
  data = await handle_upload_pdf(file)

  return {
    "status": "ok",
    "message": "File uploaded successfully",
    "filename": file.filename,
    "content_type": file.content_type,
    "data": data
  }