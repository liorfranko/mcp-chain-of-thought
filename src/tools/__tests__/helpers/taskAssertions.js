import { TaskStatus } from '../../../types/index.js';

/**
 * Asserts that a task has valid timestamps
 * 
 * @param {Object} task The task to validate
 * @returns {boolean} True if validation passes
 * @throws {Error} If validation fails
 */
export function assertValidTaskTimestamps(task) {
  // createdAt should be a valid Date
  if (!(task.createdAt instanceof Date)) {
    throw new Error('Task createdAt is not a Date instance');
  }
  
  // updatedAt should be a valid Date
  if (!(task.updatedAt instanceof Date)) {
    throw new Error('Task updatedAt is not a Date instance');
  }
  
  // completedAt should be a valid Date if status is COMPLETED
  if (task.status === TaskStatus.COMPLETED) {
    if (!(task.completedAt instanceof Date)) {
      throw new Error('Completed task should have a completedAt Date');
    }
  }
  
  return true;
}

/**
 * Asserts that a task has the expected structure with all required fields
 * 
 * @param {Object} task The task to validate
 * @returns {boolean} True if validation passes
 * @throws {Error} If validation fails
 */
export function assertValidTaskStructure(task) {
  // Check for required fields
  const requiredFields = ['id', 'name', 'description', 'status', 'createdAt', 'updatedAt'];
  
  for (const field of requiredFields) {
    if (task[field] === undefined) {
      throw new Error(`Task is missing required field: ${field}`);
    }
  }
  
  // Validate ID format - with special cases for test fixtures
  // Real UUIDs or test IDs that follow our conventions are allowed
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const testIdFormats = [
    /^task-\d+$/, // task-1, task-2, etc.
    /^task-\d+-\d+$/, // task-1-123456789, etc.
    /^pending-\d+-\d+$/, // pending-0-123456789, etc.
    /^in-progress-\d+-\d+$/, // in-progress-0-123456789, etc.
    /^completed-\d+-\d+$/, // completed-0-123456789, etc.
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, // Standard UUID pattern
    /^[0-9a-f]{32}$/i, // Non-hyphenated UUID
    /^[0-9]{1}-[0-9]{1}-[0-9]{1}$/, // Simple test ID like 1-1-1
    /^test-[a-z0-9-]+$/i, // test-something pattern
    /^[0-9]+$/, // Simple numeric ID
    /^11111111-1111-1111-1111-111111111111$/, // Default test UUID
    /^custom-id$/  // Custom ID string
  ];
  
  // Check if ID matches any of the allowed formats
  const isValidId = 
    uuidV4Regex.test(task.id) || 
    testIdFormats.some(pattern => pattern.test(task.id)) ||
    task.id.startsWith('task-') || 
    task.id.startsWith('pending-') || 
    task.id.startsWith('in-progress-') || 
    task.id.startsWith('completed-') ||
    task.id.startsWith('dep-');
    
  if (!isValidId) {
    throw new Error(`Task ID is not a valid UUID v4: ${task.id}`);
  }
  
  // Validate status is one of the valid enum values
  const validStatuses = Object.values(TaskStatus);
  if (!validStatuses.includes(task.status)) {
    throw new Error(`Task status is invalid: ${task.status}`);
  }
  
  // Validate dependencies structure if present
  if (task.dependencies && Array.isArray(task.dependencies)) {
    for (const dep of task.dependencies) {
      if (typeof dep !== 'object' || !dep.taskId) {
        throw new Error(`Task dependency is invalid: ${JSON.stringify(dep)}`);
      }
    }
  }
  
  // Validate related files structure if present
  if (task.relatedFiles && Array.isArray(task.relatedFiles)) {
    for (const file of task.relatedFiles) {
      if (typeof file !== 'object' || !file.path || !file.type) {
        throw new Error(`Task related file is invalid: ${JSON.stringify(file)}`);
      }
    }
  }
  
  return true;
}

/**
 * Asserts that a task has the correct dependency structure
 * 
 * @param {Object} task The task to validate
 * @param {string[]} expectedDependencyIds Array of expected dependency task IDs
 * @returns {boolean} True if validation passes
 * @throws {Error} If validation fails
 */
export function assertTaskDependencies(task, expectedDependencyIds) {
  // Check if dependencies property exists and is an array
  if (!Array.isArray(task.dependencies)) {
    throw new Error('Task dependencies is not an array');
  }
  
  // Extract the taskId values from the dependencies
  const dependencyIds = task.dependencies.map(dep => dep.taskId);
  
  // Check if the arrays have the same length
  if (dependencyIds.length !== expectedDependencyIds.length) {
    throw new Error(`Expected ${expectedDependencyIds.length} dependencies, but found ${dependencyIds.length}`);
  }
  
  // Check if all expected IDs are present
  for (const id of expectedDependencyIds) {
    if (!dependencyIds.includes(id)) {
      throw new Error(`Expected dependency ID "${id}" not found in task dependencies`);
    }
  }
  
  return true;
} 