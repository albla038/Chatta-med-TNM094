"use client";
import { useEffect, useState } from "react";
import { ChatInput } from "./chat-input";
import UserMessage from "./user-message";
import AssistantMessage from "./assistant-message";
import useLocalStorage from "@/hooks/use-local-storage";
import clsx from "clsx";
import useWebSocket, { ReadyState } from "react-use-websocket";

type ResponseData = {
  content: string;
};

type ResponseMessage = {
  status: string;
  // id: string;
  role: string;
  content: string;
};

type ConversationItem = {
  role: string;
  content: string;
};

export default function Chat() {
  // STATE
  const [input, setInput] = useState("");
  const [conversationHistory, setConversationHistory] = useLocalStorage<
    ConversationItem[]
  >("conversation-history", []);

  // TODO State to manage the error state of the chat input
  const [isError, setIsError] = useState(false);

  // DERIVED STATE
  // Check if the last message in the conversation history is from the user
  const pending =
    conversationHistory[conversationHistory.length - 1]?.role === "user";

  // WebSocket connection
  const socketURL = "ws://127.0.0.1:8000/ws/llm/conversation";
  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket(
    socketURL,
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
      const { role, content, status } = lastJsonMessage as ResponseMessage;

      if (status === "ok") {
        setConversationHistory((prev) => [...prev, { role, content }]);
      } else {
        // TODO Handle error messages from the server by rendering them in the UI
        console.error("Error in response:", lastJsonMessage);
      }
    }

    // TODO Handle other error cases, such as connection errors or timeouts
    // maybe use function onError() or form useWebSocket()
    // or shouldReconnect() function event
  }, [lastJsonMessage, setConversationHistory]);

  // Send message to the backend and update the conversation history
  async function sendMessage() {
    const trimmedInput = input.trim();
    setInput("");
    if (trimmedInput.length === 0) {
      return;
    }

    const newConversationHistory = [
      ...conversationHistory,
      { role: "user", content: trimmedInput },
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

  // Send message to the backend and update the conversation history
  function sendMessageViaWS() {
    // Trim the input to remove leading and trailing whitespace
    // and set the input state to an empty string
    const trimmedInput = input.trim();
    setInput("");
    if (trimmedInput.length === 0) {
      return;
    }

    // Add the user message to the conversation history
    const newConversationHistory = [
      ...conversationHistory,
      { role: "user", content: trimmedInput },
    ];
    setConversationHistory(newConversationHistory);

    // Send the message to the server via WebSocket
    sendJsonMessage(newConversationHistory);
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
          {/* Pending/thinking indicator */}
          {pending && (
            <li className="animate-pulse w-4 h-1.5 rounded-full bg-gray-400 self-start" />
          )}
        </ul>
      </div>
      <ChatInput
        input={input}
        setInput={setInput}
        handleClick={sendMessageViaWS}
        disabled={readyState !== ReadyState.OPEN}
      />
    </main>
  );
}
