import type { Metadata } from "next";
import TodoApp from "@/components/todo-app";

export const metadata: Metadata = {
  title: "To Do List · Openclaw1003",
  description:
    "以 Next.js 靜態輸出打造的 To Do List：新增、編輯、刪除、到期日、完成標記、分類標籤、搜尋、排序與匯出。",
};

export default function ToDoListPage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            <a href="../" className="hover:underline">
              ← 返回應用索引
            </a>
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">To Do List</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            新增、編輯、刪除、到期日、完成標記、分類標籤、搜尋、排序與匯出。資料儲存於瀏覽器
            localStorage（靜態部署）。
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
