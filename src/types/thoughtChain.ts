/**
 * Thought Chain Data Structure Definition
 *
 * This file defines the core data structures needed for the thought chain tool, only including interfaces
 * for processing a single thought, not including functionality for storing historical records.
 * The design complies with the existing project architecture style.
 */

/**
 * Thought Stage Enum: Defines different stages in the thinking process
 */
export enum ThoughtStage {
  PROBLEM_DEFINITION = "Problem Definition", // Stage for defining problems and goals
  COLLECT_INFORMATION = "Collect Information", // Stage for collecting and analyzing information
  RESEARCH = "Research", // Stage for researching information
  ANALYSIS = "Analysis", // Stage for in-depth analysis of problems and possible solutions
  SYNTHESIS = "Synthesis", // Stage for integrating analysis results to form solutions
  CONCLUSION = "Conclusion", // Stage for summarizing the thinking process and proposing final solutions
  QUESTIONING = "Questioning", // Stage for questioning and critique
  PLANNING = "Planning", // Stage for planning and scheduling
}

/**
 * Thought Data Interface: Defines the complete data structure of a thought
 */
export interface ThoughtData {
  thought: string; // Thought content (string)
  thoughtNumber: number; // Current thought number (number)
  totalThoughts: number; // Estimated total number of thoughts (number)
  nextThoughtNeeded: boolean; // Whether more thoughts are needed (boolean)
  stage: string; // Thought stage (string, e.g., "Problem Definition", "Research", "Analysis", "Synthesis", "Conclusion", "Questioning")
  tags?: string[]; // Optional thought keywords or categories (string array)
  axioms_used?: string[]; // Optional principles or axioms used in this thought (string array)
  assumptions_challenged?: string[]; // Optional assumptions challenged by this thought (string array)
}
