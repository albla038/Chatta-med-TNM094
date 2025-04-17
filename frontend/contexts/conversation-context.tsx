"use client";

import useConversations from "@/hooks/use-conversations";
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  getConversationFromLocalStorage,
  setConversationToLocalStorage,
} from "@/lib/utils";
import { Conversation } from "@/lib/types";

const KEY = "conversations";

type ConversationContextProviderProps = {
  children: React.ReactNode;
};

type ConversationContext = {
  conversations: Conversation[];
  addConversation: (conversation: Conversation) => boolean;
  getConversation: (id: string) => Conversation | null;
  removeConversation: (id: string) => boolean;
  renameConversation: (id: string, title: string) => boolean;
  updateConversation: (updatedConversation: Conversation) => boolean;
  isLoading: boolean;
  saveConversations: (conversations: Conversation[]) => boolean;
};

const ConversationContext = createContext<ConversationContext | null>(null);

export default function ConversationContextProvider({
  children,
}: ConversationContextProviderProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set initial data from local storage
  useEffect(() => {
    const data = getConversationFromLocalStorage<Conversation[]>(KEY);
    if (data) setConversations(data);
    setIsLoading(false);
  }, []);

  // Save the conversation list in local storage with KEY
  const saveConversations = useCallback(
    (conversations: Conversation[]): boolean => {
      if (setConversationToLocalStorage(KEY, conversations)) {
        setConversations(conversations);
        return true;
      } else {
        return false;
      }
    },
    []
  );

  const addConversation = useCallback(
    (newConversation: Conversation): boolean => {
      let successfulRes = false;

      setConversations((prevConversations) => {
        const updatedList = [...prevConversations, newConversation];
        successfulRes = setConversationToLocalStorage(KEY, updatedList);
        return successfulRes ? updatedList : prevConversations;
      });

      return successfulRes;
    },
    []
  );

  const getConversation = useCallback(
    (id: string): Conversation | null => {
      const conversation = conversations.find((conv) => conv.id === id);
      return conversation ? conversation : null;
    },
    [conversations]
  );

  // Update one conversation in the list of conversations
  const updateConversation = useCallback(
    (updatedConversation: Conversation) => {
      let successfulRes = false;

      setConversations((prevConversations) => {
        const updatedList = prevConversations.map((conv) =>
          conv.id === updatedConversation.id ? updatedConversation : conv
        );
        successfulRes = setConversationToLocalStorage(KEY, updatedList);
        return successfulRes ? updatedList : prevConversations;
      });

      return successfulRes;
    },
    []
  );

  const removeConversation = useCallback((id: string): boolean => {
    let successfulRes = false;

    setConversations((prevConversations) => {
      const updatedList = prevConversations.filter((conv) => conv.id !== id);
      successfulRes = setConversationToLocalStorage(KEY, updatedList);
      return successfulRes ? updatedList : prevConversations;
    });

    return successfulRes;
  }, []);

  const renameConversation = useCallback(
    (id: string, title: string): boolean => {
      let successfulRes = false;

      setConversations((prevConversations) => {
        const updatedList = prevConversations.map((conv) =>
          conv.id === id ? { ...conv, title } : conv
        );
        successfulRes = setConversationToLocalStorage(KEY, updatedList);
        return successfulRes ? updatedList : prevConversations;
      });

      return successfulRes;
    },
    []
  );

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        saveConversations,
        addConversation,
        getConversation,
        updateConversation,
        removeConversation,
        renameConversation,
        isLoading,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversationContext() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversationContext must be used within a ConversationContextProvider"
    );
  }
  return context;
}
