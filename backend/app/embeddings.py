from langchain_openai import OpenAIEmbeddings
from .config import env

# embedding object holds the OpenAI embedding model instance
# Max tokens: 8191
# Dimensions: 1536
embedding = OpenAIEmbeddings(
  model="text-embedding-3-small",
  api_key=env.OPENAI_API_KEY
  # dimensions=1536
)