import { jest } from '@jest/globals';

// Mock the taskModel module
jest.mock('../../models/taskModel.js', () => {
  const original = jest.requireActual('../../models/taskModel.js');
  return {
    ...original,
    batchCreateOrUpdateTasks: jest.fn().mockResolvedValue([]),
    getAllTasks: jest.fn().mockResolvedValue([]),
    clearAllTasks: jest.fn().mockResolvedValue({
      success: true,
      message: 'All tasks cleared',
      backupFile: 'backup.json'
    })
  };
});

// Import the taskModel module after mocking
import * as taskModel from '../../models/taskModel.js';

// Import the module to test
import { splitTasks } from '../../tools/taskTools.js';

describe('Project Rules Update Task Implementation Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('should add project rules update task with clearAllTasks mode', async () => {
    // Prepare test data
    const testTasks = [
      {
        name: 'Task 1',
        description: 'Task 1 description',
        implementationGuide: 'Task 1 guide'
      },
      {
        name: 'Task 2',
        description: 'Task 2 description',
        implementationGuide: 'Task 2 guide'
      }
    ];

    // Call the function
    await splitTasks({
      updateMode: 'clearAllTasks',
      tasks: testTasks
    });

    // Verify batchCreateOrUpdateTasks was called with the correct parameters
    expect(taskModel.batchCreateOrUpdateTasks).toHaveBeenCalledTimes(1);
    
    // Get the actual tasks passed to batchCreateOrUpdateTasks
    const actualTasks = taskModel.batchCreateOrUpdateTasks.mock.calls[0][0];
    
    // Verify there is one more task than we started with (the project rules update task)
    expect(actualTasks.length).toBe(testTasks.length + 1);
    
    // Verify the last task is the project rules update task
    const projectRulesTask = actualTasks[actualTasks.length - 1];
    expect(projectRulesTask.name).toBe('Update Project Rules Based on Completed Items');
    
    // Verify it depends on all other tasks
    expect(projectRulesTask.dependencies).toEqual(['Task 1', 'Task 2']);
  });

  test('should add project rules update task with append mode', async () => {
    // Prepare test data
    const testTasks = [
      {
        name: 'Task 3',
        description: 'Task 3 description',
        implementationGuide: 'Task 3 guide'
      }
    ];

    // Call the function
    await splitTasks({
      updateMode: 'append',
      tasks: testTasks
    });

    // Verify batchCreateOrUpdateTasks was called with the correct parameters
    expect(taskModel.batchCreateOrUpdateTasks).toHaveBeenCalledTimes(1);
    
    // Get the actual tasks passed to batchCreateOrUpdateTasks
    const actualTasks = taskModel.batchCreateOrUpdateTasks.mock.calls[0][0];
    
    // Verify there is one more task than we started with (the project rules update task)
    expect(actualTasks.length).toBe(testTasks.length + 1);
    
    // Verify the last task is the project rules update task
    const projectRulesTask = actualTasks[actualTasks.length - 1];
    expect(projectRulesTask.name).toBe('Update Project Rules Based on Completed Items');
    
    // Verify it depends on all other tasks
    expect(projectRulesTask.dependencies).toEqual(['Task 3']);
  });

  test('should add project rules update task with overwrite mode', async () => {
    // Prepare test data
    const testTasks = [
      {
        name: 'Task 4',
        description: 'Task 4 description',
        implementationGuide: 'Task 4 guide'
      },
      {
        name: 'Task 5',
        description: 'Task 5 description',
        implementationGuide: 'Task 5 guide'
      }
    ];

    // Call the function
    await splitTasks({
      updateMode: 'overwrite',
      tasks: testTasks
    });

    // Verify batchCreateOrUpdateTasks was called with the correct parameters
    expect(taskModel.batchCreateOrUpdateTasks).toHaveBeenCalledTimes(1);
    
    // Get the actual tasks passed to batchCreateOrUpdateTasks
    const actualTasks = taskModel.batchCreateOrUpdateTasks.mock.calls[0][0];
    
    // Verify there is one more task than we started with (the project rules update task)
    expect(actualTasks.length).toBe(testTasks.length + 1);
    
    // Verify the last task is the project rules update task
    const projectRulesTask = actualTasks[actualTasks.length - 1];
    expect(projectRulesTask.name).toBe('Update Project Rules Based on Completed Items');
    
    // Verify it depends on all other tasks
    expect(projectRulesTask.dependencies).toEqual(['Task 4', 'Task 5']);
  });

  test('should add project rules update task with selective mode', async () => {
    // Prepare test data
    const testTasks = [
      {
        name: 'Task 6',
        description: 'Task 6 description',
        implementationGuide: 'Task 6 guide'
      }
    ];

    // Call the function
    await splitTasks({
      updateMode: 'selective',
      tasks: testTasks
    });

    // Verify batchCreateOrUpdateTasks was called with the correct parameters
    expect(taskModel.batchCreateOrUpdateTasks).toHaveBeenCalledTimes(1);
    
    // Get the actual tasks passed to batchCreateOrUpdateTasks
    const actualTasks = taskModel.batchCreateOrUpdateTasks.mock.calls[0][0];
    
    // Verify there is one more task than we started with (the project rules update task)
    expect(actualTasks.length).toBe(testTasks.length + 1);
    
    // Verify the last task is the project rules update task
    const projectRulesTask = actualTasks[actualTasks.length - 1];
    expect(projectRulesTask.name).toBe('Update Project Rules Based on Completed Items');
    
    // Verify it depends on all other tasks
    expect(projectRulesTask.dependencies).toEqual(['Task 6']);
  });

  test('should handle edge case: empty task list', async () => {
    // Call the function with empty task list
    await splitTasks({
      updateMode: 'clearAllTasks',
      tasks: []
    });

    // Verify batchCreateOrUpdateTasks was called with the correct parameters
    expect(taskModel.batchCreateOrUpdateTasks).toHaveBeenCalledTimes(1);
    
    // Get the actual tasks passed to batchCreateOrUpdateTasks
    const actualTasks = taskModel.batchCreateOrUpdateTasks.mock.calls[0][0];
    
    // Verify there is exactly one task (the project rules update task)
    expect(actualTasks.length).toBe(1);
    
    // Verify the task is the project rules update task
    const projectRulesTask = actualTasks[0];
    expect(projectRulesTask.name).toBe('Update Project Rules Based on Completed Items');
    
    // Verify it has no dependencies since there are no other tasks
    expect(projectRulesTask.dependencies).toEqual([]);
  });
}); 