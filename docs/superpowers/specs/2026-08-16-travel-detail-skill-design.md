# TravelDetail 行程頁自動化 Skill 設計

日期：2026-08-16
範圍：`TravelDetail/`（新建 Skill + 共用元件庫，不動既有 `Seoul-202609/`、`Tailand-202610/` 內容）

## Problem Statement

每次想規劃一個新目的地的詳細行程頁面時，使用者都得從零手刻整份 HTML/CSS（配色、字型、版面、捲動動畫、導覽列），並手動把零散筆記整理成排版好的內容。這個流程慢、每次風格不一致，也無法規模化到「未來想自動產生很多想去的旅遊地點」的目標。

## Solution

在 `TravelDetail/` 內建立一個範圍限定的 Claude Code Skill：給定目的地、日期、使用者的粗略行程願望清單/筆記，Skill 會：
1. 依既有的 `<Destination>-<YYYYMM>` 慣例建立資料夾。
2. 用網路研究補足使用者筆記中的空缺（景點、SPA、餐廳、預約連結等）。
3. 產出一組多檔案 HTML 行程頁（主行程頁 + 視情況產生的子主題頁，如 SPA/活動）+ 原始規劃筆記 `.md` + 連結清單 `.md`。
4. 所有頁面共用一套可重用的結構元件庫（導覽列、hero、逐日卡片、捲動淡入動畫），但每個目的地可套用自己的配色/字型主題。

## User Stories

1. As a 旅遊規劃者, I want 用一個 Skill 觸發整個目的地頁面的產生流程, so that 我不用每次重新手刻 HTML。
2. As a 旅遊規劃者, I want Skill 自動依 `<Destination>-<YYYYMM>` 慣例建立資料夾, so that 所有行程資料夾維持一致的命名與可預期的結構。
3. As a 旅遊規劃者, I want 貼上我自己粗略整理的行程筆記/願望清單當作輸入, so that 最終頁面反映我真正想做的事，而不是 Skill 憑空生成的內容。
4. As a 旅遊規劃者, I want Skill 在我筆記有空缺時（例如沒指定具體 SPA 店家、健行路線）自動上網查資料補齊, so that 我不用自己一一查證每個細節。
5. As a 旅遊規劃者, I want 所有查到的參考連結/預約網址都被記錄到 `link.md`, so that 我事後可以核對來源、直接點進去預約。
6. As a 旅遊規劃者, I want 原始規劃筆記被保留成獨立的 `plan.md`, so that 我可以之後手動修改筆記、再重新請 Skill 依新筆記更新頁面。
7. As a 旅遊規劃者, I want 主行程頁以「逐日卡片」呈現, so that 我可以快速掃視每天的安排。
8. As a 旅遊規劃者, I want 一個吸頂的導覽列可以快速跳到指定日期或主題子頁, so that 長頁面往下捲動時仍方便導覽。
9. As a 旅遊規劃者, I want 頁面頂部有 hero 區塊呈現出發/回程日期、天數等統計資訊, so that 一打開頁面就能掌握行程全貌。
10. As a 旅遊規劃者, I want 逐日卡片隨捲動淡入顯示, so that 頁面閱讀體驗跟現有 `dm.html` 一致的精緻感。
11. As a 旅遊規劃者, I want 當某個主題（如 SPA 推薦、廚藝課）內容夠豐富時自動拆成獨立子頁, so that 主行程頁不會被過多細節撐爆，但相關資訊仍完整可查。
12. As a 旅遊規劃者, I want 每個目的地可以有自己的配色與字型主題, so that 不同地點的頁面在視覺上仍保有各自的氛圍，不會長得千篇一律。
13. As a 旅遊規劃者, I want 所有目的地頁面共用同一套結構元件（CSS/JS）, so that Skill 產出的頁面品質穩定、不用每次重新設計版面邏輯。
14. As a 旅遊規劃者, I want 頁面內容一律使用繁體中文, so that 符合我平常規劃行程、閱讀的語言習慣。
15. As a 旅遊規劃者, I want 產出的頁面在手機瀏覽器上也能正常閱讀（RWD）, so that 我出國在路上也能用手機查行程。
16. As a 旅遊規劃者, I want 之後可以針對同一個目的地資料夾重新執行 Skill 來更新內容, so that 行程有變動時不用整頁重寫。
17. As a 旅遊規劃者, I want Skill 在資料夾已存在時不要靜默覆蓋既有檔案, so that 我不會不小心弄丟已經調整過的內容。
18. As a 旅遊規劃者, I want 多個目的地資料夾可以同時存在、彼此風格不互相污染, so that 我可以同時規劃多趟旅行而不必擔心 CSS/JS 衝突。
19. As a 旅遊規劃者, I want 產出的頁面就是純靜態檔案、可以直接在瀏覽器打開, so that 不需要额外部署或伺服器就能看行程。
20. As a 旅遊規劃者, I want Skill 有清楚的觸發說明（何時該被呼叫）, so that 我在對話中提到「規劃新的目的地頁面」時，Skill 能被正確辨識並使用。
21. As a 旅遊規劃者, I want 即使我完全沒提供筆記、只給目的地與日期, Skill 仍能靠研究生成一份完整的初稿行程, so that 我可以先看到草稿再逐步調整，而不必從零開始寫筆記。
22. As a 旅遊規劃者, I want 共用元件庫的顏色透過 CSS 變數（theme tokens）套用, so that 換主題不需要改動任何結構 CSS，只需要換一份 token 檔案。

