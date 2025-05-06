import { jest } from '@jest/globals';
import { 
  createFsMock, 
  createUuidMock, 
  createTaskFixture,
  createTaskFixtures,
  createDependentTaskFixtures,
  assertValidTaskStructure,
  assertValidTaskTimestamps,
  assertTaskDependencies,
  createExecMock,
  delay
} from './helpers/index.js';
import { TaskStatus } from '../../types/index.js';

describe('Test Utility Functions', () => {
  // Test the filesystem mock
  describe('fsMocks', () => {
    test('should mock filesystem operations', async () => {
      // Create a mock filesystem with some initial files
      const fsMock = createFsMock({
        files: {
          '/test/file.txt': 'Initial content',
        },
        directories: new Set(['/test'])
      });
      
      // Test access
      await expect(fsMock.access('/test')).resolves.toBeUndefined();
      await expect(fsMock.access('/test/file.txt')).resolves.toBeUndefined();
      await expect(fsMock.access('/nonexistent')).rejects.toThrow('ENOENT');
      
      // Test readFile
      await expect(fsMock.readFile('/test/file.txt')).resolves.toBe('Initial content');
      await expect(fsMock.readFile('/nonexistent')).rejects.toThrow('ENOENT');
      
      // Test writeFile
      await fsMock.writeFile('/test/new-file.txt', 'New content');
      await expect(fsMock.readFile('/test/new-file.txt')).resolves.toBe('New content');
      
      // Test mkdir
      await fsMock.mkdir('/test/subdir');
      await expect(fsMock.access('/test/subdir')).resolves.toBeUndefined();
      
      // Test unlink
      await fsMock.unlink('/test/file.txt');
      await expect(fsMock.readFile('/test/file.txt')).rejects.toThrow('ENOENT');
      
      // Test helper methods
      fsMock._addFile('/test/helper-file.txt', 'Helper content');
      await expect(fsMock.readFile('/test/helper-file.txt')).resolves.toBe('Helper content');
      
      fsMock._addDirectory('/helper-dir');
      await expect(fsMock.access('/helper-dir')).resolves.toBeUndefined();
      
      const fsState = fsMock._getFileSystem();
      expect(fsState.files['/test/new-file.txt']).toBe('New content');
      expect(fsState.files['/test/helper-file.txt']).toBe('Helper content');
      expect(fsState.directories).toContain('/test/subdir');
    });
  });
  
  // Test the UUID mock
  describe('uuidMocks', () => {
    test('should return UUIDs in sequence', () => {
      const uuidMock = createUuidMock({
        uuids: ['uuid-1', 'uuid-2', 'uuid-3']
      });
      
      expect(uuidMock()).toBe('uuid-1');
      expect(uuidMock()).toBe('uuid-2');
      expect(uuidMock()).toBe('uuid-3');
      expect(uuidMock()).toBe('00000000-0000-0000-0000-000000000000'); // default
      
      // Add more UUIDs
      uuidMock._addUuid('uuid-4');
      expect(uuidMock()).toBe('uuid-4');
      
      // Set new UUIDs array
      uuidMock._setUuids(['uuid-5', 'uuid-6']);
      expect(uuidMock()).toBe('uuid-5');
      expect(uuidMock._getRemainingUuids()).toEqual(['uuid-6']);
    });
  });
  
  // Test the task fixtures
  describe('taskFixtures', () => {
    test('should create task fixtures with default values', () => {
      const task = createTaskFixture();
      
      expect(task).toHaveProperty('id', '11111111-1111-1111-1111-111111111111');
      expect(task).toHaveProperty('name', 'Test Task');
      expect(task).toHaveProperty('status', TaskStatus.PENDING);
    });
    
    test('should override default values', () => {
      const task = createTaskFixture({
        id: 'custom-id',
        name: 'Custom Task',
        status: TaskStatus.COMPLETED,
        completedAt: new Date('2023-01-02T00:00:00.000Z')
      });
      
      expect(task).toHaveProperty('id', 'custom-id');
      expect(task).toHaveProperty('name', 'Custom Task');
      expect(task).toHaveProperty('status', TaskStatus.COMPLETED);
      expect(task.completedAt).toEqual(new Date('2023-01-02T00:00:00.000Z'));
    });
    
    test('should create multiple task fixtures with different statuses', () => {
      const tasks = createTaskFixtures({
        pendingCount: 2,
        inProgressCount: 1,
        completedCount: 3
      });
      
      expect(tasks).toHaveLength(6);
      expect(tasks.filter(t => t.status === TaskStatus.PENDING)).toHaveLength(2);
      expect(tasks.filter(t => t.status === TaskStatus.IN_PROGRESS)).toHaveLength(1);
      expect(tasks.filter(t => t.status === TaskStatus.COMPLETED)).toHaveLength(3);
    });
    
    test('should create dependent task fixtures', () => {
      const tasks = createDependentTaskFixtures();
      
      expect(tasks).toHaveLength(4);
      
      // Task 1 has no dependencies
      expect(tasks[0].dependencies).toHaveLength(0);
      
      // Task 2 depends on Task 1
      expect(tasks[1].dependencies).toHaveLength(1);
      expect(tasks[1].dependencies[0].taskId).toBe('task-1');
      
      // Task 3 depends on Task 2
      expect(tasks[2].dependencies).toHaveLength(1);
      expect(tasks[2].dependencies[0].taskId).toBe('task-2');
      
      // Task 4 depends on Task 1 and Task 2
      expect(tasks[3].dependencies).toHaveLength(2);
      expect(tasks[3].dependencies[0].taskId).toBe('task-1');
      expect(tasks[3].dependencies[1].taskId).toBe('task-2');
    });
  });
  
  // Test the assertion functions
  describe('taskAssertions', () => {
    test('should validate task structure', () => {
      const validTask = createTaskFixture();
      expect(() => assertValidTaskStructure(validTask)).not.toThrow();
      
      // Missing required field
      const invalidTask1 = { ...validTask };
      delete invalidTask1.name;
      expect(() => assertValidTaskStructure(invalidTask1)).toThrow('missing required field');
      
      // Invalid status
      const invalidTask2 = { ...validTask, status: 'INVALID_STATUS' };
      expect(() => assertValidTaskStructure(invalidTask2)).toThrow('status is invalid');
      
      // Invalid dependency
      const invalidTask3 = { ...validTask, dependencies: [{ wrongProperty: 'value' }] };
      expect(() => assertValidTaskStructure(invalidTask3)).toThrow('dependency is invalid');
      
      // Invalid related file
      const invalidTask4 = { ...validTask, relatedFiles: [{ wrongProperty: 'value' }] };
      expect(() => assertValidTaskStructure(invalidTask4)).toThrow('related file is invalid');
    });
    
    test('should validate task timestamps', () => {
      const validTask = createTaskFixture();
      expect(() => assertValidTaskTimestamps(validTask)).not.toThrow();
      
      // Invalid createdAt
      const invalidTask1 = { ...validTask, createdAt: 'not-a-date' };
      expect(() => assertValidTaskTimestamps(invalidTask1)).toThrow('createdAt is not a Date');
      
      // Invalid updatedAt
      const invalidTask2 = { ...validTask, updatedAt: 'not-a-date' };
      expect(() => assertValidTaskTimestamps(invalidTask2)).toThrow('updatedAt is not a Date');
      
      // Completed task without completedAt
      const invalidTask3 = { ...validTask, status: TaskStatus.COMPLETED, completedAt: undefined };
      expect(() => assertValidTaskTimestamps(invalidTask3)).toThrow('should have a completedAt Date');
    });
    
    test('should validate task dependencies', () => {
      // Create task with dependencies
      const task = createTaskFixture({
        dependencies: [
          { taskId: 'dep-1' },
          { taskId: 'dep-2' }
        ]
      });
      
      // Valid dependencies check
      expect(() => assertTaskDependencies(task, ['dep-1', 'dep-2'])).not.toThrow();
      
      // Missing dependency
      expect(() => assertTaskDependencies(task, ['dep-1', 'dep-2', 'dep-3'])).toThrow('Expected 3 dependencies');
      
      // Wrong dependency ID
      expect(() => assertTaskDependencies(task, ['dep-1', 'wrong-id'])).toThrow('Expected dependency ID "wrong-id" not found');
      
      // Task without dependencies array
      const invalidTask = { ...task };
      delete invalidTask.dependencies;
      expect(() => assertTaskDependencies(invalidTask, [])).toThrow('dependencies is not an array');
    });
  });
  
  // Test the exec mock
  describe('execMock', () => {
    test('should mock exec with configured responses', async () => {
      const execMock = createExecMock({
        responses: {
          'ls': 'file1.txt\nfile2.txt',
          'grep': 'line1\nline2',
          'custom': (cmd) => `Command executed: ${cmd}`
        }
      });
      
      // Test matching commands
      await expect(execMock('ls -la')).resolves.toEqual({
        stdout: 'file1.txt\nfile2.txt',
        stderr: ''
      });
      
      await expect(execMock('grep pattern file.txt')).resolves.toEqual({
        stdout: 'line1\nline2',
        stderr: ''
      });
      
      await expect(execMock('custom command')).resolves.toEqual({
        stdout: 'Command executed: custom command',
        stderr: ''
      });
      
      // Test non-matching command
      await expect(execMock('unknown command')).resolves.toEqual({
        stdout: '',
        stderr: ''
      });
      
      // Test error mode
      const errorExecMock = createExecMock({ shouldThrow: true });
      await expect(errorExecMock('any command')).rejects.toThrow('Command failed');
    });
  });
  
  // Test the delay function
  describe('delay', () => {
    test('should delay execution', async () => {
      jest.useFakeTimers();
      
      const promise = delay(1000);
      
      // Fast-forward time
      jest.advanceTimersByTime(1000);
      
      await expect(promise).resolves.toBeUndefined();
      
      jest.useRealTimers();
    });
  });
}); 