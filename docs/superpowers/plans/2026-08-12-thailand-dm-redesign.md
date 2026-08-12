# 泰國 dm.html 行程總覽改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `TravelDetail/Tailand-202610/dm.html` 的「行程總覽」日期導覽改為吸頂固定，並把整體排版改造成 `Seoul-202609/seoul.html` 那種雜誌感編輯風格（大字級日期、逐日插圖、捲動動畫、照片版位），同時保留現有泰國蓆藍／金褐／紅土色系。

**Architecture:** 單一靜態 HTML 檔（無建置流程、無 JS 框架、無自動化測試）。所有改動都在 `dm.html` 內：`<style>` 區塊新增/取代 CSS 規則，`<body>` 內重組導覽列、hero、每日卡片結構。驗證方式是用瀏覽器直接開檔觀察渲染結果，以及用 `grep` 做結構性檢查（新 class 是否存在、舊 class 是否已移除）。

**Tech Stack:** 純 HTML5 + CSS3（`position:sticky`、CSS Grid、`:has()` 選擇器）+ 原生 JS（`IntersectionObserver`）。沿用現有字型（Noto Serif TC）與既有 `<defs>` SVG icon 符號庫（`#icon-flight` 等）。

## Global Constraints

- 只改 `TravelDetail/Tailand-202610/dm.html`，不動 `spa.html`。
- 色系必須沿用現有 `:root` 變數（`--deep-teal` `--teal` `--gold` `--terracotta` `--cream` `--paper` `--ink` `--muted` `--line`），不得引入 Seoul 頁的墨藍/紅配色。
- 每天的插圖 banner 必須恆顯示（不依賴外部圖片檔存在與否）；照片相簿必須在對應 `img/` 檔案不存在時，透過 CSS `:has()` 自動整列隱藏，不留空格或破圖圖示。
- 沿用現有 `<defs>` 內的 icon symbol（`#icon-flight` `#icon-cook` `#icon-hotspring` `#icon-hike` `#icon-village` `#icon-spa` `#icon-gift` `#icon-horse` `#icon-elephant` `#icon-craft`），不需新增 icon。
- 保留所有現有文字內容（不得刪減行程描述），只能重新分段/加小標題，不能改變原始資訊。
- 保留所有現有超連結（`.ext-link` `.spa-link` 與其 `href`）原樣不動。
- 動畫需遵守 `prefers-reduced-motion: reduce`。

---

## File Structure

只有一個檔案異動：

- Modify: `TravelDetail/Tailand-202610/dm.html`
  - `<style>` 區塊：新增/取代 CSS（導覽列、hero 統計列、shot banner、photo-grid、day-no/day-txt、item/chip/map-link、rv 捲動動畫），移除已淘汰的 `.phase-nav` `.day-nav` `.slot` `.slot-label` 舊規則。
  - `<body>`：合併 `phase-nav` + `day-nav` 為 `.site-nav`；hero 內插入 `.hero-stats`；9 個 `.day-card` 全部重組（插圖 banner + 照片相簿 + 大字日期編號 + `.item` 列式行程）；`</body>` 前新增捲動動畫 script。

---

### Task 1: 新增共用元件 CSS（導覽列 / hero 統計 / banner / 相簿 / item / 動畫）

**Files:**
- Modify: `TravelDetail/Tailand-202610/dm.html`（`<style>` 區塊內）

**Interfaces:**
- Produces：後續 Task 會用到的 class 名稱與行為約定：
  - `.site-nav` `.site-nav-row` `.phase-row` `.day-row`（導覽列容器與兩排內容）
  - `.hero-stats`（hero 內統計列，含 `.hi` 高亮子項）
  - `.shot`（每日插圖 banner 容器，內含 `img` + `svg`，`img` 讀取失敗時以 `onerror="this.remove()"` 自行移除，讓底下 `svg` 插圖顯示）
  - `.photo-grid` `.photo-item`（照片相簿容器與格子；`.photo-item` 內 `img` 讀取失敗時以 `onerror="this.closest('.photo-item').remove()"` 移除自身；`.photo-grid:not(:has(.photo-item))` 全空時自動隱藏整列）
  - `.day-no` `.day-txt`（取代原本的 `.day-icon` 圓形圖示 + pill 日期，改成大字級襯線數字 + 純文字日期/標題）
  - `.plan` `.plan .item` `.plan .item .period` `.chips` `.chip`（含 `.chip.book` 變體，標記需要事先預約的行程）`.map-link`（取代原本的 `.slot` / `.slot-label`；`.item` 規則刻意加 `.plan` 前綴，避免跟既有 `.highlights .item` 撞名）
  - `.rv` / `.rv.in`（捲動淡入動畫類別，配合 Task 5 的 `IntersectionObserver` script）
  - 每個 `.day-card` 透過行內 `style="--acc:var(--deep-teal)"` 等指定當日主題色，供 `.day-no`、banner 內 `<g color="var(--acc)">` 與 `.plan .item .period` 取用。

- [ ] **Step 1: 在 `:root` 之後、`.phase-nav` 規則之前，新增 `.site-nav` 相關 CSS**

在 `.phase-nav{...}` 與 `.phase-nav a{...}` `.phase-nav a:hover{...}` 三條規則（目前在 `.dates` 之後）**整組刪除**，改成：

```css
.site-nav{
  position:sticky;
  top:0;
  z-index:20;
  background:var(--paper);
  border-bottom:1px solid var(--line);
  box-shadow:0 2px 10px rgba(15,61,62,0.06);
}
.site-nav-row{
  display:flex;
  align-items:center;
  gap:10px;
  max-width:1100px;
  margin:0 auto;
  padding:10px 20px;
}
.phase-row{
  justify-content:center;
  flex-wrap:wrap;
  border-bottom:1px solid var(--line);
}
.phase-row a{
  font-size:13px;
  color:var(--teal);
  text-decoration:none;
  border:1px solid var(--line);
  padding:6px 14px;
  border-radius:20px;
  white-space:nowrap;
}
.phase-row a:hover{ background:var(--teal-soft); }
.day-row{
  gap:8px;
}
.day-row .day-nav-label{
  font-size:12px;
  color:var(--muted);
  letter-spacing:.1em;
  white-space:nowrap;
  flex-shrink:0;
}
.day-row a{
  font-size:12.5px;
  color:var(--teal);
  text-decoration:none;
  border:1px solid var(--line);
  padding:4px 11px;
  border-radius:16px;
  white-space:nowrap;
  flex-shrink:0;
}
.day-row a:hover{ background:var(--teal-soft); }
@media (max-width:640px){
  .phase-row{
    justify-content:flex-start;
    flex-wrap:nowrap;
    overflow-x:auto;
    -webkit-overflow-scrolling:touch;
  }
  .day-row{
    flex-wrap:nowrap;
    overflow-x:auto;
    -webkit-overflow-scrolling:touch;
  }
}
```

- [ ] **Step 2: 刪除舊的 `.day-nav` 系列規則，並更新 `.day-card` 的 `scroll-margin-top`**

