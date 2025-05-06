import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";
import {
  getAllTasks,
  getTaskById,
  updateTaskStatus,
  canExecuteTask,
  batchCreateOrUpdateTasks,
  deleteTask as modelDeleteTask,
  updateTaskSummary,
  assessTaskComplexity,
  clearAllTasks as modelClearAllTasks,
  updateTaskContent as modelUpdateTaskContent,
  updateTaskRelatedFiles as modelUpdateTaskRelatedFiles,
  searchTasksWithCommand,
  ensureProjectRulesUpdateTask,
} from "../models/taskModel.js";
import {
  TaskStatus,
  TaskComplexityLevel,
  RelatedFileType,
  RelatedFile,
  Task,
  TaskDependency,
} from "../types/index.js";
import {
  extractSummary,
  generateTaskSummary,
} from "../utils/summaryExtractor.js";
import { loadTaskRelatedFiles } from "../utils/fileLoader.js";
// Import prompt generators
import {
  getPlanTaskPrompt,
  getAnalyzeTaskPrompt,
  getReflectTaskPrompt,
  getSplitTasksPrompt,
  getExecuteTaskPrompt,
  getVerifyTaskPrompt,
  getCompleteTaskPrompt,
  getListTasksPrompt,
  getQueryTaskPrompt,
  getTaskDetailPrompt,
  getDeleteTaskPrompt,
  getClearAllTasksPrompt,
  getUpdateTaskContentPrompt,
} from "../prompts/index.js";

// Task planning tool
export const planTaskSchema = z.object({
  description: z
    .string()
    .min(10, {
      message: "Task description cannot be less than 10 characters, please provide a more detailed description to ensure clear task objectives",
    })
    .describe("Complete detailed task problem description, should include task objectives, background and expected outcomes"),
  requirements: z
    .string()
    .optional()
    .describe("Specific technical requirements, business constraints or quality standards for the task (optional)"),
  existingTasksReference: z
    .boolean()
    .optional()
    .default(false)
    .describe("Whether to reference existing tasks as a planning basis, used for task adjustment and continuity planning"),
});

export async function planTask({
  description,
  requirements,
  existingTasksReference = false,
}: z.infer<typeof planTaskSchema>) {
  // Get base directory path
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const PROJECT_ROOT = path.resolve(__dirname, "../..");
  const DATA_DIR = process.env.DATA_DIR || path.join(PROJECT_ROOT, "data");
  const MEMORY_DIR = path.join(DATA_DIR, "memory");

  // Prepare required parameters
  let completedTasks: Task[] = [];
  let pendingTasks: Task[] = [];

  // When existingTasksReference is true, load all tasks from the database as reference
  if (existingTasksReference) {
    try {
      const allTasks = await getAllTasks();

      // Split tasks into completed and pending categories
      completedTasks = allTasks.filter(
        (task) => task.status === TaskStatus.COMPLETED
      );
      pendingTasks = allTasks.filter(
        (task) => task.status !== TaskStatus.COMPLETED
      );
    } catch (error) {}
  }

  // Use prompt generator to get the final prompt
  const prompt = getPlanTaskPrompt({
    description,
    requirements,
    existingTasksReference,
    completedTasks,
    pendingTasks,
    memoryDir: MEMORY_DIR,
  });

  return {
    content: [
      {
        type: "text" as const,
        text: prompt,
      },
    ],
  };
}

// Task analysis tool
export const analyzeTaskSchema = z.object({
  summary: z
    .string()
    .min(10, {
      message: "Task summary cannot be less than 10 characters, please provide a more detailed description to ensure clear task objectives",
    })
    .describe(
      "Structured task summary including task objectives, scope and key technical challenges, minimum 10 characters"
    ),
  initialConcept: z
    .string()
    .min(50, {
      message:
        "Initial solution concept cannot be less than 50 characters, please provide more detailed content to ensure the technical solution is clear",
    })
    .describe(
      "At least 50 characters of initial solution concept, including technical solution, architectural design and implementation strategy, if code is needed use pseudocode format and only provide high-level logic flow and key steps avoiding complete code"
    ),
  previousAnalysis: z
    .string()
    .optional()
    .describe("Analysis results from previous iterations, used for continuous improvement of solutions (only required for reanalysis)"),
});

