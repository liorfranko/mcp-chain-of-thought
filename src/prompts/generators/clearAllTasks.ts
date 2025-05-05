/**
 * clearAllTasks prompt generator
 * Responsible for combining templates and parameters into the final prompt
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";

/**
 * clearAllTasks prompt parameter interface
 */
export interface ClearAllTasksPromptParams {
  confirm?: boolean;
  success?: boolean;
  message?: string;
  backupFile?: string;
  isEmpty?: boolean;
}

/**
 * Get complete clearAllTasks prompt
 * @param params prompt parameters
 * @returns generated prompt
 */
export function getClearAllTasksPrompt(
  params: ClearAllTasksPromptParams
): string {
  const { confirm, success, message, backupFile, isEmpty } = params;

  // Handle unconfirmed case
  if (confirm === false) {
    const cancelTemplate = loadPromptFromTemplate("clearAllTasks/cancel.md");
    return generatePrompt(cancelTemplate, {});
  }

  // Handle case when no tasks need to be cleared
  if (isEmpty) {
    const emptyTemplate = loadPromptFromTemplate("clearAllTasks/empty.md");
    return generatePrompt(emptyTemplate, {});
  }

  // Handle successful or failed clearing
  const responseTitle = success ? "Success" : "Failure";

  // Generate backupInfo using template
  const backupInfo = backupFile
    ? generatePrompt(loadPromptFromTemplate("clearAllTasks/backupInfo.md"), {
        backupFile,
      })
    : "";

  const indexTemplate = loadPromptFromTemplate("clearAllTasks/index.md");
  const prompt = generatePrompt(indexTemplate, {
    responseTitle,
    message,
    backupInfo,
  });

  // Load possible custom prompt
  return loadPrompt(prompt, "CLEAR_ALL_TASKS");
}