刪除 `.day-nav{...}` `.day-nav-label{...}` `.day-nav a{...}` `.day-nav a:hover{...}` 四條規則（吸頂列已在 Step 1 取代它們的視覺功能）。

找到 `.day-card{...}` 規則（目前含 `scroll-margin-top:76px;`），改成：

```css
.day-card{
  background:var(--paper);
  border:1px solid var(--line);
  border-radius:14px;
  padding:26px 30px;
  margin-bottom:22px;
  box-shadow:0 6px 16px rgba(15,61,62,0.05);
  scroll-margin-top:132px;
}
@media (max-width:640px){
  .day-card{ scroll-margin-top:112px; }
}
```

（原本 `.day-card` 規則裡沒有 `@media` 巢狀，這裡是新增一條獨立的 `@media` 區塊，不是巢狀寫法。）

- [ ] **Step 3: 在 `header.hero p{...}` 規則之後，新增 `.hero-stats` CSS**

```css
.hero-stats{
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
  gap:0;
  max-width:640px;
  margin:30px auto 0;
  border-top:1px solid rgba(255,255,255,0.18);
}
.hero-stats div{
  flex:1 1 120px;
  padding:16px 14px 6px;
  text-align:center;
}
.hero-stats dt{
  margin:0 0 4px;
  font-size:10.5px;
  letter-spacing:.18em;
  text-transform:uppercase;
  color:rgba(255,255,255,0.55);
}
.hero-stats dd{
  margin:0;
  font-size:19px;
  font-weight:700;
  color:var(--cream);
}
.hero-stats .hi dd{ color:var(--gold); }
```

同時把 `.hero-art{...}` 規則裡的 `max-width:760px;` 改成 `max-width:820px;`（其餘屬性不變）。

- [ ] **Step 4: 刪除 `.day-card .day-title{...}` 內對 `.day-icon` 的依賴樣式，新增 `.day-no` / `.day-txt`**

刪除這兩條規則（原本用來畫圓形 icon 徽章，Task 4 會移除對應 markup）：

```css
.day-icon{
  width:44px;
  height:44px;
  border-radius:50%;
  background:var(--teal-soft);
  color:var(--teal);
  display:flex;
  align-items:center;
  justify-content:center;
  flex-shrink:0;
}
.day-icon svg{ width:23px; height:23px; }
```

找到 `.day-card .day-date{...}` 規則（目前是深色 pill 樣式），整條改成：

```css
.day-txt{
  display:flex;
  flex-direction:column;
  gap:4px;
}
.day-txt .day-date{
  font-size:12.5px;
  letter-spacing:.1em;
  color:var(--muted);
}
```

在同一區塊新增：

```css
.day-no{
  font-family:"Noto Serif TC",serif;
  font-weight:900;
  font-size:clamp(40px,8vw,64px);
  line-height:.85;
  color:var(--acc,var(--deep-teal));
  letter-spacing:-0.02em;
}
```

`.day-card .day-title{...}` 規則裡的 `align-items:center;` 改成 `align-items:flex-end;`（讓大數字與文字底部對齊，比照 Seoul 排版）。

- [ ] **Step 5: 刪除 `.slot` 系列規則，新增 `.shot` / `.photo-grid` / `.plan` / `.item` / `.chips` / `.chip` / `.map-link`**

刪除：

```css
.slot{
  margin:12px 0;
  padding-left:16px;
  border-left:3px solid var(--teal-soft);
}
.slot .slot-label{
  font-size:13px;
  font-weight:700;
  color:var(--teal);
  letter-spacing:.03em;
  margin-bottom:2px;
}
.slot p{
  margin:0;
  font-size:15px;
}
```

新增（放在同一個位置）：

```css
.shot{
  position:relative;
  margin:0 0 18px;
  line-height:0;
  background:var(--teal-soft);
  border-radius:14px;
  overflow:hidden;
}
.shot img{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
  z-index:2;
}
.shot svg{ display:block; width:100%; height:auto; }

.photo-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(120px,1fr));
  gap:8px;
  margin:0 0 18px;
}
.photo-grid:not(:has(.photo-item)){ display:none; }
.photo-item{
  aspect-ratio:4/3;
  border-radius:10px;
  overflow:hidden;
  background:var(--teal-soft);
}
.photo-item img{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
}

.plan{ margin-top:4px; }
.plan .item{
  display:grid;
  grid-template-columns:104px 1fr;
  gap:0 22px;
  padding:18px 0;
  border-bottom:1px solid var(--line);
}
.plan .item:first-child{ border-top:1px solid var(--line); }
.plan .item .period{
  font-size:13px;
  font-weight:700;
  color:var(--acc,var(--teal));
  letter-spacing:.03em;
  padding-top:2px;
}
.plan .item h4{
  margin:0 0 6px;
  font-size:16.5px;
  color:var(--ink);
}
.plan .item p{ margin:0; font-size:15px; color:var(--ink); }
.chips{ display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px; }
.chip{
  font-size:11px;
  font-weight:700;
  letter-spacing:.05em;
  padding:3px 9px;
  border-radius:20px;
  white-space:nowrap;
}
.chip.book{ background:var(--terracotta); color:#fff; }
.map-link{
  display:inline-flex;
  align-items:center;
  gap:4px;
  margin-left:8px;
  padding:2px 10px 2px 8px;
  border:1px solid currentColor;
  border-radius:99px;
  font-size:10.5px;
  font-weight:700;
  letter-spacing:.06em;
  color:var(--terracotta);
  text-decoration:none;
  opacity:.75;
}
.map-link:hover{ background:var(--terracotta); color:#fff; opacity:1; }
@media (max-width:640px){
  .plan .item{ grid-template-columns:1fr; gap:4px; }
  .plan .item .period{ padding-top:0; }
}
```

**注意（class 命名衝突提醒）：** 現有 `.highlights` 區塊裡本來就有 `<div class="item">…</div>`（旅程亮點條列，見 `.highlights .item{...}` 規則）。上面新增的 `.plan .item` 規則刻意加了 `.plan` 父層限定，就是為了不要跟 `.highlights .item` 衝突——千萬不要把選擇器簡化成裸的 `.item{...}`，否則會讓「旅程亮點」區塊跑版（被套上 grid 兩欄＋底線樣式）。

- [ ] **Step 6: 新增 `.rv` 捲動淡入動畫 CSS**

在 `footer{...}` 規則之後新增：

```css
.rv{
  opacity:0;
  transform:translateY(14px);
  transition:opacity .6s ease, transform .6s cubic-bezier(.2,.7,.3,1);
}
.rv.in{ opacity:1; transform:none; }
@media (prefers-reduced-motion:reduce){
  .rv{ opacity:1; transform:none; transition:none; }
}
```

- [ ] **Step 7: 存檔後用 grep 檢查新規則都已寫入、舊規則都已移除**

Run:
```bash
grep -n "\.site-nav\|\.hero-stats\|\.shot{\|\.photo-grid\|\.day-no{\|\.item{\|\.chip{\|\.rv{" TravelDetail/Tailand-202610/dm.html
grep -n "\.phase-nav\|\.day-nav\|\.slot{\|\.slot-label\|\.day-icon{" TravelDetail/Tailand-202610/dm.html
```
Expected：第一條指令每個 class 至少出現一次；第二條指令**沒有任何輸出**（代表舊規則已清乾淨）。

