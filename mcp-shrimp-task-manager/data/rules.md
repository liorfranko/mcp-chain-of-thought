# Development Guidelines for Shrimp Task Manager

## Project Overview

- Shrimp Task Manager is an **MCP-compatible task management system** for AI agents
- **Primary function**: Provide structured workflow for programming tasks, with task decomposition, tracking, and verification
- **Technology stack**: TypeScript, Node.js, Zod validation, Model Context Protocol
- **Core feature set** includes task planning, analysis, reflection, splitting, execution, verification, and completion

## Project Architecture

### Directory Structure

- **/src/models/**: Data manipulation layer, interfaces with file storage
  - `taskModel.ts`: Core task CRUD operations, no direct file operations outside this file
- **/src/types/**: Type definitions for the entire application
  - `index.ts`: Contains essential interfaces and enums for task management
  - `thoughtChain.ts`: Defines structures for thought process tracking
- **/src/tools/**: MCP-compatible tool implementations
  - `taskTools.ts`: Main task management operations
  - `thoughtChainTools.ts`: Thought process utilities  
  - `projectTools.ts`: Project rules initialization
- **/src/prompts/**: Template system for AI interactions
  - Organized by language and tool function
  - Templates follow specific structures defined in each tool
- **/src/utils/**: Shared utility functions
  - `pathUtils.ts`: File path operations
  - `summaryExtractor.ts`: Text analysis utilities
  - `fileLoader.ts`: File loading functions

### Module Interactions

- All tools must handle their respective validation using Zod schemas
- All tools must communicate with data layer through model functions
- All user-facing content must be generated through prompt templates

## Coding Standards

### TypeScript Requirements

- **Always** use strong typing for all function parameters and return values
- **Always** define interfaces for complex data structures in `src/types/`
- **Always** use async/await for asynchronous operations
- **Never** use `any` type without explicit comment justification

### Validation Requirements

- **All tool input** must be validated using Zod schemas
- Schema definitions must be exported and placed above their respective functions
- Error messages must be descriptive and actionable

### Error Handling

- **Always** use try/catch blocks for operations that may fail
- **Always** return structured error responses with specific error messages
- **Never** throw unhandled exceptions in tool implementations

## Feature Implementation Standards

### Adding New Tools

1. **Define types** in `/src/types/index.ts` first
2. **Create Zod schema** for validation
3. **Implement model functions** in appropriate model file
4. **Create prompt templates** in `/src/prompts/templates_en/{toolName}/`
5. **Implement tool function** in appropriate tool file
6. **Export tool** in main index.ts file

### Example: New Tool Implementation

```typescript
// 1. In src/types/index.ts
export interface NewToolArgs {
  parameter1: string;
  parameter2?: number;
}

// 2. In src/tools/taskTools.ts
export const newToolSchema = z.object({
  parameter1: z.string().min(1, { message: "Parameter1 is required" }),
  parameter2: z.number().optional()
});

// 3. In src/tools/taskTools.ts (implementation)
export async function newTool({
  parameter1,
  parameter2
}: z.infer<typeof newToolSchema>) {
  try {
    // Implementation logic
    const prompt = getNewToolPrompt({ parameter1, parameter2 });
    return {
      content: [{ type: "text" as const, text: prompt }],
    };
  } catch (error) {
    // Error handling
  }
}
```

### Modifying Existing Tools

- **Always** update the corresponding Zod schema when changing parameters
- **Always** update prompt templates when changing functionality
- **Always** maintain backward compatibility or provide migration path

## Library Usage Standards

### External Dependencies

- Use `uuid` for generating unique identifiers
- Use `zod` for all input validation
- Use `@modelcontextprotocol/sdk` for MCP compliance
- **Never** add new dependencies without updating package.json

### File System Interactions

- **Only** perform file operations in model layer
- **Always** use asynchronous fs methods with promises
- **Always** use path.join() for path manipulation
- **Always** respect DATA_DIR environment variable for data storage

## Workflow Standards

### Task Lifecycle

1. **Planning**: Initial task description and requirements gathering
2. **Analysis**: Detailed technical analysis and solution exploration
3. **Reflection**: Critical review of analysis results
4. **Task Splitting**: Breaking down complex tasks into smaller ones
5. **Execution**: Implementing individual tasks
6. **Verification**: Ensuring task meets requirements
7. **Completion**: Finalizing and summarizing task results

### Task State Transitions

- Tasks progress through states: PENDING → IN_PROGRESS → COMPLETED
- Tasks with incomplete dependencies remain in BLOCKED state
- **Never** allow completed tasks to revert to earlier states
- **Only** allow updates to summary and relatedFiles for completed tasks

## Key File Interactions

### Critical Update Rules

- When modifying `src/types/index.ts`:
  - **Must update** all tool files using affected types
  - **Must update** all model files using affected types

- When adding new tool:
  - **Must add** corresponding prompt templates
  - **Must update** main index.ts export

- When modifying task model:
  - **Must ensure** backward compatibility with existing tasks.json files
  - **Must update** types if schema changes

### Synchronized Modifications

| When changing this... | Also update these files |
|----------------------|-------------------------|
| Task interface | taskModel.ts, taskTools.ts, types/index.ts |
| Prompt templates | Corresponding tool implementation |
| Tool schemas | Corresponding type definitions |

## AI Decision Standards

### Task Prioritization

1. Tasks with no remaining dependencies should be prioritized
2. Tasks with lower complexity should be preferred when dependencies are equal
3. Tasks related to core functionality should be prioritized over enhancements

### Error Resolution Strategy

1. Always attempt to fix validation errors first
2. For file system errors, check for permissions or missing directories
3. For business logic errors, verify the task workflow requirements

## Prohibitions

- **NEVER** bypass the model layer for data persistence
- **NEVER** modify task JSON files directly
- **NEVER** change the fundamental task workflow sequence
- **NEVER** remove existing tool functionality without providing alternatives
- **NEVER** use synchronous file system operations
- **NEVER** hardcode file paths (use environment variables and path utilities)
- **NEVER** modify completed tasks (except for allowed fields like summary)
- **NEVER** commit with debugging console.log statements