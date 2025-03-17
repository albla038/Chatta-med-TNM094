"use client";
import { useEffect, useState } from "react";
import { ChatInput } from "./chat-input";
import { UserMessage } from "./user-message";
import { ClientMessage } from "./client-message";

type ResponseData = {
  content: string;
};

type ConversationData = {
  role: string;
  content: string;
}[];

export default function Chat() {
  // --- state ---
  const [input, setInput] = useState("");
  const [conversationHistory, setConversationHistory] =
    useState<ConversationData>([]);

  // --- side effects ---

  // read data from localStorage on mount
  useEffect(() => {
    const storageString = localStorage.getItem("conversation-history");
    if (storageString) {
      setConversationHistory(JSON.parse(storageString) as ConversationData);
    }
  }, []);

  // write to localStorage when state changes
  useEffect(() => {
    localStorage.setItem(
      "conversation-history",
      JSON.stringify(conversationHistory)
    );
  }, [conversationHistory]);

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

      console.log(data.content);
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

// We wish to store the conversation history in local storage in order to access previous conversations.
// We need an id to be able to switch between the conversations.
// (Later, we need a title of the conversation, which can be set by either the llm or user. useState. Changes in the layout.)
// We can use localStorage.setItem(conversationHistory, id/key)
// To remove the object, we can use localStorage.removeItem()
