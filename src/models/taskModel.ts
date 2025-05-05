import {
  Task,
  TaskStatus,
  TaskDependency,
  TaskComplexityLevel,
  TaskComplexityThresholds,
  TaskComplexityAssessment,
  RelatedFile,
} from "../types/index.js";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { promisify } from "util";

// Ensure project folder path is obtained
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../..");

// Data file paths
const DATA_DIR = process.env.DATA_DIR || path.join(PROJECT_ROOT, "data");
const TASKS_FILE = path.join(DATA_DIR, "tasks.json");

// Convert exec to Promise form
const execPromise = promisify(exec);

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch (error) {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.access(TASKS_FILE);
  } catch (error) {
    await fs.writeFile(TASKS_FILE, JSON.stringify({ tasks: [] }));
  }
}

// Read all tasks
async function readTasks(): Promise<Task[]> {
  await ensureDataDir();
  const data = await fs.readFile(TASKS_FILE, "utf-8");
  const tasks = JSON.parse(data).tasks;

  // Convert date strings back to Date objects
  return tasks.map((task: any) => ({
    ...task,
    createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
    updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
  }));
}

// Write all tasks
async function writeTasks(tasks: Task[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(TASKS_FILE, JSON.stringify({ tasks }, null, 2));
}

// Get all tasks
export async function getAllTasks(): Promise<Task[]> {
  return await readTasks();
}

// Get task by ID
export async function getTaskById(taskId: string): Promise<Task | null> {
  const tasks = await readTasks();
  return tasks.find((task) => task.id === taskId) || null;
}

// Create new task
export async function createTask(
  name: string,
  description: string,
  notes?: string,
  dependencies: string[] = [],
  relatedFiles?: RelatedFile[]
): Promise<Task> {
  const tasks = await readTasks();

  const dependencyObjects: TaskDependency[] = dependencies.map((taskId) => ({
    taskId,
  }));

  const newTask: Task = {
    id: uuidv4(),
    name,
    description,
    notes,
    status: TaskStatus.PENDING,
    dependencies: dependencyObjects,
    createdAt: new Date(),
    updatedAt: new Date(),
    relatedFiles,
  };

  tasks.push(newTask);
  await writeTasks(tasks);

  return newTask;
}

// Update task
export async function updateTask(
  taskId: string,
  updates: Partial<Task>
): Promise<Task | null> {
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return null;
  }

  // Check if task is completed, completed tasks cannot be updated (except for explicitly allowed fields)
  if (tasks[taskIndex].status === TaskStatus.COMPLETED) {
    // Only allow updating the summary field and relatedFiles field
    const allowedFields = ["summary", "relatedFiles"];
    const attemptedFields = Object.keys(updates);

    const disallowedFields = attemptedFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (disallowedFields.length > 0) {
      return null;
    }
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date(),
  };

  await writeTasks(tasks);

  return tasks[taskIndex];
}

// Update task status
export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<Task | null> {
  const updates: Partial<Task> = { status };

  if (status === TaskStatus.COMPLETED) {
    updates.completedAt = new Date();
  }

  return await updateTask(taskId, updates);
}

// Update task summary
export async function updateTaskSummary(
  taskId: string,
  summary: string
): Promise<Task | null> {
  return await updateTask(taskId, { summary });
}

/**
 * Update task conversation history
 * Adds a new message to the task's conversation history
 * @param taskId Unique identifier of the task
 * @param role Role of the message sender (user or assistant)
 * @param content Content of the message
 * @param toolName Optional name of the tool associated with the message
 * @returns Updated task or null if task not found
 */
export async function updateTaskConversationHistory(
  taskId: string,
  role: 'user' | 'assistant',
  content: string,
  toolName?: string
): Promise<Task | null> {
  // Get task and check if it exists
  const task = await getTaskById(taskId);

  if (!task) {
    return null;
  }

  // Create new conversation message
  const message = {
    timestamp: new Date(),
    role,
    content,
    toolName
  };

  // Create conversation history array if it doesn't exist
  const conversationHistory = task.conversationHistory || [];
  
  // Add new message to conversation history
  const updatedConversationHistory = [...conversationHistory, message];

  // Update task with new conversation history
  return await updateTask(taskId, { conversationHistory: updatedConversationHistory });
}

