import { auth } from "@/auth";
import Chat from "@/components/chat";
import prisma from "@/lib/prisma";
import { notFound, unauthorized } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const conversationId = (await params).id;

  const session = await auth();
  const userId = session?.user?.id;

  // if user not authenticated
  if (!userId) unauthorized();

  const data = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
      userId,
    },
    select: {
      sentFirstMessage: true,
      messages: {
        select: { id: true, role: true, content: true, isStreaming: true },
      },
    },
  });

  // if no conversation is found
  if (!data) return notFound();

  const { sentFirstMessage, messages } = data;

  return (
    <>
      <div className="h-full w-full">
        <Chat
          conversationId={conversationId}
          sentFirstMessage={sentFirstMessage}
          initialMessages={messages}
        />
      </div>
    </>
  );
}
