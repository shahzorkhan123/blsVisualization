import { TaskBucket } from '../types';

// Interface for Task Ratings data structure
interface TaskRating {
  onetsocCode: string;
  title: string;
  taskId: string;
  task: string;
  scaleId: string;
  dataValue: number;
  category: string;
}

// Interface for Task Categories data structure
interface TaskCategory {
  onetsocCode: string;
  taskId: string;
  dwaCategoryId: string;
  dwaTitle: string;
}

let taskRatings: TaskRating[] = [];
let taskCategories: TaskCategory[] = [];

export async function loadOnetData() {
  try {
    // Load Task Ratings
    const taskRatingsResponse = await fetch('/assets/db_29_1_text/Task Ratings.txt');
    const taskRatingsText = await taskRatingsResponse.text();
    taskRatings = parseTaskRatings(taskRatingsText);
    console.log('taskRatings :', taskRatings);
    console.log('taskRatings count:', taskRatings.length);

    // Load Task Categories (DWA)
    const taskCategoriesResponse = await fetch('/assets/db_29_1_text/Tasks to DWAs.txt');
    const taskCategoriesText = await taskCategoriesResponse.text();
    taskCategories = parseTaskCategories(taskCategoriesText);
    console.log('taskCategories :', taskCategories);
    console.log('taskCategories count:', taskCategories.length);

    console.log('ONET data loaded successfully');
  } catch (error) {
    console.error('Error loading ONET data:', error);
    throw error;
  }
}

function parseTaskRatings(data: string): TaskRating[] {
  const lines = data.split('\n').slice(1); // Skip header row
  return lines
    .filter(line => line.trim())
    .map(line => {
      const [onetsocCode, title, taskId, task, scaleId, dataValue, category] = line.split('\t');
      return {
        onetsocCode,
        title,
        taskId,
        task,
        scaleId,
        dataValue: parseFloat(dataValue),
        category
      };
    });
}

function parseTaskCategories(data: string): TaskCategory[] {
  const lines = data.split('\n').slice(1); // Skip header row
  return lines
    .filter(line => line.trim())
    .map(line => {
      const [onetsocCode, , taskId, , dwaCategoryId, dwaTitle] = line.split('\t');
      return {
        onetsocCode,
        taskId,
        dwaCategoryId,
        dwaTitle
      };
    });
}

export function getAvailableOccupations() {
  const occupations = new Set<string>();
  taskRatings.forEach(rating => {
    if (rating.scaleId === 'IM') { // Only include occupations with importance ratings
      occupations.add(rating.title);
    }
  });
  return Array.from(occupations).sort();
}

export function getTaskDataForOccupation(occupationTitle: string): TaskBucket[] {
  // Get all tasks for this occupation with importance ratings
  const occupationTasks = taskRatings.filter(
    rating => rating.title === occupationTitle && rating.scaleId === 'IM'
  );

  // Group tasks by DWA category
  const tasksByCategory = new Map<string, { category: string; tasks: { name: string; value: number }[] }>();

  occupationTasks.forEach(task => {
    // Find the DWA category for this task
    const taskCategory = taskCategories.find(tc => tc.taskId === task.taskId && tc.onetsocCode === task.onetsocCode);
    
    if (taskCategory) {
      const categoryId = taskCategory.dwaCategoryId.split('.')[1]; // Get main category (e.g., 'A' from '4.A.1.b.1')
      const categoryKey = `Category ${categoryId}`;
      
      if (!tasksByCategory.has(categoryKey)) {
        tasksByCategory.set(categoryKey, {
          category: categoryKey,
          tasks: []
        });
      }

      const category = tasksByCategory.get(categoryKey)!;
      category.tasks.push({
        name: task.task,
        value: task.dataValue
      });
    }
  });

  return Array.from(tasksByCategory.values());
}