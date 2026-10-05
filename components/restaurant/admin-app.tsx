"use client";

import { useState } from "react";
import {
  removeReservation,
  reservationsToCSV,
  setReservationStatus,
  STAFF_CREDENTIALS,
  STATUS_LABEL,
  useReservations,
  type ReservationStatus,
} from "@/lib/reservations";

const SESSION_KEY = "***";

export default function AdminApp() {
  const reservations = useReservations();
  const [authed, setAuthed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | ReservationStatus>("all");

  const filtered = statusFilter === "all" ? reservations : reservations.filter((r) => r.status === statusFilter);
  const rows = [...filtered].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const counts: Record<"all" | ReservationStatus, number> = {
    all: reservations.length,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  };
  reservations.forEach((r) => {
    counts[r.status] += 1;
  });

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (user.trim() === STAFF_CREDENTIALS.username && pass === STAFF_CREDENTIALS.password) {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setAuthed(true);
      setError(null);
    } else {
      setError("帳號或密碼不正確。");
    }
  }

  function logout() {
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setAuthed(false);
    setUser("");
    setPass("");
  }

  function exportCSV() {
    const csv = reservationsToCSV(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reservations-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm">
        <form onSubmit={login} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <h1 className="font-serif text-2xl">員工登入</h1>
          <p className="mt-1 text-sm text-[#8a8175]">僅限員工查看訂位資料。</p>
          <label className="mt-5 block">
            <span className="mb-1 block text-sm text-[#8a8175]">帳號</span>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:border-[#b91c1c]"
            />
          </label>
          <label className="mt-4 block">
            <span className="mb-1 block text-sm text-[#8a8175]">密碼</span>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:border-[#b91c1c]"
            />
          </label>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-[#b91c1c] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#991b1b]"
          >
            登入
          </button>
          <p className="mt-3 text-xs text-[#8a8175]">示範帳號：admin ／ 密碼：johnny2024</p>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl">訂位管理</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[#b91c1c]"
          >
            <option value="all">全部（{counts.all}）</option>
            <option value="pending">待確認（{counts.pending}）</option>
            <option value="confirmed">已確認（{counts.confirmed}）</option>
            <option value="cancelled">已取消（{counts.cancelled}）</option>
          </select>
          <button
            type="button"
            onClick={exportCSV}
            disabled={rows.length === 0}
            className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-50"
          >
            匯出 CSV
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-full px-4 py-2 text-sm font-medium text-[#57534e] hover:bg-black/5"
          >
            登出
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-black/5 bg-white p-10 text-center text-[#8a8175]">
          目前沒有符合的訂位。
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {r.date} {r.time} · {r.partySize} 位
                    <span className="ml-2 font-mono text-xs text-[#8a8175]">{r.code}</span>
                  </p>
                  <p className="mt-1 text-sm text-[#57534e]">
                    {r.name} · {r.phone}
                    {r.email ? ` · ${r.email}` : ""}
                  </p>
                  {r.notes && <p className="mt-1 text-sm text-[#8a8175]">備註：{r.notes}</p>}
                </div>
                <span
                  className={
                    "rounded-full px-3 py-1 text-xs font-medium " +
                    (r.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-700"
                      : r.status === "cancelled"
                        ? "bg-zinc-200 text-zinc-600"
                        : "bg-amber-100 text-amber-700")
                  }
                >
                  {STATUS_LABEL[r.status]}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.status !== "confirmed" && (
                  <button
                    type="button"
                    onClick={() => setReservationStatus(r.id, "confirmed")}
                    className="rounded-full bg-[#b91c1c] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#991b1b]"
                  >
                    確認
                  </button>
                )}
                {r.status !== "cancelled" && (
                  <button
                    type="button"
                    onClick={() => setReservationStatus(r.id, "cancelled")}
                    className="rounded-full border border-black/15 px-4 py-1.5 text-sm font-medium hover:bg-black/5"
                  >
                    取消
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeReservation(r.id)}
                  className="rounded-full px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  刪除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
        ⚠️ 此後台為靜態示範版：資料僅存於本機瀏覽器（localStorage），且前端登入無法真正保密。
        正式環境請改用伺服器端資料庫與驗證（例如 Supabase／Firebase）。
      </p>
    </div>
  );
}
