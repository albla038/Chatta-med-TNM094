from pydantic_settings import BaseSettings, SettingsConfigDict

class Env(BaseSettings):
  OPENAI_API_KEY: str
  PINECONE_API_KEY: str
  LISAM_COURSE_DOCS_PATH: str
  # Import env variables from .env file
  model_config = SettingsConfigDict(env_file=".env")

env = Env()