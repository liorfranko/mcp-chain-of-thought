import { RelatedFileType } from "../types/index.js";
/**
 * Generate summary of task-related files
 *
 * This function generates summary information for files based on a list of RelatedFile objects,
 * without actually reading the file contents. This is a lightweight implementation
 * that generates formatted summaries based only on file metadata (path, type, description, etc.),
 * suitable for scenarios where file context is needed without accessing actual file contents.
 *
 * @param relatedFiles List of related files - Array of RelatedFile objects containing file path, type, description, etc.
 * @param maxTotalLength Maximum total length of summary content - Controls the total character count of the generated summary
 * @returns Formatted file summary information
 */
export async function loadTaskRelatedFiles(
  relatedFiles,
  maxTotalLength = 15000 // Control the total length of generated content
) {
  if (!relatedFiles || relatedFiles.length === 0) {
    return "## Related Files\n\nNo related files";
  }

  let filesSummary = `## Related Files Summary (${relatedFiles.length} files total)\n\n`;
  let totalLength = 0;

  // Sort by file type priority (process files to be modified first)
  const priorityOrder = {
    [RelatedFileType.TO_MODIFY]: 1,
    [RelatedFileType.REFERENCE]: 2,
    [RelatedFileType.DEPENDENCY]: 3,
    [RelatedFileType.OUTPUT]: 4,
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

    filesSummary += fileHeader + "```\n" + fileInfo + "\n```\n\n";
    totalLength += fileInfo.length + fileHeader.length + 8; // 8 for "```\n" and "\n```"
  }

  return filesSummary;
}

/**
 * Generate basic file information summary
 * 
 * Creates formatted information summary based on file metadata, including file path, type, and relevant notes.
 * Does not read actual file contents, only generates information based on the provided RelatedFile object.
 *
 * @param file Related file object - Contains basic information about the file path, type, description, etc.
 * @returns Formatted file information summary text
 */
function generateFileInfo(file) {
  let fileInfo = `File: ${file.path}\n`;
  fileInfo += `Type: ${file.type}\n`;
  if (file.description) {
    fileInfo += `Description: ${file.description}\n`;
  }
  if (file.lineStart && file.lineEnd) {
    fileInfo += `Line range: ${file.lineStart}-${file.lineEnd}\n`;
  }
  fileInfo += `To view actual content, please check the file directly: ${file.path}\n`;

  return fileInfo;
}
