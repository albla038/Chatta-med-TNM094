import { SOCKET_URL } from "@/lib/constants";
import { Conversation, Message, WebSocketMessage } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import useConversations from "./use-conversations";

export function useChat(chatId: string) {
  // STATE
  const [messages, setMessages] = useState<Message[]>([]);
  const conversationRef = useRef<Conversation>(null);

  // HOOKS
  const { getConversation, updateConversation, isLoading } = useConversations();

  // Websocket hook
  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket(
    "ws://127.0.0.1:8000/ws",
    // SOCKET_URL,
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
  // Read messages from local storage
  // and send first message in conversation to the server if the chat is new
  useEffect(() => {
    console.log("Initial effect ran.", "isLoading: ", isLoading);
    if (isLoading || !chatId) return;

    const conversation = getConversation(chatId);
    if (!conversation) {
      console.error(`Conversation with id ${chatId} doesn't exist.`);
      return;
    }
    conversationRef.current = conversation;
    const firstMessage = conversation.messages[0];

    if (!conversation.sentFirstMessage && firstMessage.role === "user") {
      // TODO Check if we need to make sure the socket connection is open
      sendJsonMessage(conversation.messages);
      conversation.sentFirstMessage = true;
      updateConversation(conversation);
      // TODO handle error if line above returns false
    }

    setMessages(conversation.messages);

    return () => {
      conversationRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, isLoading]);

  // Handle chunks sent from server over WebSocket
  useEffect(() => {
    // if (!lastMessage) return;
    if (!lastJsonMessage) return;

    const responseMessage = lastJsonMessage as WebSocketMessage;

    // Get conversation id and data
    const conversation = conversationRef.current;
    if (!conversation) {
      console.error("Conversation Ref not set!");
      return;
    }

    // Handle each type (done, error and messageChunk) individually
    if (responseMessage.type === "messageChunk") {
      const { id, content } = responseMessage;
      setMessages((prevMessages) => {
        // Check if the message ID already exists in the message history
        const existingMessage = prevMessages.find((msg) => msg.id === id);
        if (existingMessage) {
          const updatedMessages = prevMessages.map((msg) =>
            msg.id === id ? { ...msg, content } : msg
          );
          // updateConversation({ ...conversation, messages: updatedMessages });
          return updatedMessages;
        }

        // If the message doesn't exist already, add the new message to the message history
        const newMessage: Message = {
          id,
          role: "assistant",
          content,
          isStreaming: true,
        };
        const updatedMessages = [...prevMessages, newMessage];
        // updateConversation({ ...conversation, messages: updatedMessages });
        return updatedMessages;
      });
    } else if (responseMessage.type === "done") {
      const { id } = responseMessage;
      setMessages((prevMessages) => {
        // Check if the message ID exists in the conversation history
        const existingMessage = prevMessages.find((msg) => msg.id === id);
        if (existingMessage) {
          const updatedMessages = prevMessages.map((msg) =>
            msg.id === id ? { ...msg, isStreaming: false } : msg
          );
          updateConversation({ ...conversation, messages: updatedMessages });
          return updatedMessages;
        } else {
          return prevMessages;
        }
      });
    } else if (responseMessage.type === "error") {
      // TODO Handle error messages from the server by rendering them in the UI
      console.error(
        "Error: ",
        responseMessage.error,
        "Details: ",
        responseMessage.details
      );
    } else {
      // TODO Handle other error cases, such as connection errors or timeouts
      // maybe use function onError() or form useWebSocket()
      // or shouldReconnect() function event
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage]);

  // Send message to the server
  function sendMessage(content: string) {
    // Create new message
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const newMessageList = [...messages, newMessage];

    // Send messages to backend
    sendJsonMessage(newMessageList);

    // Add to state
    setMessages(newMessageList);

    // Get conversation id and data
    const conversation = conversationRef.current;
    if (!conversation) {
      console.error("Conversation Ref not set!");
      return;
    }
    updateConversation({ ...conversation, messages: newMessageList });
  }

  return { messages, sendMessage, isOpen: readyState === ReadyState.OPEN };
}
