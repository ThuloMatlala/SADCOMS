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

## API Security

### JWT Authentication

All API endpoints are protected with JWT Bearer authentication.

In production, tokens are issued by **Microsoft Entra ID** (Azure AD):
- **Authority**: `https://login.microsoftonline.com/{tenant-id}`
- **Audience**: `api://sadcoms`

### Development Bypass

For local development, a symmetric key is used to generate tokens without a real Entra tenant.

A dev-only endpoint is available to generate a token:

```bash
GET http://localhost:5195/api/token
```

This endpoint would be disabled in production.

To configure the dev secret, ensure `appsettings.Development.json` contains:

```json
{
  "Jwt": {
    "DevSecret": "J+1FQYKNEicsD6yQqWFiA00D8HovsiH7Gku0Bbh9WzhLEUVdSa+eedbRIjw9tNiP" //mocked
  }
}
```

## Testing
Tests are located in `SADCOMS.Tests` and use xUnit.

### Running Tests
```bash
cd SADCOMS.Tests
dotnet test
```

### Test Coverage

**Domain Logic (`OrderTests`)**
- `UpdateStatus` — validates correct state transitions (Pending → Paid) and rejects invalid ones (Pending → Fulfilled, Fulfilled → anything)
- `RecalculateTotalAmount` — verifies total is correctly computed as Σ (Quantity × UnitPrice) across all line items

**Validation (`SadcCurrencyValidatorTests`)**
- Verifies valid SADC country/currency pairings are accepted (e.g. ZA/ZAR)
- Verifies invalid pairings are rejected (e.g. ZA/KMF)

**Integration Tests (`ApiAuthTests`)**
- Verifies protected endpoints return `401 Unauthorized` without a token
- Uses `WebApplicationFactory<Program>` to spin up the API in memory — no running server required



### Testing Approach
Tests follow the **Arrange, Act, Assert** pattern. The focus is on pure domain logic — no database or HTTP dependencies in unit tests, making them fast and deterministic.
```

## Status
- [x] Solution structure
- [x] Domain entities
- [x] Docker Compose
- [x] EF Core + migrations
- [x] REST endpoints
- [x] RabbitMQ messaging
- [x] Worker services
- [x] React frontend
- [x] Domain Testing
- [X] JWT auth
- [x] Integration tests for test protected endpoints
- [x] Order page - Fix sorting
- [ ] update order status
- [ ] Frontend auth — handle 401s, pass token