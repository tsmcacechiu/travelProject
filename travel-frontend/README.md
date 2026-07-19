# Travel Frontend

Next.js 15 + TypeScript + Tailwind CSS

## 啟動

```bash
npm install
npm run dev
```

瀏覽器開啟 http://localhost:3000

## 環境變數

```bash
cp .env.local.example .env.local
```

| 變數 | 說明 | 預設值 |
|------|------|--------|
| `NEXT_PUBLIC_API_URL` | 後端 API URL | `http://localhost:8080` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID（見下方「Google 登入」） | 空（未設定時登入按鈕不會顯示） |

## Google 登入

1. 到 [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 建立一個 OAuth 2.0 Client ID（類型選 **Web application**）
2. **Authorized JavaScript origins** 加入 `http://localhost:3000`（正式環境再加上實際網域）
3. 不需要設定 redirect URI，也不需要 client secret — 前端走的是 `@react-oauth/google` 的 implicit / access-token flow
4. 把取得的 Client ID 填入 `.env.local` 的 `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
5. 未設定此變數時，導覽列不會顯示登入按鈕（不會噴錯，純粹隱藏），設定好重啟 `npm run dev` 後才會出現

## 路由結構

| 路徑 | 說明 |
|------|------|
| `/` | 首頁 |
| `/articles` | 旅遊文章列表 |
| `/guides` | 旅遊攻略列表 |
| `/countdown` | 生命倒數計時表 |
| `/shop` | 代購入口 |
