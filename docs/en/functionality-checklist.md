[English](../en/functionality-checklist.md)

# Chain of Thought - Functionality Implementation Checklist

This document lists all the tools, functions, parameter structures, and features actually implemented in the Chain of Thought system. This checklist serves as a reference baseline for documentation review.

## Type Definitions and Enumerations

### Task Status Enumeration (TaskStatus)

- `PENDING = "Pending"` - Tasks that have been created but not yet started
- `IN_PROGRESS = "In Progress"` - Tasks currently being executed
- `COMPLETED = "Completed"` - Tasks that have been successfully completed and verified
- `BLOCKED = "Blocked"` - Tasks that cannot be executed temporarily due to dependencies

### Task Dependency (TaskDependency)

- `taskId: string` - Unique identifier of the prerequisite task that must be completed before the current task

### Related File Type Enumeration (RelatedFileType)

- `TO_MODIFY = "To Modify"` - Files that need to be modified in the task
- `REFERENCE = "Reference"` - Reference materials or related documents for the task
- `CREATE = "To Create"` - Files that need to be created in the task
- `DEPENDENCY = "Dependency"` - Component or library files that the task depends on
- `OTHER = "Other"` - Other types of related files

### Related File (RelatedFile)

- `path: string` - File path, can be relative to the project root directory or an absolute path
- `type: RelatedFileType` - Type of relationship between the file and the task
- `description?: string` - Supplementary description of the file, explaining its specific relationship or purpose to the task
- `lineStart?: number` - Starting line of the relevant code block (optional)
- `lineEnd?: number` - Ending line of the relevant code block (optional)

### Conversation Message (ConversationMessage)

- `timestamp: Date` - Timestamp when the message was created
- `role: 'user' | 'assistant'` - Role of the message sender (user or assistant)
- `content: string` - Content of the message
- `toolName?: string` - Name of the tool associated with the message (if applicable)

### Task Interface (Task)

- `id: string` - Unique identifier of the task
- `name: string` - Concise and clear task name
- `description: string` - Detailed task description, including implementation points and acceptance criteria
- `notes?: string` - Supplementary notes, special processing requirements, or implementation suggestions (optional)
- `status: TaskStatus` - Current execution status of the task
- `dependencies: TaskDependency[]` - List of prerequisite dependencies for the task
- `createdAt: Date` - Timestamp when the task was created
- `updatedAt: Date` - Timestamp when the task was last updated
- `completedAt?: Date` - Timestamp when the task was completed (only applicable to completed tasks)
- `summary?: string` - Task completion summary, concisely describing implementation results and important decisions (only applicable to completed tasks)
- `relatedFiles?: RelatedFile[]` - List of files related to the task (optional)
- `conversationHistory?: ConversationMessage[]` - History of conversations related to the task (only when detailed mode is enabled)

### Task Complexity Level Enumeration (TaskComplexityLevel)

- `LOW = "Low Complexity"` - Simple and straightforward tasks that usually do not require special handling
- `MEDIUM = "Medium Complexity"` - Tasks with some complexity but still manageable
- `HIGH = "High Complexity"` - Complex and time-consuming tasks that require special attention
- `VERY_HIGH = "Very High Complexity"` - Extremely complex tasks that are recommended to be broken down

### Task Complexity Assessment Result (TaskComplexityAssessment)

- `level: TaskComplexityLevel` - Overall complexity level
- `metrics: object` - Detailed data for each evaluation metric
  - `descriptionLength: number` - Length of description
  - `dependenciesCount: number` - Number of dependencies
  - `notesLength: number` - Length of notes
  - `hasNotes: boolean` - Whether notes are present
- `recommendations: string[]` - List of handling recommendations

## Tool Functions and Parameters

### 1. plan_task

**Description**: Initialize and plan the task process in detail, establishing clear goals and success criteria

**Parameters**:

- `description: string` (required) - Comprehensive and detailed task problem description, should include task objectives, background, and expected outcomes
  - Must be at least 10 characters
- `requirements?: string` (optional) - Specific technical requirements, business constraints, or quality standards for the task

**Return Value**:

- Returns a response containing planning prompts to guide the user in starting task analysis

### 2. analyze_task

**Description**: Deeply analyze task requirements and systematically check the codebase, evaluating technical feasibility and potential risks

**Parameters**:

- `summary: string` (required) - Structured task summary, including task objectives, scope, and key technical challenges
  - Must be at least 20 characters
- `initialConcept: string` (required) - Initial solution concept, including technical solutions, architectural design, and implementation strategy
  - Must be at least 50 characters
- `previousAnalysis?: string` (optional) - Analysis results from previous iterations, used for continuous improvement of the solution

**Return Value**:

- Returns a response containing technical analysis guidance to direct the user in conducting in-depth analysis

### 3. reflect_task

**Description**: Critically review analysis results, evaluate solution completeness, and identify optimization opportunities, ensuring the solution follows best practices

**Parameters**:

- `summary: string` (required) - Structured task summary, keeping consistent with the analysis phase to ensure continuity
  - Must be at least 20 characters
