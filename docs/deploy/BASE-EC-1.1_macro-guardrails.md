# BASE-EC-1.1_macro-guardrails.md
版本：BASE-EC-1.1  
狀態：提案（可直接納入工程契約）  
用途：任何「VIBECODING + 多端平台 + 預覽環境 + 靜態部署」的前端專案  
核心目標：把可攜性基線升級為「平台不可知」，用宏觀圍欄降低多端漂移與驗收失真風險。

---

## 0) 本版新增：平台不可知（Platform-Agnostic Baseline）
**平台不可知**：我們不假設任何特定平台的路徑規則、CSP、Console 可用性、模組解析能力、public 映射、或 DevTools 穩定性。  
**結論**：任何「只在某一平台成立」的機制，都必須被視為不可靠，必須提供平台無關的保底路徑與可觀測證據。

---

## 1) 宏觀問題定義：多端開發 = 多個 Runtime 的一致性工程
我們同時在多個執行時（Runtime）運行同一份專案：
- AI Studio Preview Runtime（最弱、最不可信）
- Local Dev Runtime（本機 dev server）
- Local Build Runtime（vite build / rollup）
- Hosting Runtime（GitHub Pages / Cloudflare Pages）
- 可能還包含：瀏覽器擴充注入、沙箱限制、CSP、importmap 差異等

**多端漂移**的本質：  
> 同一份輸入（inputs）在不同 runtime 的解析 / 執行結果不一致，造成「我這邊可以、你那邊不行」或「改了沒反應」等驗收失真。

---

## 2) 總則：三大宏觀圍欄（Guardrails）
本契約以三大圍欄治理所有多端差異：

### 2.1 Inputs Contract（輸入面鎖死）
- 所有關鍵輸入必須**可列舉、可比對、可追溯**
- 同一類輸入只能有**單一權威來源（SSOT）**

### 2.2 Single Pipeline（效果面鎖死）
- 對任何「共享效果」必須只有**唯一寫入者（Single Writer）**
- fallback 只能是同一條管線內的 fallback，不得另起爐灶成為第二寫入者

### 2.3 Drift Gates（漂移閘門）
- 每一張 ticket 必須依序通過：Preview Gate → Local Gate → Release Gate
- 每道 Gate 都必須產出「可觀測證據（Evidence）」且能比對一致性

---

## 3) Inputs Contract：輸入面治理規範（宏觀）
### 3.1 輸入分類（必備清單）
以下輸入必須被明確列為「可追溯項」：
1) 依賴版本（react/react-dom/router/tailwind 等）
2) 設定（tokens/theme、router mode、base path）
3) 資產（public 檔、圖片、字體）
4) 平台差異參數（僅限 Profile 層允許）

### 3.2 單一權威來源（SSOT）規則
- tokens 必須是「資料」，且只能有一份權威資料來源
- router mode / base path 必須由單一開關控制（例如 env 或 profile）
- 禁止「同一個概念」有兩個來源（例如 AI Studio 用 inline、本機用 tokens.js 但兩者不同步）

### 3.3 輸入可比對：Hash / Version Stamp（強烈建議）
每個關鍵輸入應具備可比對標記：
- TOKENS_HASH：tokens JSON（或等價結構）的 hash
- DEPS_HASH：核心依賴版本集合的 hash
- BUILD_HASH：build 產物或 commit sha（選用）

> 目的：任何平台都能一眼看出「吃到的是同一份輸入」或「已漂移」。

---

## 4) Single Pipeline：效果面治理（宏觀）
### 4.1 Single Writer（唯一寫入者）硬規則
對以下共享效果，必須只有一個地方可以「寫入」：
- CSS variables（例如 `--amber`）
- style 注入（fallback CSS）
- router mode 決策（hash/browser）
- base path 決策

**禁止事項：**
- tokens 檔同時負責「資料」與「寫入 CSS vars」  
  （這會在不同 runtime 形成多寫入者，導致漂移）

### 4.2 Fallback 必須內聚於同一條管線
fallback 的正確形式：
- `applyTokens()` 中：若 tokens 不可用 → 用 DEFAULT_TOKENS
- `ensureUtilities()` 中：若 Tailwind utilities 不存在 → 注入最小 CSS

錯誤形式（禁止）：
- tokens.js 寫入一套 vars、index.html 又寫入另一套 vars（兩套互搶）
- 一個 runtime 走 tokens.js，另一個 runtime 走 inline，且優先序不同

### 4.3 平台不可知的保底路徑
任何可能被平台限制的能力，都必須有替代路徑：
- Console 不可靠 → 必須提供 UI 可視證據（badge/HUD）
- public 映射不可靠 → tokens 應可由 bundle 或 inline 提供
- Tailwind CDN 動態生成不可靠 → 必須有最小 CSS utilities fallback
- BrowserRouter 在 preview 不可靠 → 必須可切 hash 模式（profile 控制）

