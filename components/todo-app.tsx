"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getServerSnapshot, getSnapshot, setTodos, subscribe } from "@/lib/todos-store";
import { dueInDays, formatDue, newId, todoInputSchema, type Todo } from "@/lib/todos";
import { Calendar, Check, CircleCheck, ListChecks, Pencil, Plus, Trash2, X } from "lucide-react";

type Filter = "all" | "active" | "completed";

const EMPTY = { title: "", notes: "", dueDate: "" };

export default function TodoApp() {
  const todos = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(EMPTY);
  const [editError, setEditError] = useState<string | null>(null);

  function addTodo(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = todoInputSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => i.message).join("；"));
      return;
    }
    const todo: Todo = {
      id: newId(),
      title: parsed.data.title,
      notes: parsed.data.notes ?? "",
      dueDate: parsed.data.dueDate ?? "",
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    setTodos((prev) => [todo, ...prev]);
    setForm(EMPTY);
  }

  function toggle(id: string) {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null }
          : t,
      ),
    );
  }

  function remove(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function startEdit(t: Todo) {
    setEditingId(t.id);
    setEditForm({ title: t.title, notes: t.notes ?? "", dueDate: t.dueDate ?? "" });
    setEditError(null);
  }

  function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    const parsed = todoInputSchema.safeParse(editForm);
    if (!parsed.success) {
      setEditError(parsed.error.issues.map((i) => i.message).join("；"));
      return;
    }
    setTodos((prev) =>
      prev.map((t) =>
        t.id === editingId
          ? { ...t, title: parsed.data.title, notes: parsed.data.notes ?? "", dueDate: parsed.data.dueDate ?? "" }
          : t,
      ),
    );
    setEditingId(null);
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const overdue = todos.filter((t) => !t.completed && (dueInDays(t.dueDate ?? "") ?? 1) < 0).length;
    return { total, completed, active: total - completed, overdue };
  }, [todos]);

  const visible = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="全部" value={stats.total} />
        <Stat label="進行中" value={stats.active} />
        <Stat label="已完成" value={stats.completed} tone="green" />
        <Stat label="逾期" value={stats.overdue} tone="red" />
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="size-4" /> 新增待辦
          </CardTitle>
          <CardDescription>填寫標題（必填）、到期日與備註，送出前由 Zod 校驗。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTodo} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <Label htmlFor="new-title">標題</Label>
                <Input
                  id="new-title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="例如：完成 Todo App 部署"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-due">到期日</Label>
                <Input
                  id="new-due"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-notes">備註（選填）</Label>
              <Textarea
                id="new-notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="補充說明，最多 300 字"
                rows={2}
              />
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <Button type="submit" className="w-full sm:w-auto">
              <Plus className="size-4" /> 新增
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="active">進行中</TabsTrigger>
            <TabsTrigger value="completed">已完成</TabsTrigger>
          </TabsList>
        </Tabs>
        {stats.completed > 0 && (
          <Button variant="ghost" size="sm" onClick={clearCompleted}>
            <Trash2 className="size-4" /> 清除已完成
          </Button>
        )}
      </div>

      <ul className="space-y-3">
        {visible.length === 0 && (
          <li>
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-zinc-500">
                <ListChecks className="size-8" />
                <p className="text-sm">
                  {todos.length === 0 ? "尚無待辦事項，從上方新增第一個。" : "此分類沒有項目。"}
                </p>
              </CardContent>
            </Card>
          </li>
        )}

        {visible.map((t) => {
          const days = dueInDays(t.dueDate ?? "");
          const overdue = !t.completed && days !== null && days < 0;
          const dueToday = !t.completed && days === 0;
          const editing = editingId === t.id;

          return (
            <li key={t.id}>
              <Card className={t.completed ? "opacity-70" : ""}>
                <CardContent className="py-4">
                  {editing ? (
                    <form onSubmit={saveEdit} className="space-y-3">
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        aria-label="編輯標題"
                      />
                      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                        <Textarea
                          value={editForm.notes}
                          onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                          rows={2}
                          aria-label="編輯備註"
                        />
                        <Input
                          type="date"
                          value={editForm.dueDate}
                          onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                          aria-label="編輯到期日"
                          className="sm:w-44"
                        />
                      </div>
                      {editError && <p className="text-sm text-red-600 dark:text-red-400">{editError}</p>}
                      <div className="flex gap-2">
                        <Button type="submit" size="sm">
                          <Check className="size-4" /> 儲存
                        </Button>
                        <Button type="button" size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          <X className="size-4" /> 取消
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggle(t.id)}
                        aria-label={t.completed ? "標記為未完成" : "標記為完成"}
                        aria-pressed={t.completed}
                        className="mt-0.5 shrink-0 rounded-full transition-colors"
                      >
                        {t.completed ? (
                          <CircleCheck className="size-6 text-emerald-600" />
                        ) : (
                          <span className="block size-6 rounded-full border-2 border-zinc-300 dark:border-zinc-600" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p
                          className={
                            "break-words font-medium " +
                            (t.completed ? "line-through text-zinc-400" : "text-zinc-900 dark:text-zinc-100")
                          }
                        >
                          {t.title}
                        </p>
                        {t.notes && (
                          <p className="mt-1 break-words text-sm text-zinc-500 dark:text-zinc-400">{t.notes}</p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {t.dueDate && (
                            <Badge variant={overdue ? "destructive" : dueToday ? "default" : "secondary"}>
                              <Calendar className="mr-1 size-3" />
                              {overdue ? "逾期 " : dueToday ? "今天 " : ""}
                              {formatDue(t.dueDate)}
                            </Badge>
                          )}
                          {t.completed && t.completedAt && (
                            <Badge variant="secondary">
                              完成於 {new Date(t.completedAt).toLocaleDateString("zh-Hant-TW")}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => startEdit(t)} aria-label="編輯">
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => remove(t.id)}
                          aria-label="刪除"
                          className="text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "green" | "red" }) {
  const color =
    tone === "green"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "red"
        ? "text-red-600 dark:text-red-400"
        : "text-zinc-900 dark:text-zinc-100";
  return (
    <Card>
      <CardContent className="py-4">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className={"mt-1 text-2xl font-semibold tabular-nums " + color}>{value}</p>
      </CardContent>
    </Card>
  );
}
