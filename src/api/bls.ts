import axios from 'axios';
import { API_ENDPOINTS } from './config';
import { BLSYear, BLSOccupation, TaskBucket, TaskData } from '../types';//-

export async function fetchAvailableYears(): Promise<BLSYear[]> {//-
  // For now, we'll just return the current year since we're using ONET 29.1 data//-
  return [//-
    { year: 2024, label: '2024 (ONET 29.1)' }//-
  ];//-
}//-
export async function fetchOccupations(): Promise<BLSOccupation[]> {
  const response = await axios.get(API_ENDPOINTS.OCCUPATIONS);//+
  return response.data;
}

export async function fetchTaskData(year: number, occupation: string): Promise<TaskData[]> {
  const response = await axios.get<TaskData[]>(`${API_ENDPOINTS.TASKDATA}/${encodeURIComponent(occupation)}`);
  return response.data;
}
export async function fetchTaskBucket(year: number, occupation: string): Promise<TaskBucket[]> {
  const response = await axios.get<TaskBucket[]>(`${API_ENDPOINTS.TASKBUCKET}/${encodeURIComponent(occupation)}`);
  return response.data;
}