- [ ] **Step 8: Commit**

```bash
cd /Users/eyesc/Project/TravelProject
git add TravelDetail/Tailand-202610/dm.html
git commit -m "style(thailand-dm): add shared components CSS for redesign"
```

---

### Task 2: 合併導覽列 markup（吸頂）＋ hero 統計列

**Files:**
- Modify: `TravelDetail/Tailand-202610/dm.html`（`<body>` 開頭到 `<main>` 開頭之間）

**Interfaces:**
- Consumes：Task 1 產生的 `.site-nav` `.site-nav-row` `.phase-row` `.day-row` `.hero-stats` class。
- Produces：頁面吸頂導覽（後續 Task 4 的 `.day-card id` 錨點要能被這裡的連結對應：`#phase1` `#phase2` `#phase3` `#d1023`…`#d1031`，這些 id 本來就存在於既有 `.phase`/`.day-card`，不需新增）。

- [ ] **Step 1: 把現有的 `<nav class="phase-nav">…</nav>` 取代成合併後的 `.site-nav`**

原本：
```html
<nav class="phase-nav">
  <a href="#phase1">階段一・抵達與清邁啟航</a>
  <a href="#phase2">階段二・自然療癒與動物互動</a>
  <a href="#phase3">階段三・返曼谷與輕鬆返台</a>
  <a href="spa.html">🌿 清邁 SPA 推薦</a>
</nav>
```

改成：
```html
<nav class="site-nav">
  <div class="site-nav-row phase-row">
    <a href="#phase1">階段一・抵達與清邁啟航</a>
    <a href="#phase2">階段二・自然療癒與動物互動</a>
    <a href="#phase3">階段三・返曼谷與輕鬆返台</a>
    <a href="spa.html">🌿 清邁 SPA 推薦</a>
  </div>
  <div class="site-nav-row day-row">
    <span class="day-nav-label">行程總覽</span>
    <a href="#d1023">10/23（五）</a>
    <a href="#d1024">10/24（六）</a>
    <a href="#d1025">10/25（日）</a>
    <a href="#d1026">10/26（一）</a>
    <a href="#d1027">10/27（二）</a>
    <a href="#d1028">10/28（三）</a>
    <a href="#d1029">10/29（四）</a>
    <a href="#d1030">10/30（五）</a>
    <a href="#d1031">10/31（六）</a>
  </div>
</nav>
```

- [ ] **Step 2: 刪除 `<main>` 內原本的 `.day-nav` 區塊**

刪除這一整段（原本在 `<main>` 開頭）：
```html
<div class="day-nav">
  <span class="day-nav-label">行程總覽</span>
  <a href="#d1023">10/23（五）</a>
  <a href="#d1024">10/24（六）</a>
  <a href="#d1025">10/25（日）</a>
  <a href="#d1026">10/26（一）</a>
  <a href="#d1027">10/27（二）</a>
  <a href="#d1028">10/28（三）</a>
  <a href="#d1029">10/29（四）</a>
  <a href="#d1030">10/30（五）</a>
  <a href="#d1031">10/31（六）</a>
</div>
```
（內容已搬到 Step 1 的 `.day-row`，這裡刪除即可，`<main>` 直接接 `<section class="phase" id="phase1">`。）

- [ ] **Step 3: 在 hero 的 `<p>` 介紹文字之後、`<svg class="hero-art">` 之前，插入 `.hero-stats`**

```html
<dl class="hero-stats">
  <div><dt>出發</dt><dd>10.23</dd></div>
  <div><dt>回程</dt><dd>10.31</dd></div>
  <div><dt>天數</dt><dd>9 天</dd></div>
  <div class="hi"><dt>雙城</dt><dd>曼谷×清邁</dd></div>
</dl>
```

- [ ] **Step 4: 用瀏覽器打開檔案，確認吸頂行為**

Run: `open TravelDetail/Tailand-202610/dm.html`（macOS 用預設瀏覽器開啟）

Expected：
1. 頁面往下捲動時，階段連結列＋日期快速跳轉列會一起固定在畫面最上方，不會隨內容捲走。
2. 點擊任一日期 chip（如 `10/26（一）`）能跳到對應卡片，且卡片頂部不會被吸頂列蓋住。
3. hero 區塊出現「出發 / 回程 / 天數 / 雙城」四格統計。

- [ ] **Step 5: Commit**

```bash
cd /Users/eyesc/Project/TravelProject
git add TravelDetail/Tailand-202610/dm.html
git commit -m "feat(thailand-dm): merge nav into sticky bar, add hero stats"
```

---

### Task 3: 重組 Day 1（10/23）與 Day 6（10/28，大象保護區）兩張卡片，驗證插圖／相簿／item 樣式

先只改兩天，確認視覺與 fallback 行為正確，再在 Task 4 套用到剩下 7 天，降低一次改 9 天卻要重工的風險。

**Files:**
- Modify: `TravelDetail/Tailand-202610/dm.html`（`id="d1023"` 與 `id="d1028"` 兩個 `.day-card`）

**Interfaces:**
- Consumes：Task 1 的 `.shot` `.photo-grid` `.photo-item` `.day-no` `.day-txt` `.plan` `.item` `.chips` `.chip` class；`<defs>` 內既有的 `#icon-flight` `#icon-elephant` symbol。
- Produces：後續 Task 4 依樣畫葫蘆的「每日卡片標準結構」範本。

- [ ] **Step 1: 重寫 `id="d1023"` 卡片**

原本：
```html
<div class="day-card" id="d1023">
  <div class="day-title">
    <div class="day-icon"><svg><use href="#icon-flight"/></svg></div>
    <span class="day-date">10/23（五）</span>
    <h3>台北 ✈️ 飛抵曼谷</h3>
  </div>
  <div class="slot">
    <div class="slot-label">班機</div>
    <p>20:45 TPE ✈️ 23:30 BKK（長榮 EVA）。</p>
  </div>
  <div class="slot">
    <div class="slot-label">行程</div>
    <p>抵達曼谷後直接入住飯店休息補眠，為旅程蓄積能量。</p>
  </div>
</div>
```

