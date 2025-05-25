import { SOCKET_URL } from "@/lib/constants";
import { Message, WebSocketMessage } from "@/lib/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { createId } from "@paralleldrive/cuid2";
import {
  addAIMessageToConversation,
  addUserMessageToConversation,
} from "@/actions/conversations";
import throttle from "lodash.throttle";

// TODO Add error recovery logic
// TODO Implement stop streaming functionality

export function useChat(
  conversationId: string,
  sentFirstMessage: boolean,
  initialMessages: Message[]
) {
  // STATE
  // Map to store messages by their ID
  const [messages, setMessages] = useState<Map<string, Message>>(
    () => new Map(initialMessages.map((msg) => [msg.id, msg]))
  );
  const [isPending, setIsPending] = useState(false);
  // Keep track of whether the initial messages have been sent
  const hasSentInitial = useRef(sentFirstMessage);
  const hasReceivedInitial = useRef(false);
  // Store completed message IDs
  const completedMessageIds = useRef<Set<string>>(new Set());
  const isFirstRender = useRef(true);

  // Memoized list of messages for rendering
  const messageList = useMemo(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return initialMessages;
    }
    return [...messages.values()];
  }, [messages, initialMessages]);

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

  // Determine the connection status
  const status: "connected" | "connecting" | "disconnected" = useMemo(() => {
    if (readyState === ReadyState.OPEN) return "connected";
    if (readyState === ReadyState.CONNECTING) return "connecting";
    return "disconnected";
  }, [readyState]);

  // Send message
  const sendMessage = useCallback(
    async function (content: string) {
      const messageId = createId();

      // Create a new message object
      const newMessage: Message = {
        id: messageId,
        role: "user",
        content,
      };

      // Send messages and optimistically update the messages state
      setMessages((prevMessages) => {
        const newMessages = new Map(prevMessages);
        newMessages.set(messageId, newMessage);

        // Send messages to backend via WS
        const messagesArray = [...newMessages.values()];
        sendJsonMessage(messagesArray);

        return newMessages;
      });

      // Set pending state to true
      setIsPending(true);

      // TODO Following code might not make sense
      // Store the new message in db
      const res = await addUserMessageToConversation({
        conversationId,
        messageId,
        content,
      });

      // Rollback optimistic update if db operation fails
      if (!res) {
        console.error("Failed to save user message to database");
        setMessages((prevMessages) => {
          const newMessages = new Map(prevMessages);
          newMessages.delete(messageId);
          return newMessages;
        });
      }
    },
    [conversationId, sendJsonMessage]
  );

  // Throttled save for database persistence
  // This is used to prevent excessive writes to the database while streaming
  const throttledSaveToDB = useMemo(
    () =>
      throttle(
        async function (id: string, content: string) {
          // Skip if message is stale
          if (completedMessageIds.current.has(id)) return;

          // Check if is initial message recieved from LLM
          const isInitialMessage = !hasReceivedInitial.current;
          if (isInitialMessage) hasReceivedInitial.current = true;

          // Store the new message in db
          const res = await addAIMessageToConversation({
            conversationId,
            messageId: id,
            content,
            isInitial: isInitialMessage,
          });

          if (!res) console.error("Failed to save AI message to database");
        },
        500,
        { leading: false, trailing: true }
      ),
    [conversationId]
  );

  // Handle stream chunk updates
  const handleStreamChunk = useCallback(
    async function (id: string, content: string) {
      // Set pending state to false
      setIsPending(false);

      // Create a new message object
      const messageChunk: Message = {
        id,
        role: "assistant",
        content,
        isStreaming: true,
      };

      // Update state
      setMessages((prevMessages) => {
        const newMessages = new Map(prevMessages);
        return newMessages.set(id, messageChunk);
      });

      // Schedule throttled save to database
      throttledSaveToDB(id, content);
    },
    [throttledSaveToDB]
  );

  // Handle stream completion
  const handleStreamDone = useCallback(
    async function (id: string, content: string) {
      // Create a new message object
      const completeMessage: Message = {
        id,
        role: "assistant",
        content,
        isStreaming: false,
      };

      // Update state
      setMessages((prevMessages) => {
        const newMessages = new Map(prevMessages);
        return newMessages.set(id, completeMessage);
      });

      // Store the new message in db
      const res = await addAIMessageToConversation({
        conversationId,
        messageId: id,
        content,
        isComplete: true,
      });

      if (!res) {
        console.error("Failed to save AI message to database");
        return;
      }

      // Add message id to completed message IDs
      completedMessageIds.current.add(id);

      // Cancel any pending throttled saves for this ID
      throttledSaveToDB.cancel();
    },
    [conversationId, throttledSaveToDB]
  );

  // SIDE EFFECTS
  // Send initial messages when the WebSocket is open
  useEffect(() => {
    if (!hasSentInitial.current && readyState === ReadyState.OPEN) {
      sendJsonMessage(initialMessages);
      hasSentInitial.current = true;
    }
  }, [readyState, initialMessages, sendJsonMessage]);

  // Handle incoming messages from backend via WebSocket
  // TODO Validate with Zod?
  useEffect(() => {
    if (!lastJsonMessage) return;

    const message = lastJsonMessage as WebSocketMessage;

    switch (message.type) {
      case "messageChunk": {
        const { id, content } = message;
        handleStreamChunk(id, content);
        break;
      }
      case "done": {
        const { id, content } = message;
        handleStreamDone(id, content);
        break;
      }
      case "error": {
        console.error("Error: ", message.error, "Details: ", message.details);
        setIsPending(false);
        // Potentially update UI to show error state
        break;
      }
      default: {
        console.error("Unknown WebSocket message type:", message);
      }
    }
  }, [lastJsonMessage, handleStreamChunk, handleStreamDone]);

  // Clean up on unmount - forces final save
  useEffect(() => {
    return () => {
      // Force any pending saves to execute immediatly
      throttledSaveToDB.flush();
    };
  }, [throttledSaveToDB]);

  return {
    messages,
    messageList,
    sendMessage,
    isOpen: readyState === ReadyState.OPEN,
    status,
    isPending,
  };
}