// Update task content
export async function updateTaskContent(
  taskId: string,
  updates: {
    name?: string;
    description?: string;
    notes?: string;
    relatedFiles?: RelatedFile[];
    dependencies?: string[];
    implementationGuide?: string;
    verificationCriteria?: string;
  }
): Promise<{ success: boolean; message: string; task?: Task }> {
  // Get task and check if it exists
  const task = await getTaskById(taskId);

  if (!task) {
    return { success: false, message: "Task not found" };
  }

  // Check if task is completed
  if (task.status === TaskStatus.COMPLETED) {
    return { success: false, message: "Cannot update completed tasks" };
  }

  // Build update object, only include fields that need to be updated
  const updateObj: Partial<Task> = {};

  if (updates.name !== undefined) {
    updateObj.name = updates.name;
  }

  if (updates.description !== undefined) {
    updateObj.description = updates.description;
  }

  if (updates.notes !== undefined) {
    updateObj.notes = updates.notes;
  }

  if (updates.relatedFiles !== undefined) {
    updateObj.relatedFiles = updates.relatedFiles;
  }

  if (updates.dependencies !== undefined) {
    updateObj.dependencies = updates.dependencies.map((dep) => ({
      taskId: dep,
    }));
  }

  if (updates.implementationGuide !== undefined) {
    updateObj.implementationGuide = updates.implementationGuide;
  }

  if (updates.verificationCriteria !== undefined) {
    updateObj.verificationCriteria = updates.verificationCriteria;
  }

  // If there's no content to update, return early
  if (Object.keys(updateObj).length === 0) {
    return { success: true, message: "No content provided to update", task };
  }

  // Execute update
  const updatedTask = await updateTask(taskId, updateObj);

  if (!updatedTask) {
    return { success: false, message: "Error updating task" };
  }

  return {
    success: true,
    message: "Task content updated successfully",
    task: updatedTask,
  };
}

// Update task related files
export async function updateTaskRelatedFiles(
  taskId: string,
  relatedFiles: RelatedFile[]
): Promise<{ success: boolean; message: string; task?: Task }> {
  // Get task and check if it exists
  const task = await getTaskById(taskId);

  if (!task) {
    return { success: false, message: "Task not found" };
  }

  // Check if task is completed
  if (task.status === TaskStatus.COMPLETED) {
    return { success: false, message: "Cannot update completed tasks" };
  }

  // Execute update
  const updatedTask = await updateTask(taskId, { relatedFiles });

  if (!updatedTask) {
    return { success: false, message: "Error updating task related files" };
  }

  return {
    success: true,
    message: `Task related files updated successfully, ${relatedFiles.length} files updated`,
    task: updatedTask,
  };
}

