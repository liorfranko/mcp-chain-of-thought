import { jest } from '@jest/globals';

// Define the TaskStatus enum to match the real implementation
const TaskStatus = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  BLOCKED: 'Blocked'
};

// Mock the fs/promises module
jest.mock('fs/promises', () => ({
  access: jest.fn(),
  mkdir: jest.fn(),
  readFile: jest.fn(),
  writeFile: jest.fn()
}));

// Mock the uuid module
jest.mock('uuid', () => ({
  v4: jest.fn().mockImplementation(() => `test-uuid-${Math.floor(Math.random() * 1000)}`)
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

describe('Task Model Batch Operations', () => {
  // Setup helpers for consistent test data
  const createTaskFixture = (overrides = {}) => {
    return {
      id: overrides.id || '11111111-1111-1111-1111-111111111111',
      name: overrides.name || 'Test Task',
      description: overrides.description || 'Task description for testing',
      status: overrides.status || TaskStatus.PENDING,
      dependencies: overrides.dependencies || [],
      createdAt: overrides.createdAt || new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: overrides.updatedAt || new Date('2023-01-01T00:00:00.000Z'),
      relatedFiles: overrides.relatedFiles || [],
      ...(overrides.completedAt && { completedAt: overrides.completedAt }),
      ...(overrides.implementationGuide && { implementationGuide: overrides.implementationGuide }),
      ...(overrides.verificationCriteria && { verificationCriteria: overrides.verificationCriteria }),
      ...(overrides.analysisResult && { analysisResult: overrides.analysisResult }),
    };
  };
  
  const createTaskDataFixture = (overrides = {}) => {
    return {
      name: overrides.name || 'New Task',
      description: overrides.description || 'New task description',
      ...(overrides.notes && { notes: overrides.notes }),
      ...(overrides.dependencies && { dependencies: overrides.dependencies }),
      ...(overrides.relatedFiles && { relatedFiles: overrides.relatedFiles }),
      ...(overrides.implementationGuide && { implementationGuide: overrides.implementationGuide }),
      ...(overrides.verificationCriteria && { verificationCriteria: overrides.verificationCriteria }),
    };
  };
  
  const createExistingTasksFixture = () => {
    return [
      createTaskFixture({
        id: 'existing-1',
        name: 'Existing Task 1',
        status: TaskStatus.PENDING
      }),
      createTaskFixture({
        id: 'existing-2',
        name: 'Existing Task 2',
        status: TaskStatus.IN_PROGRESS
      }),
      createTaskFixture({
        id: 'existing-3',
        name: 'Existing Task 3',
        status: TaskStatus.COMPLETED,
        completedAt: new Date('2023-01-15T00:00:00.000Z')
      })
    ];
  };
  
  // Before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('batchCreateOrUpdateTasks', () => {
    describe('append mode', () => {
      test('should add new tasks to existing ones', async () => {
        // Setup - mock file system responses
        const fs = require('fs/promises');
        const existingTasks = createExistingTasksFixture();
        
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(JSON.stringify({ 
          tasks: existingTasks.map(task => ({
            ...task,
            createdAt: task.createdAt.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
            ...(task.completedAt && { completedAt: task.completedAt.toISOString() })
          }))
        }));
        fs.writeFile.mockResolvedValue(undefined);
        
        // New tasks to add
        const newTaskDataList = [
          createTaskDataFixture({ name: 'New Task 1' }),
          createTaskDataFixture({ name: 'New Task 2' })
        ];
        
        // Execute
        const result = await taskModel.batchCreateOrUpdateTasks(
          newTaskDataList,
          'append'
        );
        
        // Verify
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('New Task 1');
        expect(result[1].name).toBe('New Task 2');
        
        // Verify file was written with both existing and new tasks
        expect(fs.writeFile).toHaveBeenCalledWith(
          '/path/to/data/tasks.json',
          expect.any(String)
        );
        
        // Verify content of written file
        const writeCallArg = JSON.parse(fs.writeFile.mock.calls[0][1]);
        expect(writeCallArg.tasks).toHaveLength(5); // 3 existing + 2 new
        
        // Check that existing tasks are preserved
        expect(writeCallArg.tasks.find(t => t.id === 'existing-1')).toBeTruthy();
        expect(writeCallArg.tasks.find(t => t.id === 'existing-2')).toBeTruthy();
        expect(writeCallArg.tasks.find(t => t.id === 'existing-3')).toBeTruthy();
        
        // Check that new tasks are added
        expect(writeCallArg.tasks.find(t => t.name === 'New Task 1')).toBeTruthy();
        expect(writeCallArg.tasks.find(t => t.name === 'New Task 2')).toBeTruthy();
      });
      
      test('should handle dependencies between new tasks', async () => {
        // Setup - mock file system responses
        const fs = require('fs/promises');
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(JSON.stringify({ tasks: [] }));
        fs.writeFile.mockResolvedValue(undefined);
        
        // Mock UUID function to return predictable values
        const uuid = require('uuid');
        uuid.v4.mockImplementationOnce(() => 'task-1-id');
        uuid.v4.mockImplementationOnce(() => 'task-2-id');
        
        // New tasks with dependencies
        const newTaskDataList = [
          createTaskDataFixture({ 
            name: 'Task 1', 
            description: 'First task' 
          }),
          createTaskDataFixture({ 
            name: 'Task 2', 
            description: 'Second task depends on first',
            dependencies: ['Task 1'] // Reference by name
          })
        ];
        
        // Execute
        const result = await taskModel.batchCreateOrUpdateTasks(
          newTaskDataList,
          'append'
        );
        
        // Verify
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Task 1');
        expect(result[1].name).toBe('Task 2');
        
        // Verify dependencies are resolved correctly
        expect(result[1].dependencies).toHaveLength(1);
        expect(result[1].dependencies[0].taskId).toBe('task-1-id');
      });
    });
    
    describe('overwrite mode', () => {
      test('should keep completed tasks and replace incomplete ones', async () => {
        // Setup - mock file system responses
        const fs = require('fs/promises');
        const existingTasks = createExistingTasksFixture();
        
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(JSON.stringify({ 
          tasks: existingTasks.map(task => ({
            ...task,
            createdAt: task.createdAt.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
            ...(task.completedAt && { completedAt: task.completedAt.toISOString() })
          }))
        }));
        fs.writeFile.mockResolvedValue(undefined);
        
        // New tasks to add
        const newTaskDataList = [
          createTaskDataFixture({ name: 'New Task 1' }),
          createTaskDataFixture({ name: 'New Task 2', dependencies: ['existing-3'] }) // Depend on a completed task
        ];
        
        // Execute
        const result = await taskModel.batchCreateOrUpdateTasks(
          newTaskDataList,
          'overwrite'
        );
        
        // Verify
        expect(result).toHaveLength(2);
        
        // Verify file was written with completed tasks preserved and new tasks added
        expect(fs.writeFile).toHaveBeenCalledWith(
          '/path/to/data/tasks.json',
          expect.any(String)
        );
        
        // Verify content of written file
        const writeCallArg = JSON.parse(fs.writeFile.mock.calls[0][1]);
        expect(writeCallArg.tasks).toHaveLength(3); // 1 completed existing + 2 new
        
        // Check that only completed tasks are preserved
        expect(writeCallArg.tasks.find(t => t.id === 'existing-1')).toBeFalsy();
        expect(writeCallArg.tasks.find(t => t.id === 'existing-2')).toBeFalsy();
        expect(writeCallArg.tasks.find(t => t.id === 'existing-3')).toBeTruthy();
        
        // Check that new tasks are added
        expect(writeCallArg.tasks.find(t => t.name === 'New Task 1')).toBeTruthy();
        expect(writeCallArg.tasks.find(t => t.name === 'New Task 2')).toBeTruthy();
        
        // Verify dependencies are preserved
        const task2 = writeCallArg.tasks.find(t => t.name === 'New Task 2');
        expect(task2.dependencies).toHaveLength(1);
        expect(task2.dependencies[0].taskId).toBe('existing-3');
      });
    });
    
    describe('selective mode', () => {
      test('should update existing tasks by name and keep others', async () => {
        // Setup - mock file system responses
        const fs = require('fs/promises');
        const existingTasks = createExistingTasksFixture();
        
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(JSON.stringify({ 
          tasks: existingTasks.map(task => ({
            ...task,
            createdAt: task.createdAt.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
            ...(task.completedAt && { completedAt: task.completedAt.toISOString() })
          }))
        }));
        fs.writeFile.mockResolvedValue(undefined);
        
        // Tasks to update (one existing, one new)
        const taskDataList = [
          createTaskDataFixture({ 
            name: 'Existing Task 1', // This should update the existing task
            description: 'Updated description',
            implementationGuide: 'New implementation guide'
          }),
          createTaskDataFixture({ 
            name: 'New Task', // This should be added as new
            description: 'Brand new task'
          })
        ];
        
        // Execute
        const result = await taskModel.batchCreateOrUpdateTasks(
          taskDataList,
          'selective'
        );
        
        // Verify
        expect(result).toHaveLength(2);
        
        // Verify file was written with the updated task and additional task
        expect(fs.writeFile).toHaveBeenCalledWith(
          '/path/to/data/tasks.json',
          expect.any(String)
        );
        
        // Verify content of written file
        const writeCallArg = JSON.parse(fs.writeFile.mock.calls[0][1]);
        expect(writeCallArg.tasks).toHaveLength(4); // 3 existing (1 updated) + 1 new
        
        // Check that existing tasks are preserved
        expect(writeCallArg.tasks.find(t => t.id === 'existing-1')).toBeTruthy();
        expect(writeCallArg.tasks.find(t => t.id === 'existing-2')).toBeTruthy();
        expect(writeCallArg.tasks.find(t => t.id === 'existing-3')).toBeTruthy();
        
        // Check that the existing task was updated
        const updatedTask = writeCallArg.tasks.find(t => t.id === 'existing-1');
        expect(updatedTask.description).toBe('Updated description');
        expect(updatedTask.implementationGuide).toBe('New implementation guide');
        
        // Check that new task was added
        expect(writeCallArg.tasks.find(t => t.name === 'New Task')).toBeTruthy();
      });
      
      test('should not update completed tasks in selective mode', async () => {
        // Setup - mock file system responses
        const fs = require('fs/promises');
        const existingTasks = createExistingTasksFixture();
        
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(JSON.stringify({ 
          tasks: existingTasks.map(task => ({
            ...task,
            createdAt: task.createdAt.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
            ...(task.completedAt && { completedAt: task.completedAt.toISOString() })
          }))
        }));
        fs.writeFile.mockResolvedValue(undefined);
        
        // Try to update a completed task
        const taskDataList = [
          createTaskDataFixture({ 
            name: 'Existing Task 3', // This is a completed task
            description: 'Should not update completed task',
          })
        ];
        
        // Execute
        const result = await taskModel.batchCreateOrUpdateTasks(
          taskDataList,
          'selective'
        );
        
        // Verify
        expect(result).toHaveLength(1); // Still returns the task
        
        // Verify file was written
        expect(fs.writeFile).toHaveBeenCalledWith(
          '/path/to/data/tasks.json',
          expect.any(String)
        );
        
        // Verify content of written file
        const writeCallArg = JSON.parse(fs.writeFile.mock.calls[0][1]);
        
        // Check that the completed task was not updated
        const completedTask = writeCallArg.tasks.find(t => t.id === 'existing-3');
        expect(completedTask.description).not.toBe('Should not update completed task');
        
        // The task still gets added as a new task since the existing one wasn't updated
        expect(writeCallArg.tasks.find(t => t.name === 'Existing Task 3' && t.id !== 'existing-3')).toBeTruthy();
      });
    });
    
    describe('clearAllTasks mode', () => {
      test('should clear all tasks and add new ones', async () => {
        // Setup - mock file system responses
        const fs = require('fs/promises');
        const existingTasks = createExistingTasksFixture();
        
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(JSON.stringify({ 
          tasks: existingTasks.map(task => ({
            ...task,
            createdAt: task.createdAt.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
            ...(task.completedAt && { completedAt: task.completedAt.toISOString() })
          }))
        }));
        fs.writeFile.mockResolvedValue(undefined);
        
        // New tasks to add
        const newTaskDataList = [
          createTaskDataFixture({ name: 'New Task 1' }),
          createTaskDataFixture({ name: 'New Task 2' })
        ];
        
        // Execute
        const result = await taskModel.batchCreateOrUpdateTasks(
          newTaskDataList,
          'clearAllTasks'
        );
        
        // Verify
        expect(result).toHaveLength(2);
        
        // Verify file was written with only new tasks
        expect(fs.writeFile).toHaveBeenCalledWith(
          '/path/to/data/tasks.json',
          expect.any(String)
        );
        
        // Verify content of written file
        const writeCallArg = JSON.parse(fs.writeFile.mock.calls[0][1]);
        expect(writeCallArg.tasks).toHaveLength(2); // Only new tasks
        
        // Check that existing tasks are removed
        expect(writeCallArg.tasks.find(t => t.id === 'existing-1')).toBeFalsy();
        expect(writeCallArg.tasks.find(t => t.id === 'existing-2')).toBeFalsy();
        expect(writeCallArg.tasks.find(t => t.id === 'existing-3')).toBeFalsy();
        
        // Check that only new tasks exist
        expect(writeCallArg.tasks.find(t => t.name === 'New Task 1')).toBeTruthy();
        expect(writeCallArg.tasks.find(t => t.name === 'New Task 2')).toBeTruthy();
      });
      
      test('should support globalAnalysisResult parameter', async () => {
        // Setup - mock file system responses
        const fs = require('fs/promises');
        
        fs.access.mockResolvedValue(undefined);
        fs.readFile.mockResolvedValue(JSON.stringify({ tasks: [] }));
        fs.writeFile.mockResolvedValue(undefined);
        
        // New tasks to add with global analysis
        const newTaskDataList = [
          createTaskDataFixture({ name: 'Task with Analysis' })
        ];
        
        const globalAnalysis = 'This is a global analysis that applies to all tasks';
        
        // Execute
        const result = await taskModel.batchCreateOrUpdateTasks(
          newTaskDataList,
          'clearAllTasks',
          globalAnalysis
        );
        
        // Verify
        expect(result).toHaveLength(1);
        expect(result[0].analysisResult).toBe(globalAnalysis);
        
        // Verify content of written file
        const writeCallArg = JSON.parse(fs.writeFile.mock.calls[0][1]);
        expect(writeCallArg.tasks[0].analysisResult).toBe(globalAnalysis);
      });
    });
  });
  
  describe('clearAllTasks', () => {
    test('should clear all tasks and create a backup', async () => {
      // Setup - mock file system responses
      const fs = require('fs/promises');
      const existingTasks = createExistingTasksFixture();
      
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(JSON.stringify({ 
        tasks: existingTasks.map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
          ...(task.completedAt && { completedAt: task.completedAt.toISOString() })
        }))
      }));
      fs.writeFile.mockResolvedValue(undefined);
      fs.mkdir.mockResolvedValue(undefined);
      
      // Execute
      const result = await taskModel.clearAllTasks();
      
      // Verify
      expect(result.success).toBe(true);
      expect(result.backupFile).toBeDefined();
      
      // Verify tasks file was cleared
      expect(fs.writeFile).toHaveBeenCalledWith(
        '/path/to/data/tasks.json',
        JSON.stringify({ tasks: [] }, null, 2)
      );
      
      // Verify backup was created
      expect(fs.mkdir).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('/path/to/data/memory/'),
        expect.any(String)
      );
      
      // Check that only completed tasks are included in the backup
      const backupCall = fs.writeFile.mock.calls.find(call => 
        call[0].includes('/path/to/data/memory/')
      );
      
      const backupContent = JSON.parse(backupCall[1]);
      expect(backupContent.tasks).toHaveLength(1); // Only the completed task
      expect(backupContent.tasks[0].id).toBe('existing-3');
    });
    
    test('should return success with message when no tasks exist', async () => {
      // Setup - mock file system responses
      const fs = require('fs/promises');
      
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(JSON.stringify({ tasks: [] }));
      
      // Execute
      const result = await taskModel.clearAllTasks();
      
      // Verify
      expect(result.success).toBe(true);
      expect(result.message).toBe('No tasks need to be cleared');
      expect(result.backupFile).toBeUndefined();
      
      // Verify no files were written
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
    
    test('should handle errors gracefully', async () => {
      // Setup - mock file system error
      const fs = require('fs/promises');
      
      fs.access.mockResolvedValue(undefined);
      fs.readFile.mockRejectedValue(new Error('File system error'));
      
      // Execute
      const result = await taskModel.clearAllTasks();
      
      // Verify
      expect(result.success).toBe(false);
      expect(result.message).toContain('File system error');
      expect(result.backupFile).toBeUndefined();
    });
  });
}); 