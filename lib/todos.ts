"use client";

import { z } from "zod";

/** Todo model — mirrors the Prisma Task shape, persisted to localStorage. */
export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1, "標題不可為空").max(120, "標題最多 120 字"),
  notes: z.string().trim().max(300, "備註最多 300 字").optional().default(""),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式需為 YYYY-MM-DD")
    .optional()
    .or(z.literal("")),
  completed: z.boolean(),
  createdAt: z.string(),
  completedAt: z.string().nullable().optional(),
});

export type Todo = z.infer<typeof todoSchema>;

/** Input accepted by create/update. */
export const todoInputSchema = todoSchema.pick({ title: true, notes: true, dueDate: true });
export type TodoInput = z.infer<typeof todoInputSchema>;

export const STORAGE_KEY = "openclaw1003:todos";

export function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((t) => todoSchema.safeParse(t).success) as Todo[];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    /* storage unavailable */
  }
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Days until due (negative = overdue). Null when no due date. */
export function dueInDays(dueDate?: string): number | null {
  if (!dueDate) return null;
  const due = new Date(dueDate + "T00:00:00");
  if (Number.isNaN(due.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}

export function formatDue(dueDate?: string): string {
  if (!dueDate) return "";
  const d = new Date(dueDate + "T00:00:00");
  if (Number.isNaN(d.getTime())) return dueDate;
  return d.toLocaleDateString("zh-Hant-TW", { year: "numeric", month: "2-digit", day: "2-digit" });
}
