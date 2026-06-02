# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-06-01

### Added

- Google OAuth 2.0 authentication flow with `GET /auth/google` and `GET /auth/google/callback` endpoints.
- JWT token issuance and verification with configurable expiration via `JWT_EXPIRES_IN`.
- `parseDuration()` utility supporting `7d`, `24h`, `30m`, `5s`, or bare-seconds formats with a 7-day fallback.
- CSRF protection middleware using the double-submit cookie pattern; timing-safe comparison; safe HTTP methods (GET, HEAD, OPTIONS) exempted.
- Drizzle ORM integration with a `users` table (UUID PK, email, OAuth provider fields, login tracking, timestamps, active flag).
- Granular database environment variables: `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_DB`.
- Database migration runner (`src/db/migrate.ts`) executed automatically at container startup before the app starts.
- Multi-stage `Dockerfile` using Node.js 24-alpine and pnpm via corepack; TypeScript compiled to `dist/`.
- `docker-compose.yml` with `migrate` and `app` services; app depends on migration success.
- `docker-compose.db.yml` for a local PostgreSQL 17-alpine service with volume persistence and health checks.
- `scripts/build.sh`, `scripts/deploy.sh`, and `scripts/rollback.sh` for image building and deployment lifecycle management.
- Graceful shutdown on `SIGTERM`/`SIGINT`: closes HTTP server and database connection pool.
- Unit tests for JWT signing/verification, CSRF middleware, and `parseDuration()` using the Node.js native test runner.
- New runtime dependencies: `drizzle-orm`, `pg`, `google-auth-library`, `jsonwebtoken`.
- New dev dependencies: `drizzle-kit`, `@types/jsonwebtoken`, `@types/pg`.
- Extended `.env.example` with auth (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `CLIENT_REDIRECT_URL`), JWT (`JWT_SECRET`, `JWT_EXPIRES_IN`), and Docker (`APP_NAME`, `APP_IMAGE`, `LOCAL_DB`) variables.

## [0.1.0] - 2026-05-04

### Added

- Scaffolded Express TypeScript backend template.
- Integrated `cookie-parser` middleware.
- Configured CORS with environment-based whitelist support.
- Added VS Code launch configurations for standard and watch-mode debugging.
- Introduced custom Gemini CLI commands for code review, command refinement, and release automation (`changelog`, `release-notes`).
