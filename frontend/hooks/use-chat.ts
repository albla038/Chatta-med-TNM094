import { SOCKET_URL } from "@/lib/constants";
import { Conversation, Message, WebSocketMessage } from "@/lib/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import useConversations from "./use-conversations";
import { throttle } from "lodash";
import { useConversationContext } from "@/contexts/conversation-context";

export function useChat(chatId: string) {
  // STATE
  const [messages, setMessages] = useState<Map<string, Message>>(new Map());
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);

  const messageList = useMemo(() => [...messages.values()], [messages]);

  // HOOKS
  const { getConversation, updateConversation, isLoading } =
    useConversationContext();

  // Throttled function to update conversation
  // This is used to prevent saving the conversation to local storage too often
  const updateConversationThrottled = useRef(
    throttle(updateConversation, 1000, { leading: true, trailing: false })
  );

  // Websocket hook
  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket(
    // "ws://127.0.0.1:8000/ws",
    SOCKET_URL,
    {
      share: true,
      // Attempts to reconnect on all close events (such as server shutting down)
      shouldReconnect: () => true,
      // Log messages to console
      onOpen: () => console.log("WebSocket opened"),
      onClose: () => console.log("WebSocket closed"),
    }
  );

  // EFFECTS

  // // Keep refs updated with the latest functions
  // useEffect(() => {
  //   if (isLoading || !chatId) return;
  //   conversationRef.current = getConversation(chatId);
  // }, [getConversation, chatId, isLoading]);

  // Read messages from local storage
  // and send first message in conversation to the server if the chat is new
  useEffect(() => {
    if (isLoading || !chatId) {
      // TODO Check
      setMessages(new Map());
      setCurrentConversation(null);
      return;
    }

    const conversation = getConversation(chatId);

    if (!conversation) {
      console.error(`Conversation with id ${chatId} doesn't exist.`);
      // TODO Check
      // Clear state if conversation is not found
      setMessages(new Map());
      setCurrentConversation(null);
      return;
    }

    // Set the current conversation state
    setCurrentConversation(conversation);
    // Set the initial messages for the chat UI
    setMessages(conversation.messages);

    // Check if the first message needs to be sent
    const firstMessage = conversation.messages.values().next().value;
    if (!conversation.sentFirstMessage && firstMessage?.role === "user") {
      const messagesToSend = [...conversation.messages.values()];
      sendJsonMessage(messagesToSend);
      // Mark as sent and update the conversation state immediately
      const updatedConversation = { ...conversation, sentFirstMessage: true };
      // Update context state
      updateConversation(updatedConversation);
      // Update the local state as well
      setCurrentConversation(updatedConversation);
    }
  }, [chatId, isLoading, getConversation, sendJsonMessage, updateConversation]);

  // Send message to the server
  const sendMessage = useCallback(
    (content: string) => {
      // Ensure the local conversation is loaded
      if (!currentConversation) {
        console.error("Cannot send message: Conversation not loaded!");
        return;
      }

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

        // Send messages to backend
        const messagesArray = [...newMessages.values()];
        sendJsonMessage(messagesArray);

        const updatedConversation = {
          ...currentConversation,
          messages: newMessages,
        };

        // Update context state
        updateConversation(updatedConversation);
        // Update the local conversation state
        setCurrentConversation(updatedConversation);

        return newMessages;
      });
    },
    [sendJsonMessage, updateConversation, currentConversation]
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
      // Get conversation id and data
      // const conversation = conversationRef.current;
      // if (conversation) {
      //   updateConversationThrottled.current({ ...conversation, messages });
      // }
      return newMessages;
    });
  }, []);

  const handleStreamDone = useCallback(
    (id: string, content: string) => {
      // Ensure the local conversation is loaded
      if (!currentConversation) {
        console.error("Cannot finalize message: Conversation not loaded!");
        return;
      }

      setMessages((prevMessages) => {
        const newMessages = new Map(prevMessages);
        newMessages.set(id, {
          id,
          role: "assistant",
          content,
          isStreaming: false,
        });
        updateConversation({ ...currentConversation, messages: newMessages });
        return newMessages;
      });
    },
    [updateConversation, currentConversation]
  );

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!lastJsonMessage) return;

    // Ensure conversation is loaded before processing messages
    if (!currentConversation) return;

    const responseMessage = lastJsonMessage as WebSocketMessage;

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
  }, [
    lastJsonMessage,
    handleStreamChunk,
    handleStreamDone,
    currentConversation,
  ]);

  return {
    messages,
    messageList,
    sendMessage,
    isOpen: readyState === ReadyState.OPEN,
  };
}
