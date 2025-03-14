from .llm import call_model, call_model_with_conversation
from .vector_db import vector_db, ingest_documents
from fastapi import HTTPException, UploadFile
import os
from langchain_community.document_loaders import PyPDFLoader 
from langchain_text_splitters import RecursiveCharacterTextSplitter
from .utils import filter_document_metadata
from .models import ConversationData

# Define file directory and create it if it doesn't exist
# This directory will be used to store uploaded PDF files
UPLOAD_DIR = "uploads/pdf"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def handle_question(question: str): 
  # Retrive relevant text/inputs from vector database...
  found_documents = await vector_db.asimilarity_search(question, k=10)
  docs_content = "\n".join(doc.page_content for doc in found_documents)

  promt_template = """
  Du är en assistent för frågebesvarande uppgifter i kursen TNM094 och ska representera Linköpings universitet. Använd följande delar av hämtad kontext för att svara på frågan. Om du inte vet svaret, säg bara att du inte vet. Använd högst tre meningar och håll svaret kortfattat.
  Kontext:
  {context}


  """

  context = promt_template.format(context=docs_content)

  model_reponse = await call_model(question, context)
  return {
    "query": question,
    "content": model_reponse.content,
    "metadata": model_reponse.response_metadata
  }

async def handle_conversation(conversation: list[ConversationData]): 
  last_question = conversation[-1].content

  # Retrive relevant text/inputs from vector database...
  found_documents = await vector_db.asimilarity_search(last_question, k=10)
  docs_content = "\n".join(doc.page_content for doc in found_documents)

  promt_template = """
  Du är en assistent för frågebesvarande uppgifter i kursen TNM094 och ska representera Linköpings universitet. Använd följande delar av hämtad kontext för att svara på frågan. Om du inte vet svaret, säg bara att du inte vet. Svara tydligt och koncist.
  Kontext:
  {context}


  """

  context = promt_template.format(context=docs_content)

  model_reponse = await call_model_with_conversation(conversation, context)
  return {
    "query": conversation,
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

  text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200, add_start_index=True
  )

  all_splits = text_splitter.split_documents(pages)
  
  allowed_keys = {"title", "source", "total_pages", "page", "page_label", "start_index"}
  all_splits = filter_document_metadata(all_splits, allowed_keys)

  await ingest_documents(all_splits)