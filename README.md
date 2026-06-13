# Book — Meeting Room Booking API

A REST API backend for reserving meeting rooms. Users authenticate with JWT cookies, admins manage rooms, and authenticated users create or cancel bookings with automatic time-slot conflict detection.

## Features

- **Authentication** — register, login, and logout with JWT stored in an httpOnly cookie
- **Role-based access** — two roles: `admin` and `user`
- **Room management** — admins create rooms; any authenticated user can query available rooms for a time range
- **Bookings** — create bookings with overlap detection; cancel own bookings (users) or any booking (admins)
- **User bookings** — list upcoming bookings for a user (users can only view their own)

## Tech Stack

- Node.js, Express 5, TypeScript
- Sequelize ORM + PostgreSQL
- bcrypt (password hashing), jsonwebtoken (JWT)

## Prerequisites

- Node.js 18 or later
- PostgreSQL running locally (or accessible remotely)

## Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   The repository includes [`.env.example`](.env.example) with all required variables:

   | Variable      | Description                                     |
   | ------------- | ----------------------------------------------- |
   | `PORT`        | Server port (default: `3000`)                   |
   | `DB_HOST`     | PostgreSQL host                                 |
   | `DB_USER`     | PostgreSQL username                             |
   | `DB_PASSWORD` | PostgreSQL password                             |
   | `DB_NAME`     | PostgreSQL database name                        |
   | `JWT_SECRET`  | Secret key for signing JWT tokens               |
   | `NODE_ENV`    | `development` or `production` (cookie security) |

4. **Create the PostgreSQL database**

   Ensure the database named in `DB_NAME` exists before starting the server.

5. **Run the project**

   Development (with hot reload):

   ```bash
   npm run dev
   ```

   Production:

   ```bash
   npm run build
   npm start
   ```

   The server starts on `http://localhost:3000` by default (or the port set in `PORT`).

## Scripts

| Script  | Command                   | Description                       |
| ------- | ------------------------- | --------------------------------- |
| `dev`   | `tsx watch src/server.ts` | Start dev server with hot reload  |
| `build` | `tsc`                     | Compile TypeScript to `dist/`     |
| `start` | `node dist/server.js`     | Run the compiled production build |

## API Endpoints

| Method | Path                                   | Auth | Role         |
| ------ | -------------------------------------- | ---- | ------------ |
| POST   | `/auth/register`                       | No   | —            |
| POST   | `/auth/login`                          | No   | —            |
| POST   | `/auth/logout`                         | No   | —            |
| POST   | `/rooms`                               | Yes  | admin        |
| GET    | `/rooms/available?start_time&end_time` | Yes  | any          |
| POST   | `/bookings`                            | Yes  | any          |
| DELETE | `/bookings/:id`                        | Yes  | any          |
| GET    | `/bookings`                            | Yes  | admin        |
| GET    | `/users/:id/bookings`                  | Yes  | own or admin |

## Project Structure

```
src/
├── server.ts           # App entry point
├── config/
│   └── db.ts           # Sequelize / PostgreSQL connection
├── models/             # User, Room, Booking + associations
├── controllers/        # Request handlers
├── middlewares/        # Auth guards and error handler
├── routers/            # Route definitions
└── utils/              # Shared validation and query helpers
```
