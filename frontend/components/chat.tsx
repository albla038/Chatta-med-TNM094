"use client";
import { useState } from "react";
import { ChatInput } from "./chat-input";
import UserMessage from "./user-message";
import AssistantMessage from "./assistant-message";
import useLocalStorage from "@/hooks/use-local-storage";

type ResponseData = {
  content: string;
};

type ConversationItem = {
  role: string;
  content: string;
};

export default function Chat() {
  // State
  const [input, setInput] = useState("");
  const [conversationHistory, setConversationHistory] = useLocalStorage<
    ConversationItem[]
  >("conversation-history", []);

  // Send message to the backend and update the conversation history
  async function sendMessage() {
    const trimmedInput = input.trim();
    setInput("");
    if (trimmedInput.length === 0) {
      return;
    }

    const newConversationHistory = [
      ...conversationHistory,
      { role: "user", content: input },
    ];
    setConversationHistory(newConversationHistory);

    const url = "http://127.0.0.1:8000"; // TODO Change in production

    try {
      const response = await fetch(`${url}/llm/conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConversationHistory),
      });

      if (!response.ok) {
        console.error(response.statusText);
        const errorData = await response.json();
        console.error(errorData);
        throw new Error(`Response status: ${response.status}`);
      }

      const data = (await response.json()) as ResponseData;
      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unknown error!");
      }
    }
  }

  return (
    <main className="w-full grow flex flex-col justify-end p-8 pb-16 max-w-4xl">
      <ul className="w-full flex flex-col grow items-end gap-4">
        {conversationHistory.map((message, id) => (
          <li
            key={id}
            className={message.role === "assistant" ? "self-start" : ""}
          >
            {message.role === "user" ? (
              <UserMessage>{message.content}</UserMessage>
            ) : (
              <AssistantMessage>{message.content}</AssistantMessage>
            )}
          </li>
        ))}
      </ul>
      <ChatInput input={input} setInput={setInput} handleClick={sendMessage} />
    </main>
  );
}
