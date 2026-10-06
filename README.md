# Equipment Management

Ứng dụng quản lý thiết bị gồm Frontend Next.js và Backend ASP.NET Core Web API.

## Công nghệ sử dụng

### Frontend

- Next.js
- TypeScript
- Material UI
- MUI DataGrid

### Backend

- ASP.NET Core Web API
- C#
- Entity Framework Core
- PostgreSQL

## Chức năng

- Xem danh sách thiết bị
- Tìm kiếm thiết bị theo tên
- Xem chi tiết thiết bị
- Thêm thiết bị
- Sửa thiết bị
- Xóa thiết bị
- Xác nhận trước khi xóa
- Validation dữ liệu
- Loading state
- Empty state
- Error state

## Cấu trúc Frontend

app/
├── equipment/
│   ├── [id]/
│   │   ├── page.tsx
│   │   └── edit/
│   ├── create/
│   ├── EquipmentList.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   └── error.tsx

## Cấu trúc Backend

Equipment.Api/
├── Controllers/
├── Services/
├── Models/
├── DTOs/
├── Data/
└── Program.cs

## Chạy Backend

cd Equipment.Api
dotnet run

## Chạy Frontend

cd my-app
pnpm dev

## Database

Project sử dụng PostgreSQL và Entity Framework Core.

## API

| Method | Endpoint               | Chức năng              |
| ------ | ---------------------- | ---------------------- |
| GET    | `/api/equipments`      | Lấy danh sách thiết bị |
| GET    | `/api/equipments/{id}` | Lấy thiết bị theo ID   |
| POST   | `/api/equipments`      | Thêm thiết bị          |
| PUT    | `/api/equipments/{id}` | Cập nhật thiết bị      |
| DELETE | `/api/equipments/{id}` | Xóa thiết bị           |

## Seed Admin

Khi ứng dụng khởi động, hệ thống sẽ tự động seed tài khoản Admin nếu username `admin` chưa tồn tại.

Trước khi chạy API, cấu hình password bằng User Secrets:

```bash
dotnet user-secrets set "SeedAdmin:Password" "your-password"
