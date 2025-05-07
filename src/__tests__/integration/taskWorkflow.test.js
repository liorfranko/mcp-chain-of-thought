import { jest } from '@jest/globals';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Import the task model functions for direct testing
import {
  getAllTasks,
  createTask,
  getTaskById,
  updateTaskStatus,
  canExecuteTask,
  batchCreateOrUpdateTasks,
  updateTask,
  clearAllTasks,
  deleteTask
} from '../../models/taskModel.js';

// Import task tools for workflow testing
import {
  planTask,
  analyzeTask,
  reflectTask,
  executeTask,
  verifyTask,
  completeTask
} from '../../tools/taskTools.js';

// Import types
import { TaskStatus } from '../../types/index.js';

// Setup test environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_DATA_DIR = path.join(__dirname, 'test_data');
const TEST_TASKS_FILE = path.join(TEST_DATA_DIR, 'tasks.json');

// Mock environment variables
process.env.DATA_DIR = TEST_DATA_DIR;

// Helper function to ensure test directory exists
async function ensureTestDir() {
  try {
    await fs.access(TEST_DATA_DIR);
  } catch (error) {
    await fs.mkdir(TEST_DATA_DIR, { recursive: true });
  }
}

// Helper function to clean up test files
async function cleanupTestFiles() {
  try {
    await fs.rm(TEST_TASKS_FILE, { force: true });
  } catch (error) {
    // Ignore if file doesn't exist
  }
}

