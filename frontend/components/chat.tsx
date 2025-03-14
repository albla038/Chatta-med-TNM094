"use client";
import { useState } from "react";
import { ChatInput } from "./chat-input";
import { UserMessage } from "./user-message";
import { ClientMessage } from "./client-message";

// TODO Edit
type ResponseData = {
  query: string;
  content: string;
  metadata: any;
};

type ConversationData = {
  role: string;
  content: string;
}[];

export default function Chat() {
  const [input, setInput] = useState("");
  const [conversationHistory, setConversationHistory] =
    useState<ConversationData>([]);

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

    try {
      const response = await fetch("http://127.0.0.1:8000/llm/conversation", {
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
        { role: "assistant", content: input },
      ]);

      console.log(data);
    } catch (error) {
      // TODO FIX
      console.error(error.message);
    }
  }

  return (
    <main className="w-full grow flex flex-col justify-end p-8 pb-16 max-w-4xl">
      <ul className="w-full flex flex-col grow items-end gap-4">
        {conversationHistory.map((message, id) => (
          <li key={id}>
            {message.role === "user" ? (
              <UserMessage>{message.content}</UserMessage>
            ) : (
              <ClientMessage>{message.content}</ClientMessage>
            )}
          </li>
        ))}
      </ul>
      <ChatInput
        input={input}
        setInput={setInput}
        handleClick={sendMessage}
      ></ChatInput>
    </main>
  );
}
