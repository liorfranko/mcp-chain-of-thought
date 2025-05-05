[English](../en/prompt-customization.md)

# Prompt Customization Guide

## Overview

The Shrimp Task Manager system allows users to customize the guiding content (prompts) for various tool functions through environment variables. This provides a high degree of flexibility, enabling you to adjust the behavior of the AI assistant according to specific requirements without modifying the code. There are two customization methods:

1. **Override Mode**: Completely replace the original prompt
2. **Append Mode**: Add new content to the existing prompt

## Environment Variable Naming Conventions

- Override Mode: `MCP_PROMPT_[FUNCTION_NAME]`
- Append Mode: `MCP_PROMPT_[FUNCTION_NAME]_APPEND`

Where `[FUNCTION_NAME]` is the name of the tool function in uppercase. For example, for the task planning function `planTask`, the corresponding environment variable name is `MCP_PROMPT_PLAN_TASK`.

## Supported Tool Functions

All major functions in the system support prompt customization through environment variables:

| Function Name  | Environment Variable Prefix  | Description       |
| -------------- | ---------------------------- | ----------------- |
| `planTask`     | `MCP_PROMPT_PLAN_TASK`       | Task planning     |
| `analyzeTask`  | `MCP_PROMPT_ANALYZE_TASK`    | Task analysis     |
| `reflectTask`  | `MCP_PROMPT_REFLECT_TASK`    | Solution evaluation |
| `splitTasks`   | `MCP_PROMPT_SPLIT_TASKS`     | Task splitting    |
| `executeTask`  | `MCP_PROMPT_EXECUTE_TASK`    | Task execution    |
| `verifyTask`   | `MCP_PROMPT_VERIFY_TASK`     | Task verification |
| `completeTask` | `MCP_PROMPT_COMPLETE_TASK`   | Task completion   |
| `listTasks`    | `MCP_PROMPT_LIST_TASKS`      | List tasks        |
| `queryTask`    | `MCP_PROMPT_QUERY_TASK`      | Query tasks       |
| `getTaskDetail`| `MCP_PROMPT_GET_TASK_DETAIL` | Get task details  |

## Environment Variable Configuration Methods

There are two main configuration methods:

### 1. Setting Environment Variables via `.env` File

1. Copy `.env.example` to `.env` in the project root directory
2. Add the required environment variable configurations
3. The application will automatically load these environment variables when started

```
# .env file example
MCP_PROMPT_PLAN_TASK=Custom prompt content
MCP_PROMPT_ANALYZE_TASK=Custom analysis prompt content
```

> Note: Ensure that the `.env` file is ignored in version control (add it to `.gitignore`), especially when it contains sensitive information.

### 2. Setting Directly in the mcp.json Configuration File

You can also set environment variables directly in the Cursor IDE's `mcp.json` configuration file, eliminating the need to create a separate `.env` file:

```json
{
  "mcpServers": {
    "mcp-shrimp-task-manager": {
      "command": "node",
      "args": ["/path/to/mcp-shrimp-task-manager/dist/index.js"],
      "env": {
        "DATA_DIR": "/path/to/project/data",
        "MCP_PROMPT_PLAN_TASK": "Custom task planning prompt",
        "MCP_PROMPT_EXECUTE_TASK_APPEND": "Additional task execution guidance"
      }
    }
  }
}
```

The advantage of this approach is that you can manage prompt configurations together with other MCP configurations, which is particularly suitable for situations where different prompts are needed for different projects.

## Usage Examples

### Override Mode Example

```
# Completely replace the PLAN_TASK prompt in the .env file
MCP_PROMPT_PLAN_TASK=## Custom Task Planning\n\nPlease plan the task based on the following information:\n\n{description}\n\nRequirements: {requirements}\n
```

Or configure in mcp.json:

```json
"env": {
  "MCP_PROMPT_PLAN_TASK": "## Custom Task Planning\n\nPlease plan the task based on the following information:\n\n{description}\n\nRequirements: {requirements}\n"
}
```

### Append Mode Example

```
# Append content to the existing PLAN_TASK prompt in the .env file
MCP_PROMPT_PLAN_TASK_APPEND=\n\n## Additional Guidance\n\nPlease pay special attention to the following:\n1. Prioritize dependencies between tasks\n2. Minimize task coupling
```

Or configure in mcp.json:

```json
"env": {
  "MCP_PROMPT_PLAN_TASK_APPEND": "\n\n## Additional Guidance\n\nPlease pay special attention to the following:\n1. Prioritize dependencies between tasks\n2. Minimize task coupling"
}
```

## Dynamic Parameter Support

Custom prompts can also use defined dynamic parameters using the `{paramName}` syntax. The system will replace these placeholders with actual parameter values during processing.

Each function supports the following parameters:

### planTask Supported Parameters

- `{description}` - Task description
- `{requirements}` - Task requirements
- `{existingTasksReference}` - Whether to reference existing tasks
- `{completedTasks}` - List of completed tasks
- `{pendingTasks}` - List of pending tasks
- `{memoryDir}` - Task memory storage directory

### analyzeTask Supported Parameters

- `{summary}` - Task summary
- `{initialConcept}` - Initial concept
- `{previousAnalysis}` - Previous analysis results

### reflectTask Supported Parameters

- `{summary}` - Task summary
- `{analysis}` - Analysis results

### splitTasks Supported Parameters

- `{updateMode}` - Update mode
- `{createdTasks}` - Created tasks
- `{allTasks}` - All tasks

