from .models import QuestionReqBody
from .llm import call_model

async def handle_question(req_body: QuestionReqBody): 
  # Retrive relevant text/inputs from vector database...
  model_reponse = await call_model(req_body.query, req_body.context)
  return {
    "content": model_reponse.content,
    "metadata": model_reponse.response_metadata
  }