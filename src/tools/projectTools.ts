import { z } from "zod";
import { getInitProjectRulesPrompt } from "../prompts/index.js";
import { getRulesFilePath, ensureRulesFileExists } from "../utils/pathUtils.js";

// Define schema
export const initProjectRulesSchema = z.object({});

/**
 * Initialize project rules tool function
 * Provides guidance for creating specification documents
 */
export async function initProjectRules() {
  try {
    // Get prompts from generator
    const promptContent = getInitProjectRulesPrompt();

    // Ensure rules.md file exists in the DATA_DIR directory
    await ensureRulesFileExists();

    // Output the path to the rules file to help users find it
    const rulesPath = getRulesFilePath();

    // Return success response
    return {
      content: [
        {
          type: "text" as const,
          text: promptContent + `\n\nRules file will be located at: ${rulesPath}`,
        },
      ],
    };
  } catch (error) {
    // Error handling
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      content: [
        {
          type: "text" as const,
          text: `Error initializing project rules: ${errorMessage}`,
        },
      ],
    };
  }
}
