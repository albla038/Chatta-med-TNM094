// import { Square } from "lucide-react";

import { ChatInput } from "@/components/chat-input";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-end items-center grow">
        <div>text-field</div>
        <ChatInput></ChatInput>
      </div>
    </>
  );
}
