import { describe, it, expect } from 'vitest';
import {
  AuthensureError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  NetworkError,
  TimeoutError,
} from '../src/errors';

describe('AuthensureError', () => {
  it('should create error with correct properties', () => {
    const error = new AuthensureError('Test error', 'TEST_ERROR', 400, { field: 'value' });
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_ERROR');
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual({ field: 'value' });
    expect(error.name).toBe('AuthensureError');
  });

  it('should create error from response', () => {
    const error = AuthensureError.fromResponse({ message: 'Bad request' }, 400);
    expect(error.message).toBe('Bad request');
    expect(error.code).toBe('BAD_REQUEST');
    expect(error.statusCode).toBe(400);
  });

  it('should handle different status codes', () => {
    expect(AuthensureError.fromResponse({}, 401).code).toBe('UNAUTHORIZED');
    expect(AuthensureError.fromResponse({}, 403).code).toBe('FORBIDDEN');
    expect(AuthensureError.fromResponse({}, 404).code).toBe('NOT_FOUND');
    expect(AuthensureError.fromResponse({}, 409).code).toBe('CONFLICT');
    expect(AuthensureError.fromResponse({}, 422).code).toBe('UNPROCESSABLE_ENTITY');
    expect(AuthensureError.fromResponse({}, 429).code).toBe('RATE_LIMITED');
    expect(AuthensureError.fromResponse({}, 500).code).toBe('INTERNAL_ERROR');
    expect(AuthensureError.fromResponse({}, 502).code).toBe('BAD_GATEWAY');
    expect(AuthensureError.fromResponse({}, 503).code).toBe('SERVICE_UNAVAILABLE');
    expect(AuthensureError.fromResponse({}, 999).code).toBe('UNKNOWN_ERROR');
  });
});

describe('AuthenticationError', () => {
  it('should create with default message', () => {
    const error = new AuthenticationError();
    expect(error.message).toBe('Authentication failed');
    expect(error.code).toBe('AUTHENTICATION_ERROR');
    expect(error.statusCode).toBe(401);
    expect(error.name).toBe('AuthenticationError');
  });

  it('should create with custom message', () => {
    const error = new AuthenticationError('Invalid token');
    expect(error.message).toBe('Invalid token');
  });
});

describe('RateLimitError', () => {
  it('should create with retry after', () => {
    const error = new RateLimitError('Too many requests', 60);
    expect(error.message).toBe('Too many requests');
    expect(error.code).toBe('RATE_LIMITED');
    expect(error.statusCode).toBe(429);
    expect(error.retryAfter).toBe(60);
    expect(error.name).toBe('RateLimitError');
  });
});

describe('ValidationError', () => {
  it('should create with validation errors', () => {
    const validationErrors = { email: ['Invalid email format'] };
    const error = new ValidationError('Validation failed', validationErrors);
    expect(error.message).toBe('Validation failed');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.statusCode).toBe(422);
    expect(error.validationErrors).toEqual(validationErrors);
    expect(error.name).toBe('ValidationError');
  });
});

describe('NotFoundError', () => {
  it('should create with resource name', () => {
    const error = new NotFoundError('Envelope');
    expect(error.message).toBe('Envelope not found');
    expect(error.code).toBe('NOT_FOUND');
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe('NotFoundError');
  });
});

describe('NetworkError', () => {
  it('should create with message', () => {
    const error = new NetworkError('Connection failed');
    expect(error.message).toBe('Connection failed');
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.statusCode).toBe(0);
    expect(error.name).toBe('NetworkError');
  });
});

describe('TimeoutError', () => {
  it('should create with default message', () => {
    const error = new TimeoutError();
    expect(error.message).toBe('Request timed out');
    expect(error.code).toBe('TIMEOUT');
    expect(error.statusCode).toBe(0);
    expect(error.name).toBe('TimeoutError');
  });
});