// Batch create or update tasks
export async function batchCreateOrUpdateTasks(
  taskDataList: Array<{
    name: string;
    description: string;
    notes?: string;
    dependencies?: string[];
    relatedFiles?: RelatedFile[];
    implementationGuide?: string; // Added: Implementation Guide
    verificationCriteria?: string; // Added: Verification Criteria
  }>,
  updateMode: "append" | "overwrite" | "selective" | "clearAllTasks", // Required parameter, specify task update strategy
  globalAnalysisResult?: string // Added: Global Analysis Result
): Promise<Task[]> {
  // Read existing tasks
  const existingTasks = await readTasks();

  // Process existing tasks based on update mode
  let tasksToKeep: Task[] = [];

  if (updateMode === "append") {
    // Append mode: keep all existing tasks
    tasksToKeep = [...existingTasks];
  } else if (updateMode === "overwrite") {
    // Overwrite mode: keep only completed tasks, clear all incomplete tasks
    tasksToKeep = existingTasks.filter(
      (task) => task.status === TaskStatus.COMPLETED
    );
  } else if (updateMode === "selective") {
    // Selective update mode: selectively update based on task name, keep tasks not in update list
    // 1. Extract list of tasks to be updated
    const updateTaskNames = new Set(taskDataList.map((task) => task.name));

    // 2. Keep all tasks not appearing in update list
    tasksToKeep = existingTasks.filter(
      (task) => !updateTaskNames.has(task.name)
    );
  } else if (updateMode === "clearAllTasks") {
    // Clear all tasks mode: empty task list
    tasksToKeep = [];
  }

  // This map will be used to store name to task ID mapping for supporting task reference by name
  const taskNameToIdMap = new Map<string, string>();

  // For selective update mode, first record existing task names and IDs
  if (updateMode === "selective") {
    existingTasks.forEach((task) => {
      taskNameToIdMap.set(task.name, task.id);
    });
  }

  // Record all task names and IDs, whether to keep tasks or new tasks
  // This will be used later for parsing dependencies
  tasksToKeep.forEach((task) => {
    taskNameToIdMap.set(task.name, task.id);
  });

  // Create new task list
  const newTasks: Task[] = [];

  for (const taskData of taskDataList) {
    // Check if selective update mode and task name already exists
    if (updateMode === "selective" && taskNameToIdMap.has(taskData.name)) {
      // Get existing task ID
      const existingTaskId = taskNameToIdMap.get(taskData.name)!;

      // Find existing task
      const existingTaskIndex = existingTasks.findIndex(
        (task) => task.id === existingTaskId
      );

      // If existing task found and it's not completed, update it
      if (
        existingTaskIndex !== -1 &&
        existingTasks[existingTaskIndex].status !== TaskStatus.COMPLETED
      ) {
        const taskToUpdate = existingTasks[existingTaskIndex];

        // Update task basic information, but keep original ID, creation time, etc.
        const updatedTask: Task = {
          ...taskToUpdate,
          name: taskData.name,
          description: taskData.description,
          notes: taskData.notes,
          // Will handle dependencies later
          updatedAt: new Date(),
          // Added: Save Implementation Guide (if any)
          implementationGuide: taskData.implementationGuide,
          // Added: Save Verification Criteria (if any)
          verificationCriteria: taskData.verificationCriteria,
          // Added: Save Global Analysis Result (if any)
          analysisResult: globalAnalysisResult,
        };

        // Handle related files (if any)
        if (taskData.relatedFiles) {
          updatedTask.relatedFiles = taskData.relatedFiles;
        }

        // Add updated task to new task list
        newTasks.push(updatedTask);

        // Remove this task from tasksToKeep as it's already updated and added to newTasks
        tasksToKeep = tasksToKeep.filter((task) => task.id !== existingTaskId);
      }
    } else {
      // Create new task
      const newTaskId = uuidv4();

      // Add new task name and ID to map
      taskNameToIdMap.set(taskData.name, newTaskId);

      const newTask: Task = {
        id: newTaskId,
        name: taskData.name,
        description: taskData.description,
        notes: taskData.notes,
        status: TaskStatus.PENDING,
        dependencies: [], // Will fill later
        createdAt: new Date(),
        updatedAt: new Date(),
        relatedFiles: taskData.relatedFiles,
        // Added: Save Implementation Guide (if any)
        implementationGuide: taskData.implementationGuide,
        // Added: Save Verification Criteria (if any)
        verificationCriteria: taskData.verificationCriteria,
        // Added: Save Global Analysis Result (if any)
        analysisResult: globalAnalysisResult,
      };

      newTasks.push(newTask);
    }
  }

  // Handle task dependencies
  for (let i = 0; i < taskDataList.length; i++) {
    const taskData = taskDataList[i];
    const newTask = newTasks[i];

    // If there are dependencies, handle them
    if (taskData.dependencies && taskData.dependencies.length > 0) {
      const resolvedDependencies: TaskDependency[] = [];

      for (const dependencyName of taskData.dependencies) {
        // First try to interpret dependency as task ID
        let dependencyTaskId = dependencyName;

        // If dependency looks not like UUID, try to interpret it as task name
        if (
          !dependencyName.match(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
          )
        ) {
          // If map has this name, use corresponding ID
          if (taskNameToIdMap.has(dependencyName)) {
            dependencyTaskId = taskNameToIdMap.get(dependencyName)!;
          } else {
            continue; // Skip this dependency
          }
        } else {
          // UUID format, but need to confirm this ID corresponds to actual existing task
          const idExists = [...tasksToKeep, ...newTasks].some(
            (task) => task.id === dependencyTaskId
          );
          if (!idExists) {
            continue; // Skip this dependency
          }
        }

        resolvedDependencies.push({ taskId: dependencyTaskId });
      }

      newTask.dependencies = resolvedDependencies;
    }
  }

  // Merge kept tasks and new tasks
  const allTasks = [...tasksToKeep, ...newTasks];

  // Write updated task list
  await writeTasks(allTasks);

  return newTasks;
}

