/**
 * splitTasks prompt generator
 * Responsible for combining templates and parameters into the final prompt
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { Task } from "../../types/index.js";

/**
 * splitTasks prompt parameter interface
 */
export interface SplitTasksPromptParams {
  globalAnalysisResult: string;
  memoryDir: string;
  updateMode: "append" | "overwrite" | "selective" | "clearAllTasks";
  tasks?: Task[];
}

/**
 * Get the complete splitTasks prompt
 * @param params prompt parameters
 * @returns generated prompt
 */
export function getSplitTasksPrompt(params: SplitTasksPromptParams): string {
  const indexTemplate = loadPromptFromTemplate("splitTasks/index.md");

  let tasksContext = "";
  if (params.tasks && params.tasks.length > 0) {
    const taskDetailsTemplate = loadPromptFromTemplate("splitTasks/taskDetails.md");

    // Convert task list to formatted task details
    let taskDetailsContent = "";
    params.tasks.forEach((task, index) => {
      // Format dependencies if they exist
      let dependenciesContent = "";
      if (task.dependencies && task.dependencies.length > 0) {
        dependenciesContent = 
          task.dependencies
            .map(dep => {
              // Find dependency task name for more friendly display
              const depTaskName = params.tasks?.find(t => t.id === dep.taskId)?.name || dep.taskId;
              return `\`${depTaskName}\``;
            })
            .join(", ");
      }

      taskDetailsContent += `Task ${index + 1}:\n`;
      taskDetailsContent += `- ID: ${task.id}\n`;
      taskDetailsContent += `- Name: ${task.name}\n`;
      taskDetailsContent += `- Description: ${task.description}\n`;
      
      if (dependenciesContent) {
        taskDetailsContent += `- Dependencies: ${dependenciesContent}\n`;
      }
      
      taskDetailsContent += `- Status: ${task.status}\n\n`;
    });

    tasksContext = generatePrompt(taskDetailsTemplate, {
      taskCount: params.tasks.length.toString(),
      taskDetails: taskDetailsContent
    });
  }

  let prompt = generatePrompt(indexTemplate, {
    globalAnalysisResult: params.globalAnalysisResult,
    tasksContext: tasksContext,
    updateMode: params.updateMode,
    memoryDir: params.memoryDir
  });

  // Load possible custom prompt
  return loadPrompt(prompt, "SPLIT_TASKS");
}
