# Task Manager API

A RESTful backend API for managing tasks. Users can register, log in, and perform full CRUD on their own tasks.

- **User data** → PostgreSQL (via Sequelize)
- **Task data** → MongoDB (via Mongoose)
- **Auth** → JWT tokens

---

## Demonstration Video

Watch the full demo here (setup, register, login, CRUD, error handling, cross-user access test):

[Click here to watch the demo video](https://drive.google.com/drive/folders/1QQvSUJmq5tjFSPVJ1RHgKMmviGzsNqDY?usp=sharing)

---

## Tech Stack

- Node.js + Express.js
- PostgreSQL + Sequelize ORM
- MongoDB + Mongoose ODM
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- Joi (validation)
- Docker (database setup)

---

## Folder Structure

```
task-manager-api/
├── server.js
├── .env
├── docker-compose.yml
└── src/
    ├── app.js
    ├── config/
    │   ├── postgres.js
    │   └── mongo.js
    ├── models/
    │   ├── user.js          (PostgreSQL)
    │   └── task.js          (MongoDB)
    ├── controllers/
    │   ├── auth-controller.js
    │   └── task-controller.js
    ├── routes/
    │   ├── auth-routes.js
    │   └── task-routes.js
    ├── middleware/
    │   ├── authenticate.js
    │   └── errorhandler.js
    └── validators/
        └── index.js
```

---

## Setup & Run

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd task-manager-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a `.env` file in the root folder:

```env
PORT=3000

PG_HOST=localhost
PG_PORT=5433
PG_USER=postgres
PG_PASSWORD=yourpassword
PG_DB=taskmanager

MONGO_URI=mongodb://localhost:27017/taskmanager

JWT_SECRET=your_long_random_secret_here
```

### 4. Check database credentials in docker-compose.yml

> **Important:** Open `docker-compose.yml` in the root folder and check the PostgreSQL credentials. Make sure `PG_PASSWORD` in your `.env` file matches `POSTGRES_PASSWORD` in `docker-compose.yml` exactly.

```yaml
# docker-compose.yml
environment:
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: yourpassword   # ← must match PG_PASSWORD in .env
  POSTGRES_DB: taskmanager
```

### 5. Start the databases with Docker

```bash
docker-compose up -d
```

This starts PostgreSQL on port **5433** and MongoDB on port **27017**.

### 6. Create the PostgreSQL database (first time only)

```bash
docker exec -it task-manager-api-postgres-1 psql -U postgres -c "CREATE DATABASE taskmanager;"
```

### 7. Start the server

```bash
npm run dev
```

You should see:
```
PostgreSQL connected
MongoDB connected
Server running on http://localhost:3000
```

---

## API Documentation

Base URL: `http://localhost:3000/api`

All protected routes require this header:
```
Authorization: Bearer <your_token>
```

---

### Auth Endpoints

#### Register
```
POST /api/auth/register
```
Body:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
Response (201):
```json
{
    "success": true,
    "user": {
        "id": "uuid",
        "email": "user@example.com"
    }
}
```

---

#### Login
```
POST /api/auth/login
```
Body:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
Response (200):
```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### Get Profile (protected)
```
GET /api/auth/me
Authorization: Bearer <token>
```
Response (200):
```json
{
    "success": true,
    "user": {
        "id": "uuid",
        "email": "user@example.com",
        "createdAt": "2026-04-25T00:00:00.000Z"
    }
}
```

---

### Task Endpoints

All task routes require `Authorization: Bearer <token>`.

---

#### Create Task
```
POST /api/tasks
```
Body:
```json
{
    "title": "Finish assignment",
    "description": "Complete the backend API",
    "dueDate": "2026-12-31",
    "status": "pending"
}
```
Response (201):
```json
{
    "success": true,
    "task": {
        "_id": "665f3a1b2c4d5e6f7a8b9c0d",
        "userId": "uuid",
        "title": "Finish assignment",
        "description": "Complete the backend API",
        "dueDate": "2026-12-31T00:00:00.000Z",
        "status": "pending",
        "createdAt": "2026-04-25T00:00:00.000Z"
    }
}
```

---

#### Get All Tasks
```
GET /api/tasks
```
Response (200):
```json
{
    "success": true,
    "count": 1,
    "tasks": [...]
}
```

---

#### Get Single Task
```
GET /api/tasks/:id
```
Response (200):
```json
{
    "success": true,
    "task": { ... }
}
```

---

#### Update Task (partial)
```
PATCH /api/tasks/:id
```
Body (send only fields you want to change):
```json
{
    "status": "completed"
}
```
Response (200):
```json
{
    "success": true,
    "task": { ... }
}
```

---

#### Delete Task
```
DELETE /api/tasks/:id
```
Response (200):
```json
{
    "success": true,
    "message": "Task deleted"
}
```

---

## Error Responses

All errors follow this format:
```json
{
    "message": "Error description here"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request / validation failed |
| 401 | No token or invalid token |
| 403 | Trying to access another user's task |
| 404 | Task not found |
| 500 | Internal server error |

---

## Design Decisions

- **Two databases** — PostgreSQL for structured user data, MongoDB for flexible task documents. Linked by the user's UUID stored as a string field in each task.
- **UUID primary keys** — harder to guess than sequential integers, works cleanly as a cross-database link.
- **bcrypt saltRounds = 10** — industry standard balance between security and performance.
- **JWT (stateless auth)** — no session storage needed, easy to scale.
- **PATCH for updates** — allows partial updates without sending the full resource, as required by the assignment.
- **Joi validation** — all input validated before touching the database using a reusable `validate()` middleware factory.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `PG_HOST` | PostgreSQL host |
| `PG_PORT` | PostgreSQL port (5433 if using Docker alongside local PostgreSQL) |
| `PG_USER` | PostgreSQL username |
| `PG_PASSWORD` | PostgreSQL password |
| `PG_DB` | PostgreSQL database name |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
