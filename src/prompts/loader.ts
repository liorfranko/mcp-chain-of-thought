/**
 * Prompt loader
 * Provides functionality to load customized prompts from environment variables
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function processEnvString(input: string | undefined): string {
  if (!input) return "";

  return input
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\r/g, "\r");
}

/**
 * Load prompt, support customization via environment variables
 * @param basePrompt Base prompt content
 * @param promptKey Key name of the prompt, used to generate environment variable name
 * @returns Final prompt content
 */
export function loadPrompt(basePrompt: string, promptKey: string): string {
  // Convert to uppercase, as part of environment variable
  const envKey = promptKey.toUpperCase();

  // Check if there's an environment variable for replacement mode
  const overrideEnvVar = `MCP_PROMPT_${envKey}`;
  if (process.env[overrideEnvVar]) {
    // Use environment variable to completely replace original prompt
    return processEnvString(process.env[overrideEnvVar]);
  }

  // Check if there's an environment variable for append mode
  const appendEnvVar = `MCP_PROMPT_${envKey}_APPEND`;
  if (process.env[appendEnvVar]) {
    // Append environment variable content to original prompt
    return `${basePrompt}\n\n${processEnvString(process.env[appendEnvVar])}`;
  }

  // If no customization, use original prompt
  return basePrompt;
}

/**
 * Generate prompt with dynamic parameters
 * @param promptTemplate Prompt template
 * @param params Dynamic parameters
 * @returns Prompt with parameters filled in
 */
export function generatePrompt(
  promptTemplate: string,
  params: Record<string, any> = {}
): string {
  // Use simple template replacement method, replace {paramName} with corresponding parameter value
  let result = promptTemplate;

  Object.entries(params).forEach(([key, value]) => {
    // If value is undefined or null, replace with empty string
    const replacementValue =
      value !== undefined && value !== null ? String(value) : "";

    // Use regular expression to replace all matching placeholders
    const placeholder = new RegExp(`\\{${key}\\}`, "g");
    result = result.replace(placeholder, replacementValue);
  });

  return result;
}

/**
 * Load prompt from template
 * @param templatePath Relative path to template from template set root directory (e.g., 'chat/basic.md')
 * @returns Template content
 * @throws Error if template file not found
 */
export function loadPromptFromTemplate(templatePath: string): string {
  const templateSetName = process.env.TEMPLATES_USE || "en";
  const dataDir = process.env.DATA_DIR;
  const builtInTemplatesBaseDir = __dirname;

  let finalPath = "";
  const checkedPaths: string[] = []; // For more detailed error reporting

  // 1. Check for custom path in DATA_DIR
  if (dataDir) {
    // path.resolve can handle if templateSetName is an absolute path
    const customFilePath = path.resolve(dataDir, templateSetName, templatePath);
    checkedPaths.push(`Custom: ${customFilePath}`);
    if (fs.existsSync(customFilePath)) {
      finalPath = customFilePath;
    }
  }

  // 2. If custom path not found, check specific built-in template directory
  if (!finalPath) {
    // Assume templateSetName for built-in templates is 'en', 'zh', etc.
    const specificBuiltInFilePath = path.join(
      builtInTemplatesBaseDir,
      `templates_${templateSetName}`,
      templatePath
    );
    checkedPaths.push(`Specific Built-in: ${specificBuiltInFilePath}`);
    if (fs.existsSync(specificBuiltInFilePath)) {
      finalPath = specificBuiltInFilePath;
    }
  }

  // 3. If specific built-in template also not found, and it's not 'en' (avoid duplicate check)
  if (!finalPath && templateSetName !== "en") {
    const defaultBuiltInFilePath = path.join(
      builtInTemplatesBaseDir,
      "templates_en",
      templatePath
    );
    checkedPaths.push(`Default Built-in ('en'): ${defaultBuiltInFilePath}`);
    if (fs.existsSync(defaultBuiltInFilePath)) {
      finalPath = defaultBuiltInFilePath;
    }
  }

  // 4. If all paths can't find the template, throw error
  if (!finalPath) {
    throw new Error(
      `Template file not found: '${templatePath}' in template set '${templateSetName}'. Checked paths:\n - ${checkedPaths.join(
        "\n - "
      )}`
    );
  }

  // 5. Read the found file
  return fs.readFileSync(finalPath, "utf-8");
}
