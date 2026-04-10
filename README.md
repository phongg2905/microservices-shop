# Microservices Shop Lab 2

Kiến trúc gồm 4 service chính:

- **API Gateway** (`api-gateway`): Proxy duy nhất cho client, rate limit + JWT auth forwarding.
- **Product Service** (`product-service`): PostgreSQL + Prisma, CRUD sản phẩm, Swagger.
- **Order Service** (`order-service`): MongoDB + Mongoose, validate đơn hàng, Swagger.
- **Auth Service** (`auth-service`): PostgreSQL + Prisma, JWT register/login/refresh/me.

## Chuẩn bị
1. Cài Node.js >= 18, Docker Desktop >= 24.
2. Sao chép các file `.env.example` trong từng service thành `.env` và điều chỉnh thông tin kết nối thực tế nếu không chạy bằng Docker Compose.

## Chạy bằng Docker Compose
```bash
cd microservices-shop
docker compose up -d --build
```
- Swagger:
  - Product: http://localhost:3001/api-docs
  - Order: http://localhost:3002/api-docs
- Gateway health check: http://localhost:3000/health
- Auth endpoints thông qua Gateway: `POST http://localhost:3000/api/auth/login`...

## Phát triển từng service
Ví dụ với Product Service:
```bash
cd product-service
npm install
npm run prisma:migrate   # tạo schema PostgreSQL
npm run prisma:seed      # dữ liệu mẫu
npm run dev
```
Order Service và Auth Service có script `npm run dev` tương tự. Auth Service dùng Prisma nên cần `npm run prisma:migrate` trước.

## Ghi chú bảo mật
- **Không commit thông tin mật**: chỉ đẩy các file `.env.example` lên Git.
- Thay `JWT_SECRET`, `JWT_REFRESH_SECRET`, mật khẩu DB bằng biến môi trường thực tế khi deploy.

## Checklist Lab 2
- ✅ Product Service: Prisma schema/migration, CRUD + pagination/filter + Swagger.
- ✅ Order Service: Mongo schema, controller, Swagger, Dockerfile, validate dữ liệu.
- ✅ Auth Service: JWT register/login/refresh/me, Prisma, Dockerfile.
- ✅ API Gateway: Proxy, rate limit, JWT middleware, header forwarding.
- ✅ Docker Compose orchestration + healthchecks.