// Check if task can be executed (all dependencies are completed)
export async function canExecuteTask(
  taskId: string
): Promise<{ canExecute: boolean; blockedBy?: string[] }> {
  const task = await getTaskById(taskId);

  if (!task) {
    return { canExecute: false };
  }

  if (task.status === TaskStatus.COMPLETED) {
    return { canExecute: false }; // Completed tasks don't need to be executed
  }

  if (task.dependencies.length === 0) {
    return { canExecute: true }; // Tasks without dependencies can be executed directly
  }

  const allTasks = await readTasks();
  const blockedBy: string[] = [];

  for (const dependency of task.dependencies) {
    const dependencyTask = allTasks.find((t) => t.id === dependency.taskId);

    if (!dependencyTask || dependencyTask.status !== TaskStatus.COMPLETED) {
      blockedBy.push(dependency.taskId);
    }
  }

  return {
    canExecute: blockedBy.length === 0,
    blockedBy: blockedBy.length > 0 ? blockedBy : undefined,
  };
}

// Delete task
export async function deleteTask(
  taskId: string
): Promise<{ success: boolean; message: string }> {
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return { success: false, message: "Task not found" };
  }

  // Check task status, completed tasks cannot be deleted
  if (tasks[taskIndex].status === TaskStatus.COMPLETED) {
    return { success: false, message: "Cannot delete completed tasks" };
  }

  // Check if other tasks depend on this task
  const allTasks = tasks.filter((_, index) => index !== taskIndex);
  const dependentTasks = allTasks.filter((task) =>
    task.dependencies.some((dep) => dep.taskId === taskId)
  );

  if (dependentTasks.length > 0) {
    const dependentTaskNames = dependentTasks
      .map((task) => `"${task.name}" (ID: ${task.id})`)
      .join(", ");
    return {
      success: false,
      message: `Cannot delete this task, because the following tasks depend on it: ${dependentTaskNames}`,
    };
  }

  // Execute delete operation
  tasks.splice(taskIndex, 1);
  await writeTasks(tasks);

  return { success: true, message: "Task deleted successfully" };
}

