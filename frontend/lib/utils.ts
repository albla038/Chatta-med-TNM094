import { WebSocketOutgoingAuthMessage } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function conversationReviver(key: string, value: any) {
  if (value && value.__type === "Map") {
    return new Map(value.value);
  }
  return value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function conversationReplacer(key: string, value: any) {
  if (value instanceof Map) {
    return {
      __type: "Map",
      value: [...value.entries()],
    };
  }
  return value;
}

export function getConversationFromLocalStorage<T>(key: string): T | null {
  try {
    const jsonData = localStorage.getItem(key);
    return jsonData ? JSON.parse(jsonData, conversationReviver) : null;
  } catch (error) {
    console.error(`Could not get localStorage item with key: ${key}`, error);
    return null;
  }
}

export function setConversationToLocalStorage<T>(
  key: string,
  value: T
): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value, conversationReplacer));
    return true;
  } catch (error) {
    console.error(`Could not set localStorage item with key: ${key}`, error);
    return false;
  }
}

export function onWSOpen(sendJsonMessage: SendJsonMessage) {
  // Log messages to console
  console.log("WebSocket opened");
  const authMessage: WebSocketOutgoingAuthMessage = {
    type: "authenticate",
    token: process.env.NEXT_PUBLIC_BACKEND_API_KEY!,
  };
  // Send authentication message to the server
  sendJsonMessage(authMessage);
}

export function onWSClose(closeEvent: CloseEvent) {
  if (closeEvent.code === 1008) {
    console.error("WebSocket closed by server:", closeEvent.reason);
  } else {
    console.log("WebSocket closed");
  }
}
