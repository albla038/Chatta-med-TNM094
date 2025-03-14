"use client";
import { useState } from "react";
import { ChatInput } from "./chat-input";
import { UserMessage } from "./user-message";
import { ClientMessage } from "./client-message";

export default function Chat() {
  const [input, setInput] = useState("");
  const [humanMessage, setHumanMessage] = useState<string | null>(null);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  type ResponseData = {
    query: string;
    content: string;
    metadata: any;
  };

  async function sendMessage() {
    setHumanMessage(input);
    const trimmedInput = input.trim();
    setInput("");

    if (trimmedInput.length === 0) {
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmedInput,
          context: "",
        }),
      });

      if (!response.ok) {
        console.error(response.statusText);
        const errorData = await response.json();
        console.error(errorData);
        throw new Error(`Response status: ${response.status}`);
      }

      const data = (await response.json()) as ResponseData;
      setAiMessage(data.content);
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <main className="w-full grow flex flex-col justify-end p-8 pb-16 max-w-4xl">
      <div className="w-full flex flex-col grow items-end">
        {humanMessage ? <UserMessage>{humanMessage}</UserMessage> : ""}
        {aiMessage ? <ClientMessage>{aiMessage}</ClientMessage> : ""}
      </div>
      <ChatInput
        input={input}
        setInput={setInput}
        handleClick={sendMessage}
      ></ChatInput>
    </main>
  );
}
