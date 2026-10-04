import TodoApp from "@/components/todo-app";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Todo List</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            新增、編輯、刪除、到期日與完成標記。資料儲存於瀏覽器 localStorage，為靜態部署（GitHub Pages）。
          </p>
        </header>

        <TodoApp />

        <footer className="mt-14 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Next.js Static Export · TypeScript · Tailwind CSS · shadcn/ui · Zod · GitHub Pages
        </footer>
      </div>
    </main>
  );
}
