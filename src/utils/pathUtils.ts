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
 * Get MCP chain of thought rules file path
 * @returns Complete path to the MCP chain of thought rules file
 */
export function getMcpChainOfThoughtRulesFilePath(): string {
  return path.join(PROJECT_ROOT, ".cursor", "rules", "chain-of-thought-mcp.mdc");
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
/**
 * Ensure MCP chain of thought rules file exists
 * If the file doesn't exist, it will create it with the default content
 */
export async function ensureMcpChainOfThoughtRulesFileExists(): Promise<void> {
  const mcpRulesFilePath = getMcpChainOfThoughtRulesFilePath();

  try {
    // Check if MCP rules file exists
    await fs.access(mcpRulesFilePath);
  } catch (error) {
    // MCP rules file doesn't exist
    await fs.mkdir(path.dirname(mcpRulesFilePath), { recursive: true });
    await fs.writeFile(
      mcpRulesFilePath,
      `---
description: 
globs: 
alwaysApply: true
---      
# MCP Chain of Thought Task Management Rule

When assisting users with task management, planning, and execution, ALWAYS implement the MCP (Master Control Program) Chain of Thought methodology. This systematic approach ensures thorough task analysis, planning, and execution through a structured thinking process.

## Core Chain of Thought Workflow

1. **Task Planning** (\`planTask\`)
   - Initialize each task with clear objectives and success criteria
   - Establish comprehensive task context and requirements
   - Define expected outcomes and deliverables

2. **Task Analysis** (\`analyzeTask\`)
   - Perform deep technical analysis of requirements
   - Evaluate feasibility and identify potential risks
   - Create initial solution concepts

3. **Task Reflection** (\`reflectTask\`)
   - Review analysis results critically
   - Validate solution completeness
   - Identify optimization opportunities

4. **Task Decomposition** (\`splitTasks\`)
   - Break down complex tasks into manageable subtasks
   - Establish clear dependencies and priorities
   - Ensure atomic, verifiable task units

## Implementation Requirements

- **MUST** follow the complete Chain of Thought workflow for all task management operations
- **MUST** use appropriate MCP tools for each stage of the workflow (plan → analyze → reflect → split)
- **MUST** maintain task context and dependencies throughout the workflow
- **MUST** verify task completion against original requirements
- **MUST** document thought process and decisions at each stage

## Task Management Guidelines

- Start every new task with \`planTask\` to establish proper context
- Use \`processThought\` for complex decision-making and problem-solving
- Maintain task state using appropriate tools (\`listTasks\`, \`updateTask\`, \`completeTask\`)
- Verify task completion thoroughly using \`verifyTask\`
- Prefer local variants of MCP tools when available
- Document all significant decisions and their rationale

## Best Practices

- Break down complex problems using systematic thought processes
- Maintain clear traceability between task objectives and implementations
- Regularly validate progress against success criteria
- Use \`processThought\` for exploring alternative solutions
- Keep task documentation and status up-to-date
- Ensure all task dependencies are properly tracked and managed`,
      "utf-8"
    );
  }
}