// Assess task complexity
export async function assessTaskComplexity(
  taskId: string
): Promise<TaskComplexityAssessment | null> {
  const task = await getTaskById(taskId);

  if (!task) {
    return null;
  }

  // Assess various indicators
  const descriptionLength = task.description.length;
  const dependenciesCount = task.dependencies.length;
  const notesLength = task.notes ? task.notes.length : 0;
  const hasNotes = !!task.notes;

  // Based on various indicators, assess complexity level
  let level = TaskComplexityLevel.LOW;

  // Description length assessment
  if (
    descriptionLength >= TaskComplexityThresholds.DESCRIPTION_LENGTH.VERY_HIGH
  ) {
    level = TaskComplexityLevel.VERY_HIGH;
  } else if (
    descriptionLength >= TaskComplexityThresholds.DESCRIPTION_LENGTH.HIGH
  ) {
    level = TaskComplexityLevel.HIGH;
  } else if (
    descriptionLength >= TaskComplexityThresholds.DESCRIPTION_LENGTH.MEDIUM
  ) {
    level = TaskComplexityLevel.MEDIUM;
  }

  // Dependencies count assessment (take highest level)
  if (
    dependenciesCount >= TaskComplexityThresholds.DEPENDENCIES_COUNT.VERY_HIGH
  ) {
    level = TaskComplexityLevel.VERY_HIGH;
  } else if (
    dependenciesCount >= TaskComplexityThresholds.DEPENDENCIES_COUNT.HIGH &&
    level !== TaskComplexityLevel.VERY_HIGH
  ) {
    level = TaskComplexityLevel.HIGH;
  } else if (
    dependenciesCount >= TaskComplexityThresholds.DEPENDENCIES_COUNT.MEDIUM &&
    level !== TaskComplexityLevel.HIGH &&
    level !== TaskComplexityLevel.VERY_HIGH
  ) {
    level = TaskComplexityLevel.MEDIUM;
  }

  // Notes length assessment (take highest level)
  if (notesLength >= TaskComplexityThresholds.NOTES_LENGTH.VERY_HIGH) {
    level = TaskComplexityLevel.VERY_HIGH;
  } else if (
    notesLength >= TaskComplexityThresholds.NOTES_LENGTH.HIGH &&
    level !== TaskComplexityLevel.VERY_HIGH
  ) {
    level = TaskComplexityLevel.HIGH;
  } else if (
    notesLength >= TaskComplexityThresholds.NOTES_LENGTH.MEDIUM &&
    level !== TaskComplexityLevel.HIGH &&
    level !== TaskComplexityLevel.VERY_HIGH
  ) {
    level = TaskComplexityLevel.MEDIUM;
  }

  // Based on complexity level, generate processing suggestions
  const recommendations: string[] = [];

  // Low complexity task suggestions
  if (level === TaskComplexityLevel.LOW) {
    recommendations.push("This task is low complexity, can be executed directly");
    recommendations.push("Suggest setting clear completion standards, ensuring acceptance has clear basis");
  }
  // Medium complexity task suggestions
  else if (level === TaskComplexityLevel.MEDIUM) {
    recommendations.push("This task has some complexity, suggest detailed planning execution steps");
    recommendations.push("Can be executed in stages and periodically check progress, ensure understanding accurate and complete implementation");
    if (dependenciesCount > 0) {
      recommendations.push("Pay attention to check completion status and output quality of all dependent tasks");
    }
  }
  // High complexity task suggestions
  else if (level === TaskComplexityLevel.HIGH) {
    recommendations.push("This task has high complexity, suggest thorough analysis and planning");
    recommendations.push("Consider breaking down the task into smaller, independently executable sub-tasks");
    recommendations.push("Establish clear milestones and checkpoints, facilitate tracking progress and quality");
    if (
      dependenciesCount > TaskComplexityThresholds.DEPENDENCIES_COUNT.MEDIUM
    ) {
      recommendations.push(
        "Many dependent tasks, suggest making dependent relationship diagram, ensure execution sequence correct"
      );
    }
  }
  // Very high complexity task suggestions
  else if (level === TaskComplexityLevel.VERY_HIGH) {
    recommendations.push("⚠️ This task is very high complexity, strongly suggest breaking down into multiple independent tasks");
    recommendations.push(
      "Thorough analysis and planning before execution, clearly define scope and interface of each sub-task"
    );
    recommendations.push(
      "Risk assessment for the task, identify possible obstacles and develop countermeasures"
    );
    recommendations.push("Establish specific test and verification standards, ensure output quality of each sub-task");
    if (
      descriptionLength >= TaskComplexityThresholds.DESCRIPTION_LENGTH.VERY_HIGH
    ) {
      recommendations.push(
        "Task description is very long, suggest organizing key points and establishing structured execution list"
      );
    }
    if (dependenciesCount >= TaskComplexityThresholds.DEPENDENCIES_COUNT.HIGH) {
      recommendations.push(
        "Too many dependent tasks, suggest re-evaluating task boundaries, ensure task splitting reasonable"
      );
    }
  }

  return {
    level,
    metrics: {
      descriptionLength,
      dependenciesCount,
      notesLength,
      hasNotes,
    },
    recommendations,
  };
}

