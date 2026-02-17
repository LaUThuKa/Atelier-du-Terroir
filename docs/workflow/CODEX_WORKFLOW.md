# WORKFLOW.md — Ticket × Codex × GitHub × 本機驗收（V1）

本文件定義 Atelier du Terroir 專案的標準開發流程，目標是：**避免改動來源混亂、確保 main 永遠可發布、所有變更可追溯可驗收**。

## 0) 核心原則（必讀）

1. **GitHub Repo 是唯一真相來源（Source of Truth）**
   - 沒有出現在 GitHub 的 **commit / PR** → 一律視為「未落地草稿」。

2. **`main` 永遠保持可發布（release-ready）**
   - 不允許未驗收的改動進入 `main`。

3. **所有改動必須走：Ticket → 分支 → PR → 本機驗收 → 合併**
   - 不走這條路的改動，不納入正式版本。

---

## Environment Responsibilities（Windows vs WSL Ubuntu）

本專案採用「Ubuntu（WSL2）為工程真相、Windows 為工作台」的分工，以降低環境飄移與權限/檔案鎖等非預期問題，並讓本機驗收與 CI（Linux runner）保持一致。

### Ubuntu（WSL2）＝強環境 / 工程真相（Source of Truth for Build）
Ubuntu（WSL2）負責所有「會影響依賴、建置、部署、可攜性」的工作，並作為驗收與 Git 操作主場。

- **必做驗收**（每張工程票 DoD 的最低門檻）  
  - `npm ci --no-audit --no-fund`  
  - `npm run build`  
  - `npm run preview`（需要時）
- **Git 主操作**：branch / commit / cherry-pick / merge / rebase（避免 Windows 檔案鎖與權限坑）
- **部署/CI 對齊**：GitHub Actions runner 為 Linux，WSL Ubuntu 先跑通等同提前驗證
- **Repo 放置規則**：repo 應位於 Linux 檔案系統（建議 `~/src/<repo>`），避免以 `/mnt/<drive>/...` 作為主 repo

> 建議主 repo 位置：`~/src/Atelier-du-Terroir`  
> 避免：`/mnt/d/...` 作為日常工程主工作樹（容易受 Windows 檔案監控/權限影響）

### Windows＝工作台 / 介面與外部工具（Workbench）
Windows 專注於「視覺與工具整合」，不作為工程驗收主場。

- **IDE/UI**：VS Code（建議使用 WSL Remote 直接開 Ubuntu repo）、瀏覽器視覺驗收（localhost）
- **GitHub Web**：PR 審查、merge、查看 Actions logs / 部署狀態
- **內容與資產**：文案、素材、設計工具（AI Studio/Figma/圖像處理等）

### VS Code 建議工作模式（最穩）
- Windows 開 VS Code → 使用 **WSL Remote** 開啟 `~/src/Atelier-du-Terroir`
- 在同一份 Ubuntu repo 上編輯、跑命令、做 git 操作
- Windows 僅用瀏覽器確認 `localhost` 的視覺結果與 GitHub PR/Actions 狀態

---

## Daily SOP（每票固定操作順序）
1. 進入 Ubuntu（WSL2）repo：`cd ~/src/Atelier-du-Terroir`
2. 同步主線：`git checkout main && git pull`
3. 建立票分支（乾淨可開 PR）：`git checkout -b codex/<ticket>-<slug>-clean`
4. 僅修改本票白名單檔案（Scope Fence）
5. 在 Ubuntu 驗收：  
   - `npm ci --no-audit --no-fund`  
   - `npm run build`  
   - `npm run preview`（需要時）
6. 檢查變更範圍：`git diff --name-only origin/main...HEAD`（必須只包含白名單）
7. Commit（可回滾）：`git commit -m "<type>: <message>"`
8. Push 分支：`git push -u origin <branch>`
9. Windows GitHub 開 PR → review → merge
10. 回 Ubuntu：`git checkout main && git pull`，進下一票

---

