# Contributing to AcquiTrack

Welcome to AcquiTrack! This document provides information about contributing to the project.

## Development Setup

### Prerequisites

- Node.js 20.x or later
- npm (comes with Node.js)
- Git

### Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/brooks-t/acquitrack.git
   cd acquitrack
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install Playwright browsers (for e2e tests):
   ```bash
   npx playwright install
   ```

## Development Commands

### Running the Application

```bash
# Start development server
npm start

# The application will be available at http://localhost:4200
```

### Building

```bash
# Development build
npm run build

# Production build
npm run build:prod
```

### Testing

```bash
# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with coverage report
npm run test:coverage

# Run end-to-end tests
npm run e2e

# Run e2e tests with UI mode
npm run e2e:ui
```

### Code Quality

```bash
# Run linting
npm run lint

# Run linting with auto-fix
npm run lint:fix

# Format code
npm run format

# Check code formatting
npm run format:check
```

## Code Standards

### Linting and Formatting

- ESLint is configured for TypeScript and Angular
- Prettier handles code formatting
- Pre-commit hooks ensure code quality before commits

### Testing

- Unit tests use Jest with Testing Library
- E2E tests use Playwright
- Aim for 80%+ code coverage
- Write tests for new features and bug fixes

### Git Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting: `npm run precommit`
4. Commit your changes (pre-commit hooks will run automatically)
5. Push to your branch and create a pull request

### Component Naming

- Use the `at` prefix for component selectors (AcquiTrack)
- Follow Angular style guide conventions
- Use kebab-case for component selectors
- Use camelCase for directive selectors

## Project Structure

```
src/
├── app/                 # Application modules and components
├── assets/             # Static assets
├── environments/       # Environment configurations
└── styles.css         # Global styles

e2e/                    # End-to-end tests
```

## Commit Message Format

We follow conventional commits:

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding or updating tests
- `chore:` maintenance tasks

Example: `feat: add customer acquisition tracking`

## Questions?

Feel free to open an issue for any questions about contributing to AcquiTrack.
