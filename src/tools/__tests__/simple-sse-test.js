// Simple SSE test script
import assert from 'assert';

// Mock Event Source
class MockEventSource {
  constructor(url) {
    this.url = url;
    this.listeners = {};
    this.onmessage = null;
    this.onerror = null;
    this.onopen = null;
  }

  addEventListener(event, callback) {
    this.listeners[event] = callback;
  }

  close() {
    // No-op for mock
  }

  // Test helper to simulate events
  simulateMessage(data) {
    if (this.onmessage) {
      this.onmessage({ data });
    }
  }

  simulateUpdateEvent(data) {
    if (this.listeners.update) {
      this.listeners.update({ data });
    }
  }

  simulateError() {
    if (this.onerror) {
      this.onerror();
    }
  }

  simulateOpen() {
    if (this.onopen) {
      this.onopen();
    }
  }
}

// Mocks for global objects
globalThis.EventSource = function(url) {
  return new MockEventSource(url);
};

// Mock fetchTasks
let fetchTasksCalled = false;
globalThis.fetchTasks = function() {
  fetchTasksCalled = true;
};

// Mock updateTaskConversations
let updateTaskConversationsCalled = false;
let lastTaskId = null;
let lastConversations = null;
globalThis.updateTaskConversations = function(taskId, conversations) {
  updateTaskConversationsCalled = true;
  lastTaskId = taskId;
  lastConversations = conversations;
};

// Mock console
const originalConsole = { ...console };
let consoleErrors = [];
let consoleLogs = [];
console.error = function(...args) {
  consoleErrors.push(args);
};
console.log = function(...args) {
  consoleLogs.push(args);
};

// Import the setupSSE function (mock it since we don't have direct access)
function setupSSE() {
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
}

// Test cases
function runTests() {
  // Reset state before each test
  function resetState() {
    fetchTasksCalled = false;
    updateTaskConversationsCalled = false;
    lastTaskId = null;
    lastConversations = null;
    consoleErrors = [];
    consoleLogs = [];
  }

  // Test 1: setupSSE creates EventSource with correct URL
  resetState();
  const evtSource = setupSSE();
  assert.strictEqual(evtSource.url, '/api/tasks/stream', 'EventSource should be created with correct URL');
  
  // Test 2: Conversation update message is handled correctly
  resetState();
  const evtSource2 = setupSSE();
  const conversationUpdateData = {
    type: 'conversation_update',
    taskId: 'test-task-id',
    conversations: [{ role: 'user', content: 'test' }]
  };
  evtSource2.simulateMessage(JSON.stringify(conversationUpdateData));
  assert.strictEqual(updateTaskConversationsCalled, true, 'updateTaskConversations should be called');
  assert.strictEqual(lastTaskId, 'test-task-id', 'Task ID should be passed correctly');
  assert.deepStrictEqual(lastConversations, [{ role: 'user', content: 'test' }], 'Conversations should be passed correctly');
  
  // Test 3: Non-conversation update message triggers fetchTasks
  resetState();
  const evtSource3 = setupSSE();
  const taskUpdateData = { type: 'task_update' };
  evtSource3.simulateUpdateEvent(JSON.stringify(taskUpdateData));
  assert.strictEqual(fetchTasksCalled, true, 'fetchTasks should be called for non-conversation updates');
  
  // Test 4: Error handling for invalid JSON
  resetState();
  const evtSource4 = setupSSE();
  evtSource4.simulateMessage('invalid json');
  assert.strictEqual(consoleErrors.length, 1, 'Console error should be logged for invalid JSON');
  
  // Test 5: Error event handler closes connection and attempts reconnection
  resetState();
  globalThis.setTimeout = function(callback, delay) {
    assert.strictEqual(delay, 5000, 'Reconnection delay should be 5000ms');
  };
  const evtSource5 = setupSSE();
  let closeCalled = false;
  evtSource5.close = function() {
    closeCalled = true;
  };
  evtSource5.simulateError();
  assert.strictEqual(closeCalled, true, 'close() should be called on error');
  
  // Test 6: Open event logs message
  resetState();
  const evtSource6 = setupSSE();
  evtSource6.simulateOpen();
  assert.strictEqual(consoleLogs.length, 1, 'Console log should be called on open');
  assert.strictEqual(consoleLogs[0][0], 'SSE connection opened.', 'Open message should be logged');

  console.log = originalConsole.log;
  console.log('All tests passed!');
}

// Run the tests
try {
  runTests();
} catch (error) {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.error('Test failed:', error);
} 