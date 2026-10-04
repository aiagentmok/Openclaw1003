import TaskBoard from "@/components/task-board";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Openclaw1003 · 任務清單</h1>
          <p className="text-zinc-500 mt-2">
            Next.js（靜態輸出）+ TypeScript + Tailwind CSS + shadcn/ui + Prisma schema（localStorage 適配）+ Zod 校驗。
            資料存在瀏覽器 localStorage，靜態站無伺服器端。
          </p>
        </header>

        <TaskBoard />

        <footer className="mt-12 text-center text-sm text-zinc-500">
          Openclaw1003 · 靜態站 · GitHub Pages
        </footer>
      </div>
    </main>
  );
}
