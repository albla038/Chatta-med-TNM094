from fastapi import FastAPI
from .llm import handle_question
from .models import QuestionReqBody

app = FastAPI()

@app.get("/")
async def root():
  return {"status": "ok", "message": "All systems up and running"}

@app.post("/ask")
async def ask(req_body: QuestionReqBody):
  response = await handle_question(req_body)
  return response