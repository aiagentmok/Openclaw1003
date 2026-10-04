import { defineConfig } from "prisma/config";

/**
 * Prisma 7 設定檔：靜態站將資料庫連線改由 LocalStorage 模擬，
 * 此檔供 Prisma CLI 在 build/CI 時讀取 schema 並產生 client 型別。
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
});
