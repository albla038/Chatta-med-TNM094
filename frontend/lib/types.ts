export type Message = {
  role: "user" | "assistant";
  content: string;
  loading: boolean;
};

export type Conversation = {
  id: string;
  createdAt: string;
  messages: Message[];
  sentFirstMessage: boolean; // Flag to check if the first message has been sent
};

export type ConversationMeta = {
  id: string;
  createdAt: string;
  title?: string;
};

// TODO Types for sending JSON over WS

// type WebSocketMessage =
//   | { type: 'userMessage'; content: string }
//   | { type: 'assistantMessageChunk'; id: string; content: string }
//   | { type: 'done'; id: string }
//   | { type: 'error'; message: string };

// type ResponseMessage = {
//   status: string;
//   id: string;
//   role: string;
//   content: string;
//   responseMetadata: null | {
//     [key: string]: string;
//   };
// };