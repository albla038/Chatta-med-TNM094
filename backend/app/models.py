# Pydantic models
from pydantic import BaseModel, Field

class QuestionReqBody(BaseModel):
  query: str
  context: str = ""

class ConversationData(BaseModel):
  message_id: str = Field(alias="messageId")
  role: str
  content: str