/**
 * executeTask prompt generator
 * Responsible for combining templates and parameters into the final prompt
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { Task, TaskStatus } from "../../types/index.js";

/**
 * Task complexity assessment interface
 */
interface ComplexityAssessment {
  level: string;
  metrics: {
    descriptionLength: number;
    dependenciesCount: number;
  };
  recommendations?: string[];
}

/**
 * executeTask prompt parameter interface
 */
export interface ExecuteTaskPromptParams {
  task: Task;
  complexityAssessment?: ComplexityAssessment;
  relatedFilesSummary?: string;
  dependencyTasks?: Task[];
}

/**
 * Get styled text for complexity level
 * @param level complexity level
 * @returns styled text
 */
function getComplexityStyle(level: string): string {
  switch (level) {
    case "VERY_HIGH":
      return "⚠️ **Warning: This task has extremely high complexity** ⚠️";
    case "HIGH":
      return "⚠️ **Note: This task has high complexity**";
    case "MEDIUM":
      return "**Tip: This task has moderate complexity**";
    default:
      return "";
  }
}

/**
 * Get complexity-based guidance for subtask evaluation
 * @param level complexity level
 * @returns guidance text
 */
function getComplexityBasedGuidance(level: string): string {
  switch (level) {
    case "VERY_HIGH":
      return "⚠️ This task has very high complexity. It is strongly recommended to split it into multiple subtasks. You should have compelling reasons if you choose not to split this task.";
    case "HIGH":
      return "This task has high complexity. Strongly consider splitting it into smaller subtasks for better manageability and reduced risk. If you decide not to split, you must justify your decision.";
    case "MEDIUM":
      return "This task has moderate complexity. Consider if there are natural boundaries for splitting, but proceeding with a single task may be appropriate.";
    default: // LOW
      return "This task appears to be low complexity. Splitting is typically not necessary unless you identify specific reasons.";
  }
}

/**
 * Get the complete executeTask prompt
 * @param params prompt parameters
 * @returns generated prompt
 */
export function getExecuteTaskPrompt(params: ExecuteTaskPromptParams): string {
  const { task, complexityAssessment, relatedFilesSummary, dependencyTasks } =
    params;

  const notesTemplate = loadPromptFromTemplate("executeTask/notes.md");
  let notesPrompt = "";
  if (task.notes) {
    notesPrompt = generatePrompt(notesTemplate, {
      notes: task.notes,
    });
  }

  const implementationGuideTemplate = loadPromptFromTemplate(
    "executeTask/implementationGuide.md"
  );
  let implementationGuidePrompt = "";
  if (task.implementationGuide) {
    implementationGuidePrompt = generatePrompt(implementationGuideTemplate, {
      implementationGuide: task.implementationGuide,
    });
  }

  const verificationCriteriaTemplate = loadPromptFromTemplate(
    "executeTask/verificationCriteria.md"
  );
  let verificationCriteriaPrompt = "";
  if (task.verificationCriteria) {
    verificationCriteriaPrompt = generatePrompt(verificationCriteriaTemplate, {
      verificationCriteria: task.verificationCriteria,
    });
  }

  const analysisResultTemplate = loadPromptFromTemplate(
    "executeTask/analysisResult.md"
  );
  let analysisResultPrompt = "";
  if (task.analysisResult) {
    analysisResultPrompt = generatePrompt(analysisResultTemplate, {
      analysisResult: task.analysisResult,
    });
  }

  const dependencyTasksTemplate = loadPromptFromTemplate(
    "executeTask/dependencyTasks.md"
  );
  let dependencyTasksPrompt = "";
  if (dependencyTasks && dependencyTasks.length > 0) {
    const completedDependencyTasks = dependencyTasks.filter(
      (t) => t.status === TaskStatus.COMPLETED && t.summary
    );

    if (completedDependencyTasks.length > 0) {
      let dependencyTasksContent = "";
      for (const depTask of completedDependencyTasks) {
        dependencyTasksContent += `### ${depTask.name}\n${
          depTask.summary || "*No completion summary*"
        }\n\n`;
      }
      dependencyTasksPrompt = generatePrompt(dependencyTasksTemplate, {
        dependencyTasks: dependencyTasksContent,
      });
    }
  }

  const relatedFilesSummaryTemplate = loadPromptFromTemplate(
    "executeTask/relatedFilesSummary.md"
  );
  let relatedFilesSummaryPrompt = "";
  relatedFilesSummaryPrompt = generatePrompt(relatedFilesSummaryTemplate, {
    relatedFilesSummary: relatedFilesSummary || "The current task has no related files.",
  });

  const complexityTemplate = loadPromptFromTemplate(
    "executeTask/complexity.md"
  );
  let complexityPrompt = "";
  if (complexityAssessment) {
    const complexityStyle = getComplexityStyle(complexityAssessment.level);
    let recommendationContent = "";
    if (
      complexityAssessment.recommendations &&
      complexityAssessment.recommendations.length > 0
    ) {
      for (const recommendation of complexityAssessment.recommendations) {
        recommendationContent += `- ${recommendation}\n`;
      }
    }
    complexityPrompt = generatePrompt(complexityTemplate, {
      level: complexityAssessment.level,
      complexityStyle: complexityStyle,
      descriptionLength: complexityAssessment.metrics.descriptionLength,
      dependenciesCount: complexityAssessment.metrics.dependenciesCount,
      recommendation: recommendationContent,
    });
  }

  const subtaskEvaluationTemplate = loadPromptFromTemplate(
    "executeTask/subtaskEvaluation.md"
  );
  let subtaskEvaluationPrompt = "";
  if (complexityAssessment) {
    const complexityBasedGuidance = getComplexityBasedGuidance(complexityAssessment.level);
    subtaskEvaluationPrompt = generatePrompt(subtaskEvaluationTemplate, {
      complexityBasedGuidance,
    });
  } else {
    // Default guidance if complexity assessment is missing
    subtaskEvaluationPrompt = generatePrompt(subtaskEvaluationTemplate, {
      complexityBasedGuidance: "Unable to determine task complexity. Evaluate the task based on your understanding and the assessment criteria.",
    });
  }

  const indexTemplate = loadPromptFromTemplate("executeTask/index.md");
  let prompt = generatePrompt(indexTemplate, {
    name: task.name,
    id: task.id,
    description: task.description,
    notesTemplate: notesPrompt,
    implementationGuideTemplate: implementationGuidePrompt,
    verificationCriteriaTemplate: verificationCriteriaPrompt,
    analysisResultTemplate: analysisResultPrompt,
    dependencyTasksTemplate: dependencyTasksPrompt,
    relatedFilesSummaryTemplate: relatedFilesSummaryPrompt,
    complexityTemplate: complexityPrompt,
    subtaskEvaluationTemplate: subtaskEvaluationPrompt,
  });

  // Load possible custom prompt
  return loadPrompt(prompt, "EXECUTE_TASK");
}
