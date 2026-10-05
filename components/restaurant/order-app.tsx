"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { MENU, RESTAURANT, findMenuItem } from "@/lib/restaurant";
import { addItem, clearCart, removeItem, setQty, useCart } from "@/lib/cart-store";

const orderSchema = z
  .object({
    name: z.string().trim().min(1, "請填寫姓名").max(80),
    phone: z.string().trim().min(6, "請填寫有效聯絡電話").max(30),
    email: z.string().trim().email("電郵格式不正確").optional().or(z.literal("")),
    mode: z.enum(["pickup", "delivery"]),
    date: z.string().optional().or(z.literal("")),
    time: z.string().optional().or(z.literal("")),
    address: z.string().trim().max(200).optional().or(z.literal("")),
    notes: z.string().trim().max(300, "備註最多 300 字").optional().or(z.literal("")),
  })
  .refine((d) => d.mode !== "delivery" || (d.address ?? "").trim().length >= 5, {
    message: "選擇外送時請填寫完整地址",
    path: ["address"],
  });

type OrderForm = z.infer<typeof orderSchema>;

const EMPTY_FORM: OrderForm = {
  name: "",
  phone: "",
  email: "",
  mode: "pickup",
  date: "",
  time: "",
  address: "",
  notes: "",
};

const yen = (n: number) => `${RESTAURANT.currency}${n.toLocaleString("en-US")}`;

