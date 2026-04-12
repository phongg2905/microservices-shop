# LAB 2 - BACKEND VỚI NODE.JS MICROSERVICES

## Thông tin sinh viên
- Họ và tên: Phạm Thanh Phong
- MSSV: N23DCCN045
- Lớp: D23CQCN01-N

## Giới thiệu
Đây là project Lab 2 xây dựng backend kiến trúc microservices bằng Node.js và Express. Hệ thống gồm 4 service chính giao tiếp qua API Gateway, sử dụng PostgreSQL (Prisma) và MongoDB (Mongoose), đồng thời được container hóa với Docker để dễ triển khai lên Railway, Supabase và MongoDB Atlas.

## Kiến trúc hệ thống
### 1. API Gateway (port 3000)
- Định tuyến request tới các service con.
- Áp dụng JWT middleware cho các route bảo vệ.
- Là đầu mối duy nhất kết nối client.

### 2. Product Service (port 3001)
- PostgreSQL (Supabase) + Prisma ORM.
- CRUD sản phẩm, danh mục, phân trang, tìm kiếm, lọc/sắp xếp theo giá.
- Validate dữ liệu và công bố Swagger API docs.

### 3. Order Service (port 3002)
- MongoDB (MongoDB Atlas) + Mongoose.
- Tạo/lấy/cập nhật trạng thái đơn hàng, lọc theo khách hàng.
- Liên hệ product-service để lấy dữ liệu sản phẩm.

### 4. Auth Service (port 3003)
- PostgreSQL (Supabase) + Prisma ORM.
- Đăng ký, đăng nhập, cấp access token + refresh token.
- Endpoint `me` truy xuất user hiện tại, xác thực JWT.

## Cấu trúc thư mục
```
microservices-shop/
├── api-gateway/
├── auth-service/
├── order-service/
├── product-service/
├── docker-compose.yml
└── README.md
```

## Công nghệ sử dụng
- Node.js, Express.js
- Prisma ORM, PostgreSQL (Supabase)
- MongoDB, Mongoose (MongoDB Atlas)
- Swagger UI
- JWT Authentication
- Docker & Docker Compose
- Railway deploy

## Chức năng đã hoàn thành
### Product Service
- Lấy danh sách, chi tiết, tạo, cập nhật, xóa mềm sản phẩm.
- Pagination + filtering + sorting + searching.
- Validate dữ liệu đầu vào, tài liệu Swagger.

### Order Service
- Tạo đơn hàng, lấy đơn theo khách hàng, lọc theo trạng thái.
- Cập nhật trạng thái và kết nối MongoDB Atlas thành công.

### Auth Service
- Register, Login, Refresh token, Me.
- JWT authentication hoạt động.

### API Gateway
- Proxy route tới các service khác.
- Bảo vệ route order bằng Bearer token.
- Thử nghiệm nội bộ thành công.

### Docker & Deploy
- Docker Compose chạy toàn bộ hệ thống cục bộ.
- Product-service đã deploy lên Railway.

## Hướng dẫn chạy project local
1. Clone project
   ```bash
   git clone <link-repo-github>
   cd microservices-shop
   ```
2. Chạy bằng Docker Compose
   ```bash
   docker compose up --build
   ```
3. Truy cập các service
   - API Gateway: http://localhost:3000
   - Product Service: http://localhost:3001
   - Order Service: http://localhost:3002
   - Auth Service: http://localhost:3003

## Các endpoint chính
### Product Service
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Order Service
- `POST /api/orders`
- `GET /api/orders/customers/:customerId`
- `PATCH /api/orders/:id/status`

### Auth Service
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

## Swagger
- Product Service: http://localhost:3001/api-docs

## Link deploy
- Product Service: https://stunning-perception-production-4c00.up.railway.app/
- Order Service: https://microservices-shop-production-0789.up.railway.app/
- Auth Service: https://amusing-respect-production-ad2f.up.railway.app/
- Api Gateway: https://glistening-flow-production-6833.up.railway.app/
## Kết quả kiểm thử
- CRUD product, order, auth, gateway với JWT chạy thành công ở local.
- Product-service, Order-service, Auth-service, Api-gateway deploy Railway hoạt động ổn định.
