"use client";
import { useEffect, useState } from "react";
import { ChatInput } from "./chat-input";
import UserMessage from "./user-message";
import AssistantMessage from "./assistant-message";
import useLocalStorage from "@/hooks/use-local-storage";

import clsx from "clsx";
import useWebSocket, { ReadyState } from "react-use-websocket";
import TopicSuggestionCards from "./topic-suggestion-cards";

type ResponseMessage = {
  status: string;
  id: string;
  role: string;
  content: string;
  responseMetadata: null | {
    [key: string]: string;
  };
};

type ConversationItem = {
  messageId: string;
  role: string;
  content: string;
  metadata?: {
    [key: string]: string;
  };
};

const topicSuggestionsList = [
  "Vad är syftet med kursen TNM094?",
  "Vad lär jag mig i kursen TNM094?",
  "Vad handlar projektarbetet om?",
  "Hur examineras jag i kursen?",
];

export default function Chat({ chatId }: { chatId: string }) {
  // STATE
  const [input, setInput] = useState("");
  const [conversationHistory, setConversationHistory] = useLocalStorage<
    ConversationItem[]
  >(`conversation-history-${chatId}`, []);

  // TODO State to manage the error state of the chat input
  // const [isError, setIsError] = useState(false);

  // DERIVED STATE
  // Check if the last message in the conversation history is from the user
  const pending = conversationHistory.slice(-1)[0]?.role === "user";

  // WebSocket connection *
  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket(
    "ws://127.0.0.1:8000/ws/llm/conversation",
    {
      share: true,
      // Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: () => true,
      // Log messages to console
      onOpen: () => console.log("WebSocket opened"),
      onClose: () => console.log("WebSocket closed"),
    }
  );

  // Update conversation history when a new message is received from the server
  useEffect(() => {
    // Check if the last message is a valid JSON object
    if (lastJsonMessage) {
      // Cast the incoming message to the expected type and destructure it
      const { status, id, role, content, responseMetadata } =
        lastJsonMessage as ResponseMessage;

      if (status === "ok") {
        setConversationHistory((prev) => {
          // console.log(prev);

          // Check if the message ID already exists in the conversation history
          const existingMessage = prev.find((msg) => msg.messageId === id);
          if (existingMessage) {
            // If it exists, update the content of the existing message
            if (responseMetadata !== null) {
              // If the message has metadata, then the streaming has ended
              return prev.map((msg) =>
                msg.messageId === id
                  ? {
                      ...msg,
                      content: msg.content + content,
                      metadata: responseMetadata,
                    }
                  : msg
              );
            }

            // If the message doesn't have metadata, then it's still streaming
            return prev.map((msg) =>
              msg.messageId === id
                ? { ...msg, content: msg.content + content }
                : msg
            );
          }

          // If the message doesn't exist already, add the new message to the conversation history
          return [...prev, { messageId: id, role, content }];
        });
      } else {
        // TODO Handle error messages from the server by rendering them in the UI
        console.error("Error in response:", lastJsonMessage);
      }
    }

    // TODO Handle other error cases, such as connection errors or timeouts
    // maybe use function onError() or form useWebSocket()
    // or shouldReconnect() function event
  }, [lastJsonMessage, setConversationHistory]);

  function handleSendMessageClick() {
    // Clean the user-input and clear the chat-input component
    const trimmedInput = input.trim();
    setInput("");
    if (trimmedInput.length === 0) {
      return;
    }
    sendMessage(trimmedInput);
  }

  // Send message to the backend and update the conversation history
  async function sendMessage(message: string) {
    // TODO Is this unneccesary?
    const trimmedMessage = message.trim();

    // Update the conversation history
    const newConversationHistory = [
      ...conversationHistory,
      { messageId: crypto.randomUUID(), role: "user", content: trimmedMessage },
    ];
    setConversationHistory(newConversationHistory);

    // Send the message to the server via WebSocket
    // TODO Remove or handle the messageId in the backend
    sendJsonMessage(newConversationHistory);
  }

  function printConversation() {
    if (conversationHistory.length != 0) {
      return conversationHistory.map((message) => (
        <li
          key={message.messageId}
          className={clsx(
            "first:pt-12 last:pb-12",
            message.role === "assistant" ? "self-start" : ""
          )}
        >
          {message.role === "user" ? (
            <UserMessage>{message.content}</UserMessage>
          ) : (
            <AssistantMessage message={message.content}></AssistantMessage>
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
          {/* Pending/thinking indicator */}
          {pending && (
            <li className="animate-pulse w-4 h-1.5 rounded-full bg-gray-400 self-start" />
          )}
        </ul>
      </div>
      <ChatInput
        input={input}
        setInput={setInput}
        handleClick={handleSendMessageClick}
        disabled={readyState !== ReadyState.OPEN}
      />
    </main>
  );
}