改成：
```html
<div class="day-card" id="d1023" style="--acc:var(--deep-teal)">
  <div class="day-title">
    <span class="day-no">01</span>
    <div class="day-txt">
      <span class="day-date">10/23（五）</span>
      <h3>台北 ✈️ 飛抵曼谷</h3>
    </div>
  </div>

  <figure class="shot rv">
    <img src="img/d1023.jpg" alt="" onerror="this.remove()">
    <svg viewBox="0 0 900 200" role="img" aria-label="夜航班機插圖">
      <rect width="900" height="200" fill="var(--acc)" opacity=".1"/>
      <path d="M0 150 L90 112 L160 140 L240 98 L330 148 L420 114 L500 148 L590 106 L680 146 L760 118 L840 148 L900 124 L900 200 L0 200 Z" fill="var(--acc)" opacity=".16"/>
      <g color="var(--acc)" transform="translate(414,64)">
        <use href="#icon-flight" width="72" height="72"/>
      </g>
    </svg>
  </figure>

  <div class="photo-grid">
    <div class="photo-item"><img src="img/d1023-1.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1023-2.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
  </div>

  <div class="plan">
    <div class="item rv">
      <div class="period">班機</div>
      <div>
        <h4>台北 → 曼谷</h4>
        <p>20:45 TPE ✈️ 23:30 BKK（長榮 EVA）。</p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">行程</div>
      <div>
        <h4>飯店入住休息</h4>
        <p>抵達曼谷後直接入住飯店休息補眠，為旅程蓄積能量。</p>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: 重寫 `id="d1028"` 卡片**

原本：
```html
<div class="day-card" id="d1028">
  <div class="day-title">
    <div class="day-icon"><svg><use href="#icon-elephant"/></svg></div>
    <span class="day-date">10/28（三）</span>
    <h3>大象自然保護區（Elephant Nature Park / Chai Lai Orchid）+ 溪流竹筏漂流</h3>
  </div>
  <div class="slot">
    <div class="slot-label">08:30–15:30</div>
    <p>前往友善大象保護區（不騎大象、不看表演），換上少數民族服飾餵食大象香蕉與竹子。中午在河畔享用午餐，下午陪大象在溪流洗澡潑水，隨後體驗清涼的溪流竹筏漂流（Bamboo Rafting）！</p>
  </div>
  <div class="slot">
    <div class="slot-label">傍晚／晚上</div>
    <p>返回清邁市區，享用泰北傳統帝王餐（Khan Tok）並觀賞傳統舞蹈表演。</p>
  </div>
</div>
```

改成：
```html
<div class="day-card" id="d1028" style="--acc:var(--terracotta)">
  <div class="day-title">
    <span class="day-no">06</span>
    <div class="day-txt">
      <span class="day-date">10/28（三）</span>
      <h3>大象自然保護區（Elephant Nature Park / Chai Lai Orchid）+ 溪流竹筏漂流</h3>
    </div>
  </div>

  <figure class="shot rv">
    <img src="img/d1028.jpg" alt="" onerror="this.remove()">
    <svg viewBox="0 0 900 200" role="img" aria-label="大象保護區插圖">
      <rect width="900" height="200" fill="var(--acc)" opacity=".1"/>
      <path d="M0 150 L90 112 L160 140 L240 98 L330 148 L420 114 L500 148 L590 106 L680 146 L760 118 L840 148 L900 124 L900 200 L0 200 Z" fill="var(--acc)" opacity=".16"/>
      <g color="var(--acc)" transform="translate(414,64)">
        <use href="#icon-elephant" width="72" height="72"/>
      </g>
    </svg>
  </figure>

  <div class="photo-grid">
    <div class="photo-item"><img src="img/d1028-1.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1028-2.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1028-3.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1028-4.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
  </div>

  <div class="plan">
    <div class="item rv">
      <div class="period">08:30–15:30</div>
      <div>
        <h4>大象保護區．溪流竹筏漂流</h4>
        <p>前往友善大象保護區（不騎大象、不看表演），換上少數民族服飾餵食大象香蕉與竹子。中午在河畔享用午餐，下午陪大象在溪流洗澡潑水，隨後體驗清涼的溪流竹筏漂流（Bamboo Rafting）！</p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">傍晚／晚上</div>
      <div>
        <h4>泰北帝王餐．傳統舞蹈</h4>
        <p>返回清邁市區，享用泰北傳統帝王餐（Khan Tok）並觀賞傳統舞蹈表演。</p>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: 瀏覽器檢查兩張卡片與 fallback 行為**

Run: `open TravelDetail/Tailand-202610/dm.html`

Expected：
1. `d1023` 與 `d1028` 卡片頂部各出現一條插圖 banner（背景色帶 + 置中大圖示），沒有破圖圖示。
2. banner 下方沒有出現任何相簿格子（因為 `img/d1023-1.jpg` 等檔案不存在，`.photo-item` 應該全部自我移除，`.photo-grid` 因為 `:not(:has(.photo-item))` 而整列不顯示）。用瀏覽器開發者工具檢查 `.photo-grid` 元素，確認其內沒有殘留的 `.photo-item` 節點、且該元素本身 `display:none`。
3. 大字日期編號（01、06）用金/紅土色襯線數字顯示，與行程標題底部對齊。
4. 行程項目改成左側時段、右側標題+內文的兩欄排版，桌面寬度下對齊；縮到手機寬度時改成單欄堆疊。

- [ ] **Step 4: Commit**

```bash
cd /Users/eyesc/Project/TravelProject
git add TravelDetail/Tailand-202610/dm.html
git commit -m "feat(thailand-dm): rebuild day 1 and day 6 cards as reference pattern"
```

---

### Task 4: 套用相同結構到剩下 7 張卡片（10/24、10/25、10/26、10/27、10/29、10/30、10/31）

**Files:**
- Modify: `TravelDetail/Tailand-202610/dm.html`（`id="d1024"` `id="d1025"` `id="d1026"` `id="d1027"` `id="d1029"` `id="d1030"` `id="d1031"`）

**Interfaces:**
- Consumes：Task 3 驗證過的卡片結構範本（`.day-card` → `.day-title`（`.day-no` + `.day-txt`）→ `.shot`（`img` + `svg` with `<use href="#icon-…">`）→ `.photo-grid` → `.plan`（`.item` × N，每個 `.item` 是 `.period` + `h4` + `p`））。

每天的 accent 色、icon、day-no、相簿張數如下表，**必須完全比照使用**：

| id | day-no | icon | --acc | 相簿張數 |
|---|---|---|---|---|
| d1024 | 02 | `#icon-flight` | `var(--teal)` | 2 |
| d1025 | 03 | `#icon-cook` | `var(--gold)` | 4 |
| d1026 | 04 | `#icon-hotspring` | `var(--terracotta)` | 3 |
| d1027 | 05 | `#icon-horse` | `var(--teal)` | 4 |
| d1029 | 07 | `#icon-craft` | `var(--gold)` | 3 |
| d1030 | 08 | `#icon-flight` | `var(--deep-teal)` | 2 |
| d1031 | 09 | `#icon-gift` | `var(--terracotta)` | 2 |

banner 的 `<svg>` 內容每天都一樣的樣板，只需替換 `aria-label`、`use href`：
```html
<svg viewBox="0 0 900 200" role="img" aria-label="{對應主題}插圖">
  <rect width="900" height="200" fill="var(--acc)" opacity=".1"/>
  <path d="M0 150 L90 112 L160 140 L240 98 L330 148 L420 114 L500 148 L590 106 L680 146 L760 118 L840 148 L900 124 L900 200 L0 200 Z" fill="var(--acc)" opacity=".16"/>
  <g color="var(--acc)" transform="translate(414,64)">
    <use href="#icon-{ICON}" width="72" height="72"/>
  </g>
</svg>
```

- [ ] **Step 1: 重寫 `id="d1024"`**