export async function analyzeTask({
  summary,
  initialConcept,
  previousAnalysis,
}: z.infer<typeof analyzeTaskSchema>) {
  // Use prompt generator to get the final prompt
  const prompt = getAnalyzeTaskPrompt({
    summary,
    initialConcept,
    previousAnalysis,
  });

  return {
    content: [
      {
        type: "text" as const,
        text: prompt,
      },
    ],
  };
}

// Reflection tool
export const reflectTaskSchema = z.object({
  summary: z
    .string()
    .min(10, {
      message: "Task summary cannot be less than 10 characters, please provide a more detailed description to ensure clear task objectives",
    })
    .describe("Structured task summary, keeping consistent with the analysis phase to ensure continuity"),
  analysis: z
    .string()
    .min(100, {
      message: "Technical analysis content is not detailed enough, please provide complete technical analysis and implementation plan",
    })
    .describe(
      "Comprehensive technical analysis results, including all technical details, dependent components and implementation plans, if code is needed use pseudocode format and only provide high-level logic flow and key steps avoiding complete code"
    ),
});

export async function reflectTask({
  summary,
  analysis,
}: z.infer<typeof reflectTaskSchema>) {
  // Use prompt generator to get the final prompt
  const prompt = getReflectTaskPrompt({
    summary,
    analysis,
  });

  return {
    content: [
      {
        type: "text" as const,
        text: prompt,
      },
    ],
  };
}

// Task splitting tool
export const splitTasksSchema = z.object({
  updateMode: z
    .enum(["append", "overwrite", "selective", "clearAllTasks"])
    .describe(
      "Task update mode selection: 'append' (preserve all existing tasks and add new tasks), 'overwrite' (clear all unfinished tasks and completely replace, preserve completed tasks), 'selective' (intelligent update: match and update existing tasks by name, preserve tasks not in the list, recommended for minor task adjustments), 'clearAllTasks' (clear all tasks and create a backup).\nDefault is 'clearAllTasks' mode, only use other modes when the user requests changes or modifications to the plan content"
    ),
  tasks: z
    .array(
      z.object({
        name: z
          .string()
          .max(100, {
            message: "Task name too long, please limit to 100 characters",
          })
          .describe("Brief and clear task name, should be able to express the purpose of the task"),
        description: z
          .string()
          .min(10, {
            message: "Task description too short, please provide more detailed content to ensure understanding",
          })
          .describe("Detailed task description, including implementation points, technical details and acceptance standards"),
        implementationGuide: z
          .string()
          .describe(
            "Specific implementation method and steps for this task, please refer to previous analysis results and provide simplified pseudocode"
          ),
        dependencies: z
          .array(z.string())
          .optional()
          .describe(
            "List of previous task IDs or task names this task depends on, supports two referencing methods, name referencing is more intuitive, and is a string array"
          ),
        notes: z
          .string()
          .optional()
          .describe("Supplementary notes, special processing requirements or implementation suggestions (optional)"),
        relatedFiles: z
          .array(
            z.object({
              path: z
                .string()
                .min(1, {
                  message: "File path cannot be empty",
                })
                .describe("File path, can be a path relative to the project root directory or an absolute path"),
              type: z
                .nativeEnum(RelatedFileType)
                .describe(
                  "File type (TO_MODIFY: to be modified, REFERENCE: reference material, CREATE: to be created, DEPENDENCY: dependency file, OTHER: other)"
                ),
              description: z
                .string()
                .min(1, {
                  message: "File description cannot be empty",
                })
                .describe("File description, used to explain the purpose and content of the file"),
              lineStart: z
                .number()
                .int()
                .positive()
                .optional()
                .describe("Starting line of the relevant code block (optional)"),
              lineEnd: z
                .number()
                .int()
                .positive()
                .optional()
                .describe("Ending line of the relevant code block (optional)"),
            })
          )
          .optional()
          .describe(
            "List of files related to the task, used to record code files, reference materials, files to be created, etc. related to the task (optional)"
          ),
        verificationCriteria: z
          .string()
          .optional()
          .describe("Verification criteria and inspection methods for this specific task"),
      })
    )
    .min(1, {
      message: "Please provide at least one task",
    })
    .describe(
      "Structured task list, each task should be atomic and have a clear completion standard, avoid overly simple tasks, simple modifications can be integrated with other tasks, avoid too many tasks"
    ),
  globalAnalysisResult: z
    .string()
    .optional()
    .describe("Global analysis result: complete analysis result from reflect_task, applicable to the common parts of all tasks"),
});

