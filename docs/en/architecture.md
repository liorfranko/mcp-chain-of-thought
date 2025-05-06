# Architecture Design Document for Chain of Thought

[English](../en/architecture.md)

## 1. System Overview

The Chain of Thought is designed based on the MCP (Model-Chain-Protocol) framework architecture, implementing a task management system with memory capability. The system's primary functionality is to assist Large Language Models (LLMs) in efficiently managing complex task execution processes.

## 2. Design Goals

The core design goals of the Chain of Thought include:

- **Memory Enhancement**: Overcome the context limitations of LLMs, enabling long-term task processing.
- **Context Management**: Provide relevant context for each task based on dependencies and related files.
- **Process Standardization**: Establish a standardized process for task planning, execution, and verification.
- **Knowledge Accumulation**: Support continuous accumulation of task execution experience.

## 3. Architecture Layers

The system architecture consists of the following layers:

```
+-----------------+
|  User Interface |
+-----------------+
        |
+------------------+
|   Tool Layer     |
+------------------+
        |
+------------------+
|   Business Layer |
+------------------+
        |
+------------------+
|     Data Layer   |
+------------------+
```

### 3.1 User Interface Layer

The user interface layer provides tool functions for users to interact with the system. These tools are registered through the MCP protocol and can be directly called by the user.

### 3.2 Tool Layer

The tool layer implements the specific logic of each tool function, handles parameter validation, and coordinates the business layer's functionality. Core tool implementations are located in the `src/tools` directory.

### 3.3 Business Layer

The business layer contains the core business logic, including task processing, task memory management, file relationship processing, etc. The main implementation is in the `src/models` directory.

### 3.4 Data Layer

The data layer is responsible for data persistence and retrieval, maintaining task lists, task execution history, etc. It implements file-based storage in the `src/utils` directory.

## 4. Core Components

### 4.1 Task Management Module

Responsible for the entire lifecycle management of tasks, including:

- Task planning and splitting
- Task execution
- Task verification
- Task completion
- Task updates
- Task queries
- Automatic project rules updates

The Task Management Module includes a feature that automatically adds a "Project Rules Update" task to every task list. This task:
- Is added as the last item in any task list
- Depends on all other tasks in the batch
- Ensures project documentation remains in sync with code
- Updates project rules based on completed tasks
- Is created regardless of the update mode (clearAllTasks, append, overwrite, or selective)

### 4.2 Task Memory Module

Manages the execution history and experience of tasks, with key functions:

- Automatic saving of task execution records
- Loading of historical task context
- Creation of backup files

### 4.3 Conversation History Module

Captures and manages conversations between the user and the system for each task when detailed mode is enabled:

- Records all tool requests and responses
- Associates messages with specific tasks
- Provides API endpoints for retrieving conversation history
- Displays conversation history in the web UI

The module is activated by setting the `ENABLE_DETAILED_MODE` environment variable to `true`. When enabled, it captures:

- User requests (tool calls)
- System responses
- Timestamps for each message
- Associated tool names

This provides a detailed audit trail of the entire task execution process, which is especially useful for debugging, learning, and understanding complex task workflows.

### 4.4 File Association Module

Manages the relationship between tasks and related files, including:

- Creating file association information
- Loading file summaries
- Updating file relationships

### 4.5 Task Complexity Assessment Module

Evaluates the complexity of tasks based on various indicators, helping to determine the appropriate execution strategy.

## 5. Core Interaction Flows

### 5.1 Task Planning Flow

```
+--------------------+     +------------------+     +---------------+
|                    |     |                  |     |               |
| plan_task Schema   |---->| planTask         |---->| createTaskPlan|
|                    |     | (taskTools.ts)   |     | (taskModel.ts)|
+--------------------+     +--------+---------+     +-------+-------+
                                    |                       |
                                    v                       v
                            +-------+-------------------+------+
                            |     Validate Parameters          |
                            +-------+-------------------+------+
                                    |
                                    v
                            +-------+-------------------+------+
                            |  Create Task Plan with Goals     |
                            +-------+-------------------+------+
                                    |
                                    v
                            +-------+-------------------+------+
                            |   Save Task Plan to Storage      |
                            +-------+-------------------+------+
```

