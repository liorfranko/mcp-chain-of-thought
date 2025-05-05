/**
 * analyzeTask prompt generator
 * Responsible for combining templates and parameters into the final prompt
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";

/**
 * analyzeTask prompt parameter interface
 */
export interface AnalyzeTaskPromptParams {
  summary: string;
  initialConcept: string;
  previousAnalysis?: string;
}

/**
 * Get the complete analyzeTask prompt
 * @param params prompt parameters
 * @returns generated prompt
 */
export function getAnalyzeTaskPrompt(params: AnalyzeTaskPromptParams): string {
  const indexTemplate = loadPromptFromTemplate("analyzeTask/index.md");

  const iterationTemplate = loadPromptFromTemplate("analyzeTask/iteration.md");

  let iterationPrompt = "";
  if (params.previousAnalysis) {
    iterationPrompt = generatePrompt(iterationTemplate, {
      previousAnalysis: params.previousAnalysis,
    });
  }

  let prompt = generatePrompt(indexTemplate, {
    summary: params.summary,
    initialConcept: params.initialConcept,
    iterationPrompt: iterationPrompt,
  });

  // Load possible custom prompt
  return loadPrompt(prompt, "ANALYZE_TASK");
}