原本：
```html
<div class="day-card" id="d1024">
  <div class="day-title">
    <div class="day-icon"><svg><use href="#icon-flight"/></svg></div>
    <span class="day-date">10/24（六）</span>
    <h3>曼谷輕鬆半日遊 ✈️ 直飛清邁</h3>
  </div>
  <div class="slot">
    <div class="slot-label">白天</div>
    <p>在曼谷市區享用精緻早午餐、去按摩放鬆。</p>
  </div>
  <div class="slot">
    <div class="slot-label">傍晚</div>
    <p>17:50 BKK ✈️ 19:10 CNX 直飛清邁。</p>
  </div>
  <div class="slot">
    <div class="slot-label">晚上</div>
    <p>入住清邁飯店（建議選古城區或寧曼區），晚餐逛逛長康路夜市或選間質感小酒館放鬆。</p>
  </div>
</div>
```

改成：
```html
<div class="day-card" id="d1024" style="--acc:var(--teal)">
  <div class="day-title">
    <span class="day-no">02</span>
    <div class="day-txt">
      <span class="day-date">10/24（六）</span>
      <h3>曼谷輕鬆半日遊 ✈️ 直飛清邁</h3>
    </div>
  </div>

  <figure class="shot rv">
    <img src="img/d1024.jpg" alt="" onerror="this.remove()">
    <svg viewBox="0 0 900 200" role="img" aria-label="曼谷飛清邁插圖">
      <rect width="900" height="200" fill="var(--acc)" opacity=".1"/>
      <path d="M0 150 L90 112 L160 140 L240 98 L330 148 L420 114 L500 148 L590 106 L680 146 L760 118 L840 148 L900 124 L900 200 L0 200 Z" fill="var(--acc)" opacity=".16"/>
      <g color="var(--acc)" transform="translate(414,64)">
        <use href="#icon-flight" width="72" height="72"/>
      </g>
    </svg>
  </figure>

  <div class="photo-grid">
    <div class="photo-item"><img src="img/d1024-1.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1024-2.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
  </div>

  <div class="plan">
    <div class="item rv">
      <div class="period">白天</div>
      <div>
        <h4>曼谷市區早午餐．按摩放鬆</h4>
        <p>在曼谷市區享用精緻早午餐、去按摩放鬆。</p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">傍晚</div>
      <div>
        <h4>曼谷 → 清邁</h4>
        <p>17:50 BKK ✈️ 19:10 CNX 直飛清邁。</p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">晚上</div>
      <div>
        <h4>清邁入住．長康路夜市</h4>
        <p>入住清邁飯店（建議選古城區或寧曼區），晚餐逛逛長康路夜市或選間質感小酒館放鬆。</p>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: 重寫 `id="d1025"`（保留原有的 `.ext-link` / `.spa-link` 超連結不變）**

原本：
```html
<div class="day-card" id="d1025">
  <div class="day-title">
    <div class="day-icon"><svg><use href="#icon-cook"/></svg></div>
    <span class="day-date">10/25（日）</span>
    <h3>古城巡禮 × 半日泰式廚藝課 × 平價高 CP 值按摩 × 週日夜市</h3>
  </div>
  <div class="slot">
    <div class="slot-label">上午｜泰式料理課</div>
    <p>參加含「菜市場巡禮」的料理課程（如 <a class="ext-link" href="https://www.grandmascookingschool.com/?gad_source=1&amp;gad_campaignid=23571584541&amp;gbraid=0AAAAADGQsOmWEYg9YVijFayjfpLluj5Vw&amp;gclid=CjwKCAjws_DTBhB_EiwAXZknGZTPOA4u7340MtHMmB-Og72RHVvmYNQiSI0rlzKsfvwWNJX_eDE2MxoCbcIQAvD_BwE" target="_blank" rel="noopener noreferrer">Grandma's Home Cooking School</a> 或 <a class="ext-link" href="https://www.smileorganicfarmcookingschool.com/?gad_source=1&amp;gad_campaignid=23076506093&amp;gbraid=0AAAAADOLsM-bizvGo3hupZ6hkt6AWDe1U&amp;gclid=CjwKCAjws_DTBhB_EiwAXZknGQiV-S1PtIVhSqZOKiZUDp6Y9YDqD6j73QBfdeIaq-V267Yj_Xd02hoCamEQAvD_BwE" target="_blank" rel="noopener noreferrer">Thai Farm Cooking School</a>），親手採摘香草、學習煮泰北金麵（Khao Soi）與冬陰功。</p>
  </div>
  <div class="slot">
    <div class="slot-label">下午｜美學與按摩</div>
    <p>逛逛「<a class="ext-link" href="https://maps.app.goo.gl/wrNBuYfvK3S5yBjq8" target="_blank" rel="noopener noreferrer">班康瓦藝術村（Baan Kang Wat）</a>」職人手作小店。隨後預約平價名店（如 Lila 或 Green Bamboo）享受 2 小時泰式按摩
      <a class="spa-link" href="spa.html" title="查看清邁平價與高價按摩推薦">SPA</a>。
    </p>
  </div>
  <div class="slot">
    <div class="slot-label">晚上｜週日步行街</div>
    <p>走訪清邁規模最大的「<a class="ext-link" href="https://maps.app.goo.gl/QhHf7Xmytbox2U218" target="_blank" rel="noopener noreferrer">古城週日夜市</a>」，邊吃街頭小吃邊看表演。</p>
  </div>
