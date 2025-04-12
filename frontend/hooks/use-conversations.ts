import { getFromLocalStorage, setToLocalStorage } from "@/lib/utils";
import { Conversation } from "@/lib/types";
import { useEffect, useState } from "react";

const KEY = "conversations";

export default function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Set initial data from local storage
  useEffect(() => {
    const data = getFromLocalStorage<Conversation[]>(KEY);
    if (data) setConversations(data);
  }, []);

  // Save the conversation list in local storage with KEY
  function saveConversations(conversations: Conversation[]): boolean {
    if (setToLocalStorage(KEY, conversations)) {
      setConversations(conversations);
      return true;
    } else {
      return false;
    }
  }

  function addConversation(newConversation: Conversation): boolean {
    let successfulRes = false;

    setConversations((prevConversations) => {
      const updatedList = [...prevConversations, newConversation];
      successfulRes = setToLocalStorage(KEY, updatedList);
      return successfulRes ? updatedList : prevConversations;
    });

    return successfulRes;
  }

  // Update one conversation in the list of conversations
  function updateConversation(updatedConversation: Conversation) {
    let successfulRes = false;

    setConversations((prevConversations) => {
      const updatedList = prevConversations.map((conv) =>
        conv.id === updatedConversation.id ? updatedConversation : conv
      );
      successfulRes = setToLocalStorage(KEY, updatedList);
      return successfulRes ? updatedList : prevConversations;
    });

    return successfulRes;
  }

  function removeConversation(id: string): boolean {
    let successfulRes = false;

    setConversations((prevConversations) => {
      const updatedList = prevConversations.filter((conv) => conv.id !== id);
      successfulRes = setToLocalStorage(KEY, updatedList);
      return successfulRes ? updatedList : prevConversations;
    });

    return successfulRes;
  }

  return {
    conversations,
    saveConversations,
    addConversation,
    updateConversation,
    removeConversation,
  };
}