export async function splitTasks({
  updateMode,
  tasks,
  globalAnalysisResult,
}: z.infer<typeof splitTasksSchema>) {
  try {
    // Check if there are duplicate names in the tasks
    const nameSet = new Set();
    for (const task of tasks) {
      if (nameSet.has(task.name)) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Duplicate task names exist in the tasks parameter, please ensure that each task name is unique",
            },
          ],
        };
      }
      nameSet.add(task.name);
    }

    // Process tasks based on different update modes
    let message = "";
    let actionSuccess = true;
    let backupFile = null;
    let createdTasks: Task[] = [];
    let allTasks: Task[] = [];

    // Convert task data to the format required for batchCreateOrUpdateTasks
    const convertedTasks = tasks.map((task) => ({
      name: task.name,
      description: task.description,
      notes: task.notes,
      dependencies: task.dependencies,
      implementationGuide: task.implementationGuide,
      verificationCriteria: task.verificationCriteria,
      relatedFiles: task.relatedFiles?.map((file) => ({
        path: file.path,
        type: file.type as RelatedFileType,
        description: file.description,
        lineStart: file.lineStart,
        lineEnd: file.lineEnd,
      })),
    }));

    // Process clearAllTasks mode
    if (updateMode === "clearAllTasks") {
      const clearResult = await modelClearAllTasks();

      if (clearResult.success) {
        message = clearResult.message;
        backupFile = clearResult.backupFile;

        try {
          // Clear tasks and then create new tasks
          createdTasks = await batchCreateOrUpdateTasks(
            convertedTasks,
            "append",
            globalAnalysisResult
          );
          message += `\nSuccessfully created ${createdTasks.length} new tasks.`;
        } catch (error) {
          actionSuccess = false;
          message += `\nError occurred when creating new tasks: ${
            error instanceof Error ? error.message : String(error)
          }`;
        }
      } else {
        actionSuccess = false;
        message = clearResult.message;
      }
    } else {
      // For other modes, directly use batchCreateOrUpdateTasks
      try {
        createdTasks = await batchCreateOrUpdateTasks(
          convertedTasks,
          updateMode,
          globalAnalysisResult
        );

        // Generate messages based on different update modes
        switch (updateMode) {
          case "append":
            message = `Successfully appended ${createdTasks.length} new tasks.`;
            break;
          case "overwrite":
            message = `Successfully cleared unfinished tasks and created ${createdTasks.length} new tasks.`;
            break;
          case "selective":
            message = `Successfully selectively updated/created ${createdTasks.length} tasks.`;
            break;
        }
      } catch (error) {
        actionSuccess = false;
        message = `Task creation failed: ${
          error instanceof Error ? error.message : String(error)
        }`;
      }
    }

    // Add or update the project rules update task with dependencies on all created tasks
    if (actionSuccess && createdTasks.length > 0) {
      try {
        // Get IDs of all created tasks to set as dependencies
        const taskIds = createdTasks.map(task => task.id);
        
        // Create or update the project rules update task
        const rulesUpdateTask = await ensureProjectRulesUpdateTask(taskIds);
        
        // Add this task to the created tasks list if it's new
        if (!createdTasks.some(task => task.id === rulesUpdateTask.id)) {
          createdTasks.push(rulesUpdateTask);
          message += `\nAdded a final task for updating project rules based on completed tasks.`;
        }
      } catch (error) {
        // Don't fail the entire operation if adding this task fails
        message += `\nNote: Could not add the project rules update task: ${
          error instanceof Error ? error.message : String(error)
        }`;
      }
    }

    // Get all tasks for displaying dependency relationships
    try {
      allTasks = await getAllTasks();
    } catch (error) {
      allTasks = [...createdTasks]; // If retrieval fails, use just created tasks
    }

    // Use prompt generator to get the final prompt
    const prompt = getSplitTasksPrompt({
      updateMode,
      createdTasks,
      allTasks,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: prompt,
        },
      ],
      ephemeral: {
        taskCreationResult: {
          success: actionSuccess,
          message,
          backupFilePath: backupFile,
        },
      },
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text:
            "Error occurred when executing task splitting: " +
            (error instanceof Error ? error.message : String(error)),
        },
      ],
    };
  }
}

