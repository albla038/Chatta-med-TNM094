import { WebSocketOutgoingAuthMessage } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

