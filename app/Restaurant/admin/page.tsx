import type { Metadata } from "next";
import Link from "next/link";
import AdminApp from "@/components/restaurant/admin-app";

export const metadata: Metadata = {
  title: "員工後台 · Johnny Japan",
  description: "員工專用：查看與管理線上訂位。",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1917]">
      <header className="border-b border-black/5 bg-[#faf7f2]/85 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/Restaurant" className="font-serif text-lg tracking-wide">
            Johnny Japan <span className="ml-2 text-xs uppercase tracking-[0.2em] text-[#8a8175]">Staff</span>
          </Link>
          <Link href="/Restaurant" className="text-sm text-[#57534e] hover:text-[#b91c1c]">
            返回網站
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <AdminApp />
      </section>
    </div>
  );
}
