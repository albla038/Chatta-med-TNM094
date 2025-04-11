from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from .config import env
from .models import ConversationData
from typing import List

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

async def call_model_with_conversation(conversation: List[ConversationData], context: str):
  openai_message = [msg.model_dump() for msg in conversation]
  openai_message.insert(0, {"role": "system", "content": context})
  return await llm.ainvoke(openai_message)

async def call_model_for_assesment(instruction: str):
  return await llm.ainvoke([SystemMessage(content=instruction)])