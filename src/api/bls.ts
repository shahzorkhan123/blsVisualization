import axios from 'axios';
import { BLSYear, BLSOccupation, TaskBucket, TaskData } from '../types';

export async function fetchAvailableYears(): Promise<BLSYear[]> {
  // For now, we'll just return the current year since we're using ONET 29.1 data
  return [
    { year: 2024, label: '2024 (ONET 29.1)' }
  ];
}

export async function fetchOccupations(): Promise<BLSOccupation[]> {
  const response = await axios.get<BLSOccupation[]>('/api/occupations');
  return response.data;
}

export async function fetchTaskData(year: number, occupation: string): Promise<TaskData[]> {
  const response = await axios.get<TaskData[]>(`/api/task-data/${encodeURIComponent(occupation)}`);
  return response.data;
}
export async function fetchTaskBucket(year: number, occupation: string): Promise<TaskBucket[]> {
  const response = await axios.get<TaskBucket[]>(`/api/task-bucket/${encodeURIComponent(occupation)}`);
  return response.data;
}