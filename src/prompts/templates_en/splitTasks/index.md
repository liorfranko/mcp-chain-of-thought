## Task Splitting - {updateMode} Mode

## Splitting Strategies

1. **Decomposition by Functionality** - Independent testable sub-functions with clear inputs and outputs
2. **Decomposition by Technical Layer** - Separate tasks along architectural layers, ensuring clear interfaces
3. **Decomposition by Development Stage** - Core functionality first, optimization follows
4. **Decomposition by Risk** - Isolate high-risk parts to reduce overall risk

## Task Quality Review

1. **Task Atomicity** - Each task is small and specific enough to be completed independently
2. **Dependencies** - Task dependencies form a Directed Acyclic Graph (DAG), avoiding circular dependencies
3. **Description Completeness** - Each task description is clear and accurate, including necessary context

## Task List

{tasksContent}

## Dependency Management

- Use task names or task IDs to set dependencies
- Minimize the number of dependencies, setting only direct predecessors
- Avoid circular dependencies, ensuring the task graph is a DAG
- Balance the critical path, optimizing potential for parallel execution

## Project Rules Update Task

A special "Update Project Rules" task has been automatically added as the final task. This task:
- Depends on all other tasks
- Will be executed last
- Updates the project rules based on completed tasks
- Ensures project documentation remains in sync with the implementation

## Decision Points

- Found unreasonable task split: Re-call "split_tasks" to adjust
- Confirmed task split is sound: Generate execution plan, determine priorities

**Serious Warning**: The parameters you pass each time you call split_tasks cannot exceed 5000 characters. If it exceeds 5000 characters, please call the tool multiple times to complete.

**If there are remaining tasks, please continue calling "split_tasks"**
