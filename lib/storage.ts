"use client"
import { useEffect, useRef, useState } from "react";

/** Build a storage key scoped to this app. */
export function toStorageKey(name: string) {
  return `openclaw1003:${name}`;
}

/**
 * Minimal localStorage-backed state hook for static (output: "export") sites.
 * Mirrors Prisma/local records client-side so the site needs no server or DB.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable — ignore in static context
    }
  }, [key, value]);

  return [value, setValue] as const;
}
