"use client";
import { useState } from "react";
import { ChatInput } from "./chat-input";
import UserMessage from "./user-message";
import AssistantMessage from "./assistant-message";
import useLocalStorage from "@/hooks/use-local-storage";

import clsx from "clsx";
import TopicSuggestionCards from "./topic-suggestion-cards";

type ResponseData = {
  content: string;
};

type ConversationItem = {
  role: string;
  content: string;
};

const topicSuggestionsList = [
  "Vad är syftet med kursen TNM094?",
  "Vad lär jag mig i kursen TNM094?",
  "Vad handlar projektarbetet om?",
  "Hur examineras jag i kursen?",
  // "Vilka systemutvecklingsmetoder ingår i kursen?",
  // "Finns det någon kurslitteratur?",
  // "Hur ska jag strukturera min individuella rapport?",
  // "Vad är viktigt att tänka på vid samarbete i projektgrupp?",
  // "Vem är examinator?",
  // "Vilka deadlines finns i kursen?",
  // "Vad ingår i laborationerna?",
  // "Vad behöver jag förbereda inför Föreläsning 1?",
];

export default function Chat({ currentId }: { currentId: string | null }) {
  // State
  const [input, setInput] = useState("");
  const [conversationHistory, setConversationHistory] = useLocalStorage<
    ConversationItem[]
  >(`conversation-history-${currentId}`, []);

  // Send message to the backend and update the conversation history
  async function sendMessage(message: string = "") {
    let trimmedInput: string;
    if (message === "") {
      // Clean the user-input and clear the chat-input component
      trimmedInput = input.trim();
      setInput("");
      if (trimmedInput.length === 0) {
        return;
      }
    } else {
      trimmedInput = message;
    }

    // Update the conversation history
    const newConversationHistory = [
      ...conversationHistory,
      { role: "user", content: trimmedInput },
    ];
    setConversationHistory(newConversationHistory);

    const url = "http://127.0.0.1:8000"; // TODO Change in production

    // Send conversation to server/llm
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

      // Update the conversation with llm answer
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

  function printConversation() {
    if (conversationHistory.length != 0) {
      return conversationHistory.map((message, id) => (
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
      ));
    } else {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <TopicSuggestionCards
            topicSuggestionsList={topicSuggestionsList}
            handleTopicClick={(message) => sendMessage(message)}
          />
        </div>
      );
    }
  }

  return (
    <main className="w-full h-full flex items-center flex-col pb-12">
      <div
        className="w-full h-full overflow-y-auto flex flex-col items-center pl-[14px]"
        style={{ scrollbarGutter: "stable" }}
      >
        <ul className="flex flex-col w-full h-full items-end gap-4 max-w-4xl">
          {printConversation()}
        </ul>
      </div>
      <ChatInput input={input} setInput={setInput} handleClick={sendMessage} />
    </main>
  );
}
