# Theme Full List 規格文件 (V1.1)

本文件定義「主題完整作品列表頁（Theme Full List, `/themes/:themeId`）」的開發規格，旨在確保全站視覺語言與品牌質感的一致性，並可作為後續迭代與驗收的單一依據。

---

## 1. 路由規格

* **Path**: `/themes/:themeId`
* **Params**: `themeId` 對應資料中的主題識別（例如 `themes[].id` 或等價欄位）
* **Entry**: 從首頁 Showcase Footer 的「查看本主題全部作品」導入到當前 active theme 的完整列表頁
* **Navigation**

  * Header Logo → `/`
  * Footer 次要連結 → `/catalog`

---

## 2. 頁面資訊架構 (IA) — 固定順序

1. **Header**: 沿用全站統一頂欄（不新增額外導覽邏輯）
2. **Theme Hero（矮 Hero）**

   * 使用 **Neutral（中性）**意境圖（全站一致），以型錄感呈現
   * 文字包含：主題中文名 + 英文/副標（可沿用 tagline）
3. **Filter / Sort Bar**

   * Sort 至少提供 **「精選優先」**（預設）
   * Filter chips 可用 in-memory filter（不依賴後端）
4. **Dish Grid**

   * 料理展示網格（響應式欄位：Mobile 1 / md 2 / lg 3）
5. **Footer Actions**

   * 固定兩個導流：回到首頁、完整作品目錄
   * 使用 `Button variant="text"`（導覽連結語意，不做按鈕主視覺）

---

## 3. 視覺與 UI 規範

### 3.1 響應式規範 (Mobile First)

* **一致性**：卡片佈局節奏、留白、字級階層需與首頁完全統一
* **避免漂移**：同類元件（Hero / Button / Card）優先重用共用元件，不做各頁獨立樣式分岔

#### 3.1.1 Dish Grid 欄位規格（硬規格）

* **Mobile（< md）**：1 欄
* **Tablet / 小桌機（md ～ < lg）**：2 欄
* **Desktop（≥ lg）**：3 欄（**最大 3，不再增加**）

> Tailwind 對應（工程對照）：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

**驗收條件（Acceptance）**

* 手機寬度：同列只出現 **1 張**卡
* md 斷點：同列出現 **2 張**卡
* lg 以上：同列出現 **3 張**卡，且不得出現 4 欄以上

---

### 3.2 CTA / Button 系統（三分法）

* **規格對齊**：嚴格遵循 [Button 系統規範](./ui/BUTTON_SYSTEM.md)
* **Button 三分法**

  * `primary`：主動作（實心）
  * `ghost`：次要按鈕（Outlined Ghost：透明底 + 淡邊框 + 明確 hit area）
  * `text`：導覽/輕導流（純文字連結語意，無框）
* **卡片 CTA**：必須成對排列 `primary + ghost`
* **頁尾/導覽導流**：使用 `text`

---

### 3.3 Filter / Sort Bar（互動規範）

* **Sort（必做）**

  * 預設：`精選優先`
  * 規則：`featured_first`

    * `is_featured=true` 優先顯示
    * 其後依 `order` 升冪（缺 `order` 保持原序）
* **Filter chips（可做但建議做）**

  * 使用 in-memory filter
  * 必須有清楚的 active 狀態（互斥單選或可定義多選，但需明確）
  * 若篩選結果為 0，顯示簡單 empty state（並提示回到「全部」）

---

### 3.4 Lait Structure（內容結構）

* **全裝置一致**：顯示 **3 個 Bullets（base / note / finish）**
* **視覺一致**：段落間距、標題樣式、bullet 節奏與首頁卡片一致

> 註：此條款已對齊目前實作驗收（避免「Mobile 2 / Desktop 3」造成未來驗收衝突）。

---

### 3.5 Scroll / Route 行為

* **換頁置頂**：路由切換（pathname 變更）時，頁面自動 scroll to top
* **不得遮擋點擊**：任何 anchor offset 不得以負 margin/padding 方式擴張盒子造成覆蓋；優先使用 `scroll-margin-top` 等不影響 hit test 的做法

---

## 4. 禁用清單（避免 scope 爆炸）

* [ ] **Tabs**：頂部主題切換 Tabs（本頁不提供）
* [ ] **Editor’s Note**：主編的話區塊（本頁不提供）
* [ ] **Sticky Nav / Scroll Spy**：首頁那套右側固定導覽與 scroll spy（本頁不提供）
* [ ] **作品詳情頁**：不強制做 dish detail（可留 placeholder route）

---

## 5. 驗收條件（Acceptance Criteria）

* `/themes/:themeId` 可顯示該主題名稱/副標，且只列出該主題的 dishes
* Sort 預設為「精選優先」，featured dishes 會上浮並符合 order 規則
* Filter chips 點選有明確狀態變化，且列表內容會變化（或 0 筆顯示 empty state）
* Grid 響應式符合：Mobile 1 / md 2 / lg 3（最大 3）
* 每張卡顯示 Lait Structure 3 bullets
* 卡片 CTA：`primary + ghost`；Footer actions：`text`
* 跳轉頁面會置頂，且不會出現透明覆蓋層導致按鈕無法點擊

---

*Last updated: 2026-02-08*

---
