/**
 * Summary Extraction Tool: Extract key information from conversation content
 *
 * This module provides functionality to extract key information from complete conversations, using multiple strategies to identify important content:
 * 1. Keyword matching: Identify sentences containing specific keywords
 * 2. Sentence importance scoring: Evaluate sentence importance based on factors such as position, length, etc.
 * 3. Contextual relevance: Consider logical connections between sentences
 */

// Define keywords and their weights
const KEYWORDS = {
  // Task related
  task: 1.5,
  feature: 1.3,
  implement: 1.3,
  develop: 1.3,
  complete: 1.2,
  execute: 1.2,
  verify: 1.2,
  error: 1.5,
  problem: 1.5,
  fix: 1.5,
  failure: 1.8,
  success: 1.5,
  dependency: 1.2,
  blocking: 1.4,
  risk: 1.4,
  optimize: 1.3,
  improve: 1.3,

  // Decision related
  decide: 1.6,
  choose: 1.5,
  decision: 1.6,
  solution: 1.5,
  architecture: 1.5,
  design: 1.4,
  structure: 1.4,

  // Technology related
  code: 1.3,
  test: 1.3,
  function: 1.2,
  interface: 1.2,
  type: 1.2,
  module: 1.2,
  component: 1.2,
  data: 1.3,
  file: 1.2,
  path: 1.1,

  // System state
  status: 1.3,
  start: 1.3,
  stop: 1.3,
  create: 1.3,
  delete: 1.4,
  update: 1.3,
  query: 1.2,

  // Negative information (needs special attention)
  warning: 1.8,
  exception: 1.8,
  crash: 2.0,
  severe: 1.8,
  danger: 1.8,
  urgent: 1.9,
};

/**
 * Extract a brief summary from text
 * @param text Text from which to extract the summary
 * @param maxLength Maximum length of the summary
 * @returns Extracted summary text
 */
export function extractSummary(text: string, maxLength: number = 100): string {
  if (!text) return "";

  // Remove Markdown formatting
  const plainText = text
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/#+\s/g, "") // Remove header markers
    .replace(/\*\*/g, "") // Remove bold markers
    .replace(/\*/g, "") // Remove italic markers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Replace links with text
    .replace(/\n/g, " ") // Replace newlines with spaces
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim();

  // If text length is within the allowed range, return it directly
  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Take the beginning and add ellipsis
  return plainText.substring(0, maxLength - 3) + "...";
}

/**
 * Generate task completion summary
 * @param taskName Task name
 * @param taskDescription Task description
 * @param completionDetails Completion details (optional)
 * @returns Generated task summary
 */
export function generateTaskSummary(
  taskName: string,
  taskDescription: string,
  completionDetails?: string
): string {
  // If completion details are provided, use them preferentially
  if (completionDetails) {
    return extractSummary(completionDetails, 250);
  }

  // Otherwise generate a summary from the task name and description
  const baseText = `${taskName} has been successfully completed. This task involved ${extractSummary(
    taskDescription,
    200
  )}`;
  return extractSummary(baseText, 250);
}

/**
 * Split text into sentences
 *
 * @param text Text to split
 * @returns Array of sentences
 */
function splitIntoSentences(text: string): string[] {
  // Use regular expressions to split sentences
  // Match periods, question marks, exclamation marks, and line breaks in both Chinese and English
  const sentenceSplitters = /(?<=[。.！!？?\n])\s*/g;
  const sentences = text
    .split(sentenceSplitters)
    .filter((s) => s.trim().length > 0);

  return sentences;
}

/**
 * Score sentences to determine their importance in the summary
 *
 * @param sentence Sentence to score
 * @param index Position index of the sentence in the original text
 * @param totalSentences Total number of sentences in the original text
 * @returns Importance score of the sentence
 */
function scoreSentence(
  sentence: string,
  index: number,
  totalSentences: number
): number {
  let score = 1.0;

  // Position factor: Sentences at the beginning and end of the document are usually more important
  if (index === 0 || index === totalSentences - 1) {
    score *= 1.5;
  } else if (
    index < Math.ceil(totalSentences * 0.2) ||
    index >= Math.floor(totalSentences * 0.8)
  ) {
    score *= 1.25;
  }

  // Sentence length factor: Short sentences may contain less information, long sentences may contain too much information
  const wordCount = sentence.split(/\s+/).length;
  if (wordCount < 3) {
    score *= 0.8;
  } else if (wordCount > 25) {
    score *= 0.9;
  } else if (wordCount >= 5 && wordCount <= 15) {
    score *= 1.2;
  }

  // Keyword factor: Sentences containing keywords are more important
  for (const [keyword, weight] of Object.entries(KEYWORDS)) {
    if (sentence.includes(keyword)) {
      score *= weight;
    }
  }

  // Sentence structure factor: Special sentence patterns may be more important
  if (
    sentence.includes("summary") ||
    sentence.includes("conclusion") ||
    sentence.includes("therefore") ||
    sentence.includes("thus")
  ) {
    score *= 1.5;
  }

  // Numbers and proper nouns factor: Sentences containing numbers and proper nouns are usually more important
  if (/\d+/.test(sentence)) {
    score *= 1.3;
  }

  return score;
}

/**
 * Extract a brief title from specified content
 *
 * @param content Content from which to extract the title
 * @param maxLength Maximum length of the title
 * @returns Extracted title
 */
export function extractTitle(content: string, maxLength: number = 50): string {
  // Defensive check
  if (!content || content.trim().length === 0) {
    return "";
  }

  // Split into sentences
  const sentences = splitIntoSentences(content);
  if (sentences.length === 0) {
    return "";
  }

  // First consider the first sentence
  let title = sentences[0];

  // If the first sentence is too long, find the first comma or other delimiter to truncate
  if (title.length > maxLength) {
    const firstPart = title.split(/[,，:：]/)[0];
    if (firstPart && firstPart.length < maxLength) {
      title = firstPart;
    } else {
      title = title.substring(0, maxLength - 3) + "...";
    }
  }

  return title;
}

/**
 * Intelligent extract summary based on conversation context
 *
 * @param messages List of conversation messages, each containing role and content
 * @param maxLength Maximum length of the summary
 * @returns Extracted summary
 */
export function extractSummaryFromConversation(
  messages: Array<{ role: string; content: string }>,
  maxLength: number = 200
): string {
  // Defensive check
  if (!messages || messages.length === 0) {
    return "";
  }

  // If there's only one message, directly extract its summary
  if (messages.length === 1) {
    return extractSummary(messages[0].content, maxLength);
  }

  // Connect all messages, but retain role information
  const combinedText = messages
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");

  // Extract summary from combined text
  const summary = extractSummary(combinedText, maxLength);

  return summary;
}
