"use client";
import { useState } from "react";
import { ChatInput } from "./chat-input";
import UserMessage from "./user-message";
import AssistantMessage from "./assistant-message";
import useLocalStorage from "@/hooks/use-local-storage";
import clsx from "clsx";

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
    <main className="w-full h-full flex items-center flex-col pb-12">
      <div
        className="w-full h-full overflow-y-auto flex flex-col items-center pl-[14px]"
        style={{ scrollbarGutter: "stable" }}
      >
        <ul className="flex flex-col w-full h-full items-end gap-4 max-w-4xl">
          {conversationHistory.map((message, id) => (
            <li
              key={id}
              className={clsx(
                "first:pt-12 last:pb-12",
                message.role === "assistant" ? "self-start" : ""
              )}
            >
              {message.role === "user" ? (
                <UserMessage>{message.content}</UserMessage>
              ) : (
                <AssistantMessage>{message.content}</AssistantMessage>
              )}
            </li>
          ))}
        </ul>
      </div>
      <ChatInput input={input} setInput={setInput} handleClick={sendMessage} />
    </main>
  );
}
