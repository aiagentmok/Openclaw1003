"use client";

import { useSyncExternalStore } from "react";
import { z } from "zod";

export const reservationSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "請選擇日期"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "請選擇時間"),
  partySize: z.coerce.number().int("人數需為整數").min(1, "至少 1 位").max(20, "最多 20 位"),
  name: z.string().trim().min(1, "請填寫姓名").max(80),
  phone: z.string().trim().min(6, "請填寫有效聯絡電話").max(30),
  email: z.string().trim().email("電郵格式不正確").optional().or(z.literal("")),
  notes: z.string().trim().max(300, "備註最多 300 字").optional().or(z.literal("")),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type Reservation = ReservationInput & {
  id: string;
  code: string;
  status: ReservationStatus;
  createdAt: string;
};

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: "待確認",
  confirmed: "已確認",
  cancelled: "已取消",
};

const KEY = "***";

/** 產生訂位 id 與代號（置於模組層，避免在元件 render 期呼叫不純函式）。 */
export function makeReservationIds(): { id: string; code: string } {
  const t = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return { id: `r_${t}_${rand}`, code: `R${t.slice(-5)}${rand.slice(0, 2)}` };
}

let snapshot: Reservation[] | null = null;
const listeners = new Set<() => void>();
const EMPTY: Reservation[] = [];

function read(): Reservation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Reservation[]) : [];
  } catch {
    return [];
  }
}

function ensure(): Reservation[] {
  if (snapshot === null) snapshot = read();
  return snapshot;
}

function persist(next: Reservation[]) {
  snapshot = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): Reservation[] {
  return ensure();
}

export function getServerSnapshot(): Reservation[] {
  return EMPTY;
}

export function useReservations(): Reservation[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** 新增訂位（回傳完整訂位紀錄）。 */
export function addReservation(input: ReservationInput): Reservation {
  const { id, code } = makeReservationIds();
  const record: Reservation = {
    ...input,
    id,
    code,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  persist([record, ...ensure()]);
  return record;
}

export function setReservationStatus(id: string, status: ReservationStatus): void {
  persist(ensure().map((r) => (r.id === id ? { ...r, status } : r)));
}

export function removeReservation(id: string): void {
  persist(ensure().filter((r) => r.id !== id));
}

export function reservationsToCSV(rows: Reservation[]): string {
  const header = ["代號", "日期", "時間", "人數", "姓名", "電話", "電郵", "狀態", "備註", "建立時間"];
  const cell = (v: string) => {
    const s = String(v ?? "");
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const body = rows.map((r) =>
    [r.code, r.date, r.time, String(r.partySize), r.name, r.phone, r.email ?? "", STATUS_LABEL[r.status], r.notes ?? "", new Date(r.createdAt).toLocaleString("zh-Hant-TW")].map(cell).join(","),
  );
  return "\uFEFF" + [header.join(","), ...body].join("\r\n");
}

/**
 * 員工後台登入設定（示範用）。
 * ⚠️ 靜態網站的前端驗證無法真正保密，正式環境請改用伺服器端驗證。
 */
export const STAFF_CREDENTIALS = { username: "admin", password: "johnny2024" };
