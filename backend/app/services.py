from .llm import llm, call_model, call_model_with_conversation
from .vector_db import vector_db, ingest_documents, index
from fastapi import HTTPException, UploadFile
import os, re, logging
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
from .utils import filter_document_metadata, split_text, clean_text
from .models import ConversationData
from typing import List
from .logger import logger
import re
import tempfile

async def handle_question(question: str): 
  # Retrive relevant text/inputs from vector database...
  found_documents = await vector_db.asimilarity_search_with_relevance_scores(question, k=10, score_threshold=0.65)
  docs_content = "\n".join(doc.page_content for doc in found_documents)

  promt_template = """
  Du är en assistent för frågebesvarande uppgifter i kursen TNM094 och ska representera Linköpings universitet. Använd följande delar av hämtad kontext för att svara på frågan. Om du inte vet svaret, säg bara att du inte vet. Svara pedagogiskt.
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

async def handle_conversation(conversation: List[ConversationData]): 
  last_question = conversation[-1].content

  # Retrive relevant text/inputs from vector database...
  found_documents = await vector_db.asimilarity_search_with_relevance_scores(last_question, k=10, score_threshold=0.75)
  docs_content = "\n".join(doc.page_content for doc, score in found_documents)

  promt_template = """
  Du är en assistent för frågebesvarande uppgifter i kursen TNM094 och ska representera Linköpings universitet. Använd följande delar av hämtad kontext för att svara på frågan. Om du inte vet svaret, säg bara att du inte vet. Svara pedagogiskt.
  Kontext:
  {context}


  """

  context = promt_template.format(context=docs_content)

  model_response = await call_model_with_conversation(conversation, context)

  # Log the results
  logger.info(f"Last Question: {last_question}")
  logger.info(f"Conversation: {conversation}")
  logger.info(f"Number of Found Documents: {len(found_documents)}")
  logger.info(f"Found Documents: {found_documents}")
  logger.info(f"Model Response Object: {model_response}")
  logger.info(f"-----------------------------")


  return {"content": model_response.content}


async def handle_conversation_stream(conversation: List[ConversationData]): 
  last_question = conversation[-1].content

  # Retrive relevant text/inputs from vector database...
  found_documents = await vector_db.asimilarity_search_with_relevance_scores(last_question, k=10, score_threshold=0.75)
  docs_content = "\n".join(doc.page_content for doc, score in found_documents)

  promt_template = """
  Du är en assistent för frågebesvarande uppgifter i kursen TNM094 och ska representera Linköpings universitet. Använd följande delar av hämtad kontext för att svara på frågan. Om du inte vet svaret, säg bara att du inte vet. Svara pedagogiskt.
  Kontext:
  {context}


  """

  context = promt_template.format(context=docs_content)

  openai_message = [msg.model_dump() for msg in conversation]
  openai_message.insert(0, {"role": "system", "content": context})

  # TODO Log the results

  async for chunk in llm.astream(openai_message):
    # If metadata with "finish_reason" exists, send stop message
    yield {
      "id": chunk.id,
      "content": chunk.content,
    }

async def handle_upload_pdf(file: UploadFile):
  if not file.filename.endswith(".pdf"):
    raise HTTPException(status_code=400, detail={"error": "Bad Request", "message": "Only PDF files are allowed"})
  
  filename_clean = clean_text(file.filename)

  # Create a temporary directory
  with tempfile.TemporaryDirectory() as temp_dir:
    temp_file_path = os.path.join(temp_dir, file.filename)
  
    # Save the file to the temporary directory
    with open(temp_file_path, "wb") as temp_file:
      content = await file.read()
      temp_file.write(content)
      temp_file.flush()

    # Load and extract text using PyPDFLoader
    loader = PyPDFLoader(temp_file_path)
    pages = await loader.aload()

    # Split the text into chunks
    all_chunks = split_text(pages, chunk_size=1000, chunk_overlap=200)
    
    allowed_keys = {"title", "source", "total_pages", "page", "page_label", "start_index"}
    all_chunks = filter_document_metadata(all_chunks, allowed_keys)
    
    await ingest_documents(all_chunks, filename_clean)

    return all_chunks
  
async def handle_upload_webpage(page_url: str):
  try:
    loader = WebBaseLoader(web_paths=[page_url])
    page_content = []

    async for doc in loader.alazy_load():
      # Remove all (\r) 
      doc.page_content = re.sub(r"\r+", "", doc.page_content)
      # Normalize excessive newlines (replace 3+ newlines with 2)
      doc.page_content = re.sub(r'\n{3,}', '\n\n', doc.page_content)
      page_content.append(doc)

    all_chunks = split_text(page_content, chunk_size=1000, chunk_overlap=200)
    allowed_keys = {"title", "source", "total_pages", "page", "page_label", "start_index"}
    all_chunks = filter_document_metadata(all_chunks, allowed_keys)
    cleaned_url = clean_text(page_url)
    await ingest_documents(all_chunks, cleaned_url)
    
    return {"status": "ok", "message": "Webpage uploaded successfully", "url": page_url, "all chunks": all_chunks}

  except Exception as e:
    # Return error
    raise

async def delete_document_by_prefix(filename_or_url:str):
   # Clean "filename_or_url" from spaces
  id_prefix = clean_text(filename_or_url)
  # Delete all ids in the database that starts with "id_prefix"
  for ids in index.list(prefix=id_prefix):
    vector_db.delete(ids=ids)
  return ids

async def fetch_all_ids():
  # Initialize the variables
  all_ids = []
  pagination_token = None

  # Fetch data, paginated
  while True:
    # List vectors in the namespace with pagination
    results = index.list_paginated(
      # Number of records to fetch per call (100 is max value)
      limit=100,
      # Use the token to paginate
      pagination_token=pagination_token
    )
    # Collect the vector IDs
    all_ids.extend([v.id for v in results.vectors])
    # Check if pagination exists and get the next token for the next request
    if results.pagination and results.pagination.next:
      pagination_token = results.pagination.next
    else:
      # If there's no next token, break
      break

  return sorted(all_ids)