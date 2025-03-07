from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from .config import env

# llm object holds the OpenAI model instance
llm = ChatOpenAI(
  model="gpt-4o-mini",
  api_key=env.OPENAI_API_KEY
  # temperature=0
  # max_tokens=None
  # timeout=None
)

async def call_model(query: str, context: str):
  return await llm.ainvoke([SystemMessage(content=context), HumanMessage(content=query)])