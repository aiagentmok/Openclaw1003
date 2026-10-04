"use client";

import { z } from "zod";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toStorageKey, useLocalStorage } from "@/lib/storage";

// Zod schema for task entries
const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  notes: z.string().max(200, "Notes must be under 200 characters").optional().or(z.literal("")),
  completed: z.boolean(),
  createdAt: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

export default function TaskBoard() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useLocalStorage<Task[]>(toStorageKey("tasks"), []);

  function addTask() {
    setError(null);
    const candidate = {
      id: crypto.randomUUID(),
      title: title.trim(),
      notes: notes.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const result = taskSchema.safeParse(candidate);
    if (!result.success) {
      const issues = result.error.issues;
      setError(issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; "));
      return;
    }
    setTasks([result.data, ...tasks]);
    setTitle("");
    setNotes("");
  }

  function toggle(id: string) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function remove(id: string) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  const done = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>新增任務</CardTitle>
            <CardDescription>標題必填且至少 2 字；備註最長 200 字。提交前由 Zod 校驗。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">標題</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：完成部署檢查" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">備註（選填）</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="選填，最長 200 字" rows={3} />
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <Button onClick={addTask} className="w-full">加入任務</Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>統計</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-lg">
            <div>總數</div>
            <Badge variant="secondary">{tasks.length}</Badge>
            <div className="mt-4">已完成</div>
            <Badge variant="secondary">{done}</Badge>
            <div className="mt-4">未完成</div>
            <Badge>{tasks.length - done}</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">清單</TabsTrigger>
          <TabsTrigger value="about">關於此頁</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-6">
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-zinc-500">
                尚無任務。在上方加入第一個。
              </CardContent>
            </Card>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">狀態</TableHead>
                  <TableHead>標題</TableHead>
                  <TableHead>備註</TableHead>
                  <TableHead className="w-24 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((t) => (
                  <TableRow key={t.id} className={t.completed ? "opacity-55" : ""}>
                    <TableCell>
                      <button onClick={() => toggle(t.id)} className="text-sm">
                        {t.completed ? "✓ 完成" : "○ 未做"}
                      </button>
                    </TableCell>
                    <TableCell>{t.title}</TableCell>
                    <TableCell className="text-zinc-500">{t.notes || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => remove(t.id)}>刪除</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        <TabsContent value="about" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>關於此頁</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <p>此站為 Next.js 靜態輸出（<code className="font-mono">output: &quot;export&quot;</code>），部署到 GitHub Pages。</p>
              <p>Prisma 資料庫在靜態環境改由 LocalStorage 模擬；NextAuth 在此 demo 為佔位（前端 session 存於 localStorage）。</p>
              <p>Zod 負責表單資料校驗。所有 UI 元件來自 shadcn/ui，樣式由 Tailwind CSS 驅動。</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
