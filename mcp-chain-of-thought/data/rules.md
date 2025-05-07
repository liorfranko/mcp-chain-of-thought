# Development Guidelines for Chain of Thought MCP

## Project Overview

- **Version**: 1.0.1
- **Purpose**: MCP-compatible task management system for AI agents
- **Core Features**:
  - Task planning and analysis
  - Task decomposition and dependency tracking
  - Thought chain processing
  - Task execution and verification
  - Project rules management
- **Technology Stack**:
  - TypeScript 5.2+
  - Node.js LTS
  - Model Context Protocol SDK
  - Zod validation
  - Express (for GUI mode)
  - Jest for testing
  - GitHub Actions for CI/CD

## Project Architecture

### Directory Structure

- **/src/**
  - **/models/**: Data layer implementation
    - `taskModel.ts`: Core task CRUD operations
  - **/types/**: Type definitions
    - `index.ts`: Core interfaces and enums
  - **/tools/**: MCP tool implementations
    - `taskTools.ts`: Task management operations
    - `thoughtChainTools.ts`: Thought processing
    - `projectTools.ts`: Project configuration
  - **/prompts/**: AI interaction templates
    - Organized by language and tool function
  - **/utils/**: Shared utilities
    - `fileLoader.ts`: File operations
    - `summaryExtractor.ts`: Text analysis
  - **/__tests__/**: Test files and utilities
    - **/integration/**: Integration tests
    - **/helpers/**: Test utilities and mock factories
- **/dist/**: Compiled JavaScript output
- **/docs/**: Project documentation
  - **/en/**: English documentation
    - `testing.md`: Testing documentation
- **/data/**: Runtime data storage
  - **/memory/**: Thought chain storage
  - `tasks.json`: Task database
  - `rules.md`: This file
- **/.github/**: GitHub configuration
  - **/workflows/**: GitHub Actions workflows
    - `publish.yml`: NPM publishing workflow
    - `tests.yml`: Testing workflow

### Module Interactions

- **Data Flow**:
  - Tools → Models → File System
  - All file operations through models only
  - All validation through Zod schemas
  - All prompts through template system

### File Modification Rules

- **Synchronized Updates Required**:
  - Modifying `types/index.ts` requires updating related models
  - Changes to tool schemas require prompt template updates
  - New features need documentation in both code and docs
  - Version changes must be reflected in all relevant files
  - Test changes must be reflected in documentation

## Development Standards

### TypeScript Requirements

- **MUST** use strict typing for all functions
- **MUST** define interfaces in `types/index.ts`
- **MUST** use async/await for file operations
- **MUST** validate all inputs with Zod schemas

### Code Organization

- **File Naming**:
  - Use camelCase for files
  - Add type suffix for interfaces (e.g., `taskType.ts`)
  - Add Tool suffix for MCP tools
  - Add .test.js suffix for test files
- **Code Structure**:
  - Export interfaces and types at top
  - Group related functions together
  - Document complex logic with comments

### Testing Requirements

- **Unit Tests**:
  - Required for all model functions
  - Required for utility functions
  - Must cover error cases
  - Must use proper mocking for external dependencies
- **Integration Tests**:
  - Required for tool implementations
  - Must verify MCP compatibility
  - Must test complete workflows
- **Test Organization**:
  - Mirror source code structure in test organization
  - Group tests by functionality
  - Use descriptive test names
- **Test Coverage**:
  - Maintain >80% coverage for critical paths
  - CI/CD pipeline validates coverage on PRs
  - Coverage reports available in HTML format
- **Testing Utilities**:
  - Use common test helpers for repeated operations
  - Use fixture factories for consistent test data
  - Properly mock file system operations

## Configuration Management

### Environment Variables

- **Required**:
  - `DATA_DIR`: Absolute path to data storage
  - `TEMPLATES_USE`: Language code (default: "en")
- **Optional**:
  - `ENABLE_THOUGHT_CHAIN`: Enable thought processing
  - `ENABLE_GUI`: Enable web interface
  - `PORT`: GUI server port (default: auto-assigned)

### MCP Integration

- **Tool Registration**:
  - All tools must implement MCP interfaces
  - All tools must provide JSON schemas
  - All tools must handle their own validation
- **Response Format**:
  - Must return valid MCP response objects
  - Must include proper error handling
  - Must provide meaningful error messages

### Data Directory Setup

- **Structure**:
  - Must maintain separate data dirs per project
  - Must use absolute paths in configuration
  - Must handle directory creation gracefully

## Tool Usage Guidelines

### Task Management

- **Task Creation**:
  - Must provide clear descriptions
  - Must specify all dependencies
  - Must include related files when relevant
- **Task Updates**:
  - Must preserve task history
  - Must validate status transitions
  - Must update all related entities
- **Task Evaluation**:
  - Must evaluate task complexity before execution
  - Must split complex tasks when appropriate
  - Must document complex implementation decisions

### Thought Chain Processing

- **Chain Rules**:
  - Must follow sequential thinking pattern
  - Must provide clear stage transitions
  - Must challenge assumptions when needed
- **Memory Management**:
  - Must clean up old thought chains
  - Must maintain thought context
  - Must handle chain breaks gracefully

### File Operations

- **Path Handling**:
  - Must use relative paths in task definitions
  - Must resolve absolute paths at runtime
  - Must validate file existence before operations
- **Content Management**:
  - Must preserve file formatting
  - Must handle large files efficiently
  - Must backup modified files

## Prohibitions

- **NEVER** modify task IDs
- **NEVER** delete completed tasks
- **NEVER** bypass validation schemas
- **NEVER** perform direct file operations
- **NEVER** modify thought chain history
- **NEVER** hardcode absolute paths
- **NEVER** include sensitive data in tasks
- **NEVER** skip dependency checks
- **NEVER** merge code without passing tests
- **NEVER** disable test coverage checks