// Clear all tasks
export async function clearAllTasks(): Promise<{
  success: boolean;
  message: string;
  backupFile?: string;
}> {
  try {
    // Ensure data directory exists
    await ensureDataDir();

    // Read existing tasks
    const allTasks = await readTasks();

    // If there are no tasks, return directly
    if (allTasks.length === 0) {
      return { success: true, message: "No tasks need to be cleared" };
    }

    // Filter out completed tasks
    const completedTasks = allTasks.filter(
      (task) => task.status === TaskStatus.COMPLETED
    );

    // Create backup file name
    const timestamp = new Date()
      .toISOString()
      .replace(/:/g, "-")
      .replace(/\..+/, "");
    const backupFileName = `tasks_memory_${timestamp}.json`;

    // Ensure memory directory exists
    const MEMORY_DIR = path.join(DATA_DIR, "memory");
    try {
      await fs.access(MEMORY_DIR);
    } catch (error) {
      await fs.mkdir(MEMORY_DIR, { recursive: true });
    }

    // Create memory directory backup path
    const memoryFilePath = path.join(MEMORY_DIR, backupFileName);

    // Write to memory directory at the same time (only include completed tasks)
    await fs.writeFile(
      memoryFilePath,
      JSON.stringify({ tasks: completedTasks }, null, 2)
    );

    // Clear task file
    await writeTasks([]);

    return {
      success: true,
      message: `All tasks cleared successfully, ${allTasks.length} tasks deleted, ${completedTasks.length} completed tasks backed up to memory directory`,
      backupFile: backupFileName,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error clearing tasks: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

// Use system command to search task memory
export async function searchTasksWithCommand(
  query: string,
  isId: boolean = false,
  page: number = 1,
  pageSize: number = 5
): Promise<{
  tasks: Task[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    hasMore: boolean;
  };
}> {
  // Read current task file tasks
  const currentTasks = await readTasks();
  let memoryTasks: Task[] = [];

  // Search memory folder tasks
  const MEMORY_DIR = path.join(DATA_DIR, "memory");

  try {
    // Ensure memory folder exists
    await fs.access(MEMORY_DIR);

    // Generate search command
    const cmd = generateSearchCommand(query, isId, MEMORY_DIR);

    // If there's search command, execute it
    if (cmd) {
      try {
        const { stdout } = await execPromise(cmd, {
          maxBuffer: 1024 * 1024 * 10,
        });

        if (stdout) {
          // Parse search results, extract matching file paths
          const matchedFiles = new Set<string>();

          stdout.split("\n").forEach((line) => {
            if (line.trim()) {
              // Format usually is: file path:matching content
              const filePath = line.split(":")[0];
              if (filePath) {
                matchedFiles.add(filePath);
              }
            }
          });

          // Limit read file quantity
          const MAX_FILES_TO_READ = 10;
          const sortedFiles = Array.from(matchedFiles)
            .sort()
            .reverse()
            .slice(0, MAX_FILES_TO_READ);

          // Only process files that meet conditions
          for (const filePath of sortedFiles) {
            try {
              const data = await fs.readFile(filePath, "utf-8");
              const tasks = JSON.parse(data).tasks || [];

              // Format date fields
              const formattedTasks = tasks.map((task: any) => ({
                ...task,
                createdAt: task.createdAt
                  ? new Date(task.createdAt)
                  : new Date(),
                updatedAt: task.updatedAt
                  ? new Date(task.updatedAt)
                  : new Date(),
                completedAt: task.completedAt
                  ? new Date(task.completedAt)
                  : undefined,
              }));

              // Further filter tasks to ensure conditions are met
              const filteredTasks = isId
                ? formattedTasks.filter((task: Task) => task.id === query)
                : formattedTasks.filter((task: Task) => {
                    const keywords = query
                      .split(/\s+/)
                      .filter((k) => k.length > 0);
                    if (keywords.length === 0) return true;

                    return keywords.every((keyword) => {
                      const lowerKeyword = keyword.toLowerCase();
                      return (
                        task.name.toLowerCase().includes(lowerKeyword) ||
                        task.description.toLowerCase().includes(lowerKeyword) ||
                        (task.notes &&
                          task.notes.toLowerCase().includes(lowerKeyword)) ||
                        (task.implementationGuide &&
                          task.implementationGuide
                            .toLowerCase()
                            .includes(lowerKeyword)) ||
                        (task.summary &&
                          task.summary.toLowerCase().includes(lowerKeyword))
                      );
                    });
                  });

              memoryTasks.push(...filteredTasks);
            } catch (error: unknown) {}
          }
        }
      } catch (error: unknown) {}
    }
  } catch (error: unknown) {}

  // Filter tasks that match the conditions from current tasks
  const filteredCurrentTasks = filterCurrentTasks(currentTasks, query, isId);

  // Merge results and remove duplicates
  const taskMap = new Map<string, Task>();

  // Current tasks take priority
  filteredCurrentTasks.forEach((task) => {
    taskMap.set(task.id, task);
  });

  // Add memory tasks, avoid duplicates
  memoryTasks.forEach((task) => {
    if (!taskMap.has(task.id)) {
      taskMap.set(task.id, task);
    }
  });

  // Combined results
  const allTasks = Array.from(taskMap.values());

  // Sort - by update or completion time in descending order
  allTasks.sort((a, b) => {
    // Sort by completion time first
    if (a.completedAt && b.completedAt) {
      return b.completedAt.getTime() - a.completedAt.getTime();
    } else if (a.completedAt) {
      return -1; // a is completed but b is not, a comes first
    } else if (b.completedAt) {
      return 1; // b is completed but a is not, b comes first
    }

    // Otherwise sort by update time
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  // Pagination processing
  const totalResults = allTasks.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  const safePage = Math.max(1, Math.min(page, totalPages || 1)); // Ensure page number is valid
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalResults);
  const paginatedTasks = allTasks.slice(startIndex, endIndex);

  return {
    tasks: paginatedTasks,
    pagination: {
      currentPage: safePage,
      totalPages: totalPages || 1,
      totalResults,
      hasMore: safePage < totalPages,
    },
  };
}

// Generate appropriate search command based on platform
function generateSearchCommand(
  query: string,
  isId: boolean,
  memoryDir: string
): string {
  // Safely escape user input
  const safeQuery = escapeShellArg(query);
  const keywords = safeQuery.split(/\s+/).filter((k) => k.length > 0);

  // Detect operating system type
  const isWindows = process.platform === "win32";

  if (isWindows) {
    // Windows environment, use findstr command
    if (isId) {
      // ID search
      return `findstr /s /i /c:"${safeQuery}" "${memoryDir}\\*.json"`;
    } else if (keywords.length === 1) {
      // Single keyword
      return `findstr /s /i /c:"${safeQuery}" "${memoryDir}\\*.json"`;
    } else {
      // Multiple keyword search - Use PowerShell in Windows
      const keywordPatterns = keywords.map((k) => `'${k}'`).join(" -and ");
      return `powershell -Command "Get-ChildItem -Path '${memoryDir}' -Filter *.json -Recurse | Select-String -Pattern ${keywordPatterns} | ForEach-Object { $_.Path }"`;
    }
  } else {
    // Unix/Linux/MacOS environment, use grep command
    if (isId) {
      return `grep -r --include="*.json" "${safeQuery}" "${memoryDir}"`;
    } else if (keywords.length === 1) {
      return `grep -r --include="*.json" "${safeQuery}" "${memoryDir}"`;
    } else {
      // Multiple keywords connected with pipe for multiple grep commands
      const firstKeyword = escapeShellArg(keywords[0]);
      const otherKeywords = keywords.slice(1).map((k) => escapeShellArg(k));

      let cmd = `grep -r --include="*.json" "${firstKeyword}" "${memoryDir}"`;
      for (const keyword of otherKeywords) {
        cmd += ` | grep "${keyword}"`;
      }
      return cmd;
    }
  }
}

/**
 * Safely escape shell parameters to prevent command injection
 */
function escapeShellArg(arg: string): string {
  if (!arg) return "";

  // Remove all control characters and special characters
  return arg
    .replace(/[\x00-\x1F\x7F]/g, "") // Control characters
    .replace(/[&;`$"'<>|]/g, ""); // Shell special characters
}

// Filter current tasks
function filterCurrentTasks(
  tasks: Task[],
  query: string,
  isId: boolean
): Task[] {
  if (isId) {
    return tasks.filter((task) => task.id === query);
  } else {
    const keywords = query.split(/\s+/).filter((k) => k.length > 0);
    if (keywords.length === 0) return tasks;

    return tasks.filter((task) => {
      return keywords.every((keyword) => {
        const lowerKeyword = keyword.toLowerCase();
        return (
          task.name.toLowerCase().includes(lowerKeyword) ||
          task.description.toLowerCase().includes(lowerKeyword) ||
          (task.notes && task.notes.toLowerCase().includes(lowerKeyword)) ||
          (task.implementationGuide &&
            task.implementationGuide.toLowerCase().includes(lowerKeyword)) ||
          (task.summary && task.summary.toLowerCase().includes(lowerKeyword))
        );
      });
    });
  }
}