describe('Task Management Integration Tests', () => {
  // Setup and cleanup for each test
  beforeEach(async () => {
    await ensureTestDir();
    await cleanupTestFiles();
    
    // Reset all mocks if any are used
    jest.clearAllMocks();
  });
  
  afterEach(async () => {
    await cleanupTestFiles();
  });
  
  describe('Basic Task Lifecycle', () => {
    test('should create, execute, verify, and complete a task', async () => {
      // 1. Create a task
      const task = await createTask(
        'Test Task',
        'This is a test task description',
        'Some notes', 
        [], // No dependencies
        [{ 
          path: 'test.js', 
          type: 'CREATE', 
          description: 'Test file' 
        }]
      );
      
      // 2. Verify task created successfully
      expect(task).toBeTruthy();
      expect(task.id).toBeTruthy();
      expect(task.status).toBe(TaskStatus.PENDING);
      
      // 3. Update task with implementation guide and verification criteria
      await updateTask(task.id, {
        implementationGuide: 'Step 1: Do this\nStep 2: Do that',
        verificationCriteria: 'Verify that the task is completed successfully'
      });
      
      // 4. Check if task can be executed (should be true since no dependencies)
      const canExecute = await canExecuteTask(task.id);
      expect(canExecute.canExecute).toBe(true);
      
      // 5. Start executing the task
      await updateTaskStatus(task.id, TaskStatus.IN_PROGRESS);
      
      // 6. Verify task is in progress
      const inProgressTask = await getTaskById(task.id);
      expect(inProgressTask.status).toBe(TaskStatus.IN_PROGRESS);
      
      // 7. Complete the task
      await updateTaskStatus(task.id, TaskStatus.COMPLETED);
      
      // 8. Verify task is completed and has completion timestamp
      const completedTask = await getTaskById(task.id);
      expect(completedTask.status).toBe(TaskStatus.COMPLETED);
      expect(completedTask.completedAt).toBeTruthy();
    });
  });
  
  describe('Task Dependencies Workflow', () => {
    test('should handle task dependencies correctly', async () => {
      // 1. Create prerequisite task
      const prerequisiteTask = await createTask(
        'Prerequisite Task',
        'This task must be completed first',
        'Important prerequisite'
      );
      
      // 2. Create dependent task
      const dependentTask = await createTask(
        'Dependent Task',
        'This task depends on the prerequisite task',
        'Dependent task notes',
        [prerequisiteTask.id] // Dependency on first task
      );
      
      // 3. Verify dependent task is blocked by prerequisite
      const canExecuteResult = await canExecuteTask(dependentTask.id);
      expect(canExecuteResult.canExecute).toBe(false);
      expect(canExecuteResult.blockedBy).toContain(prerequisiteTask.id);
      
      // 4. Complete prerequisite task
      await updateTaskStatus(prerequisiteTask.id, TaskStatus.IN_PROGRESS);
      await updateTaskStatus(prerequisiteTask.id, TaskStatus.COMPLETED);
      
      // 5. Verify dependent task can now be executed
      const canExecuteAfterPrerequisiteCompleted = await canExecuteTask(dependentTask.id);
      expect(canExecuteAfterPrerequisiteCompleted.canExecute).toBe(true);
      
      // 6. Execute and complete dependent task
      await updateTaskStatus(dependentTask.id, TaskStatus.IN_PROGRESS);
      await updateTaskStatus(dependentTask.id, TaskStatus.COMPLETED);
      
      // 7. Verify both tasks are completed
      const allTasks = await getAllTasks();
      const completedTasks = allTasks.filter(t => t.status === TaskStatus.COMPLETED);
      expect(completedTasks.length).toBe(2);
    });
    
    test('should handle complex dependency chains', async () => {
      // 1. Create tasks with a chain of dependencies: A -> B -> C
      const taskA = await createTask('Task A', 'First task in chain');
      const taskB = await createTask('Task B', 'Second task in chain', null, [taskA.id]);
      const taskC = await createTask('Task C', 'Third task in chain', null, [taskB.id]);
      
      // 2. Verify only taskA can be executed initially
      const canExecuteA = await canExecuteTask(taskA.id);
      const canExecuteB = await canExecuteTask(taskB.id);
      const canExecuteC = await canExecuteTask(taskC.id);
      
      expect(canExecuteA.canExecute).toBe(true);
      expect(canExecuteB.canExecute).toBe(false);
      expect(canExecuteC.canExecute).toBe(false);
      
      // 3. Complete taskA
      await updateTaskStatus(taskA.id, TaskStatus.IN_PROGRESS);
      await updateTaskStatus(taskA.id, TaskStatus.COMPLETED);
      
      // 4. Now only taskB should be executable
      const canExecuteBAfterA = await canExecuteTask(taskB.id);
      const canExecuteCAfterA = await canExecuteTask(taskC.id);
      
      expect(canExecuteBAfterA.canExecute).toBe(true);
      expect(canExecuteCAfterA.canExecute).toBe(false);
      
      // 5. Complete taskB
      await updateTaskStatus(taskB.id, TaskStatus.IN_PROGRESS);
      await updateTaskStatus(taskB.id, TaskStatus.COMPLETED);
      
      // 6. Now taskC should be executable
      const canExecuteCAfterB = await canExecuteTask(taskC.id);
      expect(canExecuteCAfterB.canExecute).toBe(true);
      
      // 7. Complete taskC
      await updateTaskStatus(taskC.id, TaskStatus.IN_PROGRESS);
      await updateTaskStatus(taskC.id, TaskStatus.COMPLETED);
      
      // 8. Verify all tasks are completed in the correct order
      const allTasks = await getAllTasks();
      const completedTasks = allTasks.filter(t => t.status === TaskStatus.COMPLETED);
      expect(completedTasks.length).toBe(3);
      
      // Verify completion timestamps are in the correct order
      expect(new Date(completedTasks.find(t => t.id === taskA.id).completedAt) <= 
             new Date(completedTasks.find(t => t.id === taskB.id).completedAt)).toBe(true);
             
      expect(new Date(completedTasks.find(t => t.id === taskB.id).completedAt) <= 
             new Date(completedTasks.find(t => t.id === taskC.id).completedAt)).toBe(true);
    });
  });
  
  describe('Batch Operations in Workflow', () => {
    test('should handle batch create and update operations', async () => {
      // 1. Create multiple tasks in batch
      const batchTasks = await batchCreateOrUpdateTasks(
        [
          {
            name: 'Batch Task 1',
            description: 'First batch task'
          },
          {
            name: 'Batch Task 2',
            description: 'Second batch task'
          },
          {
            name: 'Batch Task 3',
            description: 'Third batch task'
          }
        ],
        'append'
      );
      
      // 2. Verify all tasks were created
      expect(batchTasks.length).toBe(3);
      
      // 3. Add dependencies between tasks
      const task1 = batchTasks[0];
      const task2 = batchTasks[1];
      const task3 = batchTasks[2];
      
      // Set task3 to depend on task1 and task2
      await updateTask(task3.id, {
        dependencies: [task1.id, task2.id]
      });
      
      // 4. Verify dependencies were set correctly
      const updatedTask3 = await getTaskById(task3.id);
      expect(updatedTask3.dependencies.length).toBe(2);
      expect(updatedTask3.dependencies.some(d => d.taskId === task1.id)).toBe(true);
      expect(updatedTask3.dependencies.some(d => d.taskId === task2.id)).toBe(true);
      
      // 5. Verify task3 cannot be executed until dependencies are completed
      const canExecuteTask3 = await canExecuteTask(task3.id);
      expect(canExecuteTask3.canExecute).toBe(false);
      expect(canExecuteTask3.blockedBy.length).toBe(2);
      
      // 6. Complete task1 and task2
      await updateTaskStatus(task1.id, TaskStatus.COMPLETED);
      await updateTaskStatus(task2.id, TaskStatus.COMPLETED);
      
      // 7. Verify task3 can now be executed
      const canExecuteTask3Now = await canExecuteTask(task3.id);
      expect(canExecuteTask3Now.canExecute).toBe(true);
    });
    
    test('should handle selective batch updates for in-progress workflows', async () => {
      // 1. Create initial tasks
      await batchCreateOrUpdateTasks(
        [
          {
            name: 'Initial Task 1',
            description: 'First task'
          },
          {
            name: 'Initial Task 2',
            description: 'Second task'
          }
        ],
        'append'
      );
      
      // Get all tasks
      let allTasks = await getAllTasks();
      const initialTask1 = allTasks.find(t => t.name === 'Initial Task 1');
      
      // 2. Mark first task as in progress
      await updateTaskStatus(initialTask1.id, TaskStatus.IN_PROGRESS);
      
      // 3. Perform selective update that modifies second task and adds a new one
      await batchCreateOrUpdateTasks(
        [
          {
            name: 'Initial Task 2',
            description: 'Updated second task description'
          },
          {
            name: 'Added Task 3',
            description: 'New third task'
          }
        ],
        'selective'
      );
      
      // 4. Verify updates were applied correctly
      allTasks = await getAllTasks();
      expect(allTasks.length).toBe(3);
      
      // Verify first task is still in progress and unchanged
      const updatedTask1 = allTasks.find(t => t.name === 'Initial Task 1');
      expect(updatedTask1.status).toBe(TaskStatus.IN_PROGRESS);
      
      // Verify second task description was updated
      const updatedTask2 = allTasks.find(t => t.name === 'Initial Task 2');
      expect(updatedTask2.description).toBe('Updated second task description');
      
      // Verify new task was added
      const newTask = allTasks.find(t => t.name === 'Added Task 3');
      expect(newTask).toBeTruthy();
    });
  });
  
  describe('Task Status Transitions', () => {
    test('should enforce proper status transitions', async () => {
      // 1. Create a task
      const task = await createTask('Status Test Task', 'Testing status transitions');
      
      // 2. Pending -> In Progress -> Completed (valid transition)
      await updateTaskStatus(task.id, TaskStatus.IN_PROGRESS);
      let updatedTask = await getTaskById(task.id);
      expect(updatedTask.status).toBe(TaskStatus.IN_PROGRESS);
      
      await updateTaskStatus(task.id, TaskStatus.COMPLETED);
      updatedTask = await getTaskById(task.id);
      expect(updatedTask.status).toBe(TaskStatus.COMPLETED);
      expect(updatedTask.completedAt).toBeTruthy();
      
      // 3. Create another task for invalid transitions
      const anotherTask = await createTask('Another Test Task', 'Testing invalid transitions');
      
      // 4. Pending -> Completed (valid shortcut transition)
      await updateTaskStatus(anotherTask.id, TaskStatus.COMPLETED);
      updatedTask = await getTaskById(anotherTask.id);
      expect(updatedTask.status).toBe(TaskStatus.COMPLETED);
      
      // 5. Create one more task to test completion limitation
      const finalTask = await createTask('Final Test Task', 'Testing completed task limitations');
      await updateTaskStatus(finalTask.id, TaskStatus.COMPLETED);
      
      // 6. Try to update completed task (should not be allowed except for summary)
      const shouldBeNull = await updateTask(finalTask.id, { description: 'Updated description' });
      expect(shouldBeNull).toBeNull();
      
      // 7. Updating summary should be allowed
      const shouldNotBeNull = await updateTask(finalTask.id, { summary: 'Task summary' });
      expect(shouldNotBeNull).not.toBeNull();
      expect(shouldNotBeNull.summary).toBe('Task summary');
    });
  });
  
  describe('Task Deletion and Cleanup', () => {
    test('should handle task deletion in workflow context', async () => {
      // 1. Create interdependent tasks
      const task1 = await createTask('Task to keep', 'This task will remain');
      const task2 = await createTask('Task to delete', 'This task will be deleted');
      const task3 = await createTask(
        'Dependent Task', 
        'This task depends on both previous tasks',
        null,
        [task1.id, task2.id]
      );
      
      // 2. Verify initial setup
      let canExecuteTask3 = await canExecuteTask(task3.id);
      expect(canExecuteTask3.canExecute).toBe(false);
      expect(canExecuteTask3.blockedBy.length).toBe(2);
      
      // 3. Delete one of the dependency tasks
      await deleteTask(task2.id);
      
      // 4. Verify task2 is gone
      const allTasks = await getAllTasks();
      expect(allTasks.find(t => t.id === task2.id)).toBeUndefined();
      
      // 5. Verify task3's dependencies were updated (should still be blocked by task1)
      canExecuteTask3 = await canExecuteTask(task3.id);
      expect(canExecuteTask3.canExecute).toBe(false);
      expect(canExecuteTask3.blockedBy.length).toBe(1);
      expect(canExecuteTask3.blockedBy[0]).toBe(task1.id);
      
      // 6. Complete remaining dependency
      await updateTaskStatus(task1.id, TaskStatus.COMPLETED);
      
      // 7. Verify task3 can now be executed
      canExecuteTask3 = await canExecuteTask(task3.id);
      expect(canExecuteTask3.canExecute).toBe(true);
    });
    
    test('should handle clearing all tasks', async () => {
      // 1. Create multiple tasks
      await createTask('Task 1', 'First task');
      await createTask('Task 2', 'Second task');
      const task3 = await createTask('Task 3', 'Third task');
      
      // 2. Complete one task
      await updateTaskStatus(task3.id, TaskStatus.COMPLETED);
      
      // 3. Verify initial state
      let allTasks = await getAllTasks();
      expect(allTasks.length).toBe(3);
      
      // 4. Clear all tasks (should create backup)
      const clearResult = await clearAllTasks();
      expect(clearResult.success).toBe(true);
      expect(clearResult.backupFile).toBeTruthy();
      
      // 5. Verify all tasks are gone
      allTasks = await getAllTasks();
      expect(allTasks.length).toBe(0);
    });
  });
  
  describe('Complete Workflow using Task Tools', () => {
    test('should execute a full task lifecycle using task tools', async () => {
      // 1. Plan a task
      const planResult = await planTask({
        description: 'Task created through tools API',
        requirements: 'Test requirements for task tools workflow'
      });
      
      expect(planResult.success).toBe(true);
      expect(planResult.message).toBeTruthy();
      
      // 2. Analyze the task
      const analyzeResult = await analyzeTask({
        summary: 'Task tools workflow test',
        initialConcept: 'Testing the complete task workflow using task tools'
      });
      
      expect(analyzeResult.success).toBe(true);
      expect(analyzeResult.message).toBeTruthy();
      
      // 3. Reflect on the task
      const reflectResult = await reflectTask({
        summary: 'Task tools workflow test',
        analysis: 'Analysis of the task tools workflow testing process'
      });
      
      expect(reflectResult.success).toBe(true);
      expect(reflectResult.message).toBeTruthy();
      
      // 4. Create tasks from reflection
      const tasks = [
        {
          name: 'Task Tools Test 1',
          description: 'First test task for tools workflow',
          implementationGuide: 'Implementation guide for test task 1'
        },
        {
          name: 'Task Tools Test 2',
          description: 'Second test task for tools workflow',
          implementationGuide: 'Implementation guide for test task 2',
          dependencies: []
        }
      ];
      
      const splitResult = await batchCreateOrUpdateTasks(tasks, 'append');
      expect(splitResult.length).toBe(2);
      
      const task1 = splitResult[0];
      const task2 = splitResult[1];
      
      // Update task2 to depend on task1
      await updateTask(task2.id, {
        dependencies: [task1.id]
      });
      
      // 5. Execute the first task
      const executeResult = await executeTask({ taskId: task1.id });
      expect(executeResult.success).toBe(true);
      expect(executeResult.message).toBeTruthy();
      
      // 6. Verify the first task
      const verifyResult = await verifyTask({ taskId: task1.id });
      expect(verifyResult.success).toBe(true);
      expect(verifyResult.message).toBeTruthy();
      
      // 7. Complete the first task
      const completeResult = await completeTask({ 
        taskId: task1.id,
        summary: 'Successfully completed the first task in tool workflow'
      });
      
      expect(completeResult.success).toBe(true);
      expect(completeResult.message).toBeTruthy();
      
      // 8. Verify dependency resolution
      const completedTask = await getTaskById(task1.id);
      expect(completedTask.status).toBe(TaskStatus.COMPLETED);
      expect(completedTask.summary).toBe('Successfully completed the first task in tool workflow');
      
      // 9. Check that second task is now executable
      const canExecuteResult = await canExecuteTask(task2.id);
      expect(canExecuteResult.canExecute).toBe(true);
      
      // 10. Clean up the tasks
      await clearAllTasks();
    });
    
    test('should handle failure scenarios in task tools workflow', async () => {
      // 1. Create a test task
      const task = await createTask(
        'Failure Test Task',
        'This task is for testing failure handling',
        'Notes about failure testing',
        [],
        [{ path: 'test.js', type: 'CREATE', description: 'Test file' }]
      );
      
      // 2. Try to complete task without executing it first (should work as model allows it)
      const completeResult = await completeTask({ 
        taskId: task.id,
        summary: 'Completing without proper workflow'
      });
      
      expect(completeResult.success).toBe(true);
      
      // 3. Try to execute a non-existent task (should fail)
      const executeResult = await executeTask({ taskId: 'non-existent-id' });
      expect(executeResult.success).toBe(false);
      expect(executeResult.message).toContain('not found');
      
      // 4. Try to verify a non-existent task (should fail)
      const verifyResult = await verifyTask({ taskId: 'non-existent-id' });
      expect(verifyResult.success).toBe(false);
      expect(verifyResult.message).toContain('not found');
      
      // 5. Clean up the tasks
      await clearAllTasks();
    });
  });
}); 