import { jest } from '@jest/globals';
import { TaskStatus } from '../../types/index.js';

// Mock the fs/promises module
jest.mock('fs/promises', () => ({
  access: jest.fn(),
  mkdir: jest.fn(),
  readFile: jest.fn(),
  writeFile: jest.fn()
}));

// Mock the uuid module
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid-1')
}));

// Mock child_process
jest.mock('child_process', () => ({
  exec: jest.fn()
}));

// Mock the path used for the data directory and tasks file
jest.mock('../taskModel.js', () => {
  const originalModule = jest.requireActual('../taskModel.js');
  return {
    ...originalModule,
    DATA_DIR: '/path/to/data',
    TASKS_FILE: '/path/to/data/tasks.json'
  };
});

// Import the module under test
import * as taskModel from '../taskModel.js';

describe('Task Batch Operations', () => {
  // Setup helpers for consistent test data
  const createTaskFixture = (overrides = {}) => {
    return {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Test Task',
      description: 'Task description for testing',
      status: TaskStatus.PENDING,
      dependencies: [],
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      relatedFiles: [],
      ...overrides
    };
  };
  
  // Test fixtures for batch operations
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
  
  // Before each test
  beforeEach(() => {
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
          dependencies: ['existing-task-1', 'Second Task', 'Task with ID Dependency'] // Mixed references
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