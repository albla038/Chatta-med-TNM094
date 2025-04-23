"use client";
import { useState } from "react";
import { ChatInput } from "./chat-input";
import TopicSuggestionCards from "./topic-suggestion-cards";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { SOCKET_URL } from "@/lib/constants";
import { Conversation, Message } from "@/lib/types";
import useConversations from "@/hooks/use-conversations";
import { useRouter } from "next/navigation";

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
  const { addConversation } = useConversations();

  // WebSocket connection
  const { readyState } = useWebSocket(SOCKET_URL, {
    share: true,
    // Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: () => true,
  });

  function sendMessage(message: string) {
    const conversationId = crypto.randomUUID();
    const messageId = crypto.randomUUID();

    let title = message;
    if (message.length >= 35) {
      title = message.slice(0, 35) + "...";
    }

    const newConversation: Conversation = {
      id: conversationId,
      title,
      createdAt: Date.now(),
      messages: new Map<string, Message>([
        [
          messageId,
          {
            id: messageId,
            role: "user",
            content: message,
          },
        ],
      ]),
      sentFirstMessage: false,
    };

    addConversation(newConversation);

    // Redirect user to new chat
    router.push(`/chat/${conversationId}`);
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
