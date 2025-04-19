import { auth } from "@/auth";
import ChatLauncher from "@/components/chat-launcher";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <div className="h-full w-full">
        {user?.name ? (
          <ChatLauncher />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Välkommen. Vänligen logga in</p>
          </div>
        )}
      </div>
    </>
  );
}
