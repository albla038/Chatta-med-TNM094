from fastapi import FastAPI, HTTPException, status, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from .services import handle_question, handle_upload_pdf, handle_upload_webpage
from .models import QuestionReqBody
from .vector_db import vector_db
from .vector_db import find_vectors_with_query
from langchain_core.documents import Document
from uuid import uuid4

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
  await handle_upload_pdf(file)

  return {
    "status": "ok",
    "message": "File uploaded successfully",
    "filename": file.filename,
    "content_type": file.content_type,
  }

@app.post("/upload/pdfs")
async def upload_pdfs(files: list[UploadFile]):
  pass

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