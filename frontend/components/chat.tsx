"use client";
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./chat-input";
import UserMessage from "./user-message";
import AssistantMessage from "./assistant-message";
import clsx from "clsx";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Conversation, Message } from "@/lib/types";
import { SOCKET_URL } from "@/lib/constants";
import { useChat } from "@/hooks/use-chat";
import { motion } from "motion/react";

type ChatProps = {
  chatId: string;
};

export default function Chat({ chatId }: ChatProps) {
  // STATE
  const [input, setInput] = useState("");
  // HOOKS
  const { messages, sendMessage, isOpen } = useChat(chatId);

  // DERIVED STATE
  // Check if the last message in the conversation history is from the user
  const pending = messages.slice(-1)[0]?.role === "user";

  function handleSendMessageClick() {
    // Clean the user-input and clear the chat-input component
    const trimmedInput = input.trim();
    if (trimmedInput.length === 0) {
      return;
    }
    setInput("");
    sendMessage(trimmedInput);
  }

  function printConversation() {
    if (messages.length != 0) {
      return messages.map((message) => (
        <li
          key={message.id}
          className={clsx(
            "first:pt-12 last:pb-12 px-4",
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
    }
  }

  return (
    <main className="w-full h-full flex items-center flex-col pb-0 min-[24rem]:pb-12">
      <div
        className="w-full h-full overflow-y-auto flex flex-col items-center pl-[14px]"
        style={{ scrollbarGutter: "stable" }}
      >
        <motion.ul
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col w-full h-full items-end gap-4 max-w-4xl"
        >
          {printConversation()}
          {/* Pending/thinking indicator */}
          {pending && (
            <li className="animate-pulse w-4 h-1.5 rounded-full bg-gray-400 self-start" />
          )}
        </motion.ul>
      </div>
      <ChatInput
        input={input}
        setInput={setInput}
        handleClick={handleSendMessageClick}
        disabled={!isOpen}
      />
      <div className="bottom-4 absolute text-muted-foreground text-sm">
        Språkmodellen kan göra misstag. Kontrollera viktig information.
      </div>
    </main>
  );
}

// const mock: Conversation = {
//   id: crypto.randomUUID(),
//   messages: [
//     {
//       id: crypto.randomUUID(),
//       role: "user",
//       content: "Hej",
//     },
//   ],
//   createdAt: new Date().toISOString(),
//   sentFirstMessage: false,
// };

// console.log(JSON.stringify(mock));
