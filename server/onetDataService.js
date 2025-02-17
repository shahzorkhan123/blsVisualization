import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let taskRatings = [];
let taskCategories = [];
let occupations = [];
let occupationTasks = [];
let taskDescriptions = {}
let taskDWA = [];
let dwaDescriptions = [];



export async function loadOnetData() {
  try {
    const taskRatingsData = await fs.readFile(path.join(__dirname, 'assets', 'db_29_1_text', 'Task Ratings.txt'), 'utf8');
    taskRatings = parseTaskRatings(taskRatingsData);
    console.log('Task Ratings Loaded:', taskRatings.length);

    const taskCategoriesData = await fs.readFile(path.join(__dirname, 'assets', 'db_29_1_text', 'Tasks to DWAs.txt'), 'utf8');
    taskCategories = parseTaskCategories(taskCategoriesData);
    console.log('taskCategories Loaded:', taskCategories.length);
    
    occupations = []
    const occupationsData = await fs.readFile(path.join(__dirname, 'assets', 'db_29_1_text', 'Occupation data.txt'), 'utf8');
    occupations = parseOccupations(occupationsData);
    console.log('Occupations Loaded:', occupations.length);

    // Load task descriptions
    const taskDescriptionsData = await fs.readFile(path.join(__dirname, 'assets', 'db_29_1_text', 'Task Statements.txt'), 'utf8');
    taskDescriptions = parseTaskDescriptions(taskDescriptionsData);
    console.log('Task Descriptions Loaded:', Object.keys(taskDescriptions).length);


 // ...

 occupationTasks = taskRatings.filter(rating => rating.scaleId === 'IM').
   map(rating => { // Only include occupations with importance ratings
     return { socCode: rating.socCode, taskId: rating.taskId, description: taskDescriptions[`${rating.socCode}_${rating.taskId}`], dataValue: rating.dataValue 
    }
 });

 console.log('occupationTasks Loaded:', occupationTasks.length);
    // // Load task DWA
    // const taskDWAData = await fs.readFile(path.join(__dirname, 'assets', 'db_29_1_text', 'Task DWA.txt'), 'utf8');
    // taskDWA = parseTaskDWA(taskDWAData);
    // console.log('Task DWA Loaded:', taskDWA.length);

    // // Load DWA descriptions
    // const dwaDescriptionsData = await fs.readFile(path.join(__dirname, 'assets', 'db_29_1_text', 'DWA Descriptions.txt'), 'utf8');
    // dwaDescriptions = parseDWA(dwaDescriptionsData);
    // console.log('DWA Descriptions Loaded:', dwaDescriptions.length);

    console.log('ONET data loaded successfully');
  } catch (error) {
    console.error('Error loading ONET data:', error);
    throw error;
  }
}

function parseTaskRatings(data) {
  // Assuming the data is in CSV format, split by lines
  const lines = data.split('\n').slice(1); // Skip header row
  return lines.map(line => {
    const [socCode, taskId, scaleId, category, dataValue, n, standardError, lowerCI, upperCI, , , date, domainSource] = line.split('\t'); // Assuming tab-separated values
    return {
      socCode,
      taskId,
      scaleId,
      category,
      dataValue: parseFloat(dataValue),
      n: parseInt(n),
      standardError: parseFloat(standardError),
      lowerCI: parseFloat(lowerCI),
      upperCI: parseFloat(upperCI),
      date,
      domainSource
    };
  });
}



function parseOccupations(data) {
    // Assuming the data is in CSV format, split by lines
  const lines = data.split('\n').slice(1); // Skip header row
    return lines.map(line => {
      const [socCode, title, description] = line.split('\t'); // Assuming tab-separated values
      return { socCode, title, description };
    });
  }

  
// Add these functions in a new file called dataParsers.js
export function parseTaskDescriptions(data) {
  // Assuming the data is in CSV format, split by lines
  const lines = data.split('\n').slice(1); // Skip header row
  const descriptions = {};

  //console.log(lines.slice(0, 1));

  //console.log(lines.length);

  lines.forEach(line => {
    const [socCode, taskId, description, , , , ] = line.split('\t'); // Assuming tab-separated values and skipping unnecessary columns
    descriptions[`${socCode}_${taskId}`] = description; // Trim leading/trailing whitespace
  });

  //console.log('Task Descriptions parsed:', Object.keys(descriptions).length);

  return descriptions;
}




export function parseTaskDWA(data) {
  // Assuming the data is in CSV format, split by lines
  const lines = data.split('\n').slice(1); // Skip header row
  return lines.map(line => {
    const [taskId, dwaId] = line.split('\t'); // Assuming tab-separated values
    return { taskId, dwaId };
  });
}

export function parseDWA(data) {
  // Assuming the data is in CSV format, split by lines
  const lines = data.split('\n').slice(1); // Skip header row
  return lines.map(line => {
    const [dwaId, description] = line.split('\t'); // Assuming tab-separated values
    return { dwaId, description };
  });
}

export function getAvailableOccupations() {
  return Array.from(occupations).map(occupation => {
    return { code: occupation.socCode, title: occupation.title}
  }).sort(occupation => occupation.title);
}

function parseTaskCategories(data) {
  // Assuming the data is in CSV format, split by lines
  const lines = data.split('\n');
  return lines.map(line => {
    const [taskId, categoryId] = line.split('\t'); // Assuming tab-separated values
    return { taskId, categoryId };
  });
}

export function getTaskDataForOccupation(occupation) {
  // find socCode for occupation
  const socCode = occupations.find(o => o.title === occupation).socCode;
  // Filter task ratings for the given occupation
  const tasksForOccupation = occupationTasks.filter(rating => rating.socCode === socCode);
  // Map task IDs to categories
  // const taskData = tasksForOccupation.map(task => {
  //   const categories = taskCategories
  //     .filter(category => category.taskId === task.id)
  //     .map(category => category.categoryId);
  //   return { ...task, categories };
  // });
  const taskData = tasksForOccupation.map(task => {
    return { name: task.description, value: task.dataValue };
  });
  return taskData;
}


export default {
  loadOnetData,
  getAvailableOccupations,
  getTaskDataForOccupation
};
