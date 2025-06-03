"use server";

import { auth } from "@/auth";
import { unauthorized } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// TODO Validate inputs with Zod

export async function createConversation(
  firstMessage: string
): Promise<string | null> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return unauthorized();

  let title = firstMessage;
  if (firstMessage.length >= 35) {
    title = firstMessage.slice(0, 35) + "...";
  }

  try {
    const { id } = await prisma.conversation.create({
      data: {
        title,
        userId,
        sentFirstMessage: false,
        messages: {
          create: {
            role: "user",
            content: firstMessage,
          },
        },
      },
      select: { id: true },
    });

    return id;
  } catch (error) {
    console.error("Could not create conversation in database: ", error);
    return null;
  }
}

export async function addUserMessageToConversation({
  conversationId,
  messageId,
  content,
}: {
  conversationId: string;
  messageId: string;
  content: string;
}): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return unauthorized();

  try {
    // Verify that the conversation belongs to the user
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId, userId },
    });

    if (!conversation) return unauthorized();

    await prisma.message.create({
      data: {
        id: messageId,
        content,
        role: "user",
        conversationId,
      },
    });

    return true;
  } catch (error) {
    console.error(
      "Could not add user message to conversation in database: ",
      error
    );
    return false;
  }
}

export async function addAIMessageToConversation({
  conversationId,
  messageId,
  content,
  isComplete = false,
  isInitial = false,
}: {
  conversationId: string;
  messageId: string;
  content: string;
  isInitial?: boolean;
  isComplete?: boolean;
}): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return unauthorized();

  try {
    // 1. Verify that the conversation belongs to the user
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId, userId },
    });

    if (!conversation) return unauthorized();

    // 2. Add or update message
    await prisma.message.upsert({
      where: { id: messageId },
      update: { content, isStreaming: !isComplete },
      create: {
        id: messageId,
        role: "assistant",
        content,
        isStreaming: !isComplete,
        conversationId,
      },
    });

    // 3. Update sentFirstMessage if needed
    if (isInitial) {
      await prisma.conversation.update({
        where: { id: conversationId, userId },
        data: { sentFirstMessage: true },
      });
    }
    
    // 4. Revalidate the path to update the chat page
    revalidatePath(`/chat/${conversationId}`);

    return true;
  } catch (error) {
    console.error(
      "Could not add AI message to conversation in database: ",
      error
    );
    return false;
  }
}

export async function removeConversation(id: string): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return unauthorized();

  try {
    await prisma.conversation.delete({ where: { id, userId } });
    revalidatePath(`/chat/${id}`);
    return true;
  } catch (error) {
    console.error("Could not delete conversation from database: ", error);
    return false;
  }
}

export async function renameConversation(
  id: string,
  newTitle: string
): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return unauthorized();

  try {
    await prisma.conversation.update({
      where: { id, userId },
      data: {
        title: newTitle,
      },
    });
    return true;
  } catch (error) {
    console.error("Could not rename conversation in database: ", error);
    return false;
  }
}
