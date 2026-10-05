import type { Metadata } from "next";
import Link from "next/link";
import ReserveApp from "@/components/restaurant/reserve-app";
import { RESTAURANT } from "@/lib/restaurant";

export const metadata: Metadata = {
  title: "線上訂位 · Johnny Japan",
  description: "Johnny Japan 線上訂位：選擇日期、時間、人數並填寫聯絡資料。",
};

const nav = [
  { href: "/Restaurant", label: "首頁" },
  { href: "/Restaurant/menu", label: "菜單" },
  { href: "/Restaurant/order", label: "線上點餐" },
  { href: "/Restaurant/reserve", label: "線上訂位" },
];

export default function ReservePage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1917]">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#faf7f2]/85 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/Restaurant" className="font-serif text-lg tracking-wide">
            Johnny Japan
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="text-sm text-[#57534e] transition-colors hover:text-[#b91c1c]">
                {n.label}
              </Link>
            ))}
          </div>
          <Link
            href="/Restaurant/menu"
            className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5"
          >
            查看菜單
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b91c1c]">Reservation</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">線上訂位</h1>
          <p className="mt-4 text-sm text-[#8a8175]">
            選擇日期、時間與人數，並填寫聯絡資料。餐廳確認後會與你聯絡。
          </p>
        </div>

        <div className="mt-12">
          <ReserveApp />
        </div>

        <div className="mt-16 text-center">
          <Link href="/Restaurant" className="text-sm text-[#57534e] hover:text-[#b91c1c]">
            ← 返回首頁
          </Link>
          <span className="mx-3 text-black/20">|</span>
          <Link href="/" className="text-sm text-[#57534e] hover:text-[#b91c1c]">
            應用索引
          </Link>
        </div>
      </section>

      <footer className="border-t border-black/5 bg-[#1c1917] py-8 text-center text-xs text-[#78716c]">
        <p>
          © {new Date().getFullYear()} Johnny Japan · {RESTAURANT.phone}
        </p>
      </footer>
    </div>
  );
}