</div>
```

改成：
```html
<div class="day-card" id="d1025" style="--acc:var(--gold)">
  <div class="day-title">
    <span class="day-no">03</span>
    <div class="day-txt">
      <span class="day-date">10/25（日）</span>
      <h3>古城巡禮 × 半日泰式廚藝課 × 平價高 CP 值按摩 × 週日夜市</h3>
    </div>
  </div>

  <figure class="shot rv">
    <img src="img/d1025.jpg" alt="" onerror="this.remove()">
    <svg viewBox="0 0 900 200" role="img" aria-label="泰式廚藝課插圖">
      <rect width="900" height="200" fill="var(--acc)" opacity=".1"/>
      <path d="M0 150 L90 112 L160 140 L240 98 L330 148 L420 114 L500 148 L590 106 L680 146 L760 118 L840 148 L900 124 L900 200 L0 200 Z" fill="var(--acc)" opacity=".16"/>
      <g color="var(--acc)" transform="translate(414,64)">
        <use href="#icon-cook" width="72" height="72"/>
      </g>
    </svg>
  </figure>

  <div class="photo-grid">
    <div class="photo-item"><img src="img/d1025-1.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1025-2.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1025-3.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1025-4.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
  </div>

  <div class="plan">
    <div class="item rv">
      <div class="period">上午｜泰式料理課</div>
      <div>
        <div class="chips"><span class="chip book">建議預約</span></div>
        <h4>泰式料理課</h4>
        <p>參加含「菜市場巡禮」的料理課程（如 <a class="ext-link" href="https://www.grandmascookingschool.com/?gad_source=1&amp;gad_campaignid=23571584541&amp;gbraid=0AAAAADGQsOmWEYg9YVijFayjfpLluj5Vw&amp;gclid=CjwKCAjws_DTBhB_EiwAXZknGZTPOA4u7340MtHMmB-Og72RHVvmYNQiSI0rlzKsfvwWNJX_eDE2MxoCbcIQAvD_BwE" target="_blank" rel="noopener noreferrer">Grandma's Home Cooking School</a> 或 <a class="ext-link" href="https://www.smileorganicfarmcookingschool.com/?gad_source=1&amp;gad_campaignid=23076506093&amp;gbraid=0AAAAADOLsM-bizvGo3hupZ6hkt6AWDe1U&amp;gclid=CjwKCAjws_DTBhB_EiwAXZknGQiV-S1PtIVhSqZOKiZUDp6Y9YDqD6j73QBfdeIaq-V267Yj_Xd02hoCamEQAvD_BwE" target="_blank" rel="noopener noreferrer">Thai Farm Cooking School</a>），親手採摘香草、學習煮泰北金麵（Khao Soi）與冬陰功。</p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">下午｜美學與按摩</div>
      <div>
        <div class="chips"><span class="chip book">建議預約</span></div>
        <h4>班康瓦藝術村．按摩紓壓</h4>
        <p>逛逛「<a class="ext-link" href="https://maps.app.goo.gl/wrNBuYfvK3S5yBjq8" target="_blank" rel="noopener noreferrer">班康瓦藝術村（Baan Kang Wat）</a>」職人手作小店。隨後預約平價名店（如 Lila 或 Green Bamboo）享受 2 小時泰式按摩
          <a class="spa-link" href="spa.html" title="查看清邁平價與高價按摩推薦">SPA</a>。
        </p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">晚上｜週日步行街</div>
      <div>
        <h4>古城週日夜市</h4>
        <p>走訪清邁規模最大的「<a class="ext-link" href="https://maps.app.goo.gl/QhHf7Xmytbox2U218" target="_blank" rel="noopener noreferrer">古城週日夜市</a>」，邊吃街頭小吃邊看表演。</p>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: 重寫 `id="d1026"`**

原本：
```html
<div class="day-card" id="d1026">
  <div class="day-title">
    <div class="day-icon"><svg><use href="#icon-hotspring"/></svg></div>
    <span class="day-date">10/26（一）</span>
    <h3>清邁後花園秘境「Mae Kampong」古村 × 溫泉泡腳</h3>
  </div>
  <div class="slot">
    <div class="slot-label">上午</div>
    <p>包車或搭乘共乘 Mini-bus 前往被原始森林包圍的百年古村「美康邦（Mae Kampong）」。沿著溪谷步道健行、探訪瀑布。</p>
  </div>
  <div class="slot">
    <div class="slot-label">中午</div>
    <p>在著名的懸崖咖啡館（Teddu Coffee）邊聽溪水聲邊享用早午餐與咖啡。</p>
  </div>
  <div class="slot">
    <div class="slot-label">下午</div>
    <p>下山途中停靠「San Kamphaeng 天然溫泉」，體驗溫泉水煮蛋，並坐在溪流般的天然溫泉渠邊泡腳放鬆。</p>
  </div>
  <div class="slot">
    <div class="slot-label">傍晚</div>
    <p>約 16:30 返回清邁市區休息，晚餐後安排輕鬆的足部按摩。</p>
  </div>
</div>
```

改成：
```html
<div class="day-card" id="d1026" style="--acc:var(--terracotta)">
  <div class="day-title">
    <span class="day-no">04</span>
    <div class="day-txt">
      <span class="day-date">10/26（一）</span>
      <h3>清邁後花園秘境「Mae Kampong」古村 × 溫泉泡腳</h3>
    </div>
  </div>

  <figure class="shot rv">
    <img src="img/d1026.jpg" alt="" onerror="this.remove()">
    <svg viewBox="0 0 900 200" role="img" aria-label="美康邦森林溫泉插圖">
      <rect width="900" height="200" fill="var(--acc)" opacity=".1"/>
      <path d="M0 150 L90 112 L160 140 L240 98 L330 148 L420 114 L500 148 L590 106 L680 146 L760 118 L840 148 L900 124 L900 200 L0 200 Z" fill="var(--acc)" opacity=".16"/>
      <g color="var(--acc)" transform="translate(414,64)">
        <use href="#icon-hotspring" width="72" height="72"/>
      </g>
    </svg>
  </figure>

  <div class="photo-grid">
    <div class="photo-item"><img src="img/d1026-1.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1026-2.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1026-3.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
  </div>

  <div class="plan">
    <div class="item rv">
      <div class="period">上午</div>
      <div>
        <h4>美康邦古村健行</h4>
        <p>包車或搭乘共乘 Mini-bus 前往被原始森林包圍的百年古村「美康邦（Mae Kampong）」。沿著溪谷步道健行、探訪瀑布。</p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">中午</div>
      <div>
        <h4>懸崖咖啡館早午餐</h4>
        <p>在著名的懸崖咖啡館（Teddu Coffee）邊聽溪水聲邊享用早午餐與咖啡。</p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">下午</div>
      <div>
        <h4>San Kamphaeng 天然溫泉泡腳</h4>
        <p>下山途中停靠「San Kamphaeng 天然溫泉」，體驗溫泉水煮蛋，並坐在溪流般的天然溫泉渠邊泡腳放鬆。</p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">傍晚</div>
      <div>
        <h4>返回清邁．足部按摩</h4>
        <p>約 16:30 返回清邁市區休息，晚餐後安排輕鬆的足部按摩。</p>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 4: 重寫 `id="d1027"`**

原本：
```html
<div class="day-card" id="d1027">
  <div class="day-title">
    <div class="day-icon"><svg><use href="#icon-horse"/></svg></div>
    <span class="day-date">10/27（二）</span>
    <h3>晨間瑜珈 × 素帖山僧侶步道健行 × 山野森林騎馬</h3>
  </div>
  <div class="slot">
    <div class="slot-label">早晨（08:30–10:00）</div>
    <p>在花園工作室（如 Wild Rose Yoga）參加 90 分鐘晨間流動瑜珈，伸展身心。</p>
  </div>
  <div class="slot">
    <div class="slot-label">上午（10:30–12:30）</div>
    <p>前往素帖山，沿著經典的「Monk's Trail（僧侶步道）」健行 45–60 分鐘，探訪隱身在雨林與溪流邊的古寺「Wat Pha Lat（帕拉寺）」。</p>
  </div>
  <div class="slot">
    <div class="slot-label">中午</div>
    <p>在素帖山腳下的森林景觀餐廳享用午餐。</p>
  </div>
  <div class="slot">
    <div class="slot-label">下午（14:30–16:30）</div>
    <p>前往山腳馬場（如 Chiang Mai Horse Riding），由教練帶領騎馬穿越森林、農田與小溪流（體驗馬匹涉水渡溪）。</p>
  </div>
  <div class="slot">
    <div class="slot-label">晚上</div>
    <p>享用泰北精緻料理，隨後安排草本藥包或頌缽音療深層放鬆。</p>
  </div>
