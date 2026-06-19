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

### Start Infrastructure
```bash
docker compose up -d
# SQL Server available at localhost:1433 (user: sa)
# RabbitMQ Management UI available at http://localhost:15672 (guest/guest)
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
# Swagger available at http://localhost:5195/swagger
```

### Run the Worker
```bash
cd SADCOMS.Worker
dotnet run
```

### Run the Frontend
```bash
cd SADCOMS.Web
pnpm install
pnpm run dev
# Available at http://localhost:5173
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
GET http://localhost:5195/api/token?password=SADCOMS@Dev2026!
```

This endpoint is disabled in production.

**Dev password: `SADCOMS@Dev2026!`**

The auth token is stored in memory. In production, MSAL would handle token acquisition and caching via Microsoft Entra.

To configure locally, ensure `appsettings.Development.json` contains:

```json
{
  "Jwt": {
    "DevSecret": "dev-only-secret-key-min-32-chars-long!",
    "DevPassword": "SADCOMS@Dev2026!"
  }
}
```

### Frontend Login

1. Navigate to `http://localhost:5173`
2. Click any protected page — you will be redirected to `/login`
3. Enter the dev password: `SADCOMS@Dev2026!`
4. You will be redirected to the home page with full access
5. Click **Logout** on the home page to clear the token

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

## Status
- [x] Solution structure
- [x] Domain entities
- [x] Docker Compose
- [x] EF Core + migrations
- [x] REST endpoints
- [x] RabbitMQ messaging
- [x] Worker services
- [x] React frontend
- [x] Domain testing
- [x] JWT auth
- [x] Integration tests for protected endpoints
- [x] Frontend auth — handle 401s, pass token
- [ ] Outbox pattern
- [ ] Devops
- [ ] ANSWERS.md
- [ ] Update order status (frontend)