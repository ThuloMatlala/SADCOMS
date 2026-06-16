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

### Prerequisites
- .NET 8 SDK
- Node.js 18+

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
- [ ] Domain entities
- [ ] EF Core + migrations
- [ ] REST endpoints
- [ ] RabbitMQ messaging
- [ ] React frontend
- [ ] Docker Compose