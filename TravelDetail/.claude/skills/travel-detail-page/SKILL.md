---
name: travel-detail-page
description: 用於在 TravelDetail/ 資料夾內建立或更新一個新目的地的旅遊行程詳情頁（如 Tailand-202610、Seoul-202609 的形式）。當使用者提到想規劃新的旅遊目的地、要一份行程頁面、或要更新既有行程資料夾時使用。
---

# TravelDetail 行程頁 Skill

依 `docs/superpowers/specs/2026-08-16-travel-detail-skill-design.md` 的設計，把使用者的行程筆記/願望清單轉成 `TravelDetail/` 底下一份風格精緻、結構一致的靜態 HTML 行程頁，並在筆記有空缺時自動上網補齊。

## 何時使用

使用者在 `TravelDetail/` 這個專案脈絡下，提到「想規劃新的目的地」「幫我做一份行程頁」「更新一下 XX 的行程資料夾」之類的需求時。

## 輸入

從對話中蒐集，不需要任何結構化設定檔：

- **目的地**：需要一個羅馬拼音名稱（例如「泰國」→ `Tailand`、「首爾」→ `Seoul`），若使用者只給中文名稱，先跟使用者確認資料夾要用的羅馬拼音。
- **日期**：至少要能推出 `YYYYMM`（用出發月份）。
- **筆記/願望清單**（可選）：使用者貼上的任何原始行程構想、必去景點、限制條件。若完全沒有，允許 Skill 完全靠研究生成初稿。

## 流程

### 1. 腳手架（決定性步驟，不要用 LLM 手刻檔案結構）

在 `TravelDetail/` 目錄下執行：

```bash
node _shared/scaffold.mjs <Destination> <YYYYMM>
```

這會建立 `<Destination>-<YYYYMM>/` 資料夾，內含：

- `dm.html` — 已經正確引用 `../_shared/components.css`、`../_shared/scroll-reveal.js`、`theme.css` 的骨架頁面
- `theme.css` — 從 `_shared/theme.template.css` 複製的 token 範本，等待步驟 4 填色
- `plan.md`、`link.md` — 空白檔案

**若資料夾已存在**，腳本會直接報錯拒絕覆蓋。`scaffold.mjs` 只在初次建立資料夾時使用；`--force` 也只是允許進入既有資料夾補齊缺少的檔案，**絕對不會覆蓋任何已經存在的檔案**（`dm.html`、`theme.css`、`plan.md`、`link.md` 皆然）。

**更新既有行程**（使用者說「幫我改一下 XX 的行程」）不要重新執行 scaffold，直接用 Edit 工具修改該資料夾內的 `dm.html`／`theme.css`／`plan.md`／`link.md`。scaffold 只負責「從無到有」建立骨架，不是更新機制。

### 2. 寫入原始筆記

把使用者提供的筆記/願望清單整理後寫進 `plan.md`（純文字/條列即可，不用是最終文案）。這份檔案是之後可以回頭修改、重新產生頁面的依據，不要跳過這步直接寫 HTML。

### 3. 研究補齊空缺（Hybrid）

針對 `plan.md` 中沒寫清楚的細節（具體店家、營業時間、路線名稱、預約網址等），用網路搜尋補齊。**每一個查到的來源／預約連結都要寫進 `link.md`**，格式比照現有 `Tailand-202610/link.md`（店名 + 空行 + 網址）。不要在 `dm.html` 裡引用任何沒有記錄到 `link.md` 的外部連結。

### 4. 決定主題色（`theme.css`）

依目的地的氛圍填 `theme.css` 裡的 token（`--primary`、`--primary-2`、`--primary-soft`、`--accent`、`--accent-2`、`--on-accent-2`、`--bg`、`--paper`、`--ink`、`--muted`、`--line`、`--on-primary`、`--font-heading`、`--font-body`）。不要在 `dm.html` 或任何頁面裡寫死顏色/字型，一律透過這些變數（`_shared/components.css` 只讀 token，不含任何色碼）。可以參考但不要複製既有頁面的配色（`Tailand-202610` 的深蓆藍/金/紅土，或 `Seoul-202609` 的墨藍/紅）——每個目的地應該有自己的主題。

### 5. 撰寫 `dm.html` 內容

在骨架的 `<body>` 內依 `_shared/components.css` 提供的既有 class 填入內容，結構仿照 `Tailand-202610/dm.html`：

- `header.hero`：`.eyebrow`、`h1`、`.dates`、簡介 `p`、`<dl class="hero-stats">`（出發/回程/天數等統計）
- `nav.site-nav`：`.site-nav-row.phase-row`（跳到各 `section.phase` 或子頁的連結）+ `.site-nav-row.day-row`（跳到每個 `.day-card` 的錨點）
- 每個 `section.phase` 內放數個 `.day-card`（`id` 用日期，如 `id="d1023"`），每張卡片：`.day-title`（`.day-no` + `.day-txt`）、可選 `.shot` 插圖、`.plan` 內的多個 `.item`（`.period` + `h4` + `p`）
- 需要強調可預約的活動時用 `.chips` + `.chip.book`；地圖連結用 `.map-link`；外部連結一律加 `class="ext-link"`（自動加 ↗ 符號）
- 想幫想要淡入動畫的元素（例如每個 `.item`）加上 `class="rv"`（`_shared/scroll-reveal.js` 會自動處理）
- 頁尾前可放 `.highlights` 區塊（深色底提示卡片）
- 全部文案使用繁體中文

若某個主題（SPA、廚藝課、活動推薦等）內容夠豐富，比照 `spa.html` 的前例另開一個 `<topic>.html` 子頁，同樣引用 `../_shared/components.css`、`../_shared/scroll-reveal.js`、自己的 `theme.css`（可以 `<link>` 同一份 `theme.css` 維持配色一致），並在 `dm.html` 用 `class="topic-link"` 連過去；反之內容量少就直接併入 `dm.html`，不要為了硬要拆頁而拆頁。

### 6. 驗證

生成後用瀏覽器打開 `dm.html` 檢查：導覽列是否吸頂正常、逐日卡片是否完整、捲動淡入動畫是否運作、主題色是否正確套用（不是殘留舊配色）、所有連結是否可點擊且對應 `link.md` 中的來源、手機寬度（模擬 375px）下版面是否正常。這是手動驗證，不是自動化測試——LLM 生成的行程內容本來就不寫單元測試。

## 明確不做的事

- 不處理發布/部署（不整合 Artifact、GitHub Pages、`travel-frontend`）；頁面就是本地靜態檔案。
- 不用其他語言，一律繁體中文。
- 不回頭改寫既有的 `Seoul-202609/`、`Tailand-202610/` 頁面去套用 `_shared/` 元件庫。
- 不在 `_shared/components.css` 或 `_shared/scroll-reveal.js` 裡寫任何目的地專屬的顏色/文案——這兩個檔案要能被所有目的地共用。

## 相關檔案

- `_shared/scaffold.mjs` + `_shared/scaffold.test.mjs`：資料夾腳手架腳本與測試（`node --test` 執行）
- `_shared/components.css`：共用結構樣式
- `_shared/theme.template.css`：主題 token 範本
- `_shared/scroll-reveal.js`：捲動淡入腳本
- `docs/superpowers/specs/2026-08-16-travel-detail-skill-design.md`：完整設計 spec
