from langchain_core.documents import Document

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