- `analysis: string` (required) - Comprehensive and thorough technical analysis results, including all technical details, dependent components, and implementation plans
  - Must be at least 100 characters

**Return Value**:

- Returns a response containing reflection prompts and implementation suggestions

### 4. split_tasks

**Description**: Break down complex tasks into independent and trackable subtasks, establishing clear dependencies and priorities

**Parameters**:

- `updateMode: "append" | "overwrite" | "selective" | "clearAllTasks"` (required) - Task update mode selection:
  - `append`: Preserve all existing tasks and add new tasks
  - `overwrite`: Clear all incomplete tasks and completely replace them
  - `selective`: Update existing tasks based on task name matching, preserving tasks not in the list
  - `clearAllTasks`: Clear all tasks and create a backup
- `tasks: Array<object>` (required) - Structured list of tasks, each task should be atomic and have clear completion criteria
  - `name: string` (required) - Concise and clear task name that should clearly express the task purpose
    - Not exceeding 100 characters
  - `description: string` (required) - Detailed task description, including implementation points, technical details, and acceptance criteria
    - Must be at least 10 characters
  - `notes?: string` (optional) - Supplementary notes, special processing requirements, or implementation suggestions
  - `dependencies?: string[]` (optional) - List of prerequisite task IDs or task names that this task depends on
  - `relatedFiles?: RelatedFile[]` (optional) - List of files related to the task

**Return Value**:

- Returns a response containing task splitting results, including the number of successfully created tasks and the list of task IDs

### 5. list_tasks

**Description**: Generate a structured task list, including complete status tracking, priorities, and dependencies

**Parameters**: None

**Return Value**:

- Returns a response containing a task list, displaying all tasks grouped by status

### 6. execute_task

**Description**: Execute a specific task according to the predefined plan, ensuring that the output of each step meets quality standards

**Parameters**:

- `taskId: string` (required) - Unique identifier of the task to be executed, must be a valid task ID existing in the system

**Return Value**:

- Returns a response containing task execution guidelines, including task details, complexity assessment, and suggested execution steps

### 7. verify_task

**Description**: Comprehensively verify task completion, ensuring all requirements and technical standards have been met, with no details omitted

**Parameters**:

- `taskId: string` (required) - Unique identifier of the task to be verified, must be a valid task ID existing in the system

**Return Value**:

- Returns a response containing task verification results, including completion criteria checks and specific verification items

### 8. complete_task

**Description**: Formally mark a task as completed, generate a detailed completion report, and update the dependency status of related tasks

**Parameters**:

- `taskId: string` (required) - Unique identifier of the task to be completed, must be a valid task ID existing in the system
- `summary?: string` (optional) - Task completion summary, concisely describing implementation results and important decisions

**Return Value**:

- Returns a response containing task completion confirmation, including completion time and updated dependent task status

### 9. delete_task

**Description**: Delete an incomplete task, but do not allow deletion of completed tasks, ensuring the integrity of system records

**Parameters**:

- `taskId: string` (required) - Unique identifier of the task to be deleted, must be a valid and incomplete task ID existing in the system

**Return Value**:

- Returns a response containing task deletion results, including success or failure messages

### 10. clear_all_tasks

**Description**: Delete all incomplete tasks in the system, this command must be explicitly confirmed by the user to execute. At the same time, back up tasks to the memory subdirectory, saving task history records for future reference.

**Parameters**:

- `confirm: boolean` (required) - Confirm deletion of all incomplete tasks (this operation is irreversible)

**Return Value**:

- Returns a response containing the results of the clear operation, including success or failure messages, backup file name, and backup location

**Important Details**:

- Before deleting tasks, the current task list is automatically backed up to the data/memory subdirectory
- Backup files are named using timestamps, in the format tasks_memory_YYYY-MM-DDThh-mm-ss.json
- The memory subdirectory serves as a long-term memory repository for storing task history records, for future task planning reference

### 11. query_task

**Description**: Search tasks by keyword or ID, displaying abbreviated task information

**Parameters**:

- `query: string` (required) - Search query text (can be task ID or keyword)
- `isId?: boolean` (optional) - Specify whether it's ID query mode (default is false)
- `page?: number` (optional) - Page number (default is 1)
- `pageSize?: number` (optional) - Results per page (default is 5, max 20)

**Return Value**:

- Returns a response containing search results in paginated format

### 12. update_task

**Description**: Update task content, including name, description, and notes, but do not allow modification of completed tasks

**Parameters**:

- `taskId: string` (required) - Unique identifier of the task to be updated, must be a valid and incomplete task ID existing in the system
- `name?: string` (optional) - New name for the task
- `description?: string` (optional) - New description content for the task
- `notes?: string` (optional) - New supplementary notes for the task

**Return Value**:

- Returns a response containing task update results, including success or failure messages

### 13. get_task_detail

**Description**: Get the complete detailed information of a task based on its ID

**Parameters**:

- `taskId: string` (required) - Task ID to view details

**Return Value**:

- Returns a response containing the complete task details in a well-structured format

### 14. update_task_files