export default function OrderApp() {
  const cart = useCart();
  const [form, setForm] = useState<OrderForm>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<{ id: string; summary: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const qtyOf = (id: string) => cart.find((l) => l.id === id)?.qty ?? 0;

  const lines = useMemo(
    () =>
      cart
        .map((l) => {
          const item = findMenuItem(l.id);
          return item ? { ...item, qty: l.qty, lineTotal: item.priceValue * l.qty } : null;
        })
        .filter((x): x is NonNullable<typeof x> => x !== null),
    [cart],
  );

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const count = cart.reduce((s, l) => s + l.qty, 0);
  const deliveryFee = form.mode === "delivery" ? 800 : 0;
  const total = subtotal + deliveryFee;

  function buildSummary(id: string, data: OrderForm): string {
    const rows = lines.map((l) => `  ${l.name} x${l.qty}  ${yen(l.lineTotal)}`).join("\n");
    const mode = data.mode === "delivery" ? "外送" : "外帶自取";
    const when = [data.date, data.time].filter(Boolean).join(" ") || "（未指定）";
    return [
      `訂單編號：${id}`,
      `餐廳：${RESTAURANT.name}（${RESTAURANT.latin}）`,
      "",
      "— 餐點 —",
      rows,
      "",
      `小計：${yen(subtotal)}`,
      data.mode === "delivery" ? `外送費：${yen(deliveryFee)}` : null,
      `合計：${yen(total)}`,
      "",
      `取餐方式：${mode}`,
      `時間：${when}`,
      data.mode === "delivery" ? `地址：${data.address}` : null,
      `姓名：${data.name}`,
      `電話：${data.phone}`,
      data.email ? `電郵：${data.email}` : null,
      data.notes ? `備註：${data.notes}` : null,
    ]
      .filter((x): x is string => x !== null)
      .join("\n");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (lines.length === 0) {
      setError("購物車是空的，請先加入餐點。");
      return;
    }
    const parsed = orderSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => i.message).join("；"));
      return;
    }
    const id = `JJ-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setPlaced({ id, summary: buildSummary(id, parsed.data) });
    clearCart();
    setCopied(false);
  }

  async function copyOrder() {
    if (!placed) return;
    try {
      await navigator.clipboard.writeText(placed.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const mailto =
    placed &&
    `mailto:${RESTAURANT.email}?subject=${encodeURIComponent(`線上點餐 ${placed.id}`)}&body=${encodeURIComponent(placed.summary)}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Menu list */}
      <div className="space-y-10">
        {MENU.map((section) => (
          <div key={section.id}>
            <div className="flex items-baseline gap-3 border-b border-black/10 pb-3">
              <h2 className="font-serif text-2xl">{section.title}</h2>
              <span className="text-sm text-[#8a8175]">{section.titleJp}</span>
            </div>
            <ul className="mt-4 divide-y divide-black/5">
              {section.items.map((it) => {
                const q = qtyOf(it.id);
                return (
                  <li key={it.id} className="flex items-start justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="font-medium">
                        {it.name}
                        {it.nameJp && <span className="ml-2 text-xs font-normal text-[#8a8175]">{it.nameJp}</span>}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[#57534e]">{it.desc}</p>
                      <p className="mt-1 text-sm font-medium text-[#b91c1c]">{it.price}</p>
                    </div>
                    {q === 0 ? (
                      <button
                        type="button"
                        onClick={() => addItem(it.id)}
                        className="shrink-0 rounded-full bg-[#b91c1c] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#991b1b]"
                        aria-label={`加入 ${it.name}`}
                      >
                        加入
                      </button>
                    ) : (
                      <div className="flex shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white px-1.5 py-1">
                        <button
                          type="button"
                          onClick={() => setQty(it.id, q - 1)}
                          className="grid size-7 place-items-center rounded-full text-lg leading-none hover:bg-black/5"
                          aria-label={`減少 ${it.name}`}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums">{q}</span>
                        <button
                          type="button"
                          onClick={() => setQty(it.id, q + 1)}
                          className="grid size-7 place-items-center rounded-full text-lg leading-none hover:bg-black/5"
                          aria-label={`增加 ${it.name}`}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Cart + checkout */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="flex items-center justify-between font-serif text-xl">
            購物車
            <span className="text-sm font-normal text-[#8a8175]">{count} 件</span>
          </h2>

          {lines.length === 0 ? (
            <p className="mt-4 text-sm text-[#8a8175]">尚未加入任何餐點。</p>
          ) : (
            <>
              <ul className="mt-4 space-y-3">
                {lines.map((l) => (
                  <li key={l.id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{l.name}</p>
                      <p className="text-xs text-[#8a8175]">
                        {yen(l.priceValue)} × {l.qty}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <div className="flex items-center gap-1 rounded-full border border-black/10 px-1">
                        <button
                          type="button"
                          onClick={() => setQty(l.id, l.qty - 1)}
                          className="grid size-6 place-items-center rounded-full leading-none hover:bg-black/5"
                          aria-label={`減少 ${l.name}`}
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-xs tabular-nums">{l.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(l.id, l.qty + 1)}
                          className="grid size-6 place-items-center rounded-full leading-none hover:bg-black/5"
                          aria-label={`增加 ${l.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(l.id)}
                        className="text-xs text-[#8a8175] hover:text-[#b91c1c]"
                        aria-label={`移除 ${l.name}`}
                      >
                        移除
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-1 border-t border-black/10 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[#57534e]">小計</dt>
                  <dd className="tabular-nums">{yen(subtotal)}</dd>
                </div>
                {form.mode === "delivery" && (
                  <div className="flex justify-between">
                    <dt className="text-[#57534e]">外送費</dt>
                    <dd className="tabular-nums">{yen(deliveryFee)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold">
                  <dt>合計</dt>
                  <dd className="tabular-nums text-[#b91c1c]">{yen(total)}</dd>
                </div>
              </dl>
            </>
          )}

          <form onSubmit={submit} className="mt-5 space-y-3 border-t border-black/10 pt-5">
            <p className="text-sm font-medium">落單資料</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <label className="col-span-2">
                <span className="mb-1 block text-[#8a8175]">姓名 *</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:border-[#b91c1c]"
                />
              </label>
              <label className="col-span-2">
                <span className="mb-1 block text-[#8a8175]">電話 *</span>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  inputMode="tel"
                  className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:border-[#b91c1c]"
                />
              </label>
              <label className="col-span-2">
                <span className="mb-1 block text-[#8a8175]">電郵（選填）</span>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  type="email"
                  className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:border-[#b91c1c]"
                />
              </label>
              <label>
                <span className="mb-1 block text-[#8a8175]">取餐方式</span>
                <select
                  value={form.mode}
                  onChange={(e) => setForm({ ...form, mode: e.target.value as OrderForm["mode"] })}
                  className="w-full rounded-lg border border-black/10 bg-white px-2 py-2 outline-none focus:border-[#b91c1c]"
                >
                  <option value="pickup">外帶自取</option>
                  <option value="delivery">外送</option>
                </select>
              </label>
              <label>
                <span className="mb-1 block text-[#8a8175]">時間</span>
                <input
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  type="time"
                  className="w-full rounded-lg border border-black/10 bg-white px-2 py-2 outline-none focus:border-[#b91c1c]"
                />
              </label>
              <label className="col-span-2">
                <span className="mb-1 block text-[#8a8175]">日期</span>
                <input
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  type="date"
                  className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:border-[#b91c1c]"
                />
              </label>
              {form.mode === "delivery" && (
                <label className="col-span-2">
                  <span className="mb-1 block text-[#8a8175]">外送地址 *</span>
                  <input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:border-[#b91c1c]"
                  />
                </label>
              )}
              <label className="col-span-2">
                <span className="mb-1 block text-[#8a8175]">備註（選填）</span>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none focus:border-[#b91c1c]"
                />
              </label>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={lines.length === 0}
              className="w-full rounded-full bg-[#b91c1c] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#991b1b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              確認落單（{yen(total)}）
            </button>
            <p className="text-xs text-[#8a8175]">
              送出後將產生訂單摘要，你可複製或以此電郵傳送。實際付款與確認由餐廳跟進。
            </p>
          </form>
        </div>
      </aside>

      {/* Confirmation */}
      {placed && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="font-serif text-2xl">訂單已建立</h2>
            <p className="mt-2 text-sm text-[#57534e]">
              訂單編號 <span className="font-mono font-medium text-[#b91c1c]">{placed.id}</span>
              。請複製以下內容並傳送予餐廳，或按電郵傳送。
            </p>
            <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-[#faf7f2] p-4 text-xs leading-relaxed">
              {placed.summary}
            </pre>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyOrder}
                className="rounded-full bg-[#b91c1c] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#991b1b]"
              >
                {copied ? "已複製 ✓" : "複製訂單"}
              </button>
              {mailto && (
                <a
                  href={mailto}
                  className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium hover:bg-black/5"
                >
                  以電郵傳送
                </a>
              )}
              <button
                type="button"
                onClick={() => setPlaced(null)}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-[#57534e] hover:bg-black/5"
              >
                繼續點餐
              </button>
            </div>
          </div>
        </div>
      )}

      {count > 0 && (
        <div className="lg:hidden">
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 py-3 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
              <span className="text-sm text-[#57534e]">
                {count} 件 · <span className="font-semibold text-[#b91c1c]">{yen(total)}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const el = document.querySelector("aside");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-full bg-[#b91c1c] px-5 py-2 text-sm font-medium text-white"
              >
                前往結帳
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
