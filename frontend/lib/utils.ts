import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function conversationReviver(key: string, value: any) {
  if (value && value.__type === "Map") {
    return new Map(value.value);
  }
  return value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function conversationReplacer(key: string, value: any) {
  if (value instanceof Map) {
    return {
      __type: "Map",
      value: [...value.entries()],
    };
  }
  return value;
}

export function getConversationFromLocalStorage<T>(key: string): T | null {
  try {
    const jsonData = localStorage.getItem(key);
    return jsonData ? JSON.parse(jsonData, conversationReviver) : null;
  } catch (error) {
    console.error(`Could not get localStorage item with key: ${key}`, error);
    return null;
  }
}

export function setConversationToLocalStorage<T>(
  key: string,
  value: T
): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value, conversationReplacer));
    return true;
  } catch (error) {
    console.error(`Could not set localStorage item with key: ${key}`, error);
    return false;
  }
}
