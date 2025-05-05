/**
 * getTaskDetail prompt generator
 * Responsible for combining templates and parameters into the final prompt
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { Task } from "../../types/index.js";

/**
 * getTaskDetail prompt parameter interface
 */
export interface GetTaskDetailPromptParams {
  taskId: string;
  error?: string;
  task?: Task;
  relatedFilesSummary?: string;
}

/**
 * Get the complete getTaskDetail prompt
 * @param params prompt parameters
 * @returns generated prompt
 */
export function getTaskDetailPrompt(params: GetTaskDetailPromptParams): string {
  const { taskId, error, task, relatedFilesSummary } = params;

  // If there's an error, show error message
  if (error) {
    const errorTemplate = loadPromptFromTemplate("getTaskDetail/error.md");
    return generatePrompt(errorTemplate, {
      taskId,
      error,
    });
  }

  // If task not found, show task not found message
  if (!task) {
    const notFoundTemplate = loadPromptFromTemplate(
      "getTaskDetail/notFound.md"
    );
    return generatePrompt(notFoundTemplate, {
      taskId,
    });
  }

  // Process task files if available
  let filesContentPrompt = "";
  const filesTemplate = loadPromptFromTemplate("getTaskDetail/relatedFiles.md"); // Moved this line
  
  if (relatedFilesSummary) {
    filesContentPrompt = generatePrompt(filesTemplate, {
      relatedFilesSummary,
    });
  }

  // Process task implementation guide if available
  let implementationGuidePrompt = "";
  if (task.implementationGuide) {
    const implementationGuideTemplate = loadPromptFromTemplate(
      "getTaskDetail/implementationGuide.md"
    );
    implementationGuidePrompt = generatePrompt(implementationGuideTemplate, {
      implementationGuide: task.implementationGuide,
    });
  }

  // Process task verification criteria if available
  let verificationCriteriaPrompt = "";
  if (task.verificationCriteria) {
    const verificationCriteriaTemplate = loadPromptFromTemplate(
      "getTaskDetail/verificationCriteria.md"
    );
    verificationCriteriaPrompt = generatePrompt(verificationCriteriaTemplate, {
      verificationCriteria: task.verificationCriteria,
    });
  }

  // Process task analysis result if available
  let analysisResultPrompt = "";
  if (task.analysisResult) {
    const analysisResultTemplate = loadPromptFromTemplate(
      "getTaskDetail/analysisResult.md"
    );
    analysisResultPrompt = generatePrompt(analysisResultTemplate, {
      analysisResult: task.analysisResult,
    });
  }

  // Process task notes if available
  let notesPrompt = "";
  if (task.notes) {
    const notesTemplate = loadPromptFromTemplate("getTaskDetail/notes.md");
    notesPrompt = generatePrompt(notesTemplate, {
      notes: task.notes,
    });
  }

  // Process task summary if completed
  let summaryPrompt = "";
  if (task.completedAt && task.summary) {
    const summaryTemplate = loadPromptFromTemplate("getTaskDetail/complatedSummary.md");
    summaryPrompt = generatePrompt(summaryTemplate, {
      summary: task.summary || "*No completion summary*",
    });
  }

  // Start building the base prompt
  const indexTemplate = loadPromptFromTemplate("getTaskDetail/index.md");
  
  let prompt = generatePrompt(indexTemplate, {
    id: task.id,
    name: task.name,
    description: task.description,
    status: task.status,
    createdAt: task.createdAt ? task.createdAt.toLocaleString() : "unknown",
    completedAt: task.completedAt ? task.completedAt.toLocaleString() : "not completed",
    notesTemplate: notesPrompt,
    implementationGuideTemplate: implementationGuidePrompt,
    verificationCriteriaTemplate: verificationCriteriaPrompt,
    analysisResultTemplate: analysisResultPrompt,
    summaryTemplate: summaryPrompt,
    filesTemplate: filesContentPrompt,
  });

  // Load possible custom prompt
  return loadPrompt(prompt, "GET_TASK_DETAIL");
}
