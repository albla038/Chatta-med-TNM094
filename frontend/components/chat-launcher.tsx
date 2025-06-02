"use client";
import { useState } from "react";
import { ChatInput } from "./chat-input";
import TopicSuggestionCards from "./topic-suggestion-cards";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Conversation, Message } from "@/lib/types";
import { useRouter } from "next/navigation";
import { onWSClose, onWSOpen } from "@/lib/utils";
import { createConversation } from "@/actions/conversations";

const topicSuggestionsList = [
  "Vad är syftet med kursen TNM094?",
  "Vad lär jag mig i kursen TNM094?",
  "Vad handlar projektarbetet om?",
  "Hur examineras jag i kursen?",
];

export default function ChatLauncher() {
  const router = useRouter();

  // STATE
  const [input, setInput] = useState("");

  // WebSocket connection
  const { readyState, sendJsonMessage } = useWebSocket(
    process.env.NEXT_PUBLIC_BACKEND_API_URL!,
    {
      share: true,
      // Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: () => true,
      onOpen: () => onWSOpen(sendJsonMessage),
      onClose: onWSClose,
    }
  );

  async function sendMessage(message: string) {
    const id = await createConversation(message);
    // Redirect user to new chat
    router.push(`/chat/${id}`);
  }

  return (
    <main className="w-full h-full flex items-center flex-col pb-0 min-[24rem]:pb-12">
      <TopicSuggestionCards
        topicSuggestionsList={topicSuggestionsList}
        handleTopicClick={(message) => sendMessage(message)}
      />
      <ChatInput
        input={input}
        setInput={setInput}
        handleClick={() => sendMessage(input)}
        disabled={readyState !== ReadyState.OPEN}
      />
    </main>
  );
}
