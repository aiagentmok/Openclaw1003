import { z } from "zod";

/**
 * Client-side data layer that mirrors the Prisma schema (Task/User) using
 * localStorage. This replaces a Prisma/SQLite connection for static export,
 * where no server or database process is available.
 */

const taskShape = {
  id: "string",
  title: "string",
  notes: "string",
  completed: "boolean",
  createdAt: "string",
};

export const prismaTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  notes: z.string().max(200).optional().or(z.literal("")),
  completed: z.boolean(),
  createdAt: z.string(),
});
export type PrismaTask = z.infer<typeof prismaTaskSchema>;

const TASKS_KEY = "openclaw1003:tasks";
const SESSION_KEY = "openclaw1003:session";

function readJSON<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable/full — no-op in static context
  }
}

/** Prisma-style task repository backed by localStorage. */
export const prisma = {
  task: {
    findMany(): PrismaTask[] {
      return readJSON<PrismaTask>(TASKS_KEY);
    },
    create(data: PrismaTask): PrismaTask {
      const all = readJSON<PrismaTask>(TASKS_KEY);
      all.unshift(data);
      writeJSON(TASKS_KEY, all);
      return data;
    },
    update(id: string, data: Partial<PrismaTask>): PrismaTask | undefined {
      let updated: PrismaTask | undefined;
      const all = readJSON<PrismaTask>(TASKS_KEY).map((t) => {
        if (t.id === id) {
          updated = { ...t, ...data };
          return updated;
        }
        return t;
      });
      writeJSON(TASKS_KEY, all);
      return updated;
    },
    delete(id: string): void {
      const all = readJSON<PrismaTask>(TASKS_KEY).filter((t) => t.id !== id);
      writeJSON(TASKS_KEY, all);
    },
  },
};

/** Minimal NextAuth-compatible frontend session store (localStorage). */
export type FrontendSession = {
  user: { name: string; email: string };
  expires: string;
};

export const auth = {
  getSession(): FrontendSession | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as FrontendSession) : null;
    } catch {
      return null;
    }
  },
  signIn(name: string, email: string): FrontendSession {
    const session: FrontendSession = {
      user: { name, email },
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    writeJSON(SESSION_KEY, session);
    return session;
  },
  signOut(): void {
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      // no-op
    }
  },
};

// Silence unused-var lint for the reference shape used by consumers of this module.
export const TASK_SHAPE = taskShape;
