# Contributing to Authensure Node.js SDK

Thank you for your interest in contributing to the Authensure Node.js SDK! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Please be considerate in your communications and contributions.

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone git@github.com:YOUR_USERNAME/authensure-node.git
   cd authensure-node
   ```

3. Add the upstream remote:
   ```bash
   git remote add upstream git@github.com:Authensure/authensure-node.git
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Build the project:
   ```bash
   npm run build
   ```

6. Run tests to verify setup:
   ```bash
   npm test
   ```

## Development Workflow

### Branch Naming

Create a branch for your changes using one of these prefixes:

- `feature/` - New features (e.g., `feature/add-batch-operations`)
- `fix/` - Bug fixes (e.g., `fix/retry-logic-timeout`)
- `docs/` - Documentation changes (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/http-client`)
- `test/` - Test additions or fixes (e.g., `test/webhook-verification`)

```bash
git checkout -b feature/your-feature-name
```

### Making Changes

1. Keep your fork updated:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Make your changes in your feature branch

3. Write or update tests for your changes

4. Ensure all tests pass:
   ```bash
   npm test
   ```

5. Run the linter:
   ```bash
   npm run lint
   ```

6. Build to verify compilation:
   ```bash
   npm run build
   ```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, missing semicolons, etc.
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(envelopes): add batch send functionality

fix(http-client): handle timeout errors correctly

docs(readme): add webhook examples

test(contacts): add integration tests for list endpoint
```

### Pull Requests

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request against `main` branch

3. Fill out the PR template with:
   - Description of changes
   - Related issue number (if applicable)
   - Testing performed
   - Screenshots (if UI-related)

4. Wait for review and address any feedback

## Code Style

### TypeScript Guidelines

- Use TypeScript strict mode
- Provide explicit types for function parameters and return values
- Use interfaces for object shapes
- Avoid `any` type - use `unknown` if type is truly unknown
- Use `readonly` for properties that shouldn't be modified

```typescript
// Good
interface CreateEnvelopeParams {
  readonly name: string;
  readonly message?: string;
}

async function createEnvelope(params: CreateEnvelopeParams): Promise<Envelope> {
  // implementation
}

// Avoid
async function createEnvelope(params: any) {
  // implementation
}
```

### Naming Conventions

- **Files:** kebab-case (`http-client.ts`, `api-keys.ts`)
- **Classes:** PascalCase (`HttpClient`, `EnvelopesResource`)
- **Functions/Methods:** camelCase (`getEnvelope`, `createContact`)
- **Constants:** SCREAMING_SNAKE_CASE (`DEFAULT_TIMEOUT`, `MAX_RETRIES`)
- **Interfaces/Types:** PascalCase (`Envelope`, `AuthensureConfig`)

### Error Handling

- Use custom error classes from `src/errors.ts`
- Provide meaningful error messages
- Include relevant context in error details

```typescript
// Good
throw new ValidationError('Invalid email format', {
  email: ['Must be a valid email address'],
});

// Avoid
throw new Error('Invalid input');
```

## Testing

### Test Structure

Tests are located in the `tests/` directory and use Vitest.

```
tests/
├── setup.ts          # Test setup and mocks
├── client.test.ts    # Main client tests
├── errors.test.ts    # Error class tests
└── resources/        # Resource-specific tests (optional)
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { Authensure } from '../src';

describe('EnvelopesResource', () => {
  const client = new Authensure({ apiKey: 'test_key' });

  describe('create', () => {
    it('should create an envelope with valid params', async () => {
      const envelope = await client.envelopes.create({
        name: 'Test Envelope',
      });
      
      expect(envelope).toBeDefined();
      expect(envelope.name).toBe('Test Envelope');
    });

    it('should throw ValidationError for missing name', async () => {
      await expect(
        client.envelopes.create({} as any)
      ).rejects.toThrow(ValidationError);
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/client.test.ts
```

## Adding New Features

### Adding a New Resource

1. Create the resource file in `src/resources/`:
   ```typescript
   // src/resources/new-resource.ts
   import { HttpClient } from '../http-client';
   import type { NewResourceType } from '../types';

   export class NewResource {
     constructor(private readonly http: HttpClient) {}

     async list(): Promise<NewResourceType[]> {
       return this.http.get('/new-resource');
     }

     async get(id: string): Promise<NewResourceType> {
       return this.http.get(`/new-resource/${id}`);
     }
   }
   ```

2. Export from `src/resources/index.ts`:
   ```typescript
   export { NewResource } from './new-resource';
   ```

3. Add types to `src/types/index.ts`:
   ```typescript
   export interface NewResourceType {
     id: string;
     name: string;
     // ...
   }
   ```

4. Add to main client in `src/index.ts`:
   ```typescript
   import { NewResource } from './resources';

   export class Authensure {
     public readonly newResource: NewResource;

     constructor(config: AuthensureConfig) {
       // ...
       this.newResource = new NewResource(this.http);
     }
   }
   ```

5. Write tests in `tests/`

6. Update README.md with usage examples

### Adding a New Method

1. Add the method to the appropriate resource class
2. Add any new types to `src/types/index.ts`
3. Write tests for the new method
4. Update README.md

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for public APIs:
  ```typescript
  /**
   * Creates a new envelope for document signing.
   * @param params - The envelope creation parameters
   * @returns The created envelope
   * @throws ValidationError if params are invalid
   * @example
   * const envelope = await client.envelopes.create({
   *   name: 'Contract',
   *   message: 'Please sign',
   * });
   */
  async create(params: CreateEnvelopeParams): Promise<Envelope> {
    // ...
  }
  ```

## Release Process

Releases are managed by maintainers. The process:

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create a GitHub release
4. CI/CD automatically publishes to npm

## Getting Help

- **Questions:** Open a [GitHub Discussion](https://github.com/Authensure/authensure-node/discussions)
- **Bugs:** Open a [GitHub Issue](https://github.com/Authensure/authensure-node/issues)
- **Security:** Email security@authensure.app (do not open public issues)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Authensure! 🎉
