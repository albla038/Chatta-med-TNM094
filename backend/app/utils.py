from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

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