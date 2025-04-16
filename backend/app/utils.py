import os, re
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from headings_variable import headings_for_splittning

def filter_document_metadata(documents: list[Document], allowed_keys: dict) -> list[Document]:
  """
  Filter documents based on allowed keys
  """
  return [
    Document(
        page_content=doc.page_content,
        metadata={k: v for k, v in doc.metadata.items() if k in allowed_keys}
    )
    for doc in documents
]

def split_text(documents: list[Document], chunk_size: int, chunk_overlap: int):
  # Define text splitter
  text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=chunk_size, chunk_overlap=chunk_overlap, add_start_index=True
  )
  # Split text with text splitter
  all_chunks = text_splitter.split_documents(documents)
  return all_chunks

def clean_text(filename: str):
    # Replace swedish 
    filename = filename.replace("å", "a").replace("ä", "a").replace("ö", "o")
    filename = filename.replace("Å", "A").replace("Ä", "A").replace("Ö", "O")
    # Replace space with _
    filename = filename.replace(" ", "_")  
    return filename

async def extract_paragraphs(text):
  headings = headings_for_splittning
  pattern = '|'.join([re.escape(h) for h in headings])
  parts = re.split(f'(?=\\b({pattern})\\b)', text)

  sections = []
  current_heading = None
  current_text = ""

  for part in parts:
      if part.strip() in headings:
          if current_heading:
              sections.append({"heading": current_heading, "text": current_text.strip()})
          current_heading = part.strip()
          current_text = ""
      else:
          current_text += part

  if current_heading and current_text:
      sections.append({"heading": current_heading, "text": current_text.strip()})

  return sections