### executeTask Supported Parameters

- `{task}` - Task details
- `{complexityAssessment}` - Complexity assessment results
- `{relatedFilesSummary}` - Related files summary
- `{dependencyTasks}` - Dependency tasks
- `{potentialFiles}` - Potentially related files

### verifyTask Supported Parameters

- `{task}` - Task details

### completeTask Supported Parameters

- `{task}` - Task details
- `{completionTime}` - Completion time

### listTasks Supported Parameters

- `{status}` - Task status
- `{tasks}` - Tasks grouped by status
- `{allTasks}` - All tasks

### queryTask Supported Parameters

- `{query}` - Query content
- `{isId}` - Whether it's an ID query
- `{tasks}` - Query results
- `{totalTasks}` - Total results count
- `{page}` - Current page number
- `{pageSize}` - Page size
- `{totalPages}` - Total pages

### getTaskDetail Supported Parameters

- `{taskId}` - Task ID
- `{task}` - Task details
- `{error}` - Error message (if any)

## Advanced Customization Cases

### Example 1: Adding Brand Customization Prompts

Suppose you want to add company-specific brand information and guidelines to all task execution instructions:

```
# Configure in .env file
MCP_PROMPT_EXECUTE_TASK_APPEND=\n\n## Company-Specific Guidelines\n\nWhen executing tasks, please follow these principles:\n1. Keep code consistent with company style guidelines\n2. All new features must have corresponding unit tests\n3. Documentation must use company standard templates\n4. Ensure all user interface elements comply with brand design specifications
```

### Example 2: Adjusting Task Analysis Style

Suppose you want to make task analysis more security-oriented:

```
# Configure in .env file
MCP_PROMPT_ANALYZE_TASK=## Security-Oriented Task Analysis\n\nPlease conduct a comprehensive security analysis for the following task:\n\n**Task Summary:**\n{summary}\n\n**Initial Concept:**\n{initialConcept}\n\nDuring analysis, please pay special attention to:\n1. Code injection risks\n2. Permission management issues\n3. Data validation and sanitization\n4. Security risks of third-party dependencies\n5. Potential configuration errors\n\nFor each potential issue, please provide:\n- Issue description\n- Impact level (low/medium/high)\n- Recommended solution\n\n{previousAnalysis}
```

Or configure in mcp.json:

```json
"env": {
  "MCP_PROMPT_ANALYZE_TASK": "## Security-Oriented Task Analysis\n\nPlease conduct a comprehensive security analysis for the following task:\n\n**Task Summary:**\n{summary}\n\n**Initial Concept:**\n{initialConcept}\n\nDuring analysis, please pay special attention to:\n1. Code injection risks\n2. Permission management issues\n3. Data validation and sanitization\n4. Security risks of third-party dependencies\n5. Potential configuration errors\n\nFor each potential issue, please provide:\n- Issue description\n- Impact level (low/medium/high)\n- Recommended solution\n\n{previousAnalysis}"
}
```

## Custom Template Folders

In addition to environment variables, you can also create your own template folder for deeper customization:

1. Set the `TEMPLATES_USE` environment variable to specify which template directory to use
2. Create a custom template directory in your `DATA_DIR` location

### Available Template Sets

Default template sets that can be specified with `TEMPLATES_USE`:

- `en` - English templates (default)

### Creating Custom Templates

1. Copy an existing template directory (e.g., `src/prompts/templates_en`) to your `DATA_DIR` location
2. Modify the templates as needed
3. Set `TEMPLATES_USE` to point to your custom template directory name

For example, if you create a directory `my_templates` in your data directory:

```
DATA_DIR/
└── templates/
    └── my_templates/
        ├── analyzeTask/
        ├── executeTask/
        └── ... (other tool templates)
```

Then set in your environment:

```
TEMPLATES_USE=my_templates
```

This approach allows for comprehensive customization of all system prompts while maintaining the ability to upgrade the core system without losing your customizations.

## Template Customization Overview

The system uses template files to provide prompts for different tools. You can customize these templates by:

1. Setting the `TEMPLATES_USE` environment variable to specify the template directory
2. Creating a custom template directory in your `DATA_DIR` location

## Customization Best Practices

When customizing templates:

1. Start with a copy of an existing template to understand the format
2. Preserve the overall structure and essential components
3. Adjust the language, tone, or specific instructions as needed
4. Test your custom templates thoroughly to ensure they work correctly

By following this guide, you can create customized prompts that better suit your specific needs and workflow preferences.

## Best Practices

1. **Incremental Adjustments**: Start with small changes and ensure the system still works properly after each modification.

2. **Save Configurations**: Save effective environment variable configurations to the project's `.env.example` file for team members to reference.

3. **Mind the Format**: Ensure proper line breaks and formatting in prompts, especially for environment variables enclosed in quotes.

4. **Test and Validate**: Test custom prompts in different scenarios to ensure they work properly in various situations.

5. **Consider Task Flow**: When modifying prompts, consider the entire task flow to ensure consistency between different stages.

## Troubleshooting

- **Environment Variables Not Taking Effect**: Ensure you have correctly set the environment variables and restarted the application after setting.

- **Format Issues**: Check if line breaks and special characters in environment variables are properly escaped.

- **Parameter Replacement Failure**: Ensure the parameter names you use match those supported by the system, including case sensitivity.

- **Restore Default Settings**: If custom prompts cause issues, you can delete the corresponding environment variables to restore default settings.

## Appendix: Default Prompt Reference
