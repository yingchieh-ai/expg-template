# expg-template

Express and PostgreSQL backend service template.

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

A robust, type-safe template for building backend services with Node.js, Express, and PostgreSQL. Designed for developer efficiency with integrated AI tooling and modern configurations.

## Development

### Technologies

This project uses the following technologies:

- **Runtime**: Node.js (>=24)
- **Language**: TypeScript (v6.0+)
- **Framework**: Express (v5.0+)
- **ORM**: Drizzle ORM with `pg`
- **Package Manager**: pnpm
- **Middleware**: `cors`, `cookie-parser`, `dotenv`
- **Tooling**: ESLint, Prettier, Husky, lint-staged
- **Development Runner**: tsx

### Available Scripts

- `pnpm dev`: Start the development server with watch mode.
- `pnpm build`: Compile TypeScript to JavaScript.
- `pnpm start`: Run the production build.
- `pnpm test`: Run tests.
- `pnpm lint`: Run ESLint to check for code quality issues.
- `pnpm type-check`: Run TypeScript compiler in no-emit mode for type checking.
- `pnpm dev:db:generate`: Generate a new Drizzle migration from schema changes.
- `pnpm dev:db:migrate`: Apply pending migrations via drizzle-kit (development only).
- `pnpm db:migrate`: Apply pending migrations via the production migration runner.

### Getting Started

1. **Initialize**: Use this template to create a new repository.
2. **Clone**: `git clone <your-repo-url>`
3. **Install**: `pnpm install`
4. **Environment**: Copy `.env.example` to `.env` and configure your variables.
5. **Develop**: `pnpm dev`

## Database

Schema is defined in `src/db/schema/` using Drizzle ORM. Migrations are generated into `migrations/` and are committed to the repository.

**Development workflow:**

```bash
# 1. Edit src/db/schema/*.ts
# 2. Generate the migration SQL
pnpm dev:db:generate
# 3. Apply it to your local database
pnpm dev:db:migrate
```

Migrations are baked into the Docker image at build time, so the production release package is self-contained — no source tree is needed on the server.

## Authentication

This template ships with Google OAuth 2.0 authentication and JWT-based sessions.

### Environment Variables

| Variable               | Description                                                               |
| ---------------------- | ------------------------------------------------------------------------- |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                                                    |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret                                                |
| `GOOGLE_REDIRECT_URI`  | OAuth callback URL (e.g. `http://localhost:5000/auth/google/callback`)    |
| `JWT_SECRET`           | Secret used to sign JWTs                                                  |
| `JWT_EXPIRES_IN`       | Token lifetime — `7d`, `24h`, `30m`, `5s`, or bare seconds (default `7d`) |
| `CLIENT_REDIRECT_URL`  | Frontend URL to redirect to after successful login                        |

### Endpoints

| Method | Path                    | Description                                    |
| ------ | ----------------------- | ---------------------------------------------- |
| GET    | `/auth/google`          | Initiates Google OAuth flow                    |
| GET    | `/auth/google/callback` | Handles OAuth callback and issues a JWT cookie |

### CSRF Protection

All state-changing requests (`POST`, `PUT`, `PATCH`, `DELETE`) require a CSRF token.
The token is issued as the `__csrf` cookie; clients must echo it back in the `x-csrf-token` header.

## Deployment

### Prerequisites

- Docker
- Docker Compose v2

### Environment Setup

Copy `.env.example` to `.env` on the target server and fill in the required values:

| Variable        | Description                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| `APP_NAME`      | Used as a prefix for container names                                            |
| `APP_IMAGE`     | Full image reference to deploy, e.g. `ghcr.io/your-org/your-app:v0.2.0`         |
| `LOCAL_DB`      | `true` if the database runs on the same server; `false` for a remote/managed DB |
| `DATABASE_HOST` | Set to `db` when `LOCAL_DB=true`; set to the remote hostname otherwise          |

### Deployment Topologies

| Topology                     | `LOCAL_DB` | `DATABASE_HOST`       | Notes                                |
| ---------------------------- | ---------- | --------------------- | ------------------------------------ |
| Single-server (db + app)     | `true`     | `db`                  | DB and app share one Docker network  |
| App-only (remote/managed DB) | `false`    | remote hostname or IP | DB not managed by this server        |
| DB-only server               | —          | —                     | Only `docker-compose.db.yml` is used |

### Deploy

```bash
./scripts/deploy.sh v0.2.0
```

`deploy.sh` updates `APP_IMAGE` in `.env`, pulls the image, and runs `docker compose up -d`. Migrations are applied before the app container starts — the app never starts if migrations fail.

### Upgrade

```bash
./scripts/deploy.sh v0.2.0
```

### Rollback

```bash
./scripts/rollback.sh ghcr.io/your-org/your-app:v0.1.0
```

### Build Image

#### CI (automatic, multi-platform)

Push a version tag to trigger the GitHub Actions release workflow, which builds a `linux/amd64` + `linux/arm64` image and pushes it to `ghcr.io`:

```bash
git tag v0.2.0
git push origin v0.2.0
```

The image is published as `ghcr.io/<owner>/<repo>:0.2.0`. No secrets need to be configured — the workflow uses the built-in `GITHUB_TOKEN`.

#### Local (single-arch, for testing)

```bash
./scripts/build.sh v0.2.0
docker push ghcr.io/your-org/your-app:v0.2.0
```

## AI Tools Support

### Gemini CLI

This project includes custom Gemini CLI commands to streamline development workflows.

#### Available Commands

- `/docs/release/changelog`: Automate `CHANGELOG.md` updates.
- `/docs/release/release-notes`: Generate user-facing release notes.
- `/docs/release/readme`: Synchronize `README.md` with release details.
- `/git/commit/code-review`: Perform AI-powered code reviews.

#### Setup

Load the custom commands in your Gemini CLI session:  
`/commands reload`

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
