# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains the React Native (Expo) client. Entry points are `app/App.js` and `app/index.js`. Feature code lives in `app/src/`, tests in `app/__tests__/`, and static assets in `app/assets/`.
- `rate-repository-api/` contains the Node.js GraphQL API. Main code is under `rate-repository-api/src/`, database migrations in `rate-repository-api/migrations/`, and seed data in `rate-repository-api/seeds/`.

## Build, Test, and Development Commands
- Client (`app/`):
  - `npm start` runs the Expo dev server.
  - `npm run android` / `npm run ios` / `npm run web` launches the app on the target platform.
  - `npm test` runs Jest unit tests.
  - `npm run lint` runs ESLint for JS/JSX.
- API (`rate-repository-api/`):
  - `npm run build` runs database migrations.
  - `npm start` starts the API server.
  - `npm run start:dev` starts the API with nodemon.
  - `npm run seed:run` loads seed data (overwrites existing data).
  - `npm test` runs Jest tests.
  - `npm run lint` runs ESLint.

## Coding Style & Naming Conventions
- JavaScript/JSX with 2-space indentation across the repo.
- Linting: `app/` uses `eslint.config.mjs` with React/React Native rules; `rate-repository-api/` uses `.eslintrc`.
- Test files follow `*.test.js` naming (examples in `app/__tests__/`).

## Testing Guidelines
- Client tests use Jest with `jest-expo` and Testing Library; run from `app/` with `npm test`.
- API tests use Jest; run from `rate-repository-api/` with `npm test`.
- Prefer colocating new tests next to existing test suites (e.g., `app/__tests__/Feature.test.js`).

## Commit & Pull Request Guidelines
- Commit messages follow a conventional format seen in history, e.g., `feat: ...`, `test: ...`, `refactor: ...`.
- PRs should include: a concise description, testing notes (commands + results), and screenshots for UI changes in `app/`.

## Security & Configuration Tips
- API requires Node.js v20+ and a `.env` based on `rate-repository-api/.env.template` (GitHub OAuth creds + `JWT_SECRET`).
- If `PORT` is changed in API `.env`, update the GitHub OAuth callback URL to match.