## Policy：避免混票（必遵守）
- **新票必須新分支 / 新 PR**，不得沿用上一票分支累積 commit
- 若分支發生混票：一律以 `main` 建立乾淨分支，使用 `cherry-pick` 收斂必要 commit 後再開 PR
- Windows 端若使用 Codex/Web UI，禁止以「Update branch」推進新票（僅允許用於同一 PR 的續修）

---

## 1) 分支策略（Branching）

### 1.1 長期分支（長存）
- `main`：唯一主線，永遠可發布。
- `v1.2-localize`：歷史開發分支（若已合併完成，後續不再新增 commit）。

> 建議：未來避免保留太多長期分支；分支應以「短命」為主，合併後即刪除。

### 1.2 Ticket 分支（短命，合併即刪）
每張 Ticket 對應一個分支，命名擇一：

- `t/<ticketId>-<slug>`
- `codex/t/<ticketId>-<slug>`（Codex 主導時）

範例：
- `t/C04-header-cleanup`
- `codex/t/P0-importmap-hardlock`

---

## 2) Codex 使用規範（必鎖）

### 2.1 Codex 的允許範圍
- ✅ 允許：在 **Ticket 分支** 內修改、提交 commit、開 PR。
- ❌ 禁止：直接修改或 push `main`。

### 2.2 Codex 的交付格式
每次 Codex 交付必須滿足至少其一：
- 交付 **commit**（可多次）到 Ticket 分支
- 交付 **PR**（Ticket 分支 → `main`）

> 若 Codex 僅在網頁工作區做出改動，但沒有 commit/PR → 視為未交付。

---

## 3) Ticket → PR 的標準流程

### 3.1 建立 Ticket 分支
從 `main` 開分支：

