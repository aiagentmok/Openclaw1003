import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, GALLERY, RESTAURANT } from "@/lib/restaurant";
import { asset } from "@/lib/site";

export const metadata: Metadata = {
  title: "Johnny Japan · 日式餐廳",
  description:
    "Johnny Japan — 東京 2024 年創立的現代日式餐廳。壽司、刺身、串燒、天婦羅等招牌菜式，簡約靜謐的用餐空間。",
};

const nav = [
  { href: "/Restaurant", label: "首頁" },
  { href: "/Restaurant/menu", label: "菜單" },
  { href: "#gallery", label: "環境" },
  { href: "#hours", label: "營業時間" },
  { href: "#contact", label: "聯絡" },
];

export default function RestaurantHome() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1917]">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#faf7f2]/85 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/Restaurant" className="flex items-center gap-3">
            <span className="relative block size-9 overflow-hidden rounded-full ring-1 ring-black/10">
              <img
                src={asset("/images/restaurant/logo.jpg")}
                alt="Johnny Japan logo"
                className="h-full w-full object-cover"
              />
            </span>
            <span className="leading-tight">
              <span className="block font-serif text-lg tracking-wide">Johnny Japan</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#8a8175]">{RESTAURANT.latin}</span>
            </span>
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
            className="rounded-full bg-[#b91c1c] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#991b1b]"
          >
            View Menu
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#b91c1c]">{RESTAURANT.latin}</p>
            <h1 className="mt-4 font-serif text-5xl leading-tight sm:text-6xl">Johnny Japan</h1>
            <p className="mt-3 text-sm uppercase tracking-[0.25em] text-[#8a8175]">{RESTAURANT.tagline}</p>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#57534e]">{RESTAURANT.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/Restaurant/menu"
                className="rounded-full bg-[#b91c1c] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#991b1b]"
              >
                View Menu
              </Link>
              <a
                href="#contact"
                className="rounded-full border border-black/15 px-6 py-3 text-sm font-medium transition-colors hover:bg-black/5"
              >
                訂位／聯絡
              </a>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
            <img
              src={asset("/images/restaurant/logo.jpg")}
              alt="Johnny Japan 標誌"
              className="h-full w-full object-contain p-6"
            />
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-black/5 bg-white/60">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b91c1c]">About</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">餐廳簡介</h2>
          <p className="mt-6 text-[15px] leading-relaxed text-[#57534e]">{RESTAURANT.intro}</p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b91c1c]">Philosophy</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">品牌與料理理念</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {RESTAURANT.philosophy.map((p) => (
            <div key={p.title} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <h3 className="font-serif text-xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#57534e]">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Signature categories */}
      <section className="border-t border-black/5 bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-[#b91c1c]">Signature</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">招牌菜式</h2>
            <p className="mt-3 text-sm text-[#8a8175]">依類別探索我們最受歡迎的料理。</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => (
              <article
                key={c.id}
                className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#eceae5]">
                  <img
                    src={asset(c.image)}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-xl">
                      {c.name}
                      <span className="ml-2 text-xs font-normal text-[#8a8175]">{c.nameJp}</span>
                    </h3>
                    <span className="shrink-0 text-sm font-medium text-[#b91c1c]">{c.price}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#57534e]">{c.desc}</p>
                  <Link
                    href="/Restaurant/menu"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#b91c1c] hover:underline"
                  >
                    View Menu →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b91c1c]">Space</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">環境相片</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((g, i) => (
            <div key={g.src + i} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#eceae5] ring-1 ring-black/5">
              <img src={asset(g.src)} alt={g.alt} loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Hours + Contact */}
      <section id="hours" className="border-t border-black/5 bg-white/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#b91c1c]">Hours</p>
            <h2 className="mt-3 font-serif text-3xl">營業時間</h2>
            <dl className="mt-6 divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">
              {RESTAURANT.hours.map((h) => (
                <div key={h.days} className="flex items-center justify-between gap-4 px-5 py-3">
                  <dt className="text-sm text-[#57534e]">{h.days}</dt>
                  <dd className="text-sm font-medium">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div id="contact">
            <p className="text-xs uppercase tracking-[0.35em] text-[#b91c1c]">Contact</p>
            <h2 className="mt-3 font-serif text-3xl">地址與聯絡方式</h2>
            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <span className="block text-[#8a8175]">地址</span>
                <span className="mt-1 block">{RESTAURANT.address}</span>
              </li>
              <li>
                <span className="block text-[#8a8175]">電話</span>
                <a href={`tel:${RESTAURANT.phone.replace(/[^+\d]/g, "")}`} className="mt-1 block hover:text-[#b91c1c]">
                  {RESTAURANT.phone}
                </a>
              </li>
              <li>
                <span className="block text-[#8a8175]">電郵</span>
                <a href={`mailto:${RESTAURANT.email}`} className="mt-1 block hover:text-[#b91c1c]">
                  {RESTAURANT.email}
                </a>
              </li>
            </ul>
            <a
              href={RESTAURANT.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full border border-black/15 px-6 py-3 text-sm font-medium transition-colors hover:bg-black/5"
            >
              在地圖上查看
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-[#1c1917] text-[#e7e5e4]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <p className="font-serif text-xl">Johnny Japan</p>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[#a8a29e]">{RESTAURANT.tagline}</p>
          </div>
          <div>
            <p className="text-sm font-medium">快速連結</p>
            <ul className="mt-3 space-y-2 text-sm text-[#a8a29e]">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="transition-colors hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">追蹤我們</p>
            <div className="mt-3 flex gap-4 text-sm text-[#a8a29e]">
              <a href={RESTAURANT.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Instagram
              </a>
              <a href={RESTAURANT.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Facebook
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-6 text-center text-xs text-[#78716c]">
          <p>© {new Date().getFullYear()} Johnny Japan. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/" className="hover:text-[#e7e5e4]">
              ← 返回應用索引
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