## Implementation Decisions

- **Skill 位置**：`TravelDetail/.claude/skills/travel-detail-page/SKILL.md`，範圍限定在 `TravelDetail/` 這個資料夾內（directory-scoped skill），不影響專案根目錄或 `travel-frontend`/`travel-backend`。
- **共用資源目錄**：新增 `TravelDetail/_shared/`，內含：
  - `components.css`：導覽列（吸頂）、hero、hero-stats、逐日卡片（day-card）等結構樣式，全部透過 CSS 變數讀色，不寫死任何色碼。
  - `scroll-reveal.js`：從現有 `Tailand-202610/dm.html` 抽出的 IntersectionObserver 捲動淡入邏輯，抽成獨立可重用腳本。
  - `theme.template.css`：定義每個目的地主題必須提供的 CSS 變數 token 清單（如 `--primary`、`--accent`、`--bg`、`--ink`、`--muted`、`--line` 等），作為每個目的地 `theme.css` 的填空範本。
- **參照而非複製**：各目的地頁面以相對路徑 `<link>`/`<script src>` 參照 `_shared/` 內的檔案，而不是每次複製一份到自己資料夾。取捨：日後更新共用元件會同時影響所有既有行程頁（不是凍結快照），這是刻意的決定，對應「共用結構元件 + 各自主題」的設計方向。
- **每個目的地資料夾內容**：
  - `dm.html`（必要）：主要逐日行程頁。
  - `<topic>.html`（視情況產生）：獨立主題子頁（如 SPA、活動推薦），僅在該主題內容量足夠自成一頁時才產生，否則併入 `dm.html`（沿用 `spa.html` 的既有前例）。
  - `plan.md`：格式化前的原始規劃筆記，作為使用者可編輯的「事實來源」，之後可修改後請 Skill 重新生成頁面。
  - `link.md`：所有蒐集到的參考/預約連結，附來源標籤。
  - `theme.css`：該目的地的主題 token 值，依 `_shared/theme.template.css` 的欄位填寫。
- **命名慣例**：延續現有 `<Destination>-<YYYYMM>` 格式，目的地名稱使用羅馬拼音（如 `Tailand`、`Seoul`），與現有前例一致。
- **輸入方式**：不要求任何結構化設定檔，Skill 直接從對話中讀取使用者貼上的自由格式筆記/願望清單、目的地與日期；沒有提供筆記時，允許完全靠研究生成初稿。
- **研究補齊策略（Hybrid）**：Skill 使用網路搜尋/擷取工具補足使用者筆記中未指定的細節（店家名稱、營業時間、路線名稱等），所有查到的來源連結一律寫入 `link.md`。
- **腳手架步驟（scaffold）**：由一支獨立、確定性的腳本（`TravelDetail/_shared/scaffold.sh` 或 `.mjs`）負責：
  - 驗證並建立 `<Destination>-<YYYYMM>` 資料夾。
  - 若資料夾已存在，拒絕靜默覆蓋，需明確確認才能在既有資料夾內新增/更新檔案。
  - 產生正確指向 `_shared/components.css`、`_shared/scroll-reveal.js` 的相對路徑參照。
  - 若找不到 `_shared/theme.template.css` 的 token 定義，明確報錯而非靜默略過。
  Skill 的 LLM 生成步驟（內容撰寫）在腳手架完成後才進行。
