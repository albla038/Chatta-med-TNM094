import { SOCKET_URL } from "@/lib/constants";
import { Conversation, Message, WebSocketMessage } from "@/lib/types";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

export function useChat(chatId: string) {
  // State for messages
  const [messages, setMessages] = useState<Message[]>([]);
  const key = `chat-${chatId}`;

  // Websocket hook
  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket(
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
  // Read messages from local storage
  // and send first message in conversation to the server if the chat is new
  useEffect(() => {
    const conversation = fetchLocalStorage();

    // TODO Make sure we don't need "?" (null check)
    const firstMessage = conversation.messages[0];

    if (!conversation.sentFirstMessage && firstMessage.role === "user") {
      // TODO Check if we need to make sure the socket connection is open
      sendJsonMessage(conversation.messages);
      conversation.sentFirstMessage = true;
      localStorage.setItem(key, JSON.stringify(conversation));
    }

    setMessages(conversation.messages);
  }, [key]);

  // Handle chunks sent from server over WebSocket
  useEffect(() => {
    // if (!lastMessage) return;
    if (!lastJsonMessage) return;

    const responseMessage = lastJsonMessage as WebSocketMessage;

    // Handle each type (done, error and messageChunk) individually
    if (responseMessage.type === "messageChunk") {
      const { id, content } = responseMessage;
      setMessages((prevMessages) => {
        // Check if the message ID already exists in the conversation history
        const existingMessage = prevMessages.find((msg) => msg.id === id);
        if (existingMessage) {
          const updatedMessages = prevMessages.map((msg) =>
            msg.id === id ? { ...msg, content: msg.content + content } : msg
          );
          saveToLocalStorage(updatedMessages);
          return updatedMessages;
        }

        // If the message doesn't exist already, add the new message to the conversation history
        const newMessage: Message = {
          id,
          role: "assistant",
          content,
          loading: true,
        };
        const updatedMessages = [...prevMessages, newMessage];
        saveToLocalStorage(updatedMessages);
        return updatedMessages;
      });
    } else if (responseMessage.type === "done") {
      const { id } = responseMessage;
      setMessages((prevMessages) => {
        // Check if the message ID exists in the conversation history
        const existingMessage = prevMessages.find((msg) => msg.id === id);
        if (existingMessage) {
          const updatedMessages = prevMessages.map((msg) =>
            msg.id === id ? { ...msg, loading: false } : msg
          );
          saveToLocalStorage(updatedMessages);
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
    saveToLocalStorage(newMessageList);
  }

  function fetchLocalStorage() {
    const storedValues = localStorage.getItem(key);
    if (!storedValues) {
      console.error(`Local storage with key ${key} doesn't exist!`);
      notFound();
    }

    return JSON.parse(storedValues) as Conversation;
  }

  function saveToLocalStorage(messages: Message[]) {
    const prevConversation = fetchLocalStorage();
    const newConversation = { ...prevConversation, messages };
    localStorage.setItem(key, JSON.stringify(newConversation));
  }

  return { messages, sendMessage };
}
