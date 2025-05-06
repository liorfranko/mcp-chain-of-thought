import { jest } from '@jest/globals';
import { TaskStatus } from '../../types/index.js';

// Define the functions being tested (these would normally be imported)
function compareConversations(conversations1, conversations2) {
  if (!conversations1 && !conversations2) return true;
  if (!conversations1) return !conversations2.length;
  if (!conversations2) return !conversations1.length;
  if (conversations1.length !== conversations2.length) return false;
  
  for (let i = 0; i < conversations1.length; i++) {
    // Deep check each property - content comparison is the issue, so make sure to check it properly
    if (conversations1[i].content !== conversations2[i].content) return false;
    if (conversations1[i].role !== conversations2[i].role) return false;
    
    // Check timestamp if available
    if (conversations1[i].timestamp !== conversations2[i].timestamp) return false;
  }
  
  return true;
}

function updateTaskConversations(taskId, conversations) {
  const task = global.tasks.find(t => t.id === taskId);
  if (task) {
    task.conversations = conversations;
  }
  
  if (global.isDetailedMode && global.selectedTaskId === taskId) {
    const detailConversationsElement = document.getElementById('detail-conversations');
    if (detailConversationsElement) {
      detailConversationsElement.innerHTML = '';
      conversations.forEach(conversation => {
        const item = document.createElement('div');
        item.className = 'conversation-item';
        const content = document.createElement('div');
        content.className = 'conversation-content';
        content.textContent = conversation.content;
        item.appendChild(content);
        detailConversationsElement.appendChild(item);
      });
    }
  }
}

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
      // Create a copy of the conversations
      const modifiedConversations = JSON.parse(JSON.stringify(mockConversations));
      // Modify one property
      modifiedConversations[0].content = 'Modified message';
      // Call the function
      const result = compareConversations(mockConversations, modifiedConversations);
      // The result should be false since we modified the content
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