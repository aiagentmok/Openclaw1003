"use client";

import { loadTodos, saveTodos, type Todo } from "./todos";

/**
 * External store over localStorage so components read persisted todos without
 * setState-in-effect. getSnapshot returns a stable reference until a mutation.
 */
let snapshot: Todo[] | null = null;
const listeners = new Set<() => void>();
const EMPTY: Todo[] = [];

function ensure(): Todo[] {
  if (snapshot === null) snapshot = loadTodos();
  return snapshot;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): Todo[] {
  return ensure();
}

export function getServerSnapshot(): Todo[] {
  return EMPTY;
}

export function setTodos(next: Todo[] | ((prev: Todo[]) => Todo[])): void {
  const prev = ensure();
  const value = typeof next === "function" ? (next as (p: Todo[]) => Todo[])(prev) : next;
  snapshot = value;
  saveTodos(value);
  listeners.forEach((l) => l());
}
