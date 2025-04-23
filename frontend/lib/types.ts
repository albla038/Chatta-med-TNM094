export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  messages: Map<string, Message>;
  sentFirstMessage: boolean; // Flag to check if the first message has been sent
};

export type WebSocketMessage =
  | { type: "messageChunk"; id: string; content: string }
  | { type: "done"; id: string; content: string }
  | { type: "error"; error: string; details: string }
