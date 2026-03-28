# 4 Pics 1 Word - Documentation

## Project Structure
- `auth-api/`: ASP.NET Core service for user authentication and role management.
- `resource-api/`: ASP.NET Core service for managing game assets (packs, puzzles).
- `web-app/`: React (Vite) frontend application.
- `docs/`: Project documentation.

## Running the Services

### Prerequisites
- .NET 8 SDK or later
- Node.js 18 or later
- npm or yarn

### auth-api
1. Navigate to `auth-api/`.
2. Run `dotnet run`.
3. The API will be available at `http://localhost:5000` (check `Properties/launchSettings.json`).

### resource-api
1. Navigate to `resource-api/`.
2. Run `dotnet run`.
3. The API will be available at `http://localhost:5001`.

### web-app
1. Navigate to `web-app/`.
2. Run `npm install` (first time only).
3. Run `npm run dev`.
4. The app will be available at `http://localhost:5173`.

## Environment Variables

### auth-api
- `JWT_SECRET`: A secure key for signing JWTs.
- `DB_CONNECTION_STRING`: SQLite database path (default: `Data Source=auth.db`).

### web-app
- `VITE_AUTH_API_URL`: URL of the `auth-api` service.
- `VITE_RESOURCE_API_URL`: URL of the `resource-api` service.