### 5.2 Task Analysis Flow

```
+----------------------+     +-------------------+     +------------------+
|                      |     |                   |     |                  |
| analyze_task Schema  |---->| analyzeTask       |---->| createTaskAnalysis|
|                      |     | (taskTools.ts)    |     | (taskModel.ts)   |
+----------------------+     +---------+---------+     +---------+--------+
                                       |                         |
                                       v                         v
                               +-------+-------------------------+------+
                               |        Validate Parameters             |
                               +-------+-------------------------+------+
                                       |
                                       v
                               +-------+-------------------------+------+
                               |    Check for Previous Analysis         |
                               +-------+-------------------------+------+
                                       |
                                       v
                               +-------+-------------------------+------+
                               |   Create Analysis with Technical Details|
                               +-------+-------------------------+------+
                                       |
                                       v
                               +-------+-------------------------+------+
                               |      Save Analysis to Storage          |
                               +-------+-------------------------+------+
```

### 5.3 Task Reflection Flow

```
+---------------------+     +-------------------+     +-----------------+
|                     |     |                   |     |                 |
| reflect_task Schema |---->| reflectTask       |---->| createReflection|
|                     |     | (taskTools.ts)    |     | (taskModel.ts)  |
+---------------------+     +---------+---------+     +---------+-------+
                                      |                         |
                                      v                         v
                              +-------+-------------------------+------+
                              |        Validate Parameters             |
                              +-------+-------------------------+------+
                                      |
                                      v
                              +-------+-------------------------+------+
                              |   Check for Previous Analysis          |
                              +-------+-------------------------+------+
                                      |
                                      v
                              +-------+-------------------------+------+
                              |    Create Reflection with Review       |
                              +-------+-------------------------+------+
                                      |
                                      v
                              +-------+-------------------------+------+
                              |      Save Reflection to Storage        |
                              +-------+-------------------------+------+
```

### 5.4 Task Splitting Flow

```
+--------------------+     +------------------+     +--------------------+
|                    |     |                  |     |                    |
| split_tasks Schema |---->| splitTasks       |---->| createTaskList     |
|                    |     | (taskTools.ts)   |     | (taskModel.ts)     |
+--------------------+     +--------+---------+     +---------+----------+
                                    |                         |
                                    v                         v
                            +-------+-------------------------+------+
                            |        Validate Parameters             |
                            +-------+-------------------------+------+
                                    |
                                    v
                            +-------+-------------------------+------+
                            |      Process Update Mode               |
                            +-------+-------------------------+------+
                                    |
                                    v
                            +-------+-------------------------+------+
                            |  Create Atomic Tasks with Dependencies |
                            +-------+-------------------------+------+
                                    |
                                    v
                            +-------+-------------------------+------+
                            |      Save Task List to Storage         |
                            +-------+-------------------------+------+
```

### 5.5 Task Execution Flow

```
+--------------------+     +------------------+     +------------------+
|                    |     |                  |     |                  |
| execute_task Schema|---->| executeTask      |---->| processExecution |
|                    |     | (taskTools.ts)   |     | (taskModel.ts)   |
+--------------------+     +--------+---------+     +---------+--------+
                                    |                         |
                                    v                         v
                            +-------+-------------------------+------+
                            |        Validate Parameters             |
                            +-------+-------------------------+------+
                                    |
                                    v
                            +-------+-------------------------+------+
                            |      Check Dependency Status           |
                            +-------+-------------------------+------+
                                    |
                                    v
                            +-------+-------------------------+------+
                            |   Load Task Context (Plan, Analysis)   |
                            +-------+-------------------------+------+
                                    |
                                    v
                            +-------+-------------------------+------+
                            |      Load Related Files Context        |
                            +-------+-------------------------+------+
                                    |
                                    v
                            +-------+-------------------------+------+
                            |      Mark Task as In Progress         |
                            +-------+-------------------------+------+
```