export const listTasksSchema = z.object({
  status: z
    .enum(["all", "pending", "in_progress", "completed"])
    .describe("Task status to list, can choose 'all' to list all tasks, or specify specific status"),
});

// List tasks tool
export async function listTasks({ status }: z.infer<typeof listTasksSchema>) {
  const tasks = await getAllTasks();
  let filteredTasks = tasks;
  switch (status) {
    case "all":
      break;
    case "pending":
      filteredTasks = tasks.filter(
        (task) => task.status === TaskStatus.PENDING
      );
      break;
    case "in_progress":
      filteredTasks = tasks.filter(
        (task) => task.status === TaskStatus.IN_PROGRESS
      );
      break;
    case "completed":
      filteredTasks = tasks.filter(
        (task) => task.status === TaskStatus.COMPLETED
      );
      break;
  }

  if (filteredTasks.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: `## System Notification\n\nCurrently, there are no ${
            status === "all" ? "any" : `any ${status} `
          }tasks in the system. Please query other status tasks or first use the "split_tasks" tool to create task structure, then proceed with subsequent operations.`,
        },
      ],
    };
  }

  const tasksByStatus = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  // Use prompt generator to get the final prompt
  const prompt = getListTasksPrompt({
    status,
    tasks: tasksByStatus,
    allTasks: filteredTasks,
  });

  return {
    content: [
      {
        type: "text" as const,
        text: prompt,
      },
    ],
  };
}

// Execute task tool
export const executeTaskSchema = z.object({
  taskId: z
    .string()
    .uuid({
      message: "Task ID must be a valid UUID format",
    })
    .describe("Unique identifier of the task to execute, must be an existing valid task ID in the system"),
});

