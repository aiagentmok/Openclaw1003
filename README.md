# Openclaw1003

Next.js（靜態輸出 `output: "export"`）+ TypeScript + Tailwind CSS + shadcn/ui + Prisma schema（SQLite，client 已 generate）+ LocalStorage 資料層 + NextAuth.js（前端 session）+ Zod。

部署到 GitHub Pages：`.github/workflows/deploy.yml` 使用內建 `GITHUB_TOKEN`，build 後將 `out/` 部署至 Pages。

## 本機

- `npm install`
- `npx prisma generate`
- `npm run dev`
- `npm run lint` / `npx tsc --noEmit`
- `npm run build` → `out/`