</div>
```

改成：
```html
<div class="day-card" id="d1027" style="--acc:var(--teal)">
  <div class="day-title">
    <span class="day-no">05</span>
    <div class="day-txt">
      <span class="day-date">10/27（二）</span>
      <h3>晨間瑜珈 × 素帖山僧侶步道健行 × 山野森林騎馬</h3>
    </div>
  </div>

  <figure class="shot rv">
    <img src="img/d1027.jpg" alt="" onerror="this.remove()">
    <svg viewBox="0 0 900 200" role="img" aria-label="山野騎馬插圖">
      <rect width="900" height="200" fill="var(--acc)" opacity=".1"/>
      <path d="M0 150 L90 112 L160 140 L240 98 L330 148 L420 114 L500 148 L590 106 L680 146 L760 118 L840 148 L900 124 L900 200 L0 200 Z" fill="var(--acc)" opacity=".16"/>
      <g color="var(--acc)" transform="translate(414,64)">
        <use href="#icon-horse" width="72" height="72"/>
      </g>
    </svg>
  </figure>

  <div class="photo-grid">
    <div class="photo-item"><img src="img/d1027-1.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1027-2.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1027-3.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1027-4.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
  </div>

  <div class="plan">
    <div class="item rv">
      <div class="period">早晨（08:30–10:00）</div>
      <div>
        <h4>晨間瑜珈</h4>
        <p>在花園工作室（如 Wild Rose Yoga）參加 90 分鐘晨間流動瑜珈，伸展身心。</p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">上午（10:30–12:30）</div>
      <div>
        <h4>素帖山僧侶步道健行</h4>
        <p>前往素帖山，沿著經典的「Monk's Trail（僧侶步道）」健行 45–60 分鐘，探訪隱身在雨林與溪流邊的古寺「Wat Pha Lat（帕拉寺）」。</p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">中午</div>
      <div>
        <h4>森林景觀餐廳午餐</h4>
        <p>在素帖山腳下的森林景觀餐廳享用午餐。</p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">下午（14:30–16:30）</div>
      <div>
        <h4>山野森林騎馬</h4>
        <p>前往山腳馬場（如 Chiang Mai Horse Riding），由教練帶領騎馬穿越森林、農田與小溪流（體驗馬匹涉水渡溪）。</p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">晚上</div>
      <div>
        <h4>泰北料理．深層放鬆</h4>
        <p>享用泰北精緻料理，隨後安排草本藥包或頌缽音療深層放鬆。</p>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 5: 重寫 `id="d1029"`（保留 `.spa-link` 超連結）**

原本：
```html
<div class="day-card" id="d1029">
  <div class="day-title">
    <div class="day-icon"><svg><use href="#icon-craft"/></svg></div>
    <span class="day-date">10/29（四）</span>
    <h3>短期工藝手作／心靈體驗 × 寧曼路慢生活</h3>
  </div>
  <div class="slot">
    <div class="slot-label">上午</div>
    <p>參加一日／半日短期體驗課程（如：藍染 Indigo Dyeing 工作坊、泰式香氛或草本藥包 DIY）。</p>
  </div>
  <div class="slot">
    <div class="slot-label">下午</div>
    <p>到寧曼路（Nimman）選間漂亮的綠意咖啡館喝手沖咖啡，並預約 2 小時高質感
      <a class="spa-link" href="spa.html" title="查看清邁高價位質感 SPA 推薦">SPA</a>（如 Fah Lanna 或 Kiyora）徹底紓壓。
    </p>
  </div>
  <div class="slot">
    <div class="slot-label">晚上</div>
    <p>享用在清邁最後一晚的浪漫燭光或河畔晚餐。</p>
  </div>
</div>
```

改成：
```html
<div class="day-card" id="d1029" style="--acc:var(--gold)">
  <div class="day-title">
    <span class="day-no">07</span>
    <div class="day-txt">
      <span class="day-date">10/29（四）</span>
      <h3>短期工藝手作／心靈體驗 × 寧曼路慢生活</h3>
    </div>
  </div>

  <figure class="shot rv">
    <img src="img/d1029.jpg" alt="" onerror="this.remove()">
    <svg viewBox="0 0 900 200" role="img" aria-label="工藝手作插圖">
      <rect width="900" height="200" fill="var(--acc)" opacity=".1"/>
      <path d="M0 150 L90 112 L160 140 L240 98 L330 148 L420 114 L500 148 L590 106 L680 146 L760 118 L840 148 L900 124 L900 200 L0 200 Z" fill="var(--acc)" opacity=".16"/>
      <g color="var(--acc)" transform="translate(414,64)">
        <use href="#icon-craft" width="72" height="72"/>
      </g>
    </svg>
  </figure>

  <div class="photo-grid">
    <div class="photo-item"><img src="img/d1029-1.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1029-2.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1029-3.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
  </div>

  <div class="plan">
    <div class="item rv">
      <div class="period">上午</div>
      <div>
        <h4>工藝手作體驗</h4>
        <p>參加一日／半日短期體驗課程（如：藍染 Indigo Dyeing 工作坊、泰式香氛或草本藥包 DIY）。</p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">下午</div>
      <div>
        <div class="chips"><span class="chip book">建議預約</span></div>
        <h4>寧曼路咖啡．高質感 SPA</h4>
        <p>到寧曼路（Nimman）選間漂亮的綠意咖啡館喝手沖咖啡，並預約 2 小時高質感
          <a class="spa-link" href="spa.html" title="查看清邁高價位質感 SPA 推薦">SPA</a>（如 Fah Lanna 或 Kiyora）徹底紓壓。
        </p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">晚上</div>
      <div>
        <h4>清邁最後一夜晚餐</h4>
        <p>享用在清邁最後一晚的浪漫燭光或河畔晚餐。</p>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 6: 重寫 `id="d1030"`**

原本：
```html
<div class="day-card" id="d1030">
  <div class="day-title">
    <div class="day-icon"><svg><use href="#icon-flight"/></svg></div>
    <span class="day-date">10/30（五）</span>
    <h3>清邁 ✈️ 飛回曼谷</h3>
  </div>
  <div class="slot">
    <div class="slot-label">上午／中午</div>
    <p>搭機返回曼谷（班機時間可彈性選擇）。</p>
  </div>
  <div class="slot">
    <div class="slot-label">下午</div>
    <p>入住曼谷市區飯店，預約曼谷頂級 SPA（如 Divana 或 Let's Relax）享用頂級療程。</p>
  </div>
  <div class="slot">
    <div class="slot-label">晚上</div>
    <p>安排前往湄南河畔景觀餐廳，或去高空酒吧（Rooftop Bar）欣賞曼谷夜景。</p>
  </div>
