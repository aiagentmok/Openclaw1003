import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Openclaw1003 · 應用索引",
  description: "Openclaw1003 靜態應用索引。",
};

const APPS = [
  {
    href: "/To_do_list",
    title: "To Do List",
    desc: "待辦清單：新增／編輯／刪除、到期日、完成標記、分類標籤、搜尋、排序與匯出。",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Openclaw1003</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">靜態應用索引。選擇下方應用進入。</p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2">
          {APPS.map((a) => (
            <li key={a.href}>
              <Link
                href={a.href}
                className="block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <CardTitle>{a.title}</CardTitle>
                    <CardDescription>{a.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm font-medium text-primary">開啟 →</CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>

        <footer className="mt-14 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Next.js Static Export · GitHub Pages
        </footer>
      </div>
    </main>
  );
}
