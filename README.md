# SADCOMS
SADC Order Management System — Senior Full Stack Developer technical assessment built with ASP.NET Core (.NET 8), EF Core, RabbitMQ, and React + TypeScript

## Tech Stack
- ASP.NET Core (.NET 8) — REST API
- EF Core (Code First) + SQL Server — data layer
- RabbitMQ — event messaging
- React + TypeScript — frontend
- xUnit — testing

## Project Structure
SADCOMS/
├── SADCOMS.API/        # REST API
├── SADCOMS.Worker/     # RabbitMQ background consumer
├── SADCOMS.Domain/     # Shared entities and domain logic
├── SADCOMS.Tests/      # Unit tests
└── SADCOMS.Web/        # React + TypeScript frontend

## Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- Docker

### Start SQL Server

```bash
docker compose up -d
# SQL Server available at localhost:1433 (user: sa)
```

> Note: `docker-compose.yml` sets `platform: linux/amd64` for Apple Silicon (M1/M2/M3) compatibility. Remove this line if running on Windows.

### Apply Database Migrations
```bash
cd SADCOMS.API
dotnet ef database update
```

### Add a New Migration
```bash
dotnet ef migrations add <MigrationName>
```

### Run the API
```bash
cd SADCOMS.API
dotnet run
# Swagger available at https://localhost:5001/swagger
```

### Run the Worker
```bash
cd SADCOMS.Worker
dotnet run
```

### Run Tests
```bash
cd SADCOMS.Tests
dotnet test
```

## Status
- [x] Solution structure
- [x] Domain entities
- [x] Docker Compose
- [x] EF Core + migrations
- [ ] REST endpoints
- [ ] RabbitMQ messaging
- [ ] React frontend