export async function executeTask({
  taskId,
}: z.infer<typeof executeTaskSchema>) {
  try {
    // Check if the task exists
    const task = await getTaskById(taskId);
    if (!task) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Task with ID \`${taskId}\` not found. Please confirm if the ID is correct.`,
          },
        ],
      };
    }

    // Check if the task can be executed (all dependencies are completed)
    const executionCheck = await canExecuteTask(taskId);
    if (!executionCheck.canExecute) {
      const blockedByTasksText =
        executionCheck.blockedBy && executionCheck.blockedBy.length > 0
          ? `Blocked by the following unfinished dependency tasks: ${executionCheck.blockedBy.join(", ")}`
          : "Unable to determine blocking reason";

      return {
        content: [
          {
            type: "text" as const,
            text: `Task "${task.name}" (ID: \`${taskId}\`) cannot be executed at this time. ${blockedByTasksText}`,
          },
        ],
      };
    }

    // If the task is already marked as "in progress", prompt the user
    if (task.status === TaskStatus.IN_PROGRESS) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Task "${task.name}" (ID: \`${taskId}\`) is already in progress.`,
          },
        ],
      };
    }

    // If the task is already marked as "completed", prompt the user
    if (task.status === TaskStatus.COMPLETED) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Task "${task.name}" (ID: \`${taskId}\`) has been marked as completed. If you need to execute it again, please delete the task and recreate it first.`,
          },
        ],
      };
    }

    // Update task status to "in progress"
    await updateTaskStatus(taskId, TaskStatus.IN_PROGRESS);

    // Assess task complexity
    const complexityResult = await assessTaskComplexity(taskId);

    // Convert complexity result to appropriate format
    const complexityAssessment = complexityResult
      ? {
          level: complexityResult.level,
          metrics: {
            descriptionLength: complexityResult.metrics.descriptionLength,
            dependenciesCount: complexityResult.metrics.dependenciesCount,
          },
          recommendations: complexityResult.recommendations,
        }
      : undefined;

    // Get dependency tasks, for displaying completion summary
    const dependencyTasks: Task[] = [];
    if (task.dependencies && task.dependencies.length > 0) {
      for (const dep of task.dependencies) {
        const depTask = await getTaskById(dep.taskId);
        if (depTask) {
          dependencyTasks.push(depTask);
        }
      }
    }

    // Load task-related file content
    let relatedFilesSummary = "";
    if (task.relatedFiles && task.relatedFiles.length > 0) {
      try {
        const relatedFilesResult = await loadTaskRelatedFiles(
          task.relatedFiles
        );
        relatedFilesSummary =
          typeof relatedFilesResult === "string"
            ? relatedFilesResult
            : relatedFilesResult.summary || "";
      } catch (error) {
        relatedFilesSummary =
          "Error loading related files, please check the files manually.";
      }
    }

    // Use prompt generator to get the final prompt
    const prompt = getExecuteTaskPrompt({
      task,
      complexityAssessment,
      relatedFilesSummary,
      dependencyTasks,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: prompt,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error occurred when executing task: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
}

// Verify task tool
export const verifyTaskSchema = z.object({
  taskId: z
    .string()
    .uuid({ message: "Invalid task ID format, please provide a valid UUID format" })
    .describe("Unique identifier of the task to verify, must be an existing valid task ID in the system"),
});

export async function verifyTask({ taskId }: z.infer<typeof verifyTaskSchema>) {
  const task = await getTaskById(taskId);

  if (!task) {
    return {
      content: [
        {
          type: "text" as const,
          text: `## System Error\n\nTask with ID \`${taskId}\` not found. Please use the "list_tasks" tool to confirm a valid task ID before trying again.`,
        },
      ],
      isError: true,
    };
  }

  if (task.status !== TaskStatus.IN_PROGRESS) {
    return {
      content: [
        {
          type: "text" as const,
          text: `## Status Error\n\nTask "${task.name}" (ID: \`${task.id}\`) current status is "${task.status}", not in progress state, cannot be verified.\n\nOnly tasks in "in progress" state can be verified. Please use the "execute_task" tool to start task execution first.`,
        },
      ],
      isError: true,
    };
  }

  // Use prompt generator to get the final prompt
  const prompt = getVerifyTaskPrompt({ task });

  return {
    content: [
      {
        type: "text" as const,
        text: prompt,
      },
    ],
  };
}

// Complete task tool
export const completeTaskSchema = z.object({
  taskId: z
    .string()
    .uuid({ message: "Invalid task ID format, please provide a valid UUID format" })
    .describe(
      "Unique identifier of the task to mark as completed, must be a valid unfinished task ID in the status of \"in progress\""
    ),
  summary: z
    .string()
    .min(30, {
      message: "Task summary too short, please provide a more detailed completion report, including implementation results and main decisions",
    })
    .optional()
    .describe(
      "Task completion summary, concise description of implementation results and important decisions (optional, will be automatically generated if not provided)"
    ),
});

export async function completeTask({
  taskId,
  summary,
}: z.infer<typeof completeTaskSchema>) {
  const task = await getTaskById(taskId);

  if (!task) {
    return {
      content: [
        {
          type: "text" as const,
          text: `## System Error\n\nTask with ID \`${taskId}\` not found. Please use the "list_tasks" tool to confirm a valid task ID before trying again.`,
        },
      ],
      isError: true,
    };
  }

  if (task.status !== TaskStatus.IN_PROGRESS) {
    return {
      content: [
        {
          type: "text" as const,
          text: `## Status Error\n\nTask "${task.name}" (ID: \`${task.id}\`) current status is "${task.status}", not in progress state, cannot mark as completed.\n\nOnly tasks in "in progress" state can be marked as completed. Please use the "execute_task" tool to start task execution first.`,
        },
      ],
      isError: true,
    };
  }

  // Process summary information
  let taskSummary = summary;
  if (!taskSummary) {
    // Automatically generate summary
    taskSummary = generateTaskSummary(task.name, task.description);
  }

  // Update task status to completed and add summary
  await updateTaskStatus(taskId, TaskStatus.COMPLETED);
  await updateTaskSummary(taskId, taskSummary);

  // Use prompt generator to get the final prompt
  const prompt = getCompleteTaskPrompt({
    task,
    completionTime: new Date().toISOString(),
  });

  return {
    content: [
      {
        type: "text" as const,
        text: prompt,
      },
    ],
  };
}

// Delete task tool
export const deleteTaskSchema = z.object({
  taskId: z
    .string()
    .uuid({ message: "Invalid task ID format, please provide a valid UUID format" })
    .describe("Unique identifier of the task to delete, must be an existing unfinished task ID in the system"),
});

export async function deleteTask({ taskId }: z.infer<typeof deleteTaskSchema>) {
  const task = await getTaskById(taskId);

  if (!task) {
    return {
      content: [
        {
          type: "text" as const,
          text: getDeleteTaskPrompt({ taskId }),
        },
      ],
      isError: true,
    };
  }

  if (task.status === TaskStatus.COMPLETED) {
    return {
      content: [
        {
          type: "text" as const,
          text: getDeleteTaskPrompt({ taskId, task, isTaskCompleted: true }),
        },
      ],
      isError: true,
    };
  }

  const result = await modelDeleteTask(taskId);

  return {
    content: [
      {
        type: "text" as const,
        text: getDeleteTaskPrompt({
          taskId,
          task,
          success: result.success,
          message: result.message,
        }),
      },
    ],
    isError: !result.success,
  };
}

// Clear all tasks tool
export const clearAllTasksSchema = z.object({
  confirm: z
    .boolean()
    .refine((val) => val === true, {
      message:
        "Must clearly confirm the clear operation, please set the confirm parameter to true to confirm this dangerous operation",
    })
    .describe("Confirm to delete all unfinished tasks (this operation is irreversible)"),
});

export async function clearAllTasks({
  confirm,
}: z.infer<typeof clearAllTasksSchema>) {
  // Security check: If not confirmed, refuse operation
  if (!confirm) {
    return {
      content: [
        {
          type: "text" as const,
          text: getClearAllTasksPrompt({ confirm: false }),
        },
      ],
    };
  }

  // Check if there are really tasks to clear
  const allTasks = await getAllTasks();
  if (allTasks.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: getClearAllTasksPrompt({ isEmpty: true }),
        },
      ],
    };
  }

  // Execute clear operation
  const result = await modelClearAllTasks();

  return {
    content: [
      {
        type: "text" as const,
        text: getClearAllTasksPrompt({
          success: result.success,
          message: result.message,
          backupFile: result.backupFile,
        }),
      },
    ],
    isError: !result.success,
  };
}

