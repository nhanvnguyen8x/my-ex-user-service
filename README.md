# my-ex-user-service

User microservice for Experience Review platform. **Node.js + Express.**  
Manages user profiles, list/filter/pagination, and admin actions (no credentials; auth is in auth service).

## Stack

- Node.js 20
- Express
- PostgreSQL (pg)

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/users` | List users (query params below) |
| GET | `/users/:id` | Get user by id |
| POST | `/users` | Create user |
| PATCH | `/users/:id` | Update user (partial) |
| DELETE | `/users/:id` | Delete user |

### GET /users — query params

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search in `name` and `email` (case-insensitive) |
| `status` | string | Filter by `active`, `inactive`, `suspended` |
| `role` | string | Filter by `user`, `moderator`, `admin` |
| `page` | number | Page number (default `1`) |
| `limit` | number | Page size (default `10`, max `100`) |
| `sortBy` | string | One of: `created_at`, `updated_at`, `email`, `name`, `role`, `status`, `review_count` (default `created_at`) |
| `sortOrder` | string | `asc` or `desc` (default `desc`) |

**Response:** `{ data: User[], pagination: { page, limit, total, totalPages } }`

### POST /users — body

- `email` (required): valid email
- `name` (optional): string
- `role` (optional): `user` | `moderator` | `admin` (default `user`)
- `status` (optional): `active` | `inactive` | `suspended` (default `active`)
- `avatar` (optional): URL string

### PATCH /users/:id — body (all optional)

- `email`, `name`, `role`, `status`, `avatar`, `review_count`

### User shape

`id`, `email`, `name`, `role`, `status`, `avatar`, `review_count`, `created_at`, `updated_at`

## Run locally

```bash
npm install
export DB_HOST=localhost DB_PORT=5432 DB_USER=postgres DB_PASSWORD=postgres DB_NAME=user_db
npm run dev
```

## Docker Compose

```bash
docker compose up --build
# Service: http://localhost:3002
```

## Kubernetes

```bash
kubectl apply -f k8s/
# DB first: kubectl apply -f k8s/db-deployment.yaml
# Then: kubectl apply -f k8s/deployment.yaml k8s/service.yaml
```

## Env vars

| Variable     | Default   | Description   |
|-------------|-----------|---------------|
| PORT        | 3002      | Server port   |
| DB_HOST     | localhost | Postgres host |
| DB_PORT     | 5432     | Postgres port |
| DB_USER     | postgres  | DB user       |
| DB_PASSWORD | postgres  | DB password   |
| DB_NAME     | user_db   | Database name |
