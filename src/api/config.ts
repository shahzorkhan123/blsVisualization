const API_BASE_URL = import.meta.env.DEV ? '' : '/blsVisualization';

export const API_ENDPOINTS = {
  OCCUPATIONS: `${API_BASE_URL}/api/occupations`,
  TASKDATA: `${API_BASE_URL}/api/task-data`,
  TASKBUCKET: `${API_BASE_URL}/api/task-bucket`,
  // Add other endpoints here
};