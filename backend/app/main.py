from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
  return {"status": "ok", "message": "All systems up and running"}
