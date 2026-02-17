# CODEX Workflow（Single-thread 長期開票護欄）

## 1) 目標與原則
- **Single-thread ticketing**：同一個 Codex 主線對話持續開票，不另開平行任務。
- **最小變更、可回滾**：每票變更可被單一 commit 回退。
- **白名單驅動**：每票必須先定義可修改檔案白名單（Scope Fence）。
- **可審計**：每票 1 PR，Files changed 可直接對照本票白名單。

---

## 2) Single-thread Ticket Spec（固定開票格式）
每張票都必須包含以下固定欄位：

```md
【TICKET】<編號>：<標題>

【Context Capsule】
- Repo：<repo>
- Base：main（最新 HEAD）
- 不可回退共識：
  1) <constraint-1>
  2) <constraint-2>
  ...
- 驗收命令：<cmd1> → <cmd2> → <cmd3>（或 docs-only 註明免跑）

【Scope（白名單）】
- 允許修改：
  - <file/path/a>
  - <file/path/b>
- 禁止修改：
  - <path-pattern / files>

【DoD】
1) <definition-1>
2) <definition-2>
...

【輸出格式】
A) 診斷摘要
B) 最小修復方案
C) 驗收紀錄
D) Commit（訊息 + hash）
E) PR 建議（或直接建立 PR）
```

### DoD 最低要求
- 所有變更皆在白名單內。
- 能提供可重現驗收紀錄。
- 每票可由單獨 PR 審查與回滾。

---

## 3) Scope Fence（範圍柵欄）
- 每票先定義「允許修改檔案白名單」。
- **不得**修改白名單外檔案。
- 若實作中發現需要超出白名單：
  1. 先停止擴散修改。
  2. 在當前票輸出「超出原因 + 建議拆票」。
  3. 另開新票處理，不把額外修改混入當前票。

---

## 4) 自動收斂流程（避免混票）
當 Codex 工作分支混入其他票（多 commit / 多檔）時，必須採用下列標準收斂流程：

1. 從 `main` 最新 HEAD 建立**乾淨分支**。
2. 將當前票必要 commit 以 `cherry-pick` 挑入乾淨分支。
3. 檢查 `git diff --name-only origin/main...HEAD` 僅包含白名單檔案。
4. 必要時做 `fixup`/`reword`，整理為 1 個可審核 commit（或可 squash 的少量 commit）。
5. 僅以乾淨分支開 PR；**不可**直接從混票分支 merge。

> 原則：混票分支可以作為工作暫存，但不可作為最終 merge 來源。

---

## 5) 分支命名規則
- **乾淨分支（可開 PR）**：
  - `codex/p0-<n>-<slug>-clean`
- **Codex 工作分支（可混票，不可直接 merge）**：
  - `codex/task-<slug>`

命名建議：
- `<n>` 使用票號遞增（如 `1`, `2`, `3`）。
- `<slug>` 使用短橫線、小寫、語義清楚（如 `importmap-lock`, `entry-dedup`）。

---

## 6) PR 規則
- 每票 **1 PR**。
- 優先 **1 commit**；必要多 commit 也必須可 `squash`。
- PR 描述至少包含：
  - 變更目的（為何）
  - 變更範圍（改了哪些白名單檔案）
  - 驗收紀錄（命令與結果）
- PR 的 **Files changed** 必須符合本票白名單。
- 若不符合白名單，PR 必須先關閉或改由乾淨分支重開。

---

## 7) 推薦執行清單（每票）
1. 讀取本票 Context Capsule 與 Scope。
2. 僅修改白名單檔案。
3. 進行驗收（docs-only 票可免 npm 驗收，但需保持工作樹整潔）。
4. 產生 1 個可回滾 commit。
5. 檢查 diff 檔案數量與白名單一致。
6. 以乾淨分支開 PR。
