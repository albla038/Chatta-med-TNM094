# Pydantic models
from pydantic import BaseModel

class QuestionReqBody(BaseModel):
  query: str
  context: str = ""

class ConversationData(BaseModel):
  role: str
  content: str

class ConversationReqBody(BaseModel):
  data: list[ConversationData]