### 5.6 Task Verification Flow

```
+--------------------+     +------------------+     +------------------+
|                    |     |                  |     |                  |
| verify_task Schema |---->| verifyTask       |---->| processVerification|
|                    |     | (taskTools.ts)   |     | (taskModel.ts)   |
+--------------------+     +--------+---------+     +---------+--------+
                                    |                         |
                                    v                         v
                            +-------+-------------------------+------+
                            |        Validate Parameters             |
                            +-------+-------------------------+------+
                                    |
                                    v
                            +-------+-------------------------+------+
                            |      Check Task Exists & In Progress   |
                            +-------+-------------------------+------+
                                    |
                                    v
                            +-------+-------------------------+------+
                            |   Load Task Context (Implementation)   |
                            +-------+-------------------------+------+
                                    |
                                    v
                            +-------+-------------------------+------+
                            |      Generate Verification Report      |
                            +-------+-------------------------+------+
```

### 5.7 Task Completion Flow

```
+--------------------+     +------------------+     +--------------------+
|                    |     |                  |     |                    |
| complete_task Schema|---->| completeTask     |---->| processCompletion  |
|                    |     | (taskTools.ts)   |     | (taskModel.ts)     |
+--------------------+     +--------+---------+     +---------+----------+
                                    |                         |
                                    v                         v
                            +-------+-------------------------+------+
                            |        Validate Parameters             |
                            +-------+-------------------------+------+
                                    |
                                    v
                            +-------+-------------------------+------+
                            |      Check Task Exists & In Progress   |
                            +-------+-------------------------+------+
                                    |
                                    v
                            +-------+-------------------------+------+
                            |      Generate Completion Summary       |
                            +-------+-------------------------+------+
                                    |
                                    v
                            +-------+-------------------------+------+
                            |      Update Task Status to Complete    |
                            +-------+-------------------------+------+
```

### 5.8 Task Deletion Flow

```
+--------------------+     +------------------+     +--------------------+
|                    |     |                  |     |                    |
| delete_task Schema |---->| deleteTask       |---->| processTaskDeletion|
|                    |     | (taskTools.ts)   |     | (taskModel.ts)     |
+--------------------+     +--------+---------+     +---------+----------+
                                    |                         |
                                    v                         v
                            +-------+-------------------------+------+
                            |        Validate Parameters             |
                            +-------+-------------------------+------+
                                    |
                                    v
                            +-------+-------------------------+------+
                            |      Check Task Exists & Not Complete  |
                            +-------+-------------------------+------+
                                    |
                                    v
                            +-------+-------------------------+------+
                            |      Update Dependent Tasks            |
                            +-------+-------------------------+------+
                                    |
                                    v
                            +-------+-------------------------+------+
                            |      Remove Task from Task List        |
                            +-------+-------------------------+------+
```

### 5.9 Task Complexity Assessment Flow

```
+-------------------------+     +------------------------+
|                         |     |                        |
| assessTaskComplexity    |---->| Complex Analysis Logic |
| (taskModel.ts)          |     |                        |
+-------------------------+     +-----------+------------+
                                            |
                                            v
                                +-----------+------------------------+
                                | Check Task Description Length      |
                                +-----------+------------------------+
                                            |
                                            v
                                +-----------+------------------------+
                                | Count Technical Terms              |
                                +-----------+------------------------+
                                            |
                                            v
                                +-----------+------------------------+
                                | Analyze Dependency Count           |
                                +-----------+------------------------+
                                            |
                                            v
                                +-----------+------------------------+
                                | Count File Operations              |
                                +-----------+------------------------+
                                            |
                                            v
                                +-----------+------------------------+
                                | Calculate Weighted Complexity Score|
                                +-----------+------------------------+
```

