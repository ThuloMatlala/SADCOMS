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