**Description**: Update the list of related files for a task, used to record code files, reference materials, etc. related to the task

**Parameters**:

- `taskId: string` (required) - Unique identifier of the task to be updated, must be a valid and incomplete task ID existing in the system
- `relatedFiles: Array<RelatedFile>` (required) - List of files related to the task
  - `path: string` (required) - File path, can be relative to the project root directory or an absolute path
  - `type: RelatedFileType` (required) - Type of relationship between the file and the task
  - `description?: string` (optional) - Supplementary description of the file
  - `lineStart?: number` (optional) - Starting line of the relevant code block
  - `lineEnd?: number` (optional) - Ending line of the relevant code block

**Return Value**:

- Returns a response containing file update results, including success or failure messages

## Important Details of Tool Functions

### Dependency (dependencies) Handling

- In `splitTasks` and other functions, the `dependencies` parameter accepts task names or task IDs (UUID)
- The system converts string arrays to `TaskDependency` object arrays when creating or updating tasks
- Task dependencies form a directed acyclic graph (DAG), used to determine task execution order and blocking status

### Task Complexity Assessment

- The system uses the `assessTaskComplexity` function to evaluate task complexity
- Evaluation is based on multiple metrics: description length, number of dependencies, notes length, etc.
- Complexity levels are determined based on thresholds defined in `TaskComplexityThresholds`
- Complexity assessment results are used to generate appropriate handling recommendations

### File Processing Features

- The `loadTaskRelatedFiles` function does not actually read file contents, it only generates file information summaries
- Files are sorted by type priority: TO_MODIFY > REFERENCE > DEPENDENCY > CREATE > OTHER
- Supports specifying code block line number ranges for precise localization of key implementations

## Utility Functions

### Summary Extraction (summaryExtractor.ts)

- `extractSummary` - Extract short summaries from text, automatically handling Markdown format
- `generateTaskSummary` - Generate task completion summaries based on task names and descriptions
- `extractTitle` - Extract text suitable as titles from content

### File Loading (fileLoader.ts)

- `loadTaskRelatedFiles` - Generate content summaries of task-related files
- `generateFileInfo` - Generate basic file information summaries

## Task Memory Feature

The Task Memory feature is an important characteristic of the Chain of Thought system, giving the system long-term memory capabilities to save, query, and utilize past task execution experiences.

### Core Implementation

1. **Automatic Backup Mechanism**:

   - Dual backup functionality implemented in the `clearAllTasks` function
   - Task backups are saved in both the data directory and the data/memory subdirectory
   - Backup files are named using timestamps, in the format tasks_memory_YYYY-MM-DDThh-mm-ss.json

2. **Intelligent Prompt Guidance**:
   - Task memory retrieval guidelines added to the prompt in the `planTask` function
   - Guides Agents on how to find, analyze, and apply historical task records
   - Provides intelligent reference suggestions, promoting knowledge reuse

### Use Cases

- **During Task Planning**: Reference implementation plans and best practices from similar tasks
- **During Problem Solving**: Consult similar problems encountered in the past and their solutions
- **During Code Reuse**: Identify reusable components or patterns implemented in the past
- **During Experience Learning**: Analyze past successful and failed cases, continuously optimize working methods

### Technical Points

- Use relative paths to reference the memory directory, maintaining code consistency and maintainability
- Ensure the memory directory exists, automatically creating it if it doesn't
- Maintain the original error handling pattern, ensuring system stability
- The backup process is transparent and unnoticeable, not affecting the user's normal operation flow

This feature requires no additional tools or configuration. The system automatically saves historical records when tasks are cleared and provides intelligent guidance during task planning, allowing Agents to fully utilize past experiences and knowledge.

## Environment Variables

### DATA_DIR

- **Description**: Specifies the directory to store task data and memory backups
- **Default**: If not specified, defaults to `{current directory}/data`
- **Example**: `DATA_DIR=/path/to/your/data/directory`

### ENABLE_GUI

- **Description**: Enables or disables the web-based graphical user interface for task management
- **Default**: `false`
- **Values**: `true` or `false`
- **Example**: `ENABLE_GUI=true`

### ENABLE_THOUGHT_CHAIN

- **Description**: Enables or disables the thought chain processing for structured reasoning
- **Default**: `true`
- **Values**: `true` or `false`
- **Example**: `ENABLE_THOUGHT_CHAIN=false`

### TEMPLATES_USE

- **Description**: Specifies which language template set to use for prompts
- **Default**: `en` (English)
- **Example**: `TEMPLATES_USE=en`

### ENABLE_DETAILED_MODE

- **Description**: Enables or disables the detailed mode which captures conversation history for tasks
- **Default**: `false`
- **Values**: `true` or `false`
- **Example**: `ENABLE_DETAILED_MODE=true`
- **Features when enabled**:
  - Captures all tool requests and responses as conversation messages
  - Associates messages with specific tasks
  - Provides an API endpoint (`/api/tasks/:taskId/conversation`) to retrieve conversation history
  - Displays conversation history in the web UI task details when GUI is also enabled
  - Stores timestamps and tool names with each message
