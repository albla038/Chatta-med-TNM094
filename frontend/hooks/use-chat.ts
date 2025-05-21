import {
  Conversation,
  Message,
  WebSocketIncomingMessage,
  WebSocketOutgoingMessage,
} from "@/lib/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import useConversations from "./use-conversations";
import { onWSClose, onWSOpen } from "@/lib/utils";

export function useChat(chatId: string) {
  // STATE
  const [messages, setMessages] = useState<Map<string, Message>>(new Map());
  const conversationRef = useRef<Conversation>(null);

  const messageList = useMemo(() => [...messages.values()], [messages]);

  // HOOKS
  const { getConversation, updateConversation, isLoading } = useConversations();

  // Websocket hook
  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket(
    process.env.NEXT_PUBLIC_BACKEND_API_URL!,
    {
      share: true,

      // Attempts to reconnect on all close events (such as server shutting down)
      shouldReconnect: () => true,
      onOpen: () => onWSOpen(sendJsonMessage),
      onClose: onWSClose,
    }
  );

  // EFFECTS
  // Keep refs updated with the latest functions
  useEffect(() => {
    conversationRef.current = getConversation(chatId);
  }, [getConversation, chatId]);

  // Read messages from local storage
  // and send first message in conversation to the server if the chat is new
  useEffect(() => {
    if (isLoading || !chatId) return;

    if (!conversationRef.current) {
      console.error(`Conversation with id ${chatId} doesn't exist.`);
      return;
    }

    // Store the current conversation in the ref
    const conversation = conversationRef.current;
    // Set the initial messages for the chat UI
    setMessages(conversation.messages);

    // Check if the first message needs to be sent
    const firstMessage = conversation.messages.values().next().value;
    if (!conversation.sentFirstMessage && firstMessage?.role === "user") {
      const messages = [...conversation.messages.values()];
      sendJsonMessage(messages);
      // Mark as sent and update the conversation state immediately
      const updatedConversation = { ...conversation, sentFirstMessage: true };
      updateConversation(updatedConversation);
      // Update the ref as well
      conversationRef.current = updatedConversation;
    }

    // Cleanup function to clear the ref when chatId changes or component unmounts
    return () => {
      conversationRef.current = null;
    };
  }, [chatId, isLoading, sendJsonMessage, updateConversation]);

  // Send message to the server
  const sendMessage = useCallback(
    (content: string) => {
      const messageId = crypto.randomUUID();
      const userMessage: Message = {
        id: messageId,
        role: "user",
        content,
      };

      // Update local state immediately for responsiveness

      setMessages((prevMessages) => {
        const newMessages = new Map(prevMessages);
        newMessages.set(messageId, userMessage);
        // Get the current conversation state
        const conversation = conversationRef.current;
        if (!conversation) {
          console.error("Cannot send message: Conversation Ref not set!");
          // Revert optimistic update
          return prevMessages;
        }

        // Send messages to backend
        const messagesArray: WebSocketOutgoingMessage[] = [
          ...newMessages.values(),
        ];
        sendJsonMessage(messagesArray);

        const updatedConversation = { ...conversation, messages: newMessages };
        // Update the persistent conversation state
        updateConversation(updatedConversation);

        // Update the ref
        // conversationRef.current = updatedConversation;

        return newMessages;
      });
    },
    [sendJsonMessage, updateConversation]
  );

  const handleStreamChunk = useCallback((id: string, content: string) => {
    setMessages((prevMessages) => {
      // Copy previous messages to a new Map
      const newMessages = new Map(prevMessages);
      // Update the message with the new content
      // If the message doesn't exist, create a new one
      newMessages.set(id, {
        id,
        role: "assistant",
        content,
        isStreaming: true,
      });
      return newMessages;
    });
  }, []);

  const handleStreamDone = useCallback(
    (id: string, content: string) => {
      setMessages((prevMessages) => {
        // Get conversation id and data
        const conversation = conversationRef.current;
        if (conversation) {
          // Copy previous messages to a new Map
          // Update the message with the new content
          const newMessages = new Map(prevMessages);
          newMessages.set(id, {
            id,
            role: "assistant",
            content,
            isStreaming: false,
          });
          updateConversation({ ...conversation, messages: newMessages });
          return newMessages;
        }
        return prevMessages;
      });
    },
    [updateConversation]
  );

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!lastJsonMessage) return;

    // Get conversation id and data
    const conversation = conversationRef.current;
    if (!conversation) {
      console.error("Conversation Ref not set!");
      return;
    }

    const responseMessage = lastJsonMessage as WebSocketIncomingMessage;

    switch (responseMessage.type) {
      case "messageChunk": {
        const { id, content } = responseMessage;
        handleStreamChunk(id, content);
        break;
      }
      case "done": {
        const { id, content } = responseMessage;
        handleStreamDone(id, content);
        break;
      }
      case "error": {
        console.error(
          "Error: ",
          responseMessage.error,
          "Details: ",
          responseMessage.details
        );
        // Potentially update UI to show error state
        break;
      }
      default: {
        console.error("Unknown WebSocket message type:", responseMessage);
      }
    }
  }, [lastJsonMessage, handleStreamChunk, handleStreamDone]);

  return {
    messages,
    messageList,
    sendMessage,
    isOpen: readyState === ReadyState.OPEN,
  };
}