</div>
```

改成：
```html
<div class="day-card" id="d1030" style="--acc:var(--deep-teal)">
  <div class="day-title">
    <span class="day-no">08</span>
    <div class="day-txt">
      <span class="day-date">10/30（五）</span>
      <h3>清邁 ✈️ 飛回曼谷</h3>
    </div>
  </div>

  <figure class="shot rv">
    <img src="img/d1030.jpg" alt="" onerror="this.remove()">
    <svg viewBox="0 0 900 200" role="img" aria-label="飛回曼谷插圖">
      <rect width="900" height="200" fill="var(--acc)" opacity=".1"/>
      <path d="M0 150 L90 112 L160 140 L240 98 L330 148 L420 114 L500 148 L590 106 L680 146 L760 118 L840 148 L900 124 L900 200 L0 200 Z" fill="var(--acc)" opacity=".16"/>
      <g color="var(--acc)" transform="translate(414,64)">
        <use href="#icon-flight" width="72" height="72"/>
      </g>
    </svg>
  </figure>

  <div class="photo-grid">
    <div class="photo-item"><img src="img/d1030-1.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1030-2.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
  </div>

  <div class="plan">
    <div class="item rv">
      <div class="period">上午／中午</div>
      <div>
        <h4>清邁 → 曼谷</h4>
        <p>搭機返回曼谷（班機時間可彈性選擇）。</p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">下午</div>
      <div>
        <div class="chips"><span class="chip book">建議預約</span></div>
        <h4>曼谷入住．頂級 SPA</h4>
        <p>入住曼谷市區飯店，預約曼谷頂級 SPA（如 Divana 或 Let's Relax）享用頂級療程。</p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">晚上</div>
      <div>
        <h4>湄南河畔．高空酒吧</h4>
        <p>安排前往湄南河畔景觀餐廳，或去高空酒吧（Rooftop Bar）欣賞曼谷夜景。</p>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 7: 重寫 `id="d1031"`**

原本：
```html
<div class="day-card" id="d1031">
  <div class="day-title">
    <div class="day-icon"><svg><use href="#icon-gift"/></svg></div>
    <span class="day-date">10/31（六）</span>
    <h3>曼谷市區最後巡禮 ✈️ 滿載而歸返台</h3>
  </div>
  <div class="slot">
    <div class="slot-label">白天</div>
    <p>到 IconSiam 或 Jodd Fairs 採買伴手禮與泰國零食。</p>
  </div>
  <div class="slot">
    <div class="slot-label">傍晚／晚上</div>
    <p>前往機場，搭乘晚班機返回台灣，結束療癒滿滿的泰國之旅！</p>
  </div>
</div>
```

改成：
```html
<div class="day-card" id="d1031" style="--acc:var(--terracotta)">
  <div class="day-title">
    <span class="day-no">09</span>
    <div class="day-txt">
      <span class="day-date">10/31（六）</span>
      <h3>曼谷市區最後巡禮 ✈️ 滿載而歸返台</h3>
    </div>
  </div>

  <figure class="shot rv">
    <img src="img/d1031.jpg" alt="" onerror="this.remove()">
    <svg viewBox="0 0 900 200" role="img" aria-label="曼谷市區巡禮插圖">
      <rect width="900" height="200" fill="var(--acc)" opacity=".1"/>
      <path d="M0 150 L90 112 L160 140 L240 98 L330 148 L420 114 L500 148 L590 106 L680 146 L760 118 L840 148 L900 124 L900 200 L0 200 Z" fill="var(--acc)" opacity=".16"/>
      <g color="var(--acc)" transform="translate(414,64)">
        <use href="#icon-gift" width="72" height="72"/>
      </g>
    </svg>
  </figure>

  <div class="photo-grid">
    <div class="photo-item"><img src="img/d1031-1.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
    <div class="photo-item"><img src="img/d1031-2.jpg" alt="" onerror="this.closest('.photo-item').remove()"></div>
  </div>

  <div class="plan">
    <div class="item rv">
      <div class="period">白天</div>
      <div>
        <h4>伴手禮採買</h4>
        <p>到 IconSiam 或 Jodd Fairs 採買伴手禮與泰國零食。</p>
      </div>
    </div>
    <div class="item rv">
      <div class="period">傍晚／晚上</div>
      <div>
        <h4>機場．搭機返台</h4>
        <p>前往機場，搭乘晚班機返回台灣，結束療癒滿滿的泰國之旅！</p>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 8: grep 檢查全部 9 天都已轉換、舊 markup 沒有殘留**

Run:
```bash
grep -c "class=\"day-card\"" TravelDetail/Tailand-202610/dm.html
grep -c "class=\"item rv\"" TravelDetail/Tailand-202610/dm.html
grep -n "class=\"slot\"\|class=\"day-icon\"" TravelDetail/Tailand-202610/dm.html
```
Expected：第一條輸出 `9`；第二條輸出 `27`（9 天各自的 item 數：d1023=2, d1024=3, d1025=3, d1026=4, d1027=5, d1028=2, d1029=3, d1030=3, d1031=2，總計 27）；第三條指令**沒有任何輸出**。

- [ ] **Step 9: 瀏覽器完整檢查 9 張卡片**

Run: `open TravelDetail/Tailand-202610/dm.html`

Expected：從上到下 9 張卡片都有插圖 banner、大字日期編號（01–09）、item 列式行程，配色跟著 `--acc` 在深蓆藍／蓆藍／金褐／紅土之間輪替，沒有任何破圖或跑版。

- [ ] **Step 10: Commit**

```bash
cd /Users/eyesc/Project/TravelProject
git add TravelDetail/Tailand-202610/dm.html
git commit -m "feat(thailand-dm): rebuild remaining 7 day cards with new layout"
```

---

### Task 5: 捲動淡入動畫、最終 RWD／QA 收尾

**Files:**
- Modify: `TravelDetail/Tailand-202610/dm.html`（`</body>` 前）

**Interfaces:**
- Consumes：Task 1 的 `.rv` / `.rv.in` CSS；Task 2–4 markup 中已加在 `.shot` 與 `.item` 上的 `rv` class。

- [ ] **Step 1: 在 `</body>` 前、`</html>` 前，新增捲動動畫 script**

```html
<script>
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px' });
  document.querySelectorAll('.rv').forEach(function (el, i) {
    el.style.transitionDelay = (i % 3) * 55 + 'ms';
    io.observe(el);
  });
</script>
```

- [ ] **Step 2: 瀏覽器檢查動畫與整體 RWD**

Run: `open TravelDetail/Tailand-202610/dm.html`

Expected：
1. 首次載入時，每張卡片的 banner 與行程項目會隨著捲動淡入（從透明+輕微下移，變成完全不透明）。
2. 把瀏覽器視窗縮到 375px 寬（手機尺寸），確認：吸頂列日期 chip 可以左右滑動、`.item` 改成單欄堆疊、hero 統計列自動換行、卡片內文不會橫向溢出。
3. 開發者工具打開 Console，確認捲動、點擊導覽、縮放視窗過程中沒有任何紅色錯誤訊息。
4. 系統設定「減少動態效果」（macOS: 輔助使用 → 顯示器 → 減少動態效果）開啟時重新整理頁面，確認卡片直接完整顯示、無淡入動畫延遲。

- [ ] **Step 3: Commit**

```bash
cd /Users/eyesc/Project/TravelProject
git add TravelDetail/Tailand-202610/dm.html
git commit -m "feat(thailand-dm): add scroll-reveal animation"
```
