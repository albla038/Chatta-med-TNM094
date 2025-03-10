from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from .config import env
from .embeddings import embedding
from fastapi import HTTPException

pc = Pinecone(api_key=env.PINECONE_API_KEY)
index_name = "tnm094"

index = pc.Index(index_name)

vector_db = PineconeVectorStore(index=index, embedding=embedding)

# Alternatively, you can use the retriever to search for similar vectors
retriever = vector_db.as_retriever(
  search_type="similarity_score_threshold",
  search_kwargs={"k": 5, "score_threshold": 0.5}
)

async def find_vectors_with_query(query: str, k: int, threshold: float):
  result = await vector_db.asimilarity_search_with_relevance_scores(query, k=k, score_threshold=threshold)
  if len(result) == 0:
    raise HTTPException(status_code=404, detail={"message": "No vectors found"})
  else:
    return result