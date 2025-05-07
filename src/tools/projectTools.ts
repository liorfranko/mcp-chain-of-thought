import { z } from "zod";
import { getInitProjectRulesPrompt } from "../prompts/index.js";
import { 
  getRulesFilePath, 
  ensureRulesFileExists,
  getMcpChainOfThoughtRulesFilePath,
  ensureMcpChainOfThoughtRulesFileExists
} from "../utils/pathUtils.js";

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

    // Ensure MCP chain of thought rules file exists
    await ensureMcpChainOfThoughtRulesFileExists();

    // Output the paths to the rules files to help users find them
    const rulesPath = getRulesFilePath();
    const mcpRulesPath = getMcpChainOfThoughtRulesFilePath();

    // Return success response
    return {
      content: [
        {
          type: "text" as const,
          text: promptContent + `\n\nRules file will be located at: ${rulesPath}\nMCP Chain of Thought rules file created at: ${mcpRulesPath}`,
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
