Decompose complex tasks into independent subtasks, establishing dependencies and priorities.

## updateMode

- **append**: Keep existing tasks and add new ones
- **overwrite**: Delete unfinished tasks, keep completed ones
- **selective**: Intelligently match and update existing tasks based on name
- **clearAllTasks**: Clear all tasks and create a backup (preferred mode)

## Key Requirements

- **Provide concise pseudocode**: Only provide high-level logic flow and key steps, avoid complete code
- **Consolidate when necessary**: Simple modifications can be integrated with other tasks to avoid excessive task count
- **Submit in batches**: If there are too many tasks, use the "split_tasks" tool with parameters not exceeding 5000 characters
- **Automatic final task**: A task for updating project rules is automatically added as the final task with dependencies on all other tasks
