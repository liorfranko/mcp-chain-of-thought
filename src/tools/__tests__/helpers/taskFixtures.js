import { TaskStatus } from '../../../types/index.js';

/**
 * Creates a task fixture with default values that can be overridden
 * 
 * @param {Object} overrides Properties to override in the default task
 * @returns {Object} Task fixture
 */
export function createTaskFixture(overrides = {}) {
  const defaultTask = {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Test Task',
    description: 'Task description for testing',
    status: TaskStatus.PENDING,
    dependencies: [],
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    relatedFiles: []
  };
  
  return { ...defaultTask, ...overrides };
}

/**
 * Creates a collection of task fixtures with different statuses
 * 
 * @param {Object} options Options for task creation
 * @param {number} options.pendingCount Number of pending tasks to create
 * @param {number} options.inProgressCount Number of in-progress tasks to create 
 * @param {number} options.completedCount Number of completed tasks to create
 * @param {Object} options.overrides Custom overrides to apply to all tasks
 * @returns {Object[]} Array of task fixtures
 */
export function createTaskFixtures({
  pendingCount = 1,
  inProgressCount = 1,
  completedCount = 1,
  overrides = {}
} = {}) {
  const tasks = [];
  
  // Create pending tasks
  for (let i = 0; i < pendingCount; i++) {
    tasks.push(createTaskFixture({
      id: `pending-${i}-${Date.now()}`,
      name: `Pending Task ${i}`,
      status: TaskStatus.PENDING,
      ...overrides
    }));
  }
  
  // Create in-progress tasks
  for (let i = 0; i < inProgressCount; i++) {
    tasks.push(createTaskFixture({
      id: `in-progress-${i}-${Date.now()}`,
      name: `In Progress Task ${i}`,
      status: TaskStatus.IN_PROGRESS,
      ...overrides
    }));
  }
  
  // Create completed tasks
  for (let i = 0; i < completedCount; i++) {
    tasks.push(createTaskFixture({
      id: `completed-${i}-${Date.now()}`,
      name: `Completed Task ${i}`,
      status: TaskStatus.COMPLETED,
      completedAt: new Date('2023-01-02T00:00:00.000Z'),
      ...overrides
    }));
  }
  
  return tasks;
}

/**
 * Creates a collection of related tasks with dependencies between them
 * 
 * @returns {Object[]} Array of interrelated task fixtures
 */
export function createDependentTaskFixtures() {
  const task1 = createTaskFixture({
    id: 'task-1',
    name: 'Task 1 (Root)',
    dependencies: []
  });
  
  const task2 = createTaskFixture({
    id: 'task-2',
    name: 'Task 2 (Depends on Task 1)',
    dependencies: [{ taskId: 'task-1' }]
  });
  
  const task3 = createTaskFixture({
    id: 'task-3', 
    name: 'Task 3 (Depends on Task 2)',
    dependencies: [{ taskId: 'task-2' }]
  });
  
  const task4 = createTaskFixture({
    id: 'task-4',
    name: 'Task 4 (Depends on Task 1 and Task 2)',
    dependencies: [
      { taskId: 'task-1' },
      { taskId: 'task-2' }
    ]
  });
  
  return [task1, task2, task3, task4];
} 