// Update task content tool
export const updateTaskContentSchema = z.object({
  taskId: z
    .string()
    .uuid({ message: "Invalid task ID format, please provide a valid UUID format" })
    .describe("Unique identifier of the task to update, must be an existing and unfinished task ID in the system"),
  name: z.string().optional().describe("New name for the task (optional)"),
  description: z.string().optional().describe("New description content for the task (optional)"),
  notes: z.string().optional().describe("New supplementary notes for the task (optional)"),
  dependencies: z
    .array(z.string())
    .optional()
    .describe("New dependency relationships for the task (optional)"),
  relatedFiles: z
    .array(
      z.object({
        path: z
          .string()
          .min(1, { message: "File path cannot be empty, please provide a valid file path" })
          .describe("File path, can be a path relative to the project root directory or an absolute path"),
        type: z
          .nativeEnum(RelatedFileType)
          .describe(
            "Relationship type between the file and task (TO_MODIFY, REFERENCE, CREATE, DEPENDENCY, OTHER)"
          ),
        description: z.string().optional().describe("Supplementary description of the file (optional)"),
        lineStart: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("Starting line of the relevant code block (optional)"),
        lineEnd: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("Ending line of the relevant code block (optional)"),
      })
    )
    .optional()
    .describe(
      "List of files related to the task, used to record code files, reference materials, files to be created, etc. related to the task (optional)"
    ),
  implementationGuide: z
    .string()
    .optional()
    .describe("New implementation guide for the task (optional)"),
  verificationCriteria: z
    .string()
    .optional()
    .describe("New verification criteria for the task (optional)"),
});

