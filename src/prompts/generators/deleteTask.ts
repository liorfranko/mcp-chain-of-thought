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
  isCompleted?: boolean;
  isSuccess?: boolean;
  error?: string;
  taskNotFound?: boolean;
}

/**
 * Get the complete deleteTask prompt
 * @param params prompt parameters
 * @returns generated prompt
 */
export function getDeleteTaskPrompt(params: DeleteTaskPromptParams): string {
  const { taskId, task, isCompleted, isSuccess, error, taskNotFound } = params;

  // Handle case where task doesn't exist
  if (taskNotFound) {
    const notFoundTemplate = loadPromptFromTemplate("deleteTask/notFound.md");
    return generatePrompt(notFoundTemplate, {
      taskId,
    });
  }

  // Handle case where task is already completed
  if (isCompleted) {
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
    isSuccess: isSuccess || false,
    error: error || "",
  });

  // Load possible custom prompt
  return loadPrompt(prompt, "DELETE_TASK");
}
