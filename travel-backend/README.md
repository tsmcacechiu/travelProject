# Travel Backend

Spring Boot 3.5 + Java 21 + H2 (Phase 1)

## 啟動

```bash
./mvnw spring-boot:run
```

服務啟動於 http://localhost:8080

## Health Check

```bash
curl http://localhost:8080/actuator/health
# {"status":"UP"}
```

## H2 Console（開發用）

http://localhost:8080/h2-console  
JDBC URL: `jdbc:h2:mem:traveldb`  
Username: `sa` / Password: (空)

## API 端點（Phase 1 Placeholder）

| Method | Path | 說明 | 需要登入 |
|--------|------|------|--------|
| GET | `/api/articles` | 文章列表（空） | 否 |
| GET | `/api/guides` | 攻略列表（空） | 否 |
| POST | `/api/auth/google` | 用 Google access token 換取本站 JWT（會自動註冊新使用者） | 否 |
| GET | `/api/auth/me` | 取得目前登入使用者資料 | 是（`Authorization: Bearer <token>`） |
| GET | `/actuator/health` | 健康狀態 | 否 |

## Google 登入

後端不直接驗證 ID token，而是拿前端傳來的 Google access token 去打 Google 自己的
`https://www.googleapis.com/oauth2/v3/userinfo`，用回傳結果建立/更新 `users` 表並簽發本站 JWT。
這樣不需要在後端設定 Google client secret，同時避免了「前端自己宣稱身分、後端照單全收」的風險。

| 環境變數 | 說明 | 預設值 |
|------|------|--------|
| `JWT_SECRET` | 簽發 JWT 用的 base64 secret（HS256，至少 32 bytes） | dev-only 預設值，**正式環境務必覆蓋** |
| `JWT_EXPIRATION_MS` | JWT 有效期（毫秒） | `604800000`（7 天） |

## 模組結構

```
com.travel/
├── config/      WebConfig (CORS) + SecurityConfig (JWT)
├── security/    JwtService / JwtAuthenticationFilter / JwtAuthEntryPoint
├── auth/        Google 登入（GoogleTokenVerifier + AuthController/Service）
├── user/        User entity/repository
├── article/     Article CRUD
├── guide/       Guide CRUD
├── countdown/   (Phase 2 - 無後端)
└── shop/        (Phase 5)
```