---

## 5) Drift Gates：漂移閘門（宏觀流程，不可跳步）
單張 ticket 的標準流（BASE-EC-1.0 延伸）：

### Gate 1：Preview Gate（AI Studio，最弱環境）
必過條件：
- 預覽可見、無致命錯誤
- Evidence 可見（不依賴 console）：至少顯示 PROFILE / TOKENS_SOURCE / TOKENS_HASH
- 核心互動與主 UI 路徑可驗收

### Gate 2：Local Gate（本機 dev + build）
必過條件：
- `npm run dev` 可運行
- `npm run build` 成功
- Evidence 與 Preview Gate 一致（或差異必須符合 Profile 規則）

### Gate 3：Release Gate（Hosting）
必過條件：
- 部署後可瀏覽
- Evidence 與 Local Gate 一致（或差異必須符合 Profile 規則）
- 路由/資產/base path 與平台設定一致

---

## 6) Evidence：可觀測證據（平台不可知的驗收核心）
### 6.1 必備 Evidence 欄位（建議以 UI Badge/HUD 顯示）
最低限度必須提供：
- PROFILE：preview / local / release
- TOKENS_SOURCE：bundled / inline / external
- TOKENS_HASH：短 hash（例如前 8 碼）
- ROUTER_MODE：hash / browser
- BASE_PATH：`/` 或 `/<repo>/`

> 原則：Evidence 必須「肉眼可見」，不能依賴 Console 或 Network 面板。

### 6.2 Evidence 的顯示策略（建議）
- 預設顯示小 badge（不干擾 UI）
- `?debug=1` 顯示完整 HUD（包含 CSS vars 的採樣值）
- Release 可保留 badge（或以環境變數關閉）

---

## 7) Profiles：把差異集中管理（禁止散落 if/else）
### 7.1 Profile 定義
- `PROFILE=preview`：AI Studio / sandbox / 不可知預覽
- `PROFILE=local`：本機開發
- `PROFILE=release`：正式部署（GitHub Pages / Cloudflare Pages）

### 7.2 Profile 允許差異的「白名單」
只有以下項目允許在 profile 間不同：
- ROUTER_MODE（preview 可 hash、release 可 browser）
- BASE_PATH（release 可能有 repo base）
- Evidence 顯示程度（badge/HUD）

其餘皆應一致：
- tokens 資料（TOKENS_HASH 必須一致）
- 依賴版本（DEPS_HASH 必須一致）

---

## 8) 防呆機制（宏觀落地：最小即可）
### 8.1 Drift Guard（最低配）
- 掃描 repo：禁止 tokens 檔出現 `document.documentElement.style.setProperty`（避免 tokens 成為 writer）
- 掃描 repo：`setProperty("--` 只能出現在 `applyTokens()` 所在檔案（單一 writer）
- 掃描 repo：同一 token key 不得在多處寫入（例如 `--amber`）

### 8.2 發佈前固定檢查（建議）
- `npm ci`
- `npm run build`
- `npm run lint:portable`
- `npm run drift-check`（最小腳本即可）

---

## 9) 風險模型（宏觀分類，快速定位）
遇到任何「多端不一致」先分類：
1) **解析層**：import/路徑/public 映射/ESM specifier
2) **執行層**：CSP/沙箱/擴充注入/禁用 intrinsics
3) **依賴層**：多份 React / Router 實例、版本漂移
4) **啟動層**：scripts、初始化順序、runtime 探測差異
5) **部署層**：base path、SPA fallback、資產路徑

分類後對應處理：  
- 先修 Inputs Contract（來源是否一致）  
- 再修 Single Pipeline（是否多寫入者）  
- 最後用 Evidence 驗收 Gate（是否真的一致）

---

## 10) 最終條款（宏觀結論）
- 平台不可知是基線：任何平台特性都不可假設
- SSOT + Single Writer 是治理多端漂移的根本
- Drift Gates 是流程強制器：沒有證據就不算完成
- Evidence 必須可視化：不能依賴 Console
- Profile 集中管理差異：禁止到處散落平台判斷

---

## 11) 建議的專案資產清單（可直接建立）
- `reports/BASE-EC-1.1_macro-guardrails.md`（本文件）
- `docs/PORTABILITY_PROFILES.md`（profile 白名單表）
- `diagnostics/badge.ts` 或 `diagnostics/hud.ts`（Evidence UI）
- `scripts/check-drift.mjs`（drift guard）
- `scripts/check-portable.mjs`（既有 portable 掃描延伸）

---