- **輸出範圍**：僅產生本地靜態檔案，不處理發布/部署（不整合 Artifact、GitHub Pages 或 `travel-frontend`）。

## Testing Decisions

好的測試只驗證外部行為（產出的檔案/資料夾結構是否正確），不測試 LLM 生成內容的具體文字。

- **腳手架腳本（`_shared/scaffold.*`）— 本功能中唯一具確定性、值得寫自動化測試的部分**：
  - 給定目的地＋日期輸入，建立命名正確的資料夾（`<Destination>-<YYYYMM>`）。
  - 資料夾已存在時，腳本拒絕靜默覆蓋（回傳明確錯誤/警告，而非直接覆寫）。
  - 產出的檔案正確以相對路徑參照 `_shared/components.css`、`_shared/scroll-reveal.js`。
  - 找不到 `_shared/theme.template.css` 時腳本明確失敗並給出錯誤訊息。
  - 先例：目前 `TravelDetail/` 與 `travel-frontend`/`travel-backend` 皆無現成測試框架可直接沿用；由於只有一支腳本，傾向用最小依賴的方式寫測試（如純 Node `assert` 或 shell 腳本內建測試案例），不為此單一腳本引入完整測試框架。
- **LLM 生成內容（逐日行程、SPA 推薦等文字/HTML）— 明確不寫單元測試**：改用端對端手動驗證：對一個範例目的地實際跑一次 Skill，在瀏覽器打開產出的 `dm.html`，檢查導覽列是否吸頂正常、逐日卡片是否齊全、捲動淡入動畫是否運作、主題色是否套用、連結是否可點擊。
- **`_shared/components.css` 的版面正確性（RWD 斷點、吸頂行為）**：以手動/肉眼驗證為主，不引入自動化視覺回歸測試（對個人專案而言過重，明確排除於範圍外）。

## Out of Scope

- 發布/部署整合（Claude Artifact、GitHub Pages，或接入 `travel-frontend` 成為 app 內路由）——頁面維持純本地靜態檔案。
- 自動照片來源/生成作為 Skill 的保證輸出（既有 `.claude/settings.local.json` 中已有呼叫 Wikimedia Commons API 找圖的先例，可視情況沿用，但不是本次 Skill 必須具備的功能）。
- 多語系支援——內容一律繁體中文。
- 為產出的 HTML 建立完整的自動化視覺回歸測試框架。
- 將既有 `Seoul-202609/`、`Tailand-202610/` 頁面回頭改寫成套用 `_shared/` 元件庫（可作為驗證元件庫是否真的通用的後續工作，但不在本次範圍內）。
- 正式 issue tracker／triage label 整合——本專案未使用 GitHub issue 追蹤此類工作，本 spec 依使用者選擇以本地 markdown 檔案形式存放。

## Further Notes

- 本 spec 的核心決策（多檔案產出、hybrid 研究補齊、共用結構元件＋各自主題、正式 SKILL.md 封裝、沿用既有命名慣例、僅本地檔案輸出）是使用者在 grilling 訪談第一輪直接採用建議預設值定案，未逐一走完每個決策的後續追問輪次。若實際使用後發現「共用元件 + 各自主題」或「hybrid 研究補齊」的方向不合用，應在投入更多腳手架開發前重新檢視。
- 將 `Seoul-202609/`、`Tailand-202610/` 回頭套用 `_shared/` 元件庫，是驗證元件庫是否真的能通用於兩種風格差異很大的既有設計的自然下一步，但明確排除於本次範圍。
