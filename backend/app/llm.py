from .models import QuestionReqBody
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from .config import env

async def handle_question(req_body: QuestionReqBody):
    
    # Retrive relevant text/inputs from vector database
    return await call_model(req_body.query, req_body.context)

async def call_model(query: str, context: str):
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        api_key=env.OPENAI_API_KEY
        # temprature=0
        # max_tokens=None
        # timeout=None
    )

    response = await llm.ainvoke([SystemMessage(content=context), HumanMessage(content=query)])
    return { 
        "content": response.content,
        "metadata": response.response_metadata
    }