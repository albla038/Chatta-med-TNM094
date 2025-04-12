import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFromLocalStorage<T>(key: string): T | null {
  try {
    const jsonData = localStorage.getItem(key);
    return jsonData ? JSON.parse(jsonData) : null;
  } catch (error) {
    console.error(`Could not get localStorage item with key: ${key}`, error);
    return null;
  }
}

export function setToLocalStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Could not set localStorage item with key: ${key}`, error);
    return false;
  }
}
