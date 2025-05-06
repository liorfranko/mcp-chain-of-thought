// Script to list all tasks with their details
import { getAllTasks } from './dist/models/taskModel.js';

async function listAllTasks() {
  try {
    const tasks = await getAllTasks();
    
    tasks.forEach((task) => {
      console.log('------------------------------');
      console.log('ID:', task.id);
      console.log('Name:', task.name);
      console.log('Description:', task.description ? (task.description.substring(0, 50) + '...') : 'No description');
      console.log('Status:', task.status);
      console.log('Dependencies:', JSON.stringify(task.dependencies));
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

listAllTasks(); 