"use client";

import { useState } from "react";
import { addReservation, reservationSchema, type ReservationInput } from "@/lib/reservations";

const EMPTY: ReservationInput = {
  date: "",
  time: "19:00",
  partySize: 2,
  name: "",
  phone: "",
  email: "",
  notes: "",
};

const yenTime = ["11:30", "12:00", "12:30", "13:00", "13:30", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];

export default function ReserveApp() {
  const [form, setForm] = useState<ReservationInput>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placed, setPlaced] = useState<{ code: string; summary: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = reservationSchema.safeParse(form);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const k = String(issue.path[0] ?? "form");
        if (!map[k]) map[k] = issue.message;
      }
      setErrors(map);
      return;
    }
    setErrors({});
    const saved = addReservation(parsed.data);
    const summary = [
      `訂位代號：${saved.code}`,
      `日期：${saved.date}`,
      `時間：${saved.time}`,
      `人數：${saved.partySize} 位`,
      `姓名：${saved.name}`,
      `電話：${saved.phone}`,
      saved.email ? `電郵：${saved.email}` : null,
      saved.notes ? `備註：${saved.notes}` : null,
    ]
      .filter((x): x is string => x !== null)
      .join("\n");
    setPlaced({ code: saved.code, summary });
    setCopied(false);
  }

  async function copy() {
    if (!placed) return;
    try {
      await navigator.clipboard.writeText(placed.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const err = (k: string) => errors[k] && <span className="mt-1 block text-xs text-red-600">{errors[k]}</span>;

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <form onSubmit={submit} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm text-[#8a8175]">日期 *</span>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:border-[#b91c1c]"
            />
            {err("date")}
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm text-[#8a8175]">時間 *</span>
            <select
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:border-[#b91c1c]"
            >
              {yenTime.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {err("time")}
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm text-[#8a8175]">人數 *</span>
            <input
              type="number"
              min={1}
              max={20}
              value={form.partySize}
              onChange={(e) => setForm({ ...form, partySize: Number(e.target.value) })}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:border-[#b91c1c]"
            />
            {err("partySize")}
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm text-[#8a8175]">姓名 *</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:border-[#b91c1c]"
            />
            {err("name")}
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm text-[#8a8175]">電話 *</span>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              inputMode="tel"
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:border-[#b91c1c]"
            />
            {err("phone")}
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-sm text-[#8a8175]">電郵（選填）</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:border-[#b91c1c]"
            />
            {err("email")}
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm text-[#8a8175]">備註（選填）</span>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="例如：靠窗座位、慶祝生日、食物敏感等"
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:border-[#b91c1c]"
            />
            {err("notes")}
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-[#b91c1c] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#991b1b] sm:w-auto"
        >
          提交訂位
        </button>
        <p className="mt-3 text-xs text-[#8a8175]">
          提交後將產生訂位代號；餐廳確認後會與你聯絡。
        </p>
      </form>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-lg">訂位須知</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#57534e]">
            <li>· 每組最多 20 位，逾 20 位請來電洽詢。</li>
            <li>· 座位保留 15 分鐘，逾時恕不保留。</li>
            <li>· 需修改或取消，請提供訂位代號。</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-black/5 bg-[#f3efe9] p-5 text-sm text-[#57534e]">
          <p className="font-medium text-[#1c1917]">小提示</p>
          <p className="mt-2">
            此為示範環境，訂位資料儲存在本機瀏覽器。正式上線需要連接後端服務。
          </p>
        </div>
      </aside>

      {placed && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="font-serif text-2xl">訂位已提交</h2>
            <p className="mt-2 text-sm text-[#57534e]">
              訂位代號 <span className="font-mono font-medium text-[#b91c1c]">{placed.code}</span>。餐廳將盡快與你確認。
            </p>
            <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-[#faf7f2] p-4 text-xs leading-relaxed">
              {placed.summary}
            </pre>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copy}
                className="rounded-full bg-[#b91c1c] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#991b1b]"
              >
                {copied ? "已複製 ✓" : "複製訂位資訊"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlaced(null);
                  setForm(EMPTY);
                }}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-[#57534e] hover:bg-black/5"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
