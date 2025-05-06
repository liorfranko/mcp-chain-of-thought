// Test script for project rules update task implementation
import { splitTasks } from './dist/tools/taskTools.js';
import { getAllTasks } from './dist/models/taskModel.js';

// Test clearAllTasks mode
async function testClearAllTasks() {
  console.log('Testing clearAllTasks mode...');
  
  const testTasks = [
    {
      name: 'Task 1 for testing',
      description: 'Task 1 description',
      implementationGuide: 'Task 1 guide'
    },
    {
      name: 'Task 2 for testing',
      description: 'Task 2 description',
      implementationGuide: 'Task 2 guide'
    }
  ];

  try {
    await splitTasks({
      updateMode: 'clearAllTasks',
      tasks: testTasks
    });
    console.log('Tasks created successfully');
    
    // Verify the tasks were created and include the project rules update task
    const allTasks = await getAllTasks();
    console.log(`Total tasks: ${allTasks.length}`);
    
    // The last task should be the project rules update task
    const lastTask = allTasks[allTasks.length - 1];
    console.log('Last task name:', lastTask.name);
    console.log('Last task dependencies:', JSON.stringify(lastTask.dependencies));
    
    // Verify the dependencies are correct
    if (lastTask.name === 'Update Project Rules Based on Completed Items') {
      console.log('✅ Project rules update task was added correctly');
      
      // Check if it depends on all other tasks
      const dependenciesCorrect = lastTask.dependencies.length === testTasks.length;
      if (dependenciesCorrect) {
        console.log('✅ Dependencies are correct');
      } else {
        console.log('❌ Dependencies are incorrect');
      }
    } else {
      console.log('❌ Project rules update task was not added');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Test append mode
async function testAppendMode() {
  console.log('\nTesting append mode...');
  
  const testTasks = [
    {
      name: 'Task 3 for testing',
      description: 'Task 3 description',
      implementationGuide: 'Task 3 guide'
    }
  ];

  try {
    await splitTasks({
      updateMode: 'append',
      tasks: testTasks
    });
    console.log('Tasks appended successfully');
    
    // Verify the tasks were created and include the project rules update task
    const allTasks = await getAllTasks();
    console.log(`Total tasks: ${allTasks.length}`);
    
    // Find the task with the name 'Task 3 for testing'
    const task3 = allTasks.find(task => task.name === 'Task 3 for testing');
    if (task3) {
      console.log('✅ Task 3 was added correctly');
    } else {
      console.log('❌ Task 3 was not added');
    }
    
    // Find the project rules update task that depends on Task 3
    const projectRulesTasks = allTasks.filter(task => 
      task.name === 'Update Project Rules Based on Completed Items' && 
      task.dependencies.some(dep => allTasks.find(t => t.id === dep.taskId)?.name === 'Task 3 for testing')
    );
    
    if (projectRulesTasks.length > 0) {
      console.log('✅ Project rules update task was added with correct dependency on Task 3');
    } else {
      console.log('❌ Project rules update task was not added correctly');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Test selective mode
async function testSelectiveMode() {
  console.log('\nTesting selective mode...');
  
  const testTasks = [
    {
      name: 'Task 1 for testing',  // This name already exists, so it will be updated
      description: 'Updated Task 1 description',
      implementationGuide: 'Updated Task 1 guide'
    }
  ];

  try {
    await splitTasks({
      updateMode: 'selective',
      tasks: testTasks
    });
    console.log('Tasks selectively updated successfully');
    
    // Verify the tasks were updated and include the project rules update task
    const allTasks = await getAllTasks();
    console.log(`Total tasks: ${allTasks.length}`);
    
    // Find the task with the name 'Task 1 for testing'
    const task1 = allTasks.find(task => task.name === 'Task 1 for testing');
    if (task1 && task1.description === 'Updated Task 1 description') {
      console.log('✅ Task 1 was updated correctly');
    } else {
      console.log('❌ Task 1 was not updated correctly');
    }
    
    // Find the project rules update task that depends on Task 1
    const projectRulesTasks = allTasks.filter(task => 
      task.name === 'Update Project Rules Based on Completed Items' && 
      task.dependencies.some(dep => allTasks.find(t => t.id === dep.taskId)?.name === 'Task 1 for testing')
    );
    
    if (projectRulesTasks.length > 0) {
      console.log('✅ Project rules update task was added with correct dependency on Task 1');
    } else {
      console.log('❌ Project rules update task was not added correctly');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Test overwrite mode
async function testOverwriteMode() {
  console.log('\nTesting overwrite mode...');
  
  const testTasks = [
    {
      name: 'Task 4 for testing',
      description: 'Task 4 description',
      implementationGuide: 'Task 4 guide'
    },
    {
      name: 'Task 5 for testing',
      description: 'Task 5 description',
      implementationGuide: 'Task 5 guide'
    }
  ];

  try {
    await splitTasks({
      updateMode: 'overwrite',
      tasks: testTasks
    });
    console.log('Tasks overwritten successfully');
    
    // Verify the tasks were created and include the project rules update task
    const allTasks = await getAllTasks();
    console.log(`Total tasks: ${allTasks.length}`);
    
    // Find the task with the name 'Task 4 for testing'
    const task4 = allTasks.find(task => task.name === 'Task 4 for testing');
    if (task4) {
      console.log('✅ Task 4 was added correctly');
    } else {
      console.log('❌ Task 4 was not added');
    }
    
    // Find the task with the name 'Task 5 for testing'
    const task5 = allTasks.find(task => task.name === 'Task 5 for testing');
    if (task5) {
      console.log('✅ Task 5 was added correctly');
    } else {
      console.log('❌ Task 5 was not added');
    }
    
    // Find the project rules update task that depends on Task 4 and Task 5
    const projectRulesTasks = allTasks.filter(task => 
      task.name === 'Update Project Rules Based on Completed Items' && 
      task.dependencies.some(dep => allTasks.find(t => t.id === dep.taskId)?.name === 'Task 4 for testing') &&
      task.dependencies.some(dep => allTasks.find(t => t.id === dep.taskId)?.name === 'Task 5 for testing')
    );
    
    if (projectRulesTasks.length > 0) {
      console.log('✅ Project rules update task was added with correct dependencies on Task 4 and Task 5');
    } else {
      console.log('❌ Project rules update task was not added correctly');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the tests
async function runTests() {
  await testClearAllTasks();
  await testAppendMode();
  await testSelectiveMode();
  await testOverwriteMode();
  console.log('\nAll tests completed');
}

runTests(); 