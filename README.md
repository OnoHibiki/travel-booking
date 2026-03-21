# Travel Booking Site

A full-stack travel booking web application.
旅行予約サイトのポートフォリオとして開発中。

## Tech Stack

### Backend
- NestJS(Node.js)
- TypeScript
- Prisma ORM
- PostgreSQL (Docker)

### Frontend
- React
- TypeScript

## Database Design
![ER Diagram](./docs/erd.png)

## API
[API Specification](./docs/api-spec.md)

## Git Workflow
This project follows a simple Git workflow using feature branches.
- `main`: stable branch
- `develop`: integration branch for development
- `feature/*`: feature-specific branches

## Project status
 - Started: 2026/03/02
 - ER Diagram completed: 2026/03/02
 - API Specification completed: 2026/03/03
 - Added Git Workflow documentation: 2026/03/06
 - First self PR and merge lol (`feature/reservations` → `develop`): 2026/03/08
 - Going forward, PRs will follow the (`develop` → `main`) workflow : 2026/03/10
 - Implemented JWT authentication and protected APIs: 2026/03/14
 - Core API implementation completed (Auth, Users, Hotels, Rooms, Reservations): 2026/03/15
 - Integrated Prisma ORM and PostgreSQL database (Docker) for User/Auth persistence(very very tired lol): 2026/03/16
 - Migrated Hotels/Rooms to Prisma: 2026/03/17
 - Migrated Reservations to Prisma and completed full database migration for all APIs using Prisma and PostgreSQL: 2026/03/18
 - docs: add UI design (Figma wireframes) to README: 2026/03/21