export async function updateTaskContent({
  taskId,
  name,
  description,
  notes,
  relatedFiles,
  dependencies,
  implementationGuide,
  verificationCriteria,
}: z.infer<typeof updateTaskContentSchema>) {
  if (relatedFiles) {
    for (const file of relatedFiles) {
      if (
        (file.lineStart && !file.lineEnd) ||
        (!file.lineStart && file.lineEnd) ||
        (file.lineStart && file.lineEnd && file.lineStart > file.lineEnd)
      ) {
        return {
          content: [
            {
              type: "text" as const,
              text: getUpdateTaskContentPrompt({
                taskId,
                validationError:
                  "Invalid line number settings: must set both start and end lines, and the start line must be less than the end line",
              }),
            },
          ],
        };
      }
    }
  }

  if (
    !(
      name ||
      description ||
      notes ||
      dependencies ||
      implementationGuide ||
      verificationCriteria ||
      relatedFiles
    )
  ) {
    return {
      content: [
        {
          type: "text" as const,
          text: getUpdateTaskContentPrompt({
            taskId,
            emptyUpdate: true,
          }),
        },
      ],
    };
  }

  // Get the task to check if it exists
  const task = await getTaskById(taskId);

  if (!task) {
    return {
      content: [
        {
          type: "text" as const,
          text: getUpdateTaskContentPrompt({
            taskId,
          }),
        },
      ],
      isError: true,
    };
  }

  // Record the task and content to be updated
  let updateSummary = `Preparing to update task: ${task.name} (ID: ${task.id})`;
  if (name) updateSummary += `, new name: ${name}`;
  if (description) updateSummary += `, update description`;
  if (notes) updateSummary += `, update notes`;
  if (relatedFiles)
    updateSummary += `, update related files (${relatedFiles.length})`;
  if (dependencies)
    updateSummary += `, update dependencies (${dependencies.length})`;
  if (implementationGuide) updateSummary += `, update implementation guide`;
  if (verificationCriteria) updateSummary += `, update verification criteria`;

  // Execute the update operation
  const result = await modelUpdateTaskContent(taskId, {
    name,
    description,
    notes,
    relatedFiles,
    dependencies,
    implementationGuide,
    verificationCriteria,
  });

  return {
    content: [
      {
        type: "text" as const,
        text: getUpdateTaskContentPrompt({
          taskId,
          task,
          success: result.success,
          message: result.message,
          updatedTask: result.task,
        }),
      },
    ],
    isError: !result.success,
  };
}

// Query task tool
export const queryTaskSchema = z.object({
  query: z
    .string()
    .min(1, {
      message: "Query content cannot be empty, please provide task ID or search keywords",
    })
    .describe("Search query text, can be task ID or multiple keywords (space separated)"),
  isId: z
    .boolean()
    .optional()
    .default(false)
    .describe("Specify whether it's ID query mode, default is no (keyword mode)"),
  page: z
    .number()
    .int()
    .positive()
    .optional()
    .default(1)
    .describe("Page number, default is page 1"),
  pageSize: z
    .number()
    .int()
    .positive()
    .min(1)
    .max(20)
    .optional()
    .default(5)
    .describe("Number of tasks to display per page, default is 5, maximum 20"),
});

export async function queryTask({
  query,
  isId = false,
  page = 1,
  pageSize = 3,
}: z.infer<typeof queryTaskSchema>) {
  try {
    // Use system command search function
    const results = await searchTasksWithCommand(query, isId, page, pageSize);

    // Use prompt generator to get the final prompt
    const prompt = getQueryTaskPrompt({
      query,
      isId,
      tasks: results.tasks,
      totalTasks: results.pagination.totalResults,
      page: results.pagination.currentPage,
      pageSize,
      totalPages: results.pagination.totalPages,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: prompt,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `## System Error\n\nError occurred when querying tasks: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
}

// Get complete task detail parameter
export const getTaskDetailSchema = z.object({
  taskId: z
    .string()
    .min(1, {
      message: "Task ID cannot be empty, please provide a valid task ID",
    })
    .describe("Task ID to view details"),
});

// Get complete task detail
export async function getTaskDetail({
  taskId,
}: z.infer<typeof getTaskDetailSchema>) {
  try {
    // Use searchTasksWithCommand instead of getTaskById to implement memory area task search
    // Set isId to true to search by ID; page number is 1, page size is 1
    const result = await searchTasksWithCommand(taskId, true, 1, 1);

    // Check if the task is found
    if (result.tasks.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: `## Error\n\nTask with ID \`${taskId}\` not found. Please confirm if the task ID is correct.`,
          },
        ],
        isError: true,
      };
    }

    // Get the found task (the first and only one)
    const task = result.tasks[0];

    // Use prompt generator to get the final prompt
    const prompt = getTaskDetailPrompt({
      taskId,
      task,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: prompt,
        },
      ],
    };
  } catch (error) {
    // Use prompt generator to get error message
    const errorPrompt = getTaskDetailPrompt({
      taskId,
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      content: [
        {
          type: "text" as const,
          text: errorPrompt,
        },
      ],
      isError: true,
    };
  }
}