### 5.10 Task File Loading Flow

```
+----------------------+     +--------------------+
|                      |     |                    |
| loadTaskRelatedFiles |---->| getFileSummaries   |
| (fileLoader.ts)      |     | (fileLoader.ts)    |
+----------------------+     +---------+----------+
                                      |
                                      v
                             +--------+------------------------+
                             | Format Paths to Absolute Paths  |
                             +--------+------------------------+
                                      |
                                      v
                             +--------+------------------------+
                             | Generate File Type Summaries    |
                             +--------+------------------------+
                                      |
                                      v
                             +--------+------------------------+
                             | Return Formatted File Summaries |
                             +--------+------------------------+
                                      |
                                      v
                             +--------+------------------------+
                             |                                 |
                             +--------+---------------------+--+
```

### 5.11 Updating Task Related Files Function

```
+----------------------+     +---------------------+     +----------------------+
|                      |     |                     |     |                      |
| updateTaskFilesSchema |---->| updateTaskRelatedFiles |---->| updateTaskRelatedFiles |
|                      |     | (taskTools.ts)      |     | (taskModel.ts)       |
+----------------------+     +-----------+---------+     +-----------+----------+
                                       |                           |
                                       v                           v
                               +-------+-------------------------+------+
                               |     Validate File Format and Path      |
                               +-------+-------------------------+------+
                                       |
                                       v
                               +-------+-------------------------+------+
                               |     Update Task Related Files List     |
                               +-------+-------------------------+------+
```

## 6. Extensibility Considerations

### 6.1 Method for New Feature Extensions

The modular design of the Chain of Thought makes it easy to extend. To add new features, typically you need to:

1. Define related data types in `types/index.ts`
2. Implement core logic in the corresponding model files
3. Create corresponding tool functions in the tool layer
4. Register new tools in `index.ts`

### 6.2 Current Extension Points

The system currently provides the following extension points:

- **Task Processing Flow Extension**: Can extend the task processing flow by modifying functions like `executeTask`, `verifyTask`, etc.
- **Complexity Assessment Extension**: Can add more evaluation metrics in `assessTaskComplexity`
- **Summary Generation Extension**: Can enhance algorithms in `summaryExtractor.ts`
- **File Processing Extension**: Can support more file type summary formatting in `fileLoader.ts`
- **Filter Condition Extension**: Can add more filter condition options in task queries

## 7. System Limitations and Future Improvements

### 7.1 Current Limitations

- Uses file storage, not suitable for multi-user concurrent scenarios
- Lacks user authentication and permission control
- Summary generation uses simple rules, can be further improved
- File processing does not read actual file content, only generates summary information

### 7.2 Potential Future Improvements

- Migrate to database storage, improving concurrent processing capabilities
- Add user management and access control
- Use more advanced algorithms to optimize summary generation
- Add task priority and time planning functionality
- Implement task execution progress tracking
- Enhance file association system, supporting more complex relationship types
- Implement automatic identification of related files
- Support actual reading of file content, providing more detailed context

## 8. Conclusion

The Chain of Thought adopts a modular, layered design, giving the system good maintainability and extensibility. Through 12 core tool functions and a well-developed data model, the system can effectively manage task processes in complex projects, performing exceptionally well in scenarios requiring long-term context memory.

The design focus of the system is to provide a clear task management process while enhancing the LLM's context memory capability during task execution. Through precise file association and intelligent context loading, it effectively solves the memory limitation problem that LLMs face when handling long-term complex tasks.

As the system continues to develop, future efforts will focus on improving data storage methods, optimizing summary generation algorithms, enhancing file processing capabilities, and adding more task management features, enabling the system to handle more complex task management scenarios.
