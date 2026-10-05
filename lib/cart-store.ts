"use client";

import { useSyncExternalStore } from "react";

export type CartLine = { id: string; qty: number };

const KEY = "openclaw1003:restaurant-cart";

let snapshot: CartLine[] | null = null;
const listeners = new Set<() => void>();
const EMPTY: CartLine[] = [];

function read(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l) => l && typeof l.id === "string" && typeof l.qty === "number" && l.qty > 0)
      .map((l) => ({ id: l.id, qty: Math.min(99, Math.floor(l.qty)) }));
  } catch {
    return [];
  }
}

function ensure(): CartLine[] {
  if (snapshot === null) snapshot = read();
  return snapshot;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): CartLine[] {
  return ensure();
}

export function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

export function setCart(next: CartLine[] | ((prev: CartLine[]) => CartLine[])): void {
  const prev = ensure();
  const value = typeof next === "function" ? (next as (p: CartLine[]) => CartLine[])(prev) : next;
  snapshot = value;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function addItem(id: string, qty = 1): void {
  setCart((prev) => {
    const found = prev.find((l) => l.id === id);
    if (found) return prev.map((l) => (l.id === id ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
    return [...prev, { id, qty: Math.min(99, qty) }];
  });
}

export function setQty(id: string, qty: number): void {
  setCart((prev) => {
    if (qty <= 0) return prev.filter((l) => l.id !== id);
    return prev.map((l) => (l.id === id ? { ...l, qty: Math.min(99, Math.floor(qty)) } : l));
  });
}

export function removeItem(id: string): void {
  setCart((prev) => prev.filter((l) => l.id !== id));
}

export function clearCart(): void {
  setCart([]);
}
