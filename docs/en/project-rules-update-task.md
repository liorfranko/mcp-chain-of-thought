# Project Rules Update Task

## Overview

The MCP Chain of Thought system automatically adds a "Project Rules Update" task to every task list. This document explains the purpose, behavior, and implementation of this feature.

## Purpose

The automatic project rules update task serves several important purposes:

1. **Documentation Synchronization**: Ensures that project rules documentation remains in sync with the actual codebase as tasks are completed.
2. **Standards Maintenance**: Helps maintain consistent coding standards by regularly updating project rules based on implementation decisions.
3. **Knowledge Preservation**: Captures key architectural decisions and patterns that emerge during development.
4. **Dependency Management**: Acts as a final step after all other tasks are completed, ensuring comprehensive documentation updates.

## Behavior

The project rules update task is characterized by:

- **Automatic Addition**: Automatically added to every task list created using the `split_tasks` tool.
- **Final Execution Position**: Always positioned as the last item in any task list.
- **Dependencies**: Depends on all other tasks in the batch, ensuring it only executes after all other tasks are completed.
- **Consistent Implementation**: Created regardless of the update mode (clearAllTasks, append, overwrite, or selective).
- **Standard Structure**: Contains predefined name, description, implementation guide, and verification criteria.

## Implementation Details

The system adds the project rules update task with the following attributes:

- **Name**: "Update Project Rules Based on Completed Items"
- **Description**: Task to update project rules and specification based on completed tasks
- **Dependencies**: References all other tasks in the batch
- **Implementation Guide**: Includes steps to review completed tasks, identify patterns, and update documentation
- **Verification Criteria**: Ensures project rules document is updated and consistent with code implementation
- **Related Files**: Typically references `data/rules.md` file for modification

## Technical Implementation

The project rules update task is implemented in the `splitTasks` function in `src/tools/taskTools.ts`. After the task list is created but before task creation is executed, the system:

1. Creates a list of dependencies from all task names in the batch
2. Creates a project rules update task object with predefined properties
3. Adds the task to the tasks array before batch creation/update
4. Ensures the task is properly processed regardless of update mode

## Best Practices

When working with the automatic project rules update task:

1. **Review Dependencies**: Verify dependencies are correctly established for proper execution order.
2. **Customize Content**: Modify the project rules document based on actual implementation details, not just theoretical plans.
3. **Complete the Task**: Don't skip this task; maintaining up-to-date documentation is essential for project maintainability.
4. **Validate Updates**: Ensure the updated project rules accurately reflect the current state of the system.

## Example Task

```json
{
  "name": "Update Project Rules Based on Completed Items",
  "description": "This task involves updating the project rules and specification based on completed tasks to ensure the documentation reflects the current state of the project. The update should incorporate patterns, decisions, and standards established during development.",
  "dependencies": ["Task 1", "Task 2", "Task 3"],
  "implementationGuide": "1. Review all completed tasks\n2. Identify key decisions and patterns\n3. Update the project rules document\n4. Ensure consistency with implemented solutions\n5. Document architectural decisions and coding standards",
  "verificationCriteria": "1. Project rules document is updated\n2. All completed tasks are reflected in the rules\n3. Documentation is consistent with code implementation",
  "notes": "This task is automatically added to ensure project rules are kept up-to-date with completed work.",
  "relatedFiles": [
    {
      "path": "data/rules.md",
      "type": "TO_MODIFY",
      "description": "Project rules document to be updated"
    }
  ]
}
``` 