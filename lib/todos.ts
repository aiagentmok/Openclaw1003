"use client";

import { z } from "zod";

/** Todo model — mirrors the Prisma Task shape, persisted to localStorage. */
export const MAX_TAGS = 6;
export const MAX_TAG_LEN = 20;

const tagSchema = z.string().trim().min(1).max(MAX_TAG_LEN, `標籤最多 ${MAX_TAG_LEN} 字`);
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式需為 YYYY-MM-DD")
  .optional()
  .or(z.literal(""));

export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1, "標題不可為空").max(120, "標題最多 120 字"),
  notes: z.string().trim().max(300, "備註最多 300 字").optional().default(""),
  tags: z.array(tagSchema).max(MAX_TAGS, `最多 ${MAX_TAGS} 個標籤`).optional().default([]),
  dueDate: dateSchema,
  completed: z.boolean(),
  createdAt: z.string(),
  completedAt: z.string().nullable().optional(),
});

export type Todo = z.infer<typeof todoSchema>;

/** Input accepted by create/update. */
export const todoInputSchema = z.object({
  title: z.string().trim().min(1, "標題不可為空").max(120, "標題最多 120 字"),
  notes: z.string().trim().max(300, "備註最多 300 字").optional().or(z.literal("")),
  tags: z.array(tagSchema).max(MAX_TAGS, `最多 ${MAX_TAGS} 個標籤`).optional().default([]),
  dueDate: dateSchema,
});
export type TodoInput = z.infer<typeof todoInputSchema>;

export const STORAGE_KEY = "openclaw1003:todos";

export function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Apply schema defaults (e.g. add tags: [] to records saved before tags existed).
    return parsed
      .map((t) => todoSchema.safeParse(t))
      .filter((r) => r.success)
      .map((r) => (r as { data: Todo }).data);
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

/* ----------------------------- sorting ----------------------------- */

export const SORT_OPTIONS = [
  { value: "created-desc", label: "建立時間（新→舊）" },
  { value: "created-asc", label: "建立時間（舊→新）" },
  { value: "due-asc", label: "到期日（近→遠）" },
  { value: "due-desc", label: "到期日（遠→近）" },
  { value: "title-asc", label: "標題（A→Z）" },
  { value: "status", label: "狀態（未完成優先）" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export function sortTodos(todos: Todo[], key: SortKey): Todo[] {
  const arr = [...todos];
  const byDue = (a: Todo, b: Todo, dir: 1 | -1) => {
    const av = a.dueDate ? new Date(a.dueDate + "T00:00:00").getTime() : Number.POSITIVE_INFINITY;
    const bv = b.dueDate ? new Date(b.dueDate + "T00:00:00").getTime() : Number.POSITIVE_INFINITY;
    return (av - bv) * dir;
  };
  switch (key) {
    case "created-asc":
      return arr.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "due-asc":
      return arr.sort((a, b) => byDue(a, b, 1));
    case "due-desc":
      return arr.sort((a, b) => byDue(a, b, -1));
    case "title-asc":
      return arr.sort((a, b) => a.title.localeCompare(b.title, "zh-Hant-TW"));
    case "status":
      return arr.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return byDue(a, b, 1);
      });
    case "created-desc":
    default:
      return arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

/* ------------------------------- tags ------------------------------ */

export function allTags(todos: Todo[]): string[] {
  const set = new Set<string>();
  todos.forEach((t) => (t.tags ?? []).forEach((tag) => set.add(tag)));
  return [...set].sort((a, b) => a.localeCompare(b, "zh-Hant-TW"));
}

/** Normalize a raw tag list: trim, drop empties, de-duplicate case-insensitively, cap count. */
export function normalizeTags(raw: string[]): string[] {
  const out: string[] = [];
  for (const t of raw) {
    const v = t.trim();
    if (!v) continue;
    if (!out.some((x) => x.toLowerCase() === v.toLowerCase())) out.push(v);
    if (out.length >= MAX_TAGS) break;
  }
  return out;
}

/* ------------------------------ export ----------------------------- */

function download(filename: string, mime: string, data: string) {
  const blob = new Blob([data], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function stamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

export function exportJSON(todos: Todo[]): void {
  download(`todos-${stamp()}.json`, "application/json", JSON.stringify(todos, null, 2));
}

function csvCell(v: string): string {
  const needsQuote = /[",\n\r]/.test(v);
  const escaped = v.replace(/"/g, '""');
  return needsQuote ? `"${escaped}"` : escaped;
}

export function exportCSV(todos: Todo[]): void {
  const header = ["標題", "備註", "標籤", "到期日", "狀態", "建立時間", "完成時間"];
  const rows = todos.map((t) => [
    t.title,
    t.notes ?? "",
    (t.tags ?? []).join(" / "),
    t.dueDate || "",
    t.completed ? "已完成" : "未完成",
    t.createdAt ? new Date(t.createdAt).toLocaleString("zh-Hant-TW") : "",
    t.completedAt ? new Date(t.completedAt).toLocaleString("zh-Hant-TW") : "",
  ]);
  const csv = "\uFEFF" + [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
  download(`todos-${stamp()}.csv`, "text/csv", csv);
}
