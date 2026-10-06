# Medical Transport Platform (Nền Tảng Dịch Vụ Y Tế & Vận Tải)

Hệ thống quản lý và đăng ký dịch vụ y tế tại nhà, đưa đón khám chữa bệnh, tuyển dụng và quản lý cộng tác viên.

## 🏗️ Cấu Trúc Project

```text
medical-transport-platform/
├── backend/            # Spring Boot 3.x API (Java 21, Spring Data JPA, Security)
├── frontend/           # Next.js Frontend (TypeScript, Tailwind CSS)
├── README.md           # Tài liệu hướng dẫn project
└── .gitignore          # Cấu hình Git ignore
```

## 📋 Requirements

- **Java**: 21 (JDK 21 LTS)
- **Node.js**: 18.x hoặc mới hơn (khuyên dùng Node 20+)
- **Maven**: 3.9+
- **Database**: PostgreSQL 15+

## ⚙️ Biến Môi Trường (Environment Variables)

### Backend (`backend/.env` hoặc OS env):
- `DATABASE_URL`: `jdbc:postgresql://localhost:5432/medical_transport_db`
- `DATABASE_USERNAME`: `postgres`
- `DATABASE_PASSWORD`: `your_password`
- `JWT_SECRET`: `your_jwt_secret_key_at_least_32_chars`
- `FRONTEND_URL`: `http://localhost:3000`
- `SERVER_PORT`: `8080`

### Frontend (`frontend/.env.local`):
- `NEXT_PUBLIC_API_URL`: `http://localhost:8080`

## 🚀 Hướng Dẫn Chạy Local (Development)

### 1. Backend (Spring Boot):
```bash
cd backend
mvn clean spring-boot:run
```
Backend API sẽ chạy tại: `http://localhost:8080`
Health check endpoint: `http://localhost:8080/api/health`

### 2. Frontend (Next.js):
```bash
cd frontend
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:3000`

## 📦 Build Production

### Backend:
```bash
cd backend
mvn clean package -DskipTests
```
File JAR sẽ được tạo tại `backend/target/medical-transport-backend-1.0.0-SNAPSHOT.jar`.

### Frontend:
```bash
cd frontend
npm run build
npm run start
```
