# Atelier-du-Terroir 部署說明（GitHub Pages 乾淨網址 → 可平滑轉 Cloudflare Pages）

Repo：`Atelier-du-Terroir`

本文件目標：
- 先用 **GitHub Pages** 免費上架，並維持「乾淨網址」（`/themes/...`，不是 `/#/themes/...`）
- 之後若改用 **Cloudflare Pages**，只需移除/新增少量檔案即可切換，不動主程式

---

## 一、目前專案關鍵點（你這份 repo 的現況）

- Vite 入口：`index.html` 以 `<script type="module" src="/index.tsx"></script>` 啟動
- Vite 設定：`vite.config.ts` 目前 **沒有**設定 `base`
- React Router：尚未安裝（`package.json` 沒有 `react-router-dom`）
- 目標路由：`/`、`/themes/:themeId`、`/catalog`

---

## 二、GitHub Pages（乾淨網址）需要解決的 2 個問題

### 1) 子路由刷新 404（history routing）
GitHub Pages 會把 `/themes/x` 當成「實體路徑」去找檔案，找不到就 404。
解法：使用 **404.html 轉址 hack**（常見作法：spa-github-pages）。

### 2) Project Pages 的 base path
你的 repo 名稱是 `Atelier-du-Terroir`，若你用 GitHub Project Pages，網址通常會是：

- `https://<username>.github.io/Atelier-du-Terroir/`

這代表前端資源與路由需要對應 base：`/Atelier-du-Terroir/`。

---

## 三、最小改動 Ticket 清單（GitHub Pages 乾淨網址）

> 這些票的設計原則：**平台耦合的東西放在 public/ 或 workflow**，避免污染 App/元件。

### Ticket DEPLOY-GH-01：Vite base 以環境變數控制
目標：同一份程式碼可支援：
- 本機 / Cloudflare：base = `/`
- GitHub Pages project：base = `/Atelier-du-Terroir/`

做法（建議）：
- `vite.config.ts` 增加：
  - `base: env.VITE_BASE || '/'`

再加 scripts：
- `build`（預設 base `/`）
- `build:gh`（base `/Atelier-du-Terroir/`）

---

### Ticket DEPLOY-GH-02：加入 GitHub Pages 的 SPA 轉址（404.html + index.html redirect handler）
目標：刷新 `/themes/:id` 不會 404，仍維持乾淨網址。

需要兩個檔案：
1) `public/404.html`：把未知路徑轉成 query 形式回到 `index.html`
2) `index.html`：加入一段小 script，把 query 還原成真正的 path（history pushState）

---

### Ticket DEPLOY-GH-03：GitHub Actions 部署到 Pages（dist）
目標：push 到 main 後自動 build（使用 `build:gh`）並部署到 GitHub Pages。

---

## 四、轉 Cloudflare Pages 時要改什麼（最小變更）

如果你之後改用 Cloudflare Pages（依然 BrowserRouter、乾淨網址），通常只要：

1) 移除 GitHub Pages 專用 hack
   - 刪除 `public/404.html`
   - 刪除 `index.html` 裡的 redirect handler script（只刪那段，不要動其他 head 設定）

2) 改回 base `/`（若你當初用 env 控制，等同於把 `VITE_BASE` 不設）
   - Cloudflare Pages 建置環境不要設定 `VITE_BASE`，或設成 `/`

3) 新增 Cloudflare Pages 的 SPA fallback
   - `public/_redirects`：
     ```
     /* /index.html 200
     ```

4) 部署流程換成 Cloudflare Pages（連 GitHub repo 或用 CI）
   - 不影響 App/元件程式碼

---

## 五、驗收清單（你每次部署都照這個檢查）

### GitHub Pages（Project Pages）
- 首頁可開：`https://<username>.github.io/Atelier-du-Terroir/`
- 內頁可開：`https://<username>.github.io/Atelier-du-Terroir/themes/white-sauce`
- 在內頁 **重新整理**不 404
- Router 內部 Link 正常

### Cloudflare Pages
- 內頁可開：`https://<project>.pages.dev/themes/white-sauce`
- 在內頁 **重新整理**不 404
- 沒有 `/#/`（仍為乾淨網址）

---

## 六、回滾策略（保險）
- 若 GitHub Pages 轉址 hack 造成意外：
  - 退回 HashRouter（`/#/themes/...`）一定能跑，但網址含 `#`
  - 建議僅作為最後手段
