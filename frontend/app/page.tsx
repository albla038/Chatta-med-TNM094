// import { Square } from "lucide-react";

import { ChatInput } from "@/components/chat-input";
import { ClientMessage } from "@/components/client-message";
import { UserMessage } from "@/components/user-message";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-end items-center grow">
        
        <UserMessage>När vi är klara med projektet ska vi fira genom att gå ut och fika och kolla på minecraftfilmen</UserMessage>
        <ClientMessage>KUL!</ClientMessage>
        <UserMessage>Vet</UserMessage>
        <ChatInput></ChatInput>

      </div>
    </>
  );
}
