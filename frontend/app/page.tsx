//import { Button } from "@/components/ui/button";
import { ClientMessage } from "@/components/client-message";
import { UserMessage } from "@/components/user-message";

export default function Home() {
  return (
    <div>
      <UserMessage>
        När vi är klara med kandidatprojektet ska vi fira genom att gå och fika och se den nya minecraftfilmen på bio
      </UserMessage>
      <ClientMessage>hej hej hej hej hej</ClientMessage>
    </div>
  );
}

