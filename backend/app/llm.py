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