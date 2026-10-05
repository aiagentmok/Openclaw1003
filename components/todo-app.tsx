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
import {
  allTags,
  dueInDays,
  exportCSV,
  exportJSON,
  formatDue,
  MAX_TAGS,
  newId,
  normalizeTags,
  SORT_OPTIONS,
  sortTodos,
  todoInputSchema,
  type SortKey,
  type Todo,
} from "@/lib/todos";
import {
  Calendar,
  Check,
  CircleCheck,
  Download,
  ListChecks,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";

type Filter = "all" | "active" | "completed";

const EMPTY = { title: "", notes: "", dueDate: "" };

export default function TodoApp() {
  const todos = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [form, setForm] = useState(EMPTY);
  const [formTags, setFormTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("created-desc");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(EMPTY);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editError, setEditError] = useState<string | null>(null);

  function addTodo(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = todoInputSchema.safeParse({ ...form, tags: normalizeTags(formTags) });
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => i.message).join("；"));
      return;
    }
    const todo: Todo = {
      id: newId(),
      title: parsed.data.title,
      notes: parsed.data.notes ?? "",
      tags: parsed.data.tags ?? [],
      dueDate: parsed.data.dueDate ?? "",
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    setTodos((prev) => [todo, ...prev]);
    setForm(EMPTY);
    setFormTags([]);
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
    setEditTags(t.tags ?? []);
    setEditError(null);
  }

  function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    const parsed = todoInputSchema.safeParse({ ...editForm, tags: normalizeTags(editTags) });
    if (!parsed.success) {
      setEditError(parsed.error.issues.map((i) => i.message).join("；"));
      return;
    }
    setTodos((prev) =>
      prev.map((t) =>
        t.id === editingId
          ? {
              ...t,
              title: parsed.data.title,
              notes: parsed.data.notes ?? "",
              tags: parsed.data.tags ?? [],
              dueDate: parsed.data.dueDate ?? "",
            }
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

  const tags = useMemo(() => allTags(todos), [todos]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = todos;
    if (filter === "active") list = list.filter((t) => !t.completed);
    else if (filter === "completed") list = list.filter((t) => t.completed);
    if (activeTag) list = list.filter((t) => (t.tags ?? []).includes(activeTag));
    if (q) {
      list = list.filter((t) => {
        const hay = [t.title, t.notes ?? "", ...(t.tags ?? [])].join(" ").toLowerCase();
        return hay.includes(q);
      });
    }
    return sortTodos(list, sortKey);
  }, [todos, filter, activeTag, query, sortKey]);

  const hasFilters = query.trim() !== "" || activeTag !== null;

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
          <CardDescription>標題必填；可加到期日、分類標籤與備註。送出前由 Zod 校驗。</CardDescription>
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
                  placeholder="例如：完成 Todo App 加功能"
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
              <Label>分類標籤（最多 {MAX_TAGS} 個，Enter 或逗號新增）</Label>
              <TagEditor tags={formTags} onChange={setFormTags} idPrefix="new" />
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

      <Card>
        <CardContent className="space-y-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜尋標題、備註或標籤…"
                className="pl-9"
                aria-label="搜尋待辦"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="sort" className="whitespace-nowrap text-sm text-zinc-500">
                排序
              </Label>
              <select
                id="sort"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => exportJSON(todos)}
                disabled={todos.length === 0}
              >
                <Download className="size-4" /> JSON
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => exportCSV(todos)}
                disabled={todos.length === 0}
              >
                <Download className="size-4" /> CSV
              </Button>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="size-3.5 text-zinc-400" />
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className={
                  "rounded-full border px-2.5 py-0.5 text-xs transition-colors " +
                  (activeTag === null
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border text-zinc-600 hover:bg-muted dark:text-zinc-300")
                }
              >
                全部標籤
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={
                    "rounded-full border px-2.5 py-0.5 text-xs transition-colors " +
                    (activeTag === tag
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-border text-zinc-600 hover:bg-muted dark:text-zinc-300")
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
              <TabsList>
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="active">進行中</TabsTrigger>
                <TabsTrigger value="completed">已完成</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setActiveTag(null);
                  }}
                >
                  <X className="size-4" /> 清除篩選
                </Button>
              )}
              {stats.completed > 0 && (
                <Button variant="ghost" size="sm" onClick={clearCompleted}>
                  <Trash2 className="size-4" /> 清除已完成
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ul className="space-y-3">
        {visible.length === 0 && (
          <li>
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-zinc-500">
                <ListChecks className="size-8" />
                <p className="text-sm">
                  {todos.length === 0
                    ? "尚無待辦事項，從上方新增第一個。"
                    : hasFilters
                      ? "沒有符合搜尋／篩選的項目。"
                      : "此分類沒有項目。"}
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
                      <TagEditor tags={editTags} onChange={setEditTags} idPrefix="edit" />
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
                          {(t.tags ?? []).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                            >
                              <Tag className="mr-1 size-3" />
                              {tag}
                            </Badge>
                          ))}
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

function TagEditor({
  tags,
  onChange,
  idPrefix,
}: {
  tags: string[];
  onChange: (next: string[]) => void;
  idPrefix: string;
}) {
  const [draft, setDraft] = useState("");

  function commit(raw: string) {
    const next = normalizeTags([...tags, raw]);
    onChange(next);
    setDraft("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === "," || e.key === "，") {
      e.preventDefault();
      if (draft.trim()) commit(draft);
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  const atMax = tags.length >= MAX_TAGS;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-input bg-transparent px-2 py-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-zinc-700 dark:text-zinc-200"
        >
          {tag}
          <button
            type="button"
            aria-label={`移除標籤 ${tag}`}
            onClick={() => onChange(tags.filter((x) => x !== tag))}
            className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        id={`${idPrefix}-tag-input`}
        value={draft}
        disabled={atMax}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => draft.trim() && commit(draft)}
        placeholder={atMax ? `已達 ${MAX_TAGS} 個標籤上限` : "輸入標籤後按 Enter"}
        className="h-7 min-w-32 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed"
        aria-label="新增標籤"
      />
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
