import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get project root directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, "../..");

// Get data directory path
const DATA_DIR = process.env.DATA_DIR || path.join(PROJECT_ROOT, "data");

/**
 * Get rules file path
 * @returns Complete path to the rules file
 */
export function getRulesFilePath(): string {
  return path.join(DATA_DIR, "rules.md");
}

/**
 * Ensure rules file exists
 * If the file doesn't exist, it will try to copy from root directory or create an empty file
 */
export async function ensureRulesFileExists(): Promise<void> {
  const dataRulesPath = getRulesFilePath();

  try {
    // Check if rules file exists in DATA_DIR directory
    await fs.access(dataRulesPath);
  } catch (error) {
    // Rules file doesn't exist in DATA_DIR directory
    await fs.mkdir(path.dirname(dataRulesPath), { recursive: true });
    await fs.writeFile(
      dataRulesPath,
      "# Development Guidelines\n\nPlease define project standards in this file.",
      "utf-8"
    );
  }
}
