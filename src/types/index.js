// Task status enum: Defines the current stage of a task in the workflow
export var TaskStatus;
(function (TaskStatus) {
  TaskStatus["PENDING"] = "Pending";
  TaskStatus["IN_PROGRESS"] = "In Progress";
  TaskStatus["COMPLETED"] = "Completed";
  TaskStatus["BLOCKED"] = "Blocked";
})(TaskStatus || (TaskStatus = {}));
// Related file types: Defines the relationship types between files and tasks
export var RelatedFileType;
(function (RelatedFileType) {
  RelatedFileType["TO_MODIFY"] = "To Modify";
  RelatedFileType["REFERENCE"] = "Reference Material";
  RelatedFileType["OUTPUT"] = "Output Result";
  RelatedFileType["DEPENDENCY"] = "Dependency File";
  RelatedFileType["OTHER"] = "Other";
})(RelatedFileType || (RelatedFileType = {}));
// Task complexity levels: Defines the classification of task complexity
export var TaskComplexityLevel;
(function (TaskComplexityLevel) {
  TaskComplexityLevel["LOW"] = "Low Complexity";
  TaskComplexityLevel["MEDIUM"] = "Medium Complexity";
  TaskComplexityLevel["HIGH"] = "High Complexity";
  TaskComplexityLevel["VERY_HIGH"] = "Very High Complexity";
})(TaskComplexityLevel || (TaskComplexityLevel = {}));
// Task complexity thresholds: Defines the reference standards for task complexity assessment
export const TaskComplexityThresholds = {
  DESCRIPTION_LENGTH: {
    MEDIUM: 500, // Exceeding this character count is considered medium complexity
    HIGH: 1000, // Exceeding this character count is considered high complexity
    VERY_HIGH: 2000, // Exceeding this character count is considered very high complexity
  },
  DEPENDENCIES_COUNT: {
    MEDIUM: 2, // Exceeding this dependency count is considered medium complexity
    HIGH: 5, // Exceeding this dependency count is considered high complexity
    VERY_HIGH: 10, // Exceeding this dependency count is considered very high complexity
  },
  NOTES_LENGTH: {
    MEDIUM: 200, // Exceeding this character count is considered medium complexity
    HIGH: 500, // Exceeding this character count is considered high complexity
    VERY_HIGH: 1000, // Exceeding this character count is considered very high complexity
  },
};
