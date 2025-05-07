import { jest } from '@jest/globals';

// Mock modules with proper return values for functions
jest.mock('../../models/taskModel.js', () => ({
  getAllTasks: jest.fn().mockResolvedValue([]),
  getTaskById: jest.fn().mockResolvedValue(null),
  updateTaskStatus: jest.fn().mockResolvedValue({}),
  canExecuteTask: jest.fn().mockResolvedValue({ canExecute: true }),
  batchCreateOrUpdateTasks: jest.fn().mockResolvedValue([]),
  updateTaskSummary: jest.fn().mockResolvedValue({}),
  assessTaskComplexity: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../utils/summaryExtractor.js', () => ({
  extractSummary: jest.fn().mockReturnValue(''),
  generateTaskSummary: jest.fn().mockReturnValue('Task summary'),
}));

jest.mock('../../utils/fileLoader.js', () => ({
  loadTaskRelatedFiles: jest.fn().mockResolvedValue({ content: '', summary: '' }),
}));

jest.mock('../../prompts/index.js', () => ({
  getPlanTaskPrompt: jest.fn().mockReturnValue('Plan task prompt'),
  getAnalyzeTaskPrompt: jest.fn().mockReturnValue('Analyze task prompt'),
  getReflectTaskPrompt: jest.fn().mockReturnValue('Reflect task prompt'),
  getExecuteTaskPrompt: jest.fn().mockReturnValue('Execute task prompt'),
  getVerifyTaskPrompt: jest.fn().mockReturnValue('Verify task prompt'),
  getCompleteTaskPrompt: jest.fn().mockReturnValue('Complete task prompt'),
}));

// Import the modules to test
import { 
  planTask, 
  analyzeTask, 
  reflectTask, 
  executeTask, 
  verifyTask, 
  completeTask,
} from '../../tools/taskTools.js';

import * as taskModel from '../../models/taskModel.js';
import * as summaryExtractor from '../../utils/summaryExtractor.js';
import * as fileLoader from '../../utils/fileLoader.js';
import * as promptGenerators from '../../prompts/index.js';
import { TaskStatus, TaskComplexityLevel } from '../../types/index.js';

