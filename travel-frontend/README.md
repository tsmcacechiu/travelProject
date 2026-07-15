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

## 路由結構

| 路徑 | 說明 |
|------|------|
| `/` | 首頁 |
| `/articles` | 旅遊文章列表 |
| `/guides` | 旅遊攻略列表 |
| `/countdown` | 生命倒數計時表 |
| `/shop` | 代購入口 |
