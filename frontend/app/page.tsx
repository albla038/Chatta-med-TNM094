import { auth } from "@/auth";
import ChatLauncher from "@/components/chat-launcher";
import { unauthorized } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  if (!user) unauthorized();

  return (
    <>
      <div className="h-full w-full">
        <ChatLauncher />
      </div>
    </>
  );
}
