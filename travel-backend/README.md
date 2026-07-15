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

| Method | Path | 說明 |
|--------|------|------|
| GET | `/api/articles` | 文章列表（空） |
| GET | `/api/guides` | 攻略列表（空） |
| GET | `/actuator/health` | 健康狀態 |

## 模組結構

```
com.travel/
├── config/      WebConfig (CORS)
├── article/     Article CRUD
├── guide/       Guide CRUD
├── countdown/   (Phase 2 - 無後端)
└── shop/        (Phase 5)
```
