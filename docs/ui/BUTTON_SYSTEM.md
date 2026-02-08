# Button 視覺系統規範 (V1)

本文件定義全站按鈕的三分法規格，確保 CTA (Call to Action) 與導覽連結的視覺權重一致。

## 1. 變體定義 (Variants)

| 變體名稱 | 視覺特徵 | 程式碼對應 | 核心目的 |
| :--- | :--- | :--- | :--- |
| **Primary** | 實心填色 (`accent`)、深色字、帶陰影 | `variant="primary"` | **主動作**。引導用戶完成最核心目標（如：品鑑、目錄）。 |
| **Ghost** | 透明底、細邊框 (`olive_border`)、明確 hit area | `variant="ghost"` | **次要動作**。與主動作並列時降低視覺競爭。 |
| **Text** | 無底、無框、較小 Padding、Hover 加深 | `variant="text"` | **導覽連結**。用於頁尾導流、站內跳轉，維持頁面輕盈。 |

## 2. 使用場景規範

### 2.1 料理卡片 (Card CTA Group)
- 必須成對出現：**1 Primary + 1 Ghost**。
- 左側/首位通常為 Primary (如：品鑑洽詢)，右側為 Ghost (如：合作邀約)。
- 禁止在卡片內使用 Text 變體作為主要操作按鈕。

### 2.2 頁面導流 (Page/Footer Actions)
- 橫向排列的導航連結統一使用 **Text** 變體。
- 視覺上應搭配分隔符 (如 `/`) 或 Icon (如 `ArrowRight`)。

### 2.3 獨立操作 (Standalone Action)
- 視重要程度決定：
  - 核心跳轉（如「進入目錄」）：使用 **Primary**。
  - 返回動作（如「回到首頁」）：使用 **Ghost** 或 **Text**。

## 3. 互動規範 (States)
- **Hit Area**: `primary` 與 `ghost` 必須具備相同的點擊區域高度 (3.5rem/56px 或同等 padding)，確保行動端易於點擊。
- **Hover**: 
  - `primary`: 顏色稍加深。
  - `ghost`: 出現極淡背景色。
  - `text`: 文字加深。
- **Active**: 統一增加 `scale-95` 物理縮放反饋。

---
*Last updated: 2024.05.22*