# Pydantic models
from pydantic import BaseModel

class QuestionReqBody(BaseModel):
    query: str
    context: str = ""
