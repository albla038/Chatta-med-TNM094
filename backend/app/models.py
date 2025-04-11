# Pydantic models
from pydantic import BaseModel, Field

class QuestionReqBody(BaseModel):
  query: str
  context: str = ""

class ConversationData(BaseModel):
  id: str
  role: str
  content: str