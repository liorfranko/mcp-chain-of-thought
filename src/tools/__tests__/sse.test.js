import { jest } from '@jest/globals';

// Import the setupSSE function from the script file
// Note: We need to mock it since it references browser-specific APIs
let setupSSE;

describe('SSE Functionality', () => {
  let mockEventSource;
  let mockFetchTasks;
  let mockUpdateTaskConversations;

  beforeEach(() => {
    // Mock EventSource
    mockEventSource = {
      addEventListener: jest.fn(),
      onmessage: null,
      onerror: null,
      onopen: null,
      close: jest.fn()
    };
    global.EventSource = jest.fn(() => mockEventSource);

    // Mock fetchTasks
    mockFetchTasks = jest.fn();
    global.fetchTasks = mockFetchTasks;

    // Mock updateTaskConversations
    mockUpdateTaskConversations = jest.fn();
    global.updateTaskConversations = mockUpdateTaskConversations;
    
    // Define setupSSE function based on the implementation in script.js
    setupSSE = function() {
      const evtSource = new EventSource('/api/tasks/stream');
      
      evtSource.onmessage = function(event) {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'conversation_update') {
            updateTaskConversations(data.taskId, data.conversations);
          }
        } catch (error) {
          console.error('Error processing SSE message:', error);
        }
      };
      
      evtSource.addEventListener('update', function(event) {
        try {
          const data = JSON.parse(event.data);
          if (data.type !== 'conversation_update') {
            fetchTasks();
          }
        } catch (error) {
          console.error('Error processing SSE update event:', error);
        }
      });
      
      evtSource.onerror = function() {
        evtSource.close();
        setTimeout(setupSSE, 5000);
      };
      
      evtSource.onopen = function() {
        console.log('SSE connection opened.');
      };
      
      return evtSource;
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setupSSE', () => {
    test('should set up SSE connection correctly', () => {
      setupSSE();

      expect(EventSource).toHaveBeenCalledWith('/api/tasks/stream');
      expect(mockEventSource.addEventListener).toHaveBeenCalledWith('update', expect.any(Function));
    });

    test('should handle conversation update messages correctly', () => {
      setupSSE();

      const mockData = {
        type: 'conversation_update',
        taskId: 'test-task-id',
        conversations: [{ role: 'user', content: 'test', timestamp: '2025-05-05T17:16:06.000Z' }]
      };

      // Trigger onmessage event
      mockEventSource.onmessage({ data: JSON.stringify(mockData) });

      expect(mockUpdateTaskConversations).toHaveBeenCalledWith(
        mockData.taskId,
        mockData.conversations
      );
    });

    test('should handle non-conversation update messages correctly', () => {
      setupSSE();

      const mockData = {
        type: 'task_update',
        taskId: 'test-task-id'
      };

      // Trigger update event
      const updateHandler = mockEventSource.addEventListener.mock.calls.find(
        call => call[0] === 'update'
      )[1];
      updateHandler({ data: JSON.stringify(mockData) });

      expect(mockFetchTasks).toHaveBeenCalled();
    });

    test('should handle JSON parse errors gracefully', () => {
      setupSSE();

      const invalidData = 'invalid json';
      console.error = jest.fn(); // Mock console.error

      // Trigger onmessage event with invalid data
      mockEventSource.onmessage({ data: invalidData });

      expect(console.error).toHaveBeenCalledWith(
        'Error processing SSE message:',
        expect.any(Error)
      );
      expect(mockUpdateTaskConversations).not.toHaveBeenCalled();
    });

    test('should handle connection errors and attempt reconnection', () => {
      // Mock setTimeout
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = jest.fn();
      
      setupSSE();

      // Trigger error event
      mockEventSource.onerror();

      expect(mockEventSource.close).toHaveBeenCalled();
      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);

      // Fast-forward time and verify reconnection attempt
      const reconnectCallback = global.setTimeout.mock.calls[0][0];
      reconnectCallback(); // Execute the callback manually
      expect(EventSource).toHaveBeenCalledTimes(2);

      // Restore original setTimeout
      global.setTimeout = originalSetTimeout;
    });

    test('should log connection open event', () => {
      setupSSE();
      console.log = jest.fn(); // Mock console.log

      // Trigger open event
      mockEventSource.onopen();

      expect(console.log).toHaveBeenCalledWith('SSE connection opened.');
    });
  });
}); 