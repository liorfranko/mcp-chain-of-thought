/**
 * completeTask prompt generator
 * Responsible for combining templates and parameters into the final prompt
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { Task } from "../../types/index.js";

/**
 * completeTask prompt parameter interface
 */
export interface CompleteTaskPromptParams {
  task: Task;
  summary?: string;
}

/**
 * Get the complete completeTask prompt
 * @param params prompt parameters
 * @returns generated prompt
 */
export function getCompleteTaskPrompt(params: CompleteTaskPromptParams): string {
  const { task, summary } = params;

  const indexTemplate = loadPromptFromTemplate("completeTask/index.md");

  // Start building the base prompt
  let prompt = generatePrompt(indexTemplate, {
    taskName: task.name,
    taskId: task.id,
    taskDescription: task.description,
    summary: summary || "",
  });

  // Load possible custom prompt
  return loadPrompt(prompt, "COMPLETE_TASK");
}
