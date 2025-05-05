import { jest } from '@jest/globals';
import { Task } from '../../types';

describe('Conversation Functionality', () => {
  let mockTask;
  let mockConversations;

  beforeEach(() => {
    mockConversations = [
      {
        role: 'user',
        content: 'Test message 1',
        timestamp: new Date('2025-05-05T17:16:06.000Z').toISOString()
      },
      {
        role: 'assistant',
        content: 'Test response 1',
        timestamp: new Date('2025-05-05T17:16:07.000Z').toISOString()
      }
    ];

    mockTask = {
      id: 'test-task-id',
      name: 'Test Task',
      description: 'Test Description',
      status: 'pending',
      conversations: mockConversations,
      createdAt: new Date('2025-05-05T17:16:06.000Z')
    };
  });

  describe('compareConversations', () => {
    test('should return true for identical conversations', () => {
      const result = compareConversations(mockConversations, [...mockConversations]);
      expect(result).toBe(true);
    });

    test('should return false for different conversation content', () => {
      const modifiedConversations = [...mockConversations];
      modifiedConversations[0].content = 'Modified message';
      const result = compareConversations(mockConversations, modifiedConversations);
      expect(result).toBe(false);
    });

    test('should return false for different conversation length', () => {
      const modifiedConversations = mockConversations.slice(0, 1);
      const result = compareConversations(mockConversations, modifiedConversations);
      expect(result).toBe(false);
    });

    test('should handle null or undefined conversations', () => {
      expect(compareConversations(null, [])).toBe(true);
      expect(compareConversations(undefined, [])).toBe(true);
      expect(compareConversations([], null)).toBe(true);
      expect(compareConversations([], undefined)).toBe(true);
    });
  });

  describe('updateTaskConversations', () => {
    let mockDom;
    
    beforeEach(() => {
      mockDom = document.createElement('div');
      mockDom.id = 'detail-conversations';
      document.body.appendChild(mockDom);
      
      // Mock global variables
      global.selectedTaskId = mockTask.id;
      global.isDetailedMode = true;
      global.tasks = [mockTask];
    });

    afterEach(() => {
      document.body.removeChild(mockDom);
      global.selectedTaskId = null;
      global.isDetailedMode = false;
      global.tasks = [];
    });

    test('should update task conversations and UI when task is selected and in detailed mode', () => {
      const newConversations = [
        ...mockConversations,
        {
          role: 'user',
          content: 'New message',
          timestamp: new Date('2025-05-05T17:16:08.000Z').toISOString()
        }
      ];

      updateTaskConversations(mockTask.id, newConversations);

      // Check if task was updated
      const updatedTask = tasks.find(t => t.id === mockTask.id);
      expect(updatedTask.conversations).toEqual(newConversations);

      // Check if UI was updated
      const conversationItems = mockDom.querySelectorAll('.conversation-item');
      expect(conversationItems.length).toBe(3);
      expect(conversationItems[2].querySelector('.conversation-content').textContent).toBe('New message');
    });

    test('should not update UI when task is not selected', () => {
      global.selectedTaskId = 'different-task-id';
      const newConversations = [...mockConversations];

      updateTaskConversations(mockTask.id, newConversations);

      // Check if task was updated but UI wasn't
      const updatedTask = tasks.find(t => t.id === mockTask.id);
      expect(updatedTask.conversations).toEqual(newConversations);
      expect(mockDom.innerHTML).toBe('');
    });

    test('should not update UI when not in detailed mode', () => {
      global.isDetailedMode = false;
      const newConversations = [...mockConversations];

      updateTaskConversations(mockTask.id, newConversations);

      // Check if task was updated but UI wasn't
      const updatedTask = tasks.find(t => t.id === mockTask.id);
      expect(updatedTask.conversations).toEqual(newConversations);
      expect(mockDom.innerHTML).toBe('');
    });
  });
}); 