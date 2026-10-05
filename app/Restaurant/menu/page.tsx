import type { Metadata } from "next";
import Link from "next/link";
import { MENU, RESTAURANT } from "@/lib/restaurant";

export const metadata: Metadata = {
  title: "菜單 · Johnny Japan",
  description:
    "Johnny Japan 菜單：前菜、壽司・刺身、燒物、揚物、麵類與甜點。",
};

const nav = [
  { href: "/Restaurant", label: "首頁" },
  { href: "/Restaurant/menu", label: "菜單" },
  { href: "/Restaurant/order", label: "線上點餐" },
  { href: "/Restaurant/reserve", label: "線上訂位" },
  { href: "/Restaurant#gallery", label: "環境" },
  { href: "/Restaurant#hours", label: "營業時間" },
  { href: "/Restaurant#contact", label: "聯絡" },
];

export default function MenuPage() {
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
            href="/Restaurant"
            className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5"
          >
            返回首頁
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b91c1c]">Menu</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">菜單</h1>
          <p className="mt-4 text-sm uppercase tracking-[0.25em] text-[#8a8175]">{RESTAURANT.tagline}</p>
          <p className="mt-6 text-sm text-[#8a8175]">以下為示意菜單，實際菜式與價格以店內為準。</p>
        </div>

        <div className="mt-12 space-y-12">
          {MENU.map((section) => (
            <div key={section.id}>
              <div className="flex items-baseline gap-3 border-b border-black/10 pb-3">
                <h2 className="font-serif text-2xl">{section.title}</h2>
                <span className="text-sm text-[#8a8175]">{section.titleJp}</span>
              </div>
              <ul className="mt-4 divide-y divide-black/5">
                {section.items.map((item) => (
                  <li key={item.name} className="flex items-start justify-between gap-6 py-4">
                    <div className="min-w-0">
                      <p className="font-medium">
                        {item.name}
                        {item.nameJp && <span className="ml-2 text-xs font-normal text-[#8a8175]">{item.nameJp}</span>}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[#57534e]">{item.desc}</p>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-[#b91c1c]">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-black/5 bg-white p-8 text-center">
          <h2 className="font-serif text-2xl">訂位與查詢</h2>
          <p className="mt-3 text-sm text-[#57534e]">
            電話：{RESTAURANT.phone}　·　電郵：{RESTAURANT.email}
          </p>
          <Link
            href="/Restaurant#contact"
            className="mt-6 inline-flex rounded-full bg-[#b91c1c] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#991b1b]"
          >
            聯絡我們
          </Link>
        </div>

        <div className="mt-10 text-center">
          <Link href="/Restaurant" className="text-sm text-[#57534e] hover:text-[#b91c1c]">
            ← 返回首頁
          </Link>
          <span className="mx-3 text-black/20">|</span>
          <Link href="/" className="text-sm text-[#57534e] hover:text-[#b91c1c]">
            應用索引
          </Link>
        </div>
      </section>
    </div>
  );
}
