/**
 * deleteTask prompt generator
 * Responsible for combining templates and parameters into the final prompt
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { Task } from "../../types/index.js";

/**
 * deleteTask prompt parameter interface
 */
export interface DeleteTaskPromptParams {
  taskId: string;
  task?: Task;
  isTaskCompleted?: boolean;
  isSuccess?: boolean;
  success?: boolean;
  message?: string;
  error?: string;
  taskNotFound?: boolean;
}

/**
 * Get the complete deleteTask prompt
 * @param params prompt parameters
 * @returns generated prompt
 */
export function getDeleteTaskPrompt(params: DeleteTaskPromptParams): string {
  const { taskId, task, isTaskCompleted, isSuccess, success, error, taskNotFound, message } = params;

  // Handle case where task doesn't exist
  if (taskNotFound) {
    const notFoundTemplate = loadPromptFromTemplate("deleteTask/notFound.md");
    return generatePrompt(notFoundTemplate, {
      taskId,
    });
  }

  // Handle case where task is already completed
  if (isTaskCompleted) {
    const completedTemplate = loadPromptFromTemplate(
      "deleteTask/taskCompleted.md"
    );
    return generatePrompt(completedTemplate, {
      taskId,
      taskName: task?.name || "",
    });
  }

  // Handle case of successful or failed deletion
  const resultTemplate = loadPromptFromTemplate("deleteTask/result.md");
  let prompt = generatePrompt(resultTemplate, {
    taskId,
    taskName: task?.name || "",
    isSuccess: isSuccess || success || false,
    error: error || "",
    message: message || "",
  });

  // Load possible custom prompt
  return loadPrompt(prompt, "DELETE_TASK");
}
