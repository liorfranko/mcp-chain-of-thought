import { RelatedFile, RelatedFileType } from "../types/index.js";

/**
 * Generate summary of task-related files
 *
 * This function generates summary information for files based on the provided list of RelatedFile objects without actually reading file contents.
 * This is a lightweight implementation that generates formatted summaries based only on file metadata (such as path, type, description, etc.),
 * suitable for situations where file context information is needed but access to actual file content is not required.
 *
 * @param relatedFiles List of related files - An array of RelatedFile objects containing information about file path, type, description, etc.
 * @param maxTotalLength Maximum total length of summary content - Controls the total number of characters in the generated summary to avoid excessively large return content
 * @returns An object containing two fields:
 *   - content: Detailed file information, including basic information and guidance messages for each file
 *   - summary: A concise overview of the file list, suitable for quick browsing
 */
export async function loadTaskRelatedFiles(
  relatedFiles: RelatedFile[],
  maxTotalLength: number = 15000 // Control the total length of generated content
): Promise<{ content: string; summary: string }> {
  if (!relatedFiles || relatedFiles.length === 0) {
    return {
      content: "",
      summary: "No related files",
    };
  }

  let totalContent = "";
  let filesSummary = `## Related Files Summary (${relatedFiles.length} files total)\n\n`;
  let totalLength = 0;

  // Sort by file type priority (first process files to be modified)
  const priorityOrder: Record<RelatedFileType, number> = {
    [RelatedFileType.TO_MODIFY]: 1,
    [RelatedFileType.REFERENCE]: 2,
    [RelatedFileType.DEPENDENCY]: 3,
    [RelatedFileType.CREATE]: 4,
    [RelatedFileType.OTHER]: 5,
  };

  const sortedFiles = [...relatedFiles].sort(
    (a, b) => priorityOrder[a.type] - priorityOrder[b.type]
  );

  // Process each file
  for (const file of sortedFiles) {
    if (totalLength >= maxTotalLength) {
      filesSummary += `\n### Context length limit reached, some files not loaded\n`;
      break;
    }

    // Generate basic file information
    const fileInfo = generateFileInfo(file);

    // Add to total content
    const fileHeader = `\n### ${file.type}: ${file.path}${
      file.description ? ` - ${file.description}` : ""
    }${
      file.lineStart && file.lineEnd
        ? ` (lines ${file.lineStart}-${file.lineEnd})`
        : ""
    }\n\n`;

    totalContent += fileHeader + "```\n" + fileInfo + "\n```\n\n";
    filesSummary += `- **${file.path}**${
      file.description ? ` - ${file.description}` : ""
    } (${fileInfo.length} characters)\n`;

    totalLength += fileInfo.length + fileHeader.length + 8; // 8 for "```\n" and "\n```"
  }

  return {
    content: totalContent,
    summary: filesSummary,
  };
}

/**
 * Generate file basic information summary
 *
 * Generate formatted information summary based on file metadata, including file path, type, and related instructions.
 * Does not read actual file content, only generates information based on the provided RelatedFile object.
 *
 * @param file Related file object - Contains basic information such as file path, type, description, etc.
 * @returns Formatted file information summary text
 */
function generateFileInfo(file: RelatedFile): string {
  let fileInfo = `File: ${file.path}\n`;
  fileInfo += `Type: ${file.type}\n`;

  if (file.description) {
    fileInfo += `Description: ${file.description}\n`;
  }

  if (file.lineStart && file.lineEnd) {
    fileInfo += `Line range: ${file.lineStart}-${file.lineEnd}\n`;
  }

  fileInfo += `If you need to view the actual content, please check the file directly: ${file.path}\n`;

  return fileInfo;
}