```bash
git checkout main
git pull
git checkout -b t/<ticketId>-<slug>
````

### 3.2 開發/修改（Codex 或人工）

* 所有改動都在該分支上進行
* 可多次 commit（小步提交，利於回溯）

### 3.3 推送分支

```bash
git push -u origin t/<ticketId>-<slug>
```

### 3.4 開 PR

* 目標：`main`
* PR 標題建議：

  * `[<ticketId>] <簡短描述>`
* PR 描述至少包含：

  * 做了什麼（What）
  * 為何要做（Why）
  * 驗收方式（How to verify）

---

## 4) 本機驗收規範（合併前必做）

### 4.1 拉取 PR 分支驗收

```bash
git fetch origin
git checkout -b review/<ticketId> origin/t/<ticketId>-<slug>
```

### 4.2 最小驗收（MUST）

```bash
npm ci
npm run build
npm run preview
```

> 若專案尚未全面採用 `npm ci`，可暫用 `npm install`；但以可重現為目標，建議逐步統一到 `npm ci`。

### 4.3 視需求加做（SHOULD）

* `npm run dev`：目視檢查 UI / 路由
* 針對 Ticket 的重點驗收項（例如 importmap、入口 script 唯一化、部署流程等）

---

## 5) 驗收結果處置（只允許以下 3 種）

### ✅ 通過（Pass）

1. 在 GitHub 上 **Merge PR → main**
2. 合併後立刻同步本機：

   ```bash
   git checkout main
   git pull
   ```
3. **刪除遠端分支**（GitHub PR 介面通常可一鍵 Delete）
4. 清理本機分支（選做）：

   ```bash
   git branch -d t/<ticketId>-<slug>
   git branch -d review/<ticketId>
   ```

### ❌ 不通過（Fail）

只能三選一：

1. **同一分支繼續修到通過**

   * 持續在原分支推 commit，PR 自動更新
   * 本機驗收分支 `git pull` 後再驗收一次

2. **關閉 PR + 刪除分支（放棄）**

   * PR Close（不合併）
   * 刪除遠端分支
   * 本機刪分支

3. **需求變更太大 → 關閉 PR + 開新 Ticket/新分支**

   * 避免同一 PR scope 膨脹成另一張票
   * 舊 PR 保留作為討論紀錄，舊分支刪除

---

## 6) 發版規則（Release / Tagging）

### 6.1 發版只允許從 `main`

* 任何 tag 都必須打在 `main` 最新 commit 上。
* PR 未合併前 **禁止打 tag**（避免 tag 指向非主線 commit）。

### 6.2 建議的 tag 命名

* `vX.Y`（例如 `v1.3`、`v1.4`）
* 若偏好語意更明確，也可用 `vX.Y-release`（建議統一一種風格）

### 6.3 發版步驟

```bash
git checkout main
git pull
git tag -a vX.Y -m "release vX.Y"
git push origin vX.Y
```

---

## 7) 分支清理規則（防爆炸）

### 7.1 遠端清理

* **PR 合併後必刪遠端分支**（短命分支用完即丟）

### 7.2 本機清理

```bash
git fetch -p
git branch --merged main
```

看到已合併的本機分支即可刪除：

```bash
git branch -d <branch>
```

---

## 8) 你只要記住一句話

**Codex 只交付 PR；你只驗收分支；main 永遠乾淨；發版只從 main 打 tag。**

---

# Appendix — P0 專用附錄（Importmap Hard Lock / 入口唯一化 / 部署工作流）

本附錄專門約束「環境 / 依賴 / 部署」類改動的交付方式，確保 P0 可快速收斂且不造成 ESM/importmap 漂移。

---

## A0) P0 全域不可回退共識（硬規則）

* Tokens 來源策略：**AT_TOKENS_INLINE**（不得改成其他權威來源）
* Router：**react-router-dom 固定 v6.22.3**
* 禁止引入 alias import（例如 `@/`）
* 每張 P0 Ticket 必須 **最小變更 + 可獨立驗收**
* 每張 PR 合併前必跑：`npm ci` / `npm run build` / `npm run preview`

---

## A1) P0 PR 模板（貼到 PR 描述即可）

> PR Title：`[P0-?] <short summary>`

### What

* （列出你做了哪些改動，最多 5 點，偏「事實」描述）

### Why

* （對應 P0 目標：避免 importmap 漂移 / 避免雙載 / 部署可複製）

### Scope Guard（避免越界）

* [ ] 未改動 tokens writer/lock 權威設計（AT_TOKENS_INLINE）
* [ ] 未引入 alias import（@/）
* [ ] router 仍為 v6.22.3（未升級、未引入第二份實例）
* [ ] 入口啟動點仍為「單一入口」（無雙載）
* [ ] importmap 僅包含 runtime keys（無 @vite / fs / path / node:*）

### How to verify（本機）

```bash
npm ci
npm run build
npm run preview
```

### Acceptance checklist（勾選）

* [ ] `npm ci` 成功（無 EPERM / lock 問題）
* [ ] `npm run build` 零 warnings（或列出可接受且已知的 warnings）
* [ ] `npm run preview` 可正常開啟首頁與兩個延伸頁
* [ ] 依本票型別，完成對應的「P0 驗收清單」（見 A2/A3/A4）

### Notes / Risk

* （任何可能風險、回退方式、或需注意的環境差異）

---

## A2) P0-1：Importmap Hard Lock（runtime-only）驗收清單

### 目標

* `index.html` 的 `<script type="importmap">` 只保留 **瀏覽器 runtime 需要** 的 imports。
* 禁止混入 Vite/Node/Plugin 相關 key（避免平台注入與漂移）。

### 必須滿足

* [ ] importmap 放在所有 `<script type="module">` 與 `<link rel="modulepreload">` **之前**
* [ ] importmap 中不存在：

  * `@vite/*`、`vite/*`、`node:*`、`fs`、`path`、`rollup`、任何 plugin 名稱
* [ ] importmap 中的每一個 key 都能在 runtime 被合理解釋（僅對瀏覽器有效）
* [ ] 若有新增 `npm run lint:importmap`：

  * [ ] 允許清單（allowlist）/ 禁止清單（denylist）規則寫在腳本內
  * [ ] 腳本在 Windows PowerShell / GitHub Actions 都可跑

### 本機驗收

```bash
npm ci
npm run build
npm run preview
# 若有 guardrail
npm run lint:importmap
```

### 人工冒煙檢查（建議）

* [ ] 開啟首頁後，Console 無 importmap 解析錯誤
* [ ] Router hooks 無 context 錯誤（避免多實例載入）

---

## A3) P0-2：入口 Script 唯一化（避免雙載）驗收清單

### 目標

* `index.html` 僅存在 **一個**入口啟動 module（例如 `/src/main.tsx`）。
* tokens / hud / debug 不得造成二次初始化或二次寫入。

### 必須滿足

* [ ] `index.html` 只保留 **一個** `<script type="module" ...>`
* [ ] tokens 的注入方式擇一（只能一條路）：

  * [ ] A. 由入口檔 import（index.html 不再額外載 tokens）
  * [ ] B. 由 index.html 注入（入口檔不再 import tokens）
* [ ] 不存在「同一份初始化」被執行兩次（例如 root render 兩次、debug bootstrap 兩次）
* [ ] HUD/Badge 顯示值在一次載入期間不應重複刷新兩次（可作為雙載判斷線索）

### 本機驗收

```bash
npm ci
npm run build
npm run preview
```

### 人工冒煙檢查（必做）

* [ ] 首頁 /themes/:themeId /catalog 能正常導覽
* [ ] Console 無「hook/context」類錯誤（典型：useLocation 不在 Router context）

---

## A4) P0-3：部署工作流（GitHub Pages / Cloudflare Pages）驗收清單

### 目標

* 部署流程可複製、可追溯、可自動化（至少 build gate）。
* `main` 一合併即可觸發部署（或手動 workflow 也可，但需文件化）。

---

### A4.1 GitHub Pages（建議主線）

#### 必須滿足

* [ ] 有 `.github/workflows/<pages>.yml`（或同等）
* [ ] CI steps 至少包含：

  * [ ] `npm ci`
  * [ ] `npm run build`
* [ ] `dist/` 作為部署輸出
* [ ] 若使用 project pages（`/<repo>/`）：

  * [ ] Vite `base` 設定正確（避免資源路徑 404）
* [ ] 若為 SPA 路由：

  * [ ] 有對應的 fallback 策略（依你現況：hash router 或 pages fallback 設定擇一）
* [ ] build fail 時不得部署（workflow 應直接 fail）

#### 本機驗收

```bash
npm ci
npm run build
npm run preview
```

#### 部署後冒煙（建議）

* [ ] 進站首頁正常
* [ ] 直接開 `/catalog`、`/themes/<id>` 不 404（依採用的路由策略驗證）

---

### A4.2 Cloudflare Pages（備援最小文件化）

#### 必須滿足（文件即可）

* [ ] 有 `docs/deploy/CLOUDFLARE_PAGES.md`（或 README 段落）
* [ ] 清楚寫出：

  * [ ] Build command：`npm run build`
  * [ ] Output directory：`dist`
  * [ ] Node 版本（與本機/CI 一致）
  * [ ] SPA fallback（若需要）

---

## A5) P0 Ticket 定義（最小可驗收拆分）

* **P0-1**：Importmap hard lock（runtime-only）+（可選）`lint:importmap`
* **P0-2**：入口 script 唯一化（避免雙載）+ 載入順序固定
* **P0-3**：部署工作流落地（GitHub Pages 必做；Cloudflare Pages 文件化備援）

> 原則：每張票 scope 不膨脹；若驗收卡住，只能照「Fail 三選一」處置（見第 5 節）。

---

## 2) CODEX_WORKFLOW.md 需要調整的內容（可直接新增章節）

你現在的文件已經把「Codex 角色定位 + 本機驗收」定住了；我們要補的是「**單一主線對話（Single-thread）長期開票協議**」與「**跨票隔離機制**」。

你可以把下面整段加到 CODEX_WORKFLOW.md（建議放在「操作準則」或「票務流程」附近）。

### 新增章節：單一主線對話開票協議（必讀）

**目的：避免 Codex 任務/對話暴增且無法刪除；同時避免每票重建環境造成漂移。**

#### 規則 S1：只使用一個 Codex 主線對話

* 所有 P0/P1 工程票，一律在同一個 Codex 主線對話串內開單。
* 除非需要「平行開發」且會互相干擾，才允許額外開新對話；新增對話必須註明原因並在完成後封存。

#### 規則 S2：每張票必帶 Context Capsule（防漂移）

每次貼給 Codex 的開票內容，必須包含：

* Repo/分支/基底 HEAD
* 不可回退共識（tokens / router / no-alias / no-UI）
* 驗收三指令（npm ci / build / preview）
* 本票 scope 與 DoD

> 任何沒有 Context Capsule 的開票視為「無效」，不得執行。

#### 規則 S3：票與票互不干擾（Scope Fence）

* Codex 只能修改「本票列出的檔案」或「為了達成 DoD 必須改動的最少檔案」。
* 若 Codex 想改動額外檔案，必須先在摘要中列出原因與替代方案，並優先選擇只改 index.html 之類的低風險檔。

#### 規則 S4：PR 優先；必要時用收斂流程

* Codex 產出 PR 草稿優先。
* 若 Codex 產出分支基底不乾淨、或 PR 出現非必要檔案：

  * 先本機驗收（npm ci/build/preview）
  * 再「收斂」：將非必要檔案還原為 main 版本，或用 cherry-pick 將必要 commit 移到乾淨分支
  * 最終 PR 必須符合「最少檔案」原則

#### 規則 S5：任務治理（不可刪除的現實對策）

* Codex 任務/對話可能只能封存，故以「單一主線對話」降低累積數量。
* 任何失敗或廢棄的分支/PR：

  * PR：Close（或保留 Draft 但標記廢棄）
  * 分支：完成後刪除本機分支；遠端分支視情況保留或刪除（以 repo 乾淨為準）

---

## UI 按鈕行為規則：Update branch 與 Create PR

### 目的

Codex 網頁介面提供「更新分支（Update branch）」與「建立新 PR（Create new PR / Create PR）」等動作。若使用不當，容易造成 **多張票的變更與 commit 堆疊在同一條工作分支**，進而導致 **PR 混票（多檔案、多 commit、跨票污染）**。本專案採用「單票可驗收、可回滾、可審計」原則，因此需明確規範這些按鈕的使用時機。

### 規則 U1：Update branch 僅限「同一張 PR 的續修」

只在以下情境允許使用 **Update branch**：

* 你已經有一張正在審查中的 PR，且本次只是在**同一張 PR** 上修正問題（例如修 CI、修小錯、修 review comment）。
* 你確定本次修改仍**完全落在該票的 Scope Fence（白名單）**內。

禁止使用 Update branch 的情境（遇到任一條即禁止）：

* 你正在進入下一張票（新的 ticket 編號 / 新的 scope）。
* 你需要把本票拆成乾淨交付（`*-clean`）或避免混票。
* 你發現 Codex 工作分支已混入其他票的 commit / 檔案（多票污染）。
* 這是一張 **docs-only** 或「白名單極嚴」的票（高風險混票）。

### 規則 U2：每張票交付一律以 Clean 分支建立新 PR

無論是否同一個 Codex 主線對話，**每張票交付**一律使用：

* 從 `main` 最新 HEAD 建立乾淨分支：`codex/p0-<n>-<slug>-clean`
* 只 cherry-pick 本票必要 commit 進入 clean 分支
* 使用 clean 分支 **建立新 PR**（或重開 PR），不得直接從混票工作分支 merge

> 原則：`codex/task-*` 可作為工作暫存，但永遠不是最終 merge 來源。

### 規則 U3：建立 PR 前的必做檢查（防混票）

在建立 PR 或更新 PR 前，必須先確認：

* `git diff --name-only origin/main..HEAD` **只包含本票白名單檔案**
* PR 頁面 `Files changed` 與本票白名單一致

  * 若不一致：**停止**，改走「自動收斂流程」重新以 clean 分支開 PR

### 規則 U4：遇到混票的標準處置

若已發生混票（PR 顯示多檔案/多 commit/跨票變更）：

1. 不 merge 該 PR（可 Close 保留歷史）
2. 依「自動收斂流程」從 `main` 建立 `*-clean` 分支
3. cherry-pick 僅本票必要 commit
4. 重新開 PR，直到 `Files changed` 與白名單一致為止

---
