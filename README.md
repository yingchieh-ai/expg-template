# expg-template

Express and PostgreSQL backend service template.

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

A robust, type-safe template for building backend services with Node.js, Express, and PostgreSQL. Designed for developer efficiency with integrated AI tooling and modern configurations.

## Development

### Technologies

This project uses the following technologies:

- **Runtime**: Node.js (>=24)
- **Language**: TypeScript (v6.0+)
- **Framework**: Express (v5.0+)
- **Package Manager**: pnpm
- **Middleware**: `cors`, `cookie-parser`, `dotenv`
- **Tooling**: ESLint, Prettier, Husky, lint-staged
- **Development Runner**: tsx

### Available Scripts

- `pnpm dev`: Start the development server with watch mode.
- `pnpm build`: Compile TypeScript to JavaScript.
- `pnpm start`: Run the production build.
- `pnpm lint`: Run ESLint to check for code quality issues.
- `pnpm type-check`: Run TypeScript compiler in no-emit mode for type checking.

## Usage

1. **Initialize**: Use this template to create a new repository.
2. **Clone**: `git clone <your-repo-url>`
3. **Install**: `pnpm install`
4. **Environment**: Copy `.env.example` to `.env` and configure your variables.
5. **Develop**: `pnpm dev`

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
