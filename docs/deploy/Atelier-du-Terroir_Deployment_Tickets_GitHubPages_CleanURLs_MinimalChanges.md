# Deployment Tickets（最小改動版）
Repo：Atelier-du-Terroir（GitHub Pages 乾淨網址，未來可切 Cloudflare Pages）

---

## DEPLOY-GH-01：Vite base 環境化（支援 project pages）
### 目的
- 本機/Cloudflare：base = `/`
- GitHub Pages（project）：base = `/Atelier-du-Terroir/`

### 變更範圍
- `vite.config.ts`
- `package.json`

### AI Studio 提示詞（直接貼）
```
請做「最小改動」以支援 GitHub Pages project base path。
1) 修改 vite.config.ts：
   - 讀取 env（你已經在用 loadEnv）
   - 新增 base: env.VITE_BASE || '/'
   - 其他設定不得改動（server/define/alias/plugins 保持不變）
2) 修改 package.json scripts：
   - 保留既有 dev/build/preview
   - 新增 "build:gh": "VITE_BASE=/Atelier-du-Terroir/ vite build"
驗收：
- npm run build 正常（base=/）
- npm run build:gh 正常（base=/Atelier-du-Terroir/）
```

---

## DEPLOY-GH-02：GitHub Pages SPA 乾淨網址（404.html redirect + index.html handler）
### 目的
- `/themes/:id` 刷新不 404
- 仍使用 BrowserRouter（乾淨網址）

### 變更範圍
- 新增 `public/404.html`
- 修改 `index.html`（只新增一段 redirect 邏輯 script，不動其他 head 設定）

### AI Studio 提示詞（直接貼）
```
請加入 GitHub Pages 專用的 SPA 乾淨網址支援（不要改 Router 模式）。
1) 新增 public/404.html，使用常見 spa-github-pages 方案：
   - 將目前 path/query/hash 編碼後導回到 base 的 index.html（/Atelier-du-Terroir/）
   - 注意：要支援 project pages base path
2) 修改 index.html：在 head 或 body 中加入「redirect handler」腳本：
   - 若 URL query 內含 p=（或等效參數），則用 history.replaceState 把路徑還原
3) 不得更動現有 Tailwind config、字體、色票、importmap、root mount script（/index.tsx）
驗收：
- 部署到 GitHub Pages 後，直接開 /Atelier-du-Terroir/themes/white-sauce 並刷新不 404
```

---

## DEPLOY-GH-03：GitHub Actions 部署到 Pages（dist）
### 目的
- push main 自動 build:gh 並部署
- 產出為 Vite dist

### 變更範圍
- 新增 `.github/workflows/pages.yml`

### AI Studio 提示詞（直接貼）
```
請新增 GitHub Actions workflow 部署到 GitHub Pages（Vite 專案）。
要求：
- 觸發：push 到 main
- 使用 Node LTS
- run: npm ci（或 npm install）→ npm run build:gh
- 使用官方 GitHub Pages actions：
  actions/configure-pages
  actions/upload-pages-artifact（path: dist）
  actions/deploy-pages
- 設定 permissions：pages: write, id-token: write
限制：不得改動任何 TS/TSX 程式碼，只新增 workflow。
驗收：
- Actions 成功後 Pages 可開啟
```

---

## DEPLOY-CF-01（未來切換用）：移除 GH hack + 加入 Cloudflare SPA fallback
### 目的
- 換 Cloudflare Pages 仍維持 BrowserRouter 乾淨網址
- 刷新不 404

### 變更範圍
- 刪除 `public/404.html`
- 移除 `index.html` 的 redirect handler script（只刪那段）
- 新增 `public/_redirects`：`/* /index.html 200`
- Cloudflare build 環境不要設 `VITE_BASE`（或設 `/`）

### AI Studio 提示詞（直接貼）
```
請新增 Cloudflare Pages 的 SPA fallback 並移除 GitHub Pages 專用 hack：
1) 刪除 public/404.html
2) 在 index.html 移除 GH SPA redirect handler（只刪那段，不動其他 head 設定）
3) 新增 public/_redirects，內容：
   /* /index.html 200
4) 不更動 Router、頁面、元件與 UI
驗收：
- 在 Cloudflare Pages 上直接開 /themes/white-sauce 刷新不 404
```
