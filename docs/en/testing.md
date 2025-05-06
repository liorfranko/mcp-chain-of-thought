# Testing Guide for MCP Chain of Thought

The MCP Chain of Thought project utilizes multiple testing approaches to ensure code reliability and functionality. This guide explains the available testing methods and when to use each one.

## Testing Approaches

### 1. Jest Tests (Standard)

The project uses Jest as its primary testing framework for comprehensive unit and integration testing. Jest tests are located in `__tests__` directories throughout the codebase.

**To run Jest tests:**
```bash
npm test
```

When working with Jest tests, keep in mind:
- The project uses ESM modules, which requires special configuration
- Jest runs with the `--experimental-vm-modules` flag
- TypeScript files are transformed using ts-jest

### 2. Simplified Tests

For more targeted and resilient testing of specific components, we've implemented simplified test scripts that don't rely on the Jest framework. These tests:
- Are independent of Jest's configuration
- Run directly with Node.js
- Focus on validating core functionality
- Are more resilient to module system changes

**To run simplified tests:**
```bash
npm run simple-test
```

Simplified tests are particularly useful for:
- Testing browser-specific functionality (like SSE)
- Verifying critical components when running into Jest configuration issues
- Quick validation of specific functionality

## When to Use Each Approach

| Use Jest Tests When... | Use Simplified Tests When... |
|------------------------|------------------------------|
| You need comprehensive test coverage | You're focusing on a specific component |
| You want to leverage mocking and assertions | Jest configuration issues arise |
| You're writing integration tests | You're testing browser API functionality |
| Adding new features with test coverage | You need a quick targeted test |

## Creating New Tests

### Adding New Jest Tests

1. Create a new file in the appropriate `__tests__` directory with a `.test.js` extension
2. Import Jest and the modules to test
3. Use Jest's `describe` and `test` functions to organize tests
4. Use Jest's expect API for assertions

Example:
```javascript
import { jest } from '@jest/globals';
import { functionToTest } from '../module.js';

describe('Module Tests', () => {
  test('should work correctly', () => {
    expect(functionToTest()).toBe(true);
  });
});
```

### Adding New Simplified Tests

1. Create a new file with a descriptive name (e.g., `simple-component-test.js`)
2. Import the Node.js assertion module
3. Set up any necessary mocks
4. Write test functions that use assertions
5. Add the test to package.json scripts if needed

Example:
```javascript
import assert from 'assert';

// Mock dependencies
// ...

// Function to test
function testFunctionality() {
  // ...
}

// Test cases
function runTests() {
  assert.strictEqual(testFunctionality(), true, 'Should return true');
  // More assertions...
}

// Run tests
try {
  runTests();
  console.log('All tests passed!');
} catch (error) {
  console.error('Test failed:', error);
}
```

## Debugging Tests

For Jest tests:
```bash
NODE_OPTIONS=--inspect-brk npm test -- --runInBand
```

For simplified tests:
```bash
node --inspect-brk src/path/to/test-file.js
```

## Best Practices

1. **Prefer Jest** for comprehensive testing where possible
2. **Use simplified tests** for browser API tests or when encountering Jest limitations
3. **Keep tests focused** on specific functionality
4. **Mock external dependencies** appropriately
5. **Ensure test isolation** by cleaning up state between tests

## Table of Contents

- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Creating New Tests](#creating-new-tests)
- [Mocking Strategies](#mocking-strategies)
- [Code Coverage](#code-coverage)
- [Common Testing Patterns](#common-testing-patterns)

## Running Tests

### Basic Test Execution

To run all tests:

```bash
npm test
```

To run tests with coverage:

```bash
npm test -- --coverage
```

To run specific test files:

```bash
npm test -- src/models/__tests__/taskModel.test.js
```

### Test Environment

Tests run in a Node.js environment using Jest. The test environment is configured in `jest.config.js`.

## Test Structure

The test suite is organized into three main categories:

### 1. Unit Tests

Located in respective `__tests__` directories next to the source code they test:

- `src/models/__tests__/`: Tests for data models
- `src/tools/__tests__/`: Tests for tool implementations

### 2. Integration Tests

Located in `src/__tests__/integration/`:

- Tests complete workflows from task creation to completion
- Verifies interactions between multiple components

### 3. Utility Tests

Located in `src/tools/__tests__/helpers/`:

- Tests for test utilities and mocking helpers

## Mocking Strategies

### File System Mocking

For file system operations, we use in-memory file system mocks:

```javascript
// Example of mocking file operations
import { mockFileSystem } from '../path/to/mock/helpers';

beforeEach(() => {
  // Set up mock file system
  mockFileSystem({
    'mock/path/file.json': JSON.stringify({ data: 'test' })
  });
});
```

### UUID Mocking

For deterministic testing with UUIDs:

```javascript
// Example of mocking UUID generation
import { mockUuid } from '../path/to/mock/helpers';

beforeEach(() => {
  // Set predetermined UUIDs for predictable test results
  mockUuid(['uuid-1', 'uuid-2', 'uuid-3']);
});
```

### Time Mocking

For time-dependent operations:

```javascript
// Example of mocking time
import { mockDate } from '../path/to/mock/helpers';

beforeEach(() => {
  // Set a fixed date/time
  mockDate('2023-01-01T00:00:00Z');
});
```

## Code Coverage

Coverage requirements are configured in `jest.config.js`:

```javascript
// Coverage thresholds
coverageThreshold: {
  global: {
    branches: 75,
    functions: 75,
    lines: 75,
    statements: 75
  }
}
```

Coverage reports are generated in the `coverage` directory, including:
- HTML reports (`coverage/lcov-report/index.html`)
- LCOV format for CI/CD integration

## Common Testing Patterns

### Testing Task Model CRUD Operations

```javascript
// Example of testing CRUD operations
it('should create and retrieve a task', async () => {
  // Create task
  const taskId = await taskModel.createTask({
    name: 'Test Task',
    description: 'Test Description'
  });
  
  // Retrieve task
  const task = await taskModel.getTask(taskId);
  
  // Verify task
  expect(task).toMatchObject({
    id: taskId,
    name: 'Test Task',
    description: 'Test Description',
    status: 'pending'
  });
});
```

### Testing Status Transitions

```javascript
// Example of testing status transitions
it('should transition task from pending to in_progress', async () => {
  // Create task
  const taskId = await taskModel.createTask({
    name: 'Status Test',
    description: 'Testing status transitions'
  });
  
  // Transition status
  await taskModel.updateTask(taskId, { status: 'in_progress' });
  
  // Verify status change
  const task = await taskModel.getTask(taskId);
  expect(task.status).toBe('in_progress');
});
```

### Testing Dependencies

```javascript
// Example of testing task dependencies
it('should handle dependent tasks correctly', async () => {
  // Create dependency task
  const dependencyId = await taskModel.createTask({
    name: 'Dependency Task',
    description: 'A task that others depend on'
  });
  
  // Create dependent task
  const taskId = await taskModel.createTask({
    name: 'Dependent Task',
    description: 'Task with dependency',
    dependencies: [dependencyId]
  });
  
  // Verify dependency
  const task = await taskModel.getTask(taskId);
  expect(task.dependencies).toContain(dependencyId);
  
  // Verify dependency blocks task execution
  const canExecute = await taskModel.canExecuteTask(taskId);
  expect(canExecute).toBe(false);
  
  // Complete dependency
  await taskModel.updateTask(dependencyId, { status: 'completed' });
  
  // Verify task can now be executed
  const canExecuteNow = await taskModel.canExecuteTask(taskId);
  expect(canExecuteNow).toBe(true);
});
```

### Testing Schema Validation

```javascript
// Example of testing schema validation
it('should reject invalid task schema', async () => {
  // Attempt to create invalid task
  await expect(
    taskModel.createTask({
      // Missing required 'name' field
      description: 'Invalid task'
    })
  ).rejects.toThrow();
}); 