import { jest } from '@jest/globals';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { TaskStatus } from '../../types/index.js';

// Mock the modules
jest.mock('fs/promises');
jest.mock('uuid');

// Import the module under test - do this *after* mocking dependencies
import * as taskModel from '../taskModel.js';

// Use jest.spyOn instead of trying to directly override properties
const originalReadTasks = taskModel.readTasks;
const originalWriteTasks = taskModel.writeTasks;

// We'll mock the internal functions during tests
beforeEach(() => {
  // Setup spies on the module's internal functions
  if (typeof taskModel.readTasks === 'function') {
    jest.spyOn(taskModel, 'readTasks');
  }
  if (typeof taskModel.writeTasks === 'function') {
    jest.spyOn(taskModel, 'writeTasks');
  }
});

afterEach(() => {
  // Restore original functions if needed
  if (typeof taskModel.readTasks === 'function' && taskModel.readTasks.mockRestore) {
    taskModel.readTasks.mockRestore();
  }
  if (typeof taskModel.writeTasks === 'function' && taskModel.writeTasks.mockRestore) {
    taskModel.writeTasks.mockRestore();
  }
});

describe('Task Model CRUD Operations', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock UUID to return predictable values
    uuidv4.mockReturnValue('test-uuid-1234');
    
    // Mock fs.readFile to return empty tasks by default
    fs.readFile.mockResolvedValue(JSON.stringify({ tasks: [] }));
    
    // Mock fs.writeFile to succeed
    fs.writeFile.mockResolvedValue(undefined);
    
    // Mock fs.access to succeed
    fs.access.mockResolvedValue(undefined);
    
    // Mock fs.mkdir to succeed
    fs.mkdir.mockResolvedValue(undefined);
  });
  
  describe('createTask', () => {
    test('should create a new task with the provided data', async () => {
      // Setup
      const now = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => now);
      
      // Call the function
      const result = await taskModel.createTask(
        'Test Task',
        'Test Description',
        'Test Notes',
        ['dependency-1'],
        [{ path: 'src/test.js', type: 'TO_MODIFY', description: 'Test file' }]
      );
      
      // Verify result
      expect(result).toEqual({
        id: 'test-uuid-1234',
        name: 'Test Task',
        description: 'Test Description',
        notes: 'Test Notes',
        status: TaskStatus.PENDING,
        dependencies: [{ taskId: 'dependency-1' }],
        createdAt: now,
        updatedAt: now,
        relatedFiles: [{ path: 'src/test.js', type: 'TO_MODIFY', description: 'Test file' }]
      });
      
      // Verify fs.writeFile was called correctly
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('test-uuid-1234'),
        expect.any(String)
      );
    });
    
    test('should create a task with minimal required fields', async () => {
      // Setup
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(JSON.stringify({ tasks: [] }));
      fs.writeFile.mockResolvedValue(undefined);
      
      // Execute
      const result = await taskModel.createTask('Minimal Task', 'Minimal description');
      
      // Verify
      expect(result).toEqual(expect.objectContaining({
        id: 'test-uuid-1234',
        name: 'Minimal Task',
        description: 'Minimal description',
        status: TaskStatus.PENDING,
        dependencies: []
      }));
    });
    
    test('should handle errors when creating a task', async () => {
      // Setup - simulate a filesystem error
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockRejectedValue(new Error('File system error'));
      
      // Execute & Verify
      await expect(
        taskModel.createTask('Error Task', 'This will fail')
      ).rejects.toThrow('File system error');
    });
  });
  
  describe('getAllTasks', () => {
    test('should return all tasks', async () => {
      // Setup - populate the mock tasks
      const testTasks = [
        createTaskFixture({ id: 'task-1', name: 'Task 1' }),
        createTaskFixture({ id: 'task-2', name: 'Task 2' })
      ];
      
      // Convert dates to strings as they would be in the JSON
      const tasksJson = JSON.stringify({
        tasks: testTasks.map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      
      // Execute
      const result = await taskModel.getAllTasks();
      
      // Verify
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('task-1');
      expect(result[1].id).toBe('task-2');
      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[1].updatedAt).toBeInstanceOf(Date);
    });
    
    test('should return an empty array when no tasks exist', async () => {
      // Setup
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(JSON.stringify({ tasks: [] }));
      
      // Execute
      const result = await taskModel.getAllTasks();
      
      // Verify
      expect(result).toEqual([]);
    });
    
    test('should handle errors when reading tasks', async () => {
      // Setup
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockRejectedValue(new Error('Cannot read file'));
      
      // Execute & Verify
      await expect(taskModel.getAllTasks()).rejects.toThrow('Cannot read file');
    });
  });
  
  describe('getTaskById', () => {
    test('should return the task with the specified ID', async () => {
      // Setup
      const testTasks = [
        createTaskFixture({ id: 'task-1', name: 'Task 1' }),
        createTaskFixture({ id: 'task-2', name: 'Task 2' })
      ];
      
      // Convert dates to strings as they would be in the JSON
      const tasksJson = JSON.stringify({
        tasks: testTasks.map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      
      // Execute
      const result = await taskModel.getTaskById('task-2');
      
      // Verify
      expect(result).not.toBeNull();
      expect(result.id).toBe('task-2');
      expect(result.name).toBe('Task 2');
    });
    
    test('should return null when task with ID does not exist', async () => {
      // Setup
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(JSON.stringify({ tasks: [] }));
      
      // Execute
      const result = await taskModel.getTaskById('non-existent-id');
      
      // Verify
      expect(result).toBeNull();
    });
  });
  
  describe('updateTask', () => {
    test('should update the task with the provided data', async () => {
      // Setup
      const existingTask = createTaskFixture({
        id: 'task-to-update',
        name: 'Original Name',
        description: 'Original description'
      });
      
      const tasksJson = JSON.stringify({
        tasks: [existingTask].map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      fs.writeFile.mockResolvedValue(undefined);
      
      // Execute
      const result = await taskModel.updateTask('task-to-update', {
        name: 'Updated Name',
        description: 'Updated description'
      });
      
      // Verify
      expect(result).not.toBeNull();
      expect(result.id).toBe('task-to-update');
      expect(result.name).toBe('Updated Name');
      expect(result.description).toBe('Updated description');
      expect(fs.writeFile).toHaveBeenCalled();
      
      // Verify the write contains our updates
      const writeCall = fs.writeFile.mock.calls[0][1];
      expect(writeCall).toContain('Updated Name');
      expect(writeCall).toContain('Updated description');
    });
    
    test('should return null when updating non-existent task', async () => {
      // Setup
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(JSON.stringify({ tasks: [] }));
      
      // Execute
      const result = await taskModel.updateTask('non-existent-id', { name: 'New Name' });
      
      // Verify
      expect(result).toBeNull();
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
    
    test('should not update disallowed fields on completed tasks', async () => {
      // Setup - a completed task
      const completedTask = createTaskFixture({
        id: 'completed-task',
        name: 'Completed Task',
        status: TaskStatus.COMPLETED,
        completedAt: new Date('2023-01-02T00:00:00.000Z')
      });
      
      const tasksJson = JSON.stringify({
        tasks: [completedTask].map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
          completedAt: task.completedAt.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      
      // Execute - trying to update a disallowed field
      const result = await taskModel.updateTask('completed-task', {
        name: 'New Name' // This should be disallowed on completed tasks
      });
      
      // Verify
      expect(result).toBeNull();
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
    
    test('should allow updating summary and relatedFiles on completed tasks', async () => {
      // Setup - a completed task
      const completedTask = createTaskFixture({
        id: 'completed-task',
        name: 'Completed Task',
        status: TaskStatus.COMPLETED,
        completedAt: new Date('2023-01-02T00:00:00.000Z')
      });
      
      const tasksJson = JSON.stringify({
        tasks: [completedTask].map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
          completedAt: task.completedAt.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      fs.writeFile.mockResolvedValue(undefined);
      
      // Execute - updating an allowed field
      const result = await taskModel.updateTask('completed-task', {
        summary: 'New summary',
        relatedFiles: [{ path: 'file.txt', type: 'REFERENCE', description: 'A test file' }]
      });
      
      // Verify
      expect(result).not.toBeNull();
      expect(result.summary).toBe('New summary');
      expect(result.relatedFiles).toHaveLength(1);
      expect(fs.writeFile).toHaveBeenCalled();
    });
  });
  
  describe('deleteTask', () => {
    test('should delete the task with the specified ID', async () => {
      // Setup
      const tasks = [
        createTaskFixture({ id: 'task-1', name: 'Task 1' }),
        createTaskFixture({ id: 'task-to-delete', name: 'Task to Delete' }),
        createTaskFixture({ id: 'task-3', name: 'Task 3' })
      ];
      
      const tasksJson = JSON.stringify({
        tasks: tasks.map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      fs.writeFile.mockImplementation((file, data) => {
        const content = JSON.parse(data);
        expect(content.tasks).toHaveLength(2);
        expect(content.tasks.find(t => t.id === 'task-to-delete')).toBeUndefined();
        return Promise.resolve();
      });
      
      // Execute
      const result = await taskModel.deleteTask('task-to-delete');
      
      // Verify
      expect(result.success).toBe(true);
      expect(result.message).toContain('deleted successfully');
      expect(fs.writeFile).toHaveBeenCalled();
    });
    
    test('should return failure when task does not exist', async () => {
      // Setup
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(JSON.stringify({ tasks: [] }));
      
      // Execute
      const result = await taskModel.deleteTask('non-existent-id');
      
      // Verify
      expect(result.success).toBe(false);
      expect(result.message).toContain('not found');
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
    
    test('should not delete completed tasks', async () => {
      // Setup - a completed task
      const completedTask = createTaskFixture({
        id: 'completed-task',
        name: 'Completed Task',
        status: TaskStatus.COMPLETED,
        completedAt: new Date('2023-01-02T00:00:00.000Z')
      });
      
      const tasksJson = JSON.stringify({
        tasks: [completedTask].map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
          completedAt: task.completedAt?.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      
      // Execute
      const result = await taskModel.deleteTask('completed-task');
      
      // Verify
      expect(result.success).toBe(false);
      expect(result.message).toContain('Cannot delete completed tasks');
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
    
    test('should not delete tasks that other tasks depend on', async () => {
      // Setup - task with dependency
      const task1 = createTaskFixture({ id: 'task-1', name: 'Task 1' });
      const task2 = createTaskFixture({ 
        id: 'task-2', 
        name: 'Task 2',
        dependencies: [{ taskId: 'task-1' }]
      });
      
      const tasksJson = JSON.stringify({
        tasks: [task1, task2].map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      
      // Execute - try to delete the task that another depends on
      const result = await taskModel.deleteTask('task-1');
      
      // Verify
      expect(result.success).toBe(false);
      expect(result.message).toContain('depend on it');
      expect(result.message).toContain('Task 2');
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });
  
  // New test suite for Task Status and Dependency Tests
  describe('Task Status Transitions', () => {
    test('should update task status from PENDING to IN_PROGRESS', async () => {
      // Setup
      const pendingTask = createTaskFixture({
        id: 'pending-task',
        status: TaskStatus.PENDING
      });
      
      const tasksJson = JSON.stringify({
        tasks: [pendingTask].map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      fs.writeFile.mockResolvedValue(undefined);
      
      // Execute
      const result = await taskModel.updateTaskStatus('pending-task', TaskStatus.IN_PROGRESS);
      
      // Verify
      expect(result).not.toBeNull();
      expect(result.status).toBe(TaskStatus.IN_PROGRESS);
      expect(result.completedAt).toBeUndefined();
      expect(fs.writeFile).toHaveBeenCalled();
    });
    
    test('should update task status from IN_PROGRESS to COMPLETED and set completedAt', async () => {
      // Setup
      const inProgressTask = createTaskFixture({
        id: 'in-progress-task',
        status: TaskStatus.IN_PROGRESS
      });
      
      const tasksJson = JSON.stringify({
        tasks: [inProgressTask].map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      fs.writeFile.mockResolvedValue(undefined);
      
      // Execute
      const result = await taskModel.updateTaskStatus('in-progress-task', TaskStatus.COMPLETED);
      
      // Verify
      expect(result).not.toBeNull();
      expect(result.status).toBe(TaskStatus.COMPLETED);
      expect(result.completedAt).toBeInstanceOf(Date);
      expect(fs.writeFile).toHaveBeenCalled();
    });
    
    test('should update task status from PENDING to BLOCKED', async () => {
      // Setup
      const pendingTask = createTaskFixture({
        id: 'pending-task',
        status: TaskStatus.PENDING
      });
      
      const tasksJson = JSON.stringify({
        tasks: [pendingTask].map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      fs.writeFile.mockResolvedValue(undefined);
      
      // Execute
      const result = await taskModel.updateTaskStatus('pending-task', TaskStatus.BLOCKED);
      
      // Verify
      expect(result).not.toBeNull();
      expect(result.status).toBe(TaskStatus.BLOCKED);
      expect(result.completedAt).toBeUndefined();
      expect(fs.writeFile).toHaveBeenCalled();
    });
    
    test('should not be able to revert a COMPLETED task to any other status', async () => {
      // Setup - a completed task
      const completedTask = createTaskFixture({
        id: 'completed-task',
        status: TaskStatus.COMPLETED,
        completedAt: new Date('2023-01-02T00:00:00.000Z')
      });
      
      const tasksJson = JSON.stringify({
        tasks: [completedTask].map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
          completedAt: task.completedAt.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      
      // Execute - try to revert to IN_PROGRESS
      const result = await taskModel.updateTaskStatus('completed-task', TaskStatus.IN_PROGRESS);
      
      // Verify
      expect(result).toBeNull();
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
    
    test('should return null when updating status of non-existent task', async () => {
      // Setup
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(JSON.stringify({ tasks: [] }));
      
      // Execute
      const result = await taskModel.updateTaskStatus('non-existent-id', TaskStatus.IN_PROGRESS);
      
      // Verify
      expect(result).toBeNull();
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });
  
  describe('Task Dependencies and Execution', () => {
    test('should allow execution when task has no dependencies', async () => {
      // Setup
      const taskWithNoDeps = createTaskFixture({
        id: 'no-deps-task',
        dependencies: []
      });
      
      const tasksJson = JSON.stringify({
        tasks: [taskWithNoDeps].map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      
      // Execute
      const result = await taskModel.canExecuteTask('no-deps-task');
      
      // Verify
      expect(result.canExecute).toBe(true);
      expect(result.blockedBy).toBeUndefined();
    });
    
    test('should not allow execution when dependencies are not completed', async () => {
      // Setup - task with pending dependency
      const dependencyTask = createTaskFixture({
        id: 'dependency-task',
        status: TaskStatus.PENDING
      });
      
      const taskWithDeps = createTaskFixture({
        id: 'task-with-deps',
        dependencies: [{ taskId: 'dependency-task' }]
      });
      
      const tasksJson = JSON.stringify({
        tasks: [dependencyTask, taskWithDeps].map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      
      // Execute
      const result = await taskModel.canExecuteTask('task-with-deps');
      
      // Verify
      expect(result.canExecute).toBe(false);
      expect(result.blockedBy).toContain('dependency-task');
    });
    
    test('should allow execution when all dependencies are completed', async () => {
      // Setup - task with completed dependency
      const dependencyTask = createTaskFixture({
        id: 'dependency-task',
        status: TaskStatus.COMPLETED,
        completedAt: new Date('2023-01-02T00:00:00.000Z')
      });
      
      const taskWithDeps = createTaskFixture({
        id: 'task-with-deps',
        dependencies: [{ taskId: 'dependency-task' }]
      });
      
      const tasksJson = JSON.stringify({
        tasks: [dependencyTask, taskWithDeps].map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
          completedAt: task.completedAt?.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      
      // Execute
      const result = await taskModel.canExecuteTask('task-with-deps');
      
      // Verify
      expect(result.canExecute).toBe(true);
      expect(result.blockedBy).toBeUndefined();
    });
    
    test('should handle multiple dependencies correctly', async () => {
      // Setup - task with multiple dependencies (one completed, one pending)
      const completedDep = createTaskFixture({
        id: 'completed-dep',
        status: TaskStatus.COMPLETED,
        completedAt: new Date('2023-01-02T00:00:00.000Z')
      });
      
      const pendingDep = createTaskFixture({
        id: 'pending-dep',
        status: TaskStatus.PENDING
      });
      
      const taskWithDeps = createTaskFixture({
        id: 'task-with-deps',
        dependencies: [
          { taskId: 'completed-dep' },
          { taskId: 'pending-dep' }
        ]
      });
      
      const tasksJson = JSON.stringify({
        tasks: [completedDep, pendingDep, taskWithDeps].map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
          completedAt: task.completedAt?.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      
      // Execute
      const result = await taskModel.canExecuteTask('task-with-deps');
      
      // Verify
      expect(result.canExecute).toBe(false);
      expect(result.blockedBy).toHaveLength(1);
      expect(result.blockedBy).toContain('pending-dep');
    });
    
    test('should not allow execution of completed tasks', async () => {
      // Setup - a completed task
      const completedTask = createTaskFixture({
        id: 'completed-task',
        status: TaskStatus.COMPLETED,
        completedAt: new Date('2023-01-02T00:00:00.000Z')
      });
      
      const tasksJson = JSON.stringify({
        tasks: [completedTask].map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
          completedAt: task.completedAt.toISOString()
        }))
      });
      
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(tasksJson);
      
      // Execute
      const result = await taskModel.canExecuteTask('completed-task');
      
      // Verify
      expect(result.canExecute).toBe(false);
    });
    
    test('should return canExecute: false for non-existent task', async () => {
      // Setup
      const fs = require('fs/promises');
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(JSON.stringify({ tasks: [] }));
      
      // Execute
      const result = await taskModel.canExecuteTask('non-existent-id');
      
      // Verify
      expect(result.canExecute).toBe(false);
    });
  });
  
  // Batch Operation Tests
  describe('Task Batch Operations', () => {
    // Test setup helpers
    const createTaskDataFixture = (overrides = {}) => {
      return {
        name: 'Test Batch Task',
        description: 'Batch task description',
        notes: 'Batch task notes',
        dependencies: [],
        relatedFiles: [],
        implementationGuide: 'Implementation steps',
        verificationCriteria: 'Verification criteria',
        ...overrides
      };
    };
    
    const createExistingTasksFixture = () => {
      return [
        createTaskFixture({
          id: 'existing-task-1',
          name: 'Existing Task 1',
          status: TaskStatus.PENDING
        }),
        createTaskFixture({
          id: 'existing-task-2',
          name: 'Existing Task 2',
          status: TaskStatus.IN_PROGRESS
        }),
        createTaskFixture({
          id: 'existing-task-3',
          name: 'Existing Task 3',
          status: TaskStatus.COMPLETED
        })
      ];
    };
    
    beforeEach(() => {
      // Reset mock counters
      jest.clearAllMocks();
      
      // Mock uuid to return predictable values
      const uuidMock = require('uuid').v4;
      uuidMock
        .mockReturnValueOnce('batch-uuid-1')
        .mockReturnValueOnce('batch-uuid-2')
        .mockReturnValueOnce('batch-uuid-3');
    });
    
    describe('batchCreateOrUpdateTasks', () => {
      test('should create new tasks in append mode', async () => {
        // Setup - existing tasks
        const existingTasks = createExistingTasksFixture();
        
        // Convert date fields to string as they would be in JSON
        const existingTasksJson = existingTasks.map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
          completedAt: task.completedAt ? task.completedAt.toISOString() : undefined
        }));
        
        // Set up file system mock
        const fs = require('fs/promises');
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(JSON.stringify({ tasks: existingTasksJson }));
        fs.writeFile.mockResolvedValue(undefined);
        
        // New task data
        const newTasksData = [
          createTaskDataFixture({ name: 'New Batch Task 1' }),
          createTaskDataFixture({ name: 'New Batch Task 2' })
        ];
        
        // Execute
        const result = await taskModel.batchCreateOrUpdateTasks(newTasksData, 'append');
        
        // Verify
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe('batch-uuid-1');
        expect(result[0].name).toBe('New Batch Task 1');
        expect(result[1].id).toBe('batch-uuid-2');
        expect(result[1].name).toBe('New Batch Task 2');
        
        // Verify file was written with correct content
        expect(fs.writeFile).toHaveBeenCalledTimes(1);
        
        // Parse the written content to verify all tasks are preserved
        const writeCall = fs.writeFile.mock.calls[0];
        const writtenContent = JSON.parse(writeCall[1]);
        
        // Should have all existing tasks plus the new ones
        expect(writtenContent.tasks).toHaveLength(5);
        
        // Original tasks should be preserved
        expect(writtenContent.tasks).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: 'existing-task-1' }),
            expect.objectContaining({ id: 'existing-task-2' }),
            expect.objectContaining({ id: 'existing-task-3' })
          ])
        );
        
        // New tasks should be added
        expect(writtenContent.tasks).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: 'batch-uuid-1' }),
            expect.objectContaining({ id: 'batch-uuid-2' })
          ])
        );
      });
      
      test('should only keep completed tasks in overwrite mode', async () => {
        // Setup - existing tasks
        const existingTasks = createExistingTasksFixture();
        
        // Convert date fields to string as they would be in JSON
        const existingTasksJson = existingTasks.map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
          completedAt: task.completedAt ? task.completedAt.toISOString() : undefined
        }));
        
        // Set up file system mock
        const fs = require('fs/promises');
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(JSON.stringify({ tasks: existingTasksJson }));
        fs.writeFile.mockResolvedValue(undefined);
        
        // New task data
        const newTasksData = [
          createTaskDataFixture({ name: 'New Batch Task 1' })
        ];
        
        // Execute
        const result = await taskModel.batchCreateOrUpdateTasks(newTasksData, 'overwrite');
        
        // Verify
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('batch-uuid-1');
        
        // Verify file was written with correct content
        expect(fs.writeFile).toHaveBeenCalledTimes(1);
        
        // Parse the written content to verify only completed tasks are kept
        const writeCall = fs.writeFile.mock.calls[0];
        const writtenContent = JSON.parse(writeCall[1]);
        
        // Should have completed task plus the new one
        expect(writtenContent.tasks).toHaveLength(2);
        
        // Only completed tasks should be preserved
        expect(writtenContent.tasks).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: 'existing-task-3', status: TaskStatus.COMPLETED })
          ])
        );
        
        // New task should be added
        expect(writtenContent.tasks).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: 'batch-uuid-1' })
          ])
        );
        
        // Pending and in-progress tasks should not be present
        expect(writtenContent.tasks).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: 'existing-task-1' }),
            expect.objectContaining({ id: 'existing-task-2' })
          ])
        );
      });
      
      test('should update matching tasks by name in selective mode', async () => {
        // Setup - existing tasks with specific names for selective update
        const existingTasks = [
          createTaskFixture({
            id: 'existing-task-1',
            name: 'Task to Update',
            description: 'Original description',
            status: TaskStatus.PENDING
          }),
          createTaskFixture({
            id: 'existing-task-2',
            name: 'Task to Keep',
            status: TaskStatus.IN_PROGRESS
          }),
          createTaskFixture({
            id: 'existing-task-3',
            name: 'Completed Task',
            status: TaskStatus.COMPLETED
          })
        ];
        
        // Convert date fields to string as they would be in JSON
        const existingTasksJson = existingTasks.map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
          completedAt: task.completedAt ? task.completedAt.toISOString() : undefined
        }));
        
        // Set up file system mock
        const fs = require('fs/promises');
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(JSON.stringify({ tasks: existingTasksJson }));
        fs.writeFile.mockResolvedValue(undefined);
        
        // Update task data: one matches existing name, one is new
        const taskDataList = [
          createTaskDataFixture({ 
            name: 'Task to Update', 
            description: 'Updated description',
            implementationGuide: 'New implementation steps'
          }),
          createTaskDataFixture({ name: 'Brand New Task' })
        ];
        
        // Execute
        const result = await taskModel.batchCreateOrUpdateTasks(taskDataList, 'selective');
        
        // Verify
        expect(result).toHaveLength(2);
        
        // First task should be the updated one, keeping original ID
        expect(result[0].id).toBe('existing-task-1');
        expect(result[0].name).toBe('Task to Update');
        expect(result[0].description).toBe('Updated description');
        expect(result[0].implementationGuide).toBe('New implementation steps');
        
        // Second task should be new
        expect(result[1].id).toBe('batch-uuid-1');
        expect(result[1].name).toBe('Brand New Task');
        
        // Verify file was written with correct content
        expect(fs.writeFile).toHaveBeenCalledTimes(1);
        
        // Parse the written content
        const writeCall = fs.writeFile.mock.calls[0];
        const writtenContent = JSON.parse(writeCall[1]);
        
        // Should have all tasks (2 kept, 2 updated/new)
        expect(writtenContent.tasks).toHaveLength(4);
        
        // Tasks that weren't updated should be preserved
        expect(writtenContent.tasks).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: 'existing-task-2', name: 'Task to Keep' }),
            expect.objectContaining({ id: 'existing-task-3', name: 'Completed Task' })
          ])
        );
        
        // Updated task should have new description but same ID
        expect(writtenContent.tasks).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ 
              id: 'existing-task-1', 
              name: 'Task to Update',
              description: 'Updated description' 
            })
          ])
        );
        
        // New task should be added
        expect(writtenContent.tasks).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: 'batch-uuid-1', name: 'Brand New Task' })
          ])
        );
      });
      
      test('should clear all tasks in clearAllTasks mode', async () => {
        // Setup - existing tasks
        const existingTasks = createExistingTasksFixture();
        
        // Convert date fields to string as they would be in JSON
        const existingTasksJson = existingTasks.map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
          completedAt: task.completedAt ? task.completedAt.toISOString() : undefined
        }));
        
        // Set up file system mock
        const fs = require('fs/promises');
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(JSON.stringify({ tasks: existingTasksJson }));
        fs.writeFile.mockResolvedValue(undefined);
        
        // New task data
        const newTasksData = [
          createTaskDataFixture({ name: 'New Batch Task 1' }),
          createTaskDataFixture({ name: 'New Batch Task 2' })
        ];
        
        // Execute
        const result = await taskModel.batchCreateOrUpdateTasks(newTasksData, 'clearAllTasks');
        
        // Verify
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe('batch-uuid-1');
        expect(result[0].name).toBe('New Batch Task 1');
        expect(result[1].id).toBe('batch-uuid-2');
        expect(result[1].name).toBe('New Batch Task 2');
        
        // Verify file was written with correct content
        expect(fs.writeFile).toHaveBeenCalledTimes(1);
        
        // Parse the written content
        const writeCall = fs.writeFile.mock.calls[0];
        const writtenContent = JSON.parse(writeCall[1]);
        
        // Should have only the new tasks, all existing tasks should be removed
        expect(writtenContent.tasks).toHaveLength(2);
        
        // Only new tasks should be present
        expect(writtenContent.tasks).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: 'batch-uuid-1' }),
            expect.objectContaining({ id: 'batch-uuid-2' })
          ])
        );
        
        // No existing tasks should be present
        expect(writtenContent.tasks).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: 'existing-task-1' }),
            expect.objectContaining({ id: 'existing-task-2' }),
            expect.objectContaining({ id: 'existing-task-3' })
          ])
        );
      });
      
      test('should resolve dependencies by both ID and name', async () => {
        // Setup - existing tasks
        const existingTasks = [
          createTaskFixture({
            id: 'existing-task-1',
            name: 'First Task',
            status: TaskStatus.PENDING
          }),
          createTaskFixture({
            id: 'existing-task-2',
            name: 'Second Task',
            status: TaskStatus.IN_PROGRESS
          })
        ];
        
        // Convert date fields to string as they would be in JSON
        const existingTasksJson = existingTasks.map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString()
        }));
        
        // Set up file system mock
        const fs = require('fs/promises');
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(JSON.stringify({ tasks: existingTasksJson }));
        fs.writeFile.mockResolvedValue(undefined);
        
        // New task data with dependencies by ID and name
        const newTasksData = [
          createTaskDataFixture({ 
            name: 'Task with ID Dependency', 
            dependencies: ['existing-task-1'] // Reference by ID
          }),
          createTaskDataFixture({ 
            name: 'Task with Name Dependency', 
            dependencies: ['Second Task'] // Reference by name
          }),
          createTaskDataFixture({ 
            name: 'Task with Mixed Dependencies', 
            dependencies: ['existing-task-1', 'Second Task', 'New Batch Task 1'] // Mixed references
          })
        ];
        
        // Execute
        const result = await taskModel.batchCreateOrUpdateTasks(newTasksData, 'append');
        
        // Verify
        expect(result).toHaveLength(3);
        
        // Verify ID dependency resolution
        expect(result[0].dependencies).toEqual([
          { taskId: 'existing-task-1' }
        ]);
        
        // Verify name dependency resolution
        expect(result[1].dependencies).toEqual([
          { taskId: 'existing-task-2' }
        ]);
        
        // Verify mixed dependency resolution
        // Should include existing-task-1, existing-task-2, and batch-uuid-1
        expect(result[2].dependencies).toEqual(
          expect.arrayContaining([
            { taskId: 'existing-task-1' },
            { taskId: 'existing-task-2' },
            { taskId: 'batch-uuid-1' }
          ])
        );
      });
      
      test('should handle error during task creation', async () => {
        // Setup - simulate a filesystem error
        const fs = require('fs/promises');
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockRejectedValue(new Error('Failed to read tasks file'));
        
        // New task data
        const newTasksData = [
          createTaskDataFixture({ name: 'New Batch Task 1' })
        ];
        
        // Execute & Verify
        await expect(
          taskModel.batchCreateOrUpdateTasks(newTasksData, 'append')
        ).rejects.toThrow('Failed to read tasks file');
      });
    });
    
    describe('clearAllTasks', () => {
      test('should clear all tasks and create a backup', async () => {
        // Setup - existing tasks
        const existingTasks = createExistingTasksFixture();
        
        // Convert date fields to string as they would be in JSON
        const existingTasksJson = existingTasks.map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
          completedAt: task.completedAt ? task.completedAt.toISOString() : undefined
        }));
        
        // Set up file system mock
        const fs = require('fs/promises');
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(JSON.stringify({ tasks: existingTasksJson }));
        fs.writeFile.mockResolvedValue(undefined);
        fs.mkdir.mockResolvedValue(undefined);
        
        // Mock date for consistent filename
        const originalDate = global.Date;
        const mockDate = jest.fn(() => new Date('2023-05-15T12:00:00Z'));
        mockDate.prototype = Object.create(Date.prototype);
        mockDate.prototype.toISOString = jest.fn(() => '2023-05-15T12:00:00.000Z');
        global.Date = mockDate;
        
        // Execute
        const result = await taskModel.clearAllTasks();
        
        // Restore original Date
        global.Date = originalDate;
        
        // Verify
        expect(result.success).toBe(true);
        expect(result.backupFile).toBe('tasks_memory_2023-05-15T12-00-00.json');
        
        // Verify memory directory was created
        expect(fs.mkdir).toHaveBeenCalledWith(expect.any(String), { recursive: true });
        
        // Verify backup file was written
        expect(fs.writeFile).toHaveBeenCalledWith(
          expect.stringContaining('memory/tasks_memory_2023-05-15T12-00-00.json'),
          expect.any(String)
        );
        
        // Verify the backup only contains completed tasks
        const backupCall = fs.writeFile.mock.calls[0];
        const backupContent = JSON.parse(backupCall[1]);
        expect(backupContent.tasks).toHaveLength(1);
        expect(backupContent.tasks[0].status).toBe(TaskStatus.COMPLETED);
        
        // Verify tasks file was cleared
        const clearCall = fs.writeFile.mock.calls[1];
        expect(clearCall[1]).toBe('{"tasks":[]}');
      });
      
      test('should return success if no tasks to clear', async () => {
        // Setup - empty tasks list
        const fs = require('fs/promises');
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(JSON.stringify({ tasks: [] }));
        
        // Execute
        const result = await taskModel.clearAllTasks();
        
        // Verify
        expect(result.success).toBe(true);
        expect(result.message).toContain('No tasks need to be cleared');
        expect(result.backupFile).toBeUndefined();
        
        // Verify no file was written
        expect(fs.writeFile).not.toHaveBeenCalled();
      });
      
      test('should handle errors during clearing', async () => {
        // Setup - filesystem error
        const fs = require('fs/promises');
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockRejectedValue(new Error('Access denied'));
        
        // Execute
        const result = await taskModel.clearAllTasks();
        
        // Verify
        expect(result.success).toBe(false);
        expect(result.message).toContain('Error clearing tasks');
        expect(result.message).toContain('Access denied');
      });
    });
  });
}); 