describe('Task Business Logic Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('planTask function tests', () => {
    test('should generate a plan task prompt correctly', async () => {
      // Setup mocks
      promptGenerators.getPlanTaskPrompt.mockReturnValue('Mocked planning prompt');
      taskModel.getAllTasks.mockResolvedValue([
        { id: 'task1', name: 'Task 1', status: TaskStatus.PENDING },
        { id: 'task2', name: 'Task 2', status: TaskStatus.COMPLETED },
      ]);
      
      // Call the function
      const result = await planTask({
        description: 'Test task description',
        requirements: 'Test requirements',
        existingTasksReference: true
      });
      
      // Assertions
      expect(promptGenerators.getPlanTaskPrompt).toHaveBeenCalledTimes(1);
      expect(taskModel.getAllTasks).toHaveBeenCalledTimes(1);
      expect(result).toBe('Mocked planning prompt');
      
      // Verify correct parameters were passed to getPlanTaskPrompt
      const promptParams = promptGenerators.getPlanTaskPrompt.mock.calls[0][0];
      expect(promptParams).toHaveProperty('description', 'Test task description');
      expect(promptParams).toHaveProperty('requirements', 'Test requirements');
      expect(promptParams).toHaveProperty('existingTasks');
    });
    
    test('should not fetch tasks when existingTasksReference is false', async () => {
      // Setup mocks
      promptGenerators.getPlanTaskPrompt.mockReturnValue('Mocked planning prompt');
      
      // Call the function
      await planTask({
        description: 'Test task description',
        existingTasksReference: false
      });
      
      // Assertions
      expect(taskModel.getAllTasks).not.toHaveBeenCalled();
      expect(promptGenerators.getPlanTaskPrompt).toHaveBeenCalledTimes(1);
      
      // Verify parameters
      const promptParams = promptGenerators.getPlanTaskPrompt.mock.calls[0][0];
      expect(promptParams).toHaveProperty('description', 'Test task description');
      expect(promptParams).toHaveProperty('existingTasks', []);
    });
    
    test('should handle errors correctly', async () => {
      // Setup mocks to throw an error
      taskModel.getAllTasks.mockRejectedValue(new Error('Database error'));
      
      // Call the function and expect it to throw
      await expect(planTask({
        description: 'Test task description',
        existingTasksReference: true
      })).rejects.toThrow('Database error');
      
      // Verify the mock was called
      expect(taskModel.getAllTasks).toHaveBeenCalledTimes(1);
      expect(promptGenerators.getPlanTaskPrompt).not.toHaveBeenCalled();
    });
  });
  
  describe('analyzeTask function tests', () => {
    test('should generate an analyze task prompt correctly', async () => {
      // Setup mocks
      promptGenerators.getAnalyzeTaskPrompt.mockReturnValue('Mocked analysis prompt');
      
      // Call the function
      const result = await analyzeTask({
        summary: 'Test summary',
        initialConcept: 'Test initial concept with sufficient length for the test to pass validation'
      });
      
      // Assertions
      expect(promptGenerators.getAnalyzeTaskPrompt).toHaveBeenCalledTimes(1);
      expect(result).toBe('Mocked analysis prompt');
      
      // Verify parameters
      const promptParams = promptGenerators.getAnalyzeTaskPrompt.mock.calls[0][0];
      expect(promptParams).toHaveProperty('summary', 'Test summary');
      expect(promptParams).toHaveProperty('initialConcept', 'Test initial concept with sufficient length for the test to pass validation');
    });
    
    test('should include previousAnalysis when provided', async () => {
      // Setup mocks
      promptGenerators.getAnalyzeTaskPrompt.mockReturnValue('Mocked analysis prompt');
      
      // Call the function
      await analyzeTask({
        summary: 'Test summary',
        initialConcept: 'Test initial concept with sufficient length for the test',
        previousAnalysis: 'Previous analysis data'
      });
      
      // Verify parameters
      const promptParams = promptGenerators.getAnalyzeTaskPrompt.mock.calls[0][0];
      expect(promptParams).toHaveProperty('previousAnalysis', 'Previous analysis data');
    });
  });
  
  describe('reflectTask function tests', () => {
    test('should generate a reflect task prompt correctly', async () => {
      // Setup mocks
      promptGenerators.getReflectTaskPrompt.mockReturnValue('Mocked reflection prompt');
      
      // Call the function
      const result = await reflectTask({
        summary: 'Test summary',
        analysis: 'This is a detailed analysis that meets the minimum character requirement for the reflectTask function to pass validation and generate the proper prompt.'
      });
      
      // Assertions
      expect(promptGenerators.getReflectTaskPrompt).toHaveBeenCalledTimes(1);
      expect(result).toBe('Mocked reflection prompt');
      
      // Verify parameters
      const promptParams = promptGenerators.getReflectTaskPrompt.mock.calls[0][0];
      expect(promptParams).toHaveProperty('summary', 'Test summary');
      expect(promptParams).toHaveProperty('analysis', 'This is a detailed analysis that meets the minimum character requirement for the reflectTask function to pass validation and generate the proper prompt.');
    });
  });
  
  describe('executeTask function tests', () => {
    test('should generate an execute task prompt correctly', async () => {
      // Setup mocks
      const mockTask = {
        id: 'task1',
        name: 'Task 1',
        description: 'Test description',
        status: TaskStatus.PENDING,
        implementationGuide: 'Test implementation guide',
        dependencies: [{ taskId: 'dep1' }]
      };
      
      const mockDependencyTask = {
        id: 'dep1',
        name: 'Dependency Task',
        description: 'Dependency description',
        status: TaskStatus.COMPLETED,
        summary: 'Completed dependency task summary'
      };
      
      taskModel.getTaskById.mockResolvedValueOnce(mockTask);
      taskModel.getTaskById.mockResolvedValueOnce(mockDependencyTask);
      taskModel.canExecuteTask.mockResolvedValue({ canExecute: true });
      taskModel.updateTaskStatus.mockResolvedValue({});
      taskModel.assessTaskComplexity.mockResolvedValue({
        level: TaskComplexityLevel.MEDIUM,
        metrics: { descriptionLength: 100, dependencyCount: 1 },
        recommendations: ['Test recommendation']
      });
      fileLoader.loadTaskRelatedFiles.mockResolvedValue('Related files summary');
      promptGenerators.getExecuteTaskPrompt.mockReturnValue('Mocked execute prompt');
      
      // Call the function
      const result = await executeTask({
        taskId: 'task1'
      });
      
      // Assertions
      expect(taskModel.getTaskById).toHaveBeenCalledWith('task1');
      expect(taskModel.canExecuteTask).toHaveBeenCalledWith('task1');
      expect(taskModel.updateTaskStatus).toHaveBeenCalledWith('task1', TaskStatus.IN_PROGRESS);
      expect(taskModel.assessTaskComplexity).toHaveBeenCalledWith(mockTask);
      expect(fileLoader.loadTaskRelatedFiles).toHaveBeenCalledWith(mockTask);
      expect(promptGenerators.getExecuteTaskPrompt).toHaveBeenCalledTimes(1);
      expect(result).toBe('Mocked execute prompt');
      
      // Verify parameters to getExecuteTaskPrompt
      const promptParams = promptGenerators.getExecuteTaskPrompt.mock.calls[0][0];
      expect(promptParams).toHaveProperty('task', mockTask);
      expect(promptParams).toHaveProperty('complexityAssessment');
      expect(promptParams).toHaveProperty('relatedFilesSummary', 'Related files summary');
      expect(promptParams).toHaveProperty('dependencyTasks');
    });
    
    test('should throw error if task cannot be executed', async () => {
      // Setup mocks
      taskModel.getTaskById.mockResolvedValue({ id: 'task1', name: 'Task 1' });
      taskModel.canExecuteTask.mockResolvedValue({ 
        canExecute: false, 
        reason: 'Dependencies not met'
      });
      
      // Call the function and expect it to throw
      await expect(executeTask({
        taskId: 'task1'
      })).rejects.toThrow('Cannot execute task: Dependencies not met');
      
      // Verify mocks
      expect(taskModel.getTaskById).toHaveBeenCalledWith('task1');
      expect(taskModel.canExecuteTask).toHaveBeenCalledWith('task1');
      expect(taskModel.updateTaskStatus).not.toHaveBeenCalled();
    });
    
    test('should handle non-existent task', async () => {
      // Setup mocks
      taskModel.getTaskById.mockResolvedValue(null);
      
      // Call the function and expect it to throw
      await expect(executeTask({
        taskId: 'non-existent-task'
      })).rejects.toThrow('Task not found: non-existent-task');
      
      // Verify mocks
      expect(taskModel.getTaskById).toHaveBeenCalledWith('non-existent-task');
      expect(taskModel.canExecuteTask).not.toHaveBeenCalled();
    });
  });
  
  describe('verifyTask function tests', () => {
    test('should generate a verify task prompt correctly', async () => {
      // Setup mocks
      const mockTask = {
        id: 'task1',
        name: 'Task 1',
        description: 'Test description',
        status: TaskStatus.IN_PROGRESS,
        implementationGuide: 'Test implementation guide line 1\nTest implementation guide line 2\nTest implementation guide line 3',
      };
      
      taskModel.getTaskById.mockResolvedValue(mockTask);
      promptGenerators.getVerifyTaskPrompt.mockReturnValue('Mocked verify prompt');
      
      // Call the function
      const result = await verifyTask({
        taskId: 'task1'
      });
      
      // Assertions
      expect(taskModel.getTaskById).toHaveBeenCalledWith('task1');
      expect(promptGenerators.getVerifyTaskPrompt).toHaveBeenCalledTimes(1);
      expect(result).toBe('Mocked verify prompt');
      
      // Verify parameters
      const promptParams = promptGenerators.getVerifyTaskPrompt.mock.calls[0][0];
      expect(promptParams).toHaveProperty('task', mockTask);
      expect(promptParams).toHaveProperty('implementationGuideSummary');
      // Implementation guide summary should have 3 items
      expect(promptParams.implementationGuideSummary.split('\n')).toHaveLength(3);
    });
    
    test('should throw error if task is not in progress', async () => {
      // Setup mocks
      taskModel.getTaskById.mockResolvedValue({
        id: 'task1',
        name: 'Task 1',
        status: TaskStatus.PENDING
      });
      
      // Call the function and expect it to throw
      await expect(verifyTask({
        taskId: 'task1'
      })).rejects.toThrow('Task must be in progress to verify');
      
      // Verify mocks
      expect(taskModel.getTaskById).toHaveBeenCalledWith('task1');
      expect(promptGenerators.getVerifyTaskPrompt).not.toHaveBeenCalled();
    });
    
    test('should handle non-existent task', async () => {
      // Setup mocks
      taskModel.getTaskById.mockResolvedValue(null);
      
      // Call the function and expect it to throw
      await expect(verifyTask({
        taskId: 'non-existent-task'
      })).rejects.toThrow('Task not found: non-existent-task');
      
      // Verify mocks
      expect(taskModel.getTaskById).toHaveBeenCalledWith('non-existent-task');
      expect(promptGenerators.getVerifyTaskPrompt).not.toHaveBeenCalled();
    });
  });
  
  describe('completeTask function tests', () => {
    test('should complete a task and generate a completion prompt', async () => {
      // Setup mocks
      const mockTask = {
        id: 'task1',
        name: 'Task 1',
        description: 'Test description',
        status: TaskStatus.IN_PROGRESS
      };
      
      taskModel.getTaskById.mockResolvedValue(mockTask);
      taskModel.updateTaskStatus.mockResolvedValue({ ...mockTask, status: TaskStatus.COMPLETED });
      summaryExtractor.generateTaskSummary.mockReturnValue('Generated task summary');
      taskModel.updateTaskSummary.mockResolvedValue({});
      promptGenerators.getCompleteTaskPrompt.mockReturnValue('Mocked complete prompt');
      
      // Call the function
      const result = await completeTask({
        taskId: 'task1'
      });
      
      // Assertions
      expect(taskModel.getTaskById).toHaveBeenCalledWith('task1');
      expect(taskModel.updateTaskStatus).toHaveBeenCalledWith('task1', TaskStatus.COMPLETED);
      expect(summaryExtractor.generateTaskSummary).toHaveBeenCalled();
      expect(taskModel.updateTaskSummary).toHaveBeenCalledWith('task1', 'Generated task summary');
      expect(promptGenerators.getCompleteTaskPrompt).toHaveBeenCalledTimes(1);
      expect(result).toBe('Mocked complete prompt');
      
      // Verify parameters
      const promptParams = promptGenerators.getCompleteTaskPrompt.mock.calls[0][0];
      expect(promptParams).toHaveProperty('task');
      expect(promptParams.task.status).toBe(TaskStatus.COMPLETED);
    });
    
    test('should use provided summary if available', async () => {
      // Setup mocks
      const mockTask = {
        id: 'task1',
        name: 'Task 1',
        status: TaskStatus.IN_PROGRESS
      };
      
      taskModel.getTaskById.mockResolvedValue(mockTask);
      taskModel.updateTaskStatus.mockResolvedValue({ ...mockTask, status: TaskStatus.COMPLETED });
      promptGenerators.getCompleteTaskPrompt.mockReturnValue('Mocked complete prompt');
      
      // Call the function with a summary
      await completeTask({
        taskId: 'task1',
        summary: 'User provided summary that is longer than the minimum required characters'
      });
      
      // Assertions
      expect(summaryExtractor.generateTaskSummary).not.toHaveBeenCalled();
      expect(taskModel.updateTaskSummary).toHaveBeenCalledWith('task1', 'User provided summary that is longer than the minimum required characters');
    });
    
    test('should throw error if task is not in progress', async () => {
      // Setup mocks
      taskModel.getTaskById.mockResolvedValue({
        id: 'task1',
        name: 'Task 1',
        status: TaskStatus.PENDING
      });
      
      // Call the function and expect it to throw
      await expect(completeTask({
        taskId: 'task1'
      })).rejects.toThrow('Task must be in progress to complete');
      
      // Verify mocks
      expect(taskModel.getTaskById).toHaveBeenCalledWith('task1');
      expect(taskModel.updateTaskStatus).not.toHaveBeenCalled();
    });
    
    test('should handle non-existent task', async () => {
      // Setup mocks
      taskModel.getTaskById.mockResolvedValue(null);
      
      // Call the function and expect it to throw
      await expect(completeTask({
        taskId: 'non-existent-task'
      })).rejects.toThrow('Task not found: non-existent-task');
      
      // Verify mocks
      expect(taskModel.getTaskById).toHaveBeenCalledWith('non-existent-task');
      expect(taskModel.updateTaskStatus).not.toHaveBeenCalled();
    });
  });
}); 