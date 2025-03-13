from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .services import handle_question
from .models import QuestionReqBody

app = FastAPI()

origins = [
  "http://localhost",
  "http://localhost:3000",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/")
async def root():
  return {"status": "ok", "message": "All systems up and running"}

@app.post("/ask")
async def ask(req_body: QuestionReqBody):
  response = await handle_question(req_body)
  return response