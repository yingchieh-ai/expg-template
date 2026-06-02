# Release Notes

This file contains user-facing release notes for all versions of this project.

---

## Release Notes - v0.2.0 (2026-06-01)

### Executive Summary

v0.2.0 transforms the base scaffold into a production-ready backend. This release adds end-to-end Google OAuth 2.0 authentication with JWT sessions, CSRF protection, a fully integrated PostgreSQL database layer with schema migrations, and Docker-based containerization with one-command deploy and rollback scripts.

### Key Features

- **Authentication**: Full Google OAuth 2.0 flow issuing signed JWT session cookies. Token lifetime is configurable via `JWT_EXPIRES_IN` (e.g. `7d`, `24h`, `30m`) with a `parseDuration()` utility handling flexible formats.
- **Security**: CSRF double-submit cookie pattern protects all state-changing requests. Validation uses timing-safe comparison; safe HTTP methods are exempted automatically.
- **Database**: Drizzle ORM `users` table with UUID primary key, email, OAuth provider fields, login tracking, and soft-delete support. Migrations are generated with `drizzle-kit` and committed to the repository.
- **Containerization & Deployment**: Multi-stage `Dockerfile` (Node.js 24-alpine, pnpm). Docker Compose wires a `migrate` service that runs before the `app` service starts, ensuring the database is always up to date. `docker-compose.db.yml` provides an optional local PostgreSQL 17 service. `scripts/build.sh`, `scripts/deploy.sh`, and `scripts/rollback.sh` cover the full image lifecycle.
- **Graceful Shutdown**: Handles `SIGTERM` and `SIGINT` by draining the HTTP server and closing the database pool before exit — enabling zero-downtime rolling deployments.
- **Testing**: Unit test suite using the Node.js native test runner covers JWT issuance/verification, CSRF middleware behavior, and duration parsing edge cases.

### Getting Started

To get started with this template, refer to the [README.md](README.md) for installation, authentication setup, and deployment instructions.

---

## Release Notes - v0.1.0 (2026-05-04)

### Executive Summary

This is the initial release of the `expg-template` project, providing a robust foundation for Express and PostgreSQL backend services. This release establishes the core architecture, essential security middleware, and advanced developer tooling to streamline the development lifecycle.

### Key Features

- **Modern Backend Architecture**: A fully scaffolded Express application using TypeScript, providing type safety and modern JavaScript features out of the box.
- **Enhanced Developer Experience**:
  - **Intelligent CLI Integration**: Custom Gemini CLI commands for automated code reviews, command refinement, and release documentation (`changelog`, `release-notes`, `readme`).
  - **Advanced Debugging**: Pre-configured VS Code launch settings for both standard and watch-mode debugging.
- **Security & Middleware**:
  - **Configurable CORS**: Flexible Cross-Origin Resource Sharing (CORS) setup with support for environment-based whitelisting.
  - **Cookie Management**: Integrated `cookie-parser` for seamless cookie handling.
- **Ready-to-Use Tooling**: Integrated ESLint, Prettier, and Husky for consistent code style and automated pre-commit checks.

### Getting Started

To get started with this template, refer to the [README.md](README.md) for installation and usage instructions.
