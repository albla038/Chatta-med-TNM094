"use client";
import { useState } from "react";
import { ChatInput } from "./chat-input";
import UserMessage from "./user-message";
import AssistantMessage from "./assistant-message";
import clsx from "clsx";
import { useChat } from "@/hooks/use-chat";

type ChatProps = {
  chatId: string;
};

export default function Chat({ chatId }: ChatProps) {
  // STATE
  const [input, setInput] = useState("");
  // HOOKS
  const { messageList, sendMessage, isOpen } = useChat(chatId);

  // DERIVED STATE
  // Check if the last message in the conversation history is from the user
  const pending = messageList.slice(-1)[0]?.role === "user";

  function handleSendMessageClick() {
    // Clean the user-input and clear the chat-input component
    const trimmedInput = input.trim();
    if (trimmedInput.length === 0) {
      return;
    }
    setInput("");
    sendMessage(trimmedInput);
  }

  return (
    <main className="w-full h-full flex items-center flex-col pb-0 min-[24rem]:pb-12">
      <div
        className="w-full h-full overflow-y-auto flex flex-col items-center pl-[14px]"
        style={{
          scrollbarGutter: "stable",
          scrollbarColor: "#cbd5e1 #ffffff",
        }}
      >
        <ul className="flex flex-col w-full h-full items-end gap-4 max-w-4xl">
          {messageList.map((message) => (
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
        handleClick={handleSendMessageClick}
        disabled={!isOpen}
      />
      <div className="bottom-4 absolute text-muted-foreground text-sm">
        Språkmodellen kan göra misstag. Kontrollera viktig information.
      </div>
    </main>
  );
}
