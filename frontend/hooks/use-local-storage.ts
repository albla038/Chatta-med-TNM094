"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";

// Custom hook to use localStorage with a key and initial value
// Behaves like useState, but persists data to localStorage and reads from it on mount
export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState(initialValue);

  // Read data from localStorage on mount (if it exists)
  useEffect(() => {
    try {
      const jsonData = localStorage.getItem(key);
      if (jsonData) {
        setValue(JSON.parse(jsonData) as T);
      }
    } catch (error) {
      console.error(
        `Could not get localStorage item with key: ${key}. Error: ${error}`
      );
    }
  }, [key]);

  // Write to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(
        `Could not set localStorage item with key: ${key}. Error: ${error}`
      );
    }
  }, [key, value]);

  // Return getter and setter with useState-like API
  return [value, setValue];
}
