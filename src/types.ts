export interface DataPoint {
  name: string;
  value: number;
  children?: DataPoint[];
}

export interface PropensityData {
  group: string;
  propensity: number;
  frequency: number;
}

export interface BLSData {
  year: number;
  occupation: string;
  tasks: {
    name: string;
    value: number;
  }[];
}

export interface BLSYear {
  year: number;
  label: string;
}

export interface BLSOccupation {
  code: string;
  title: string;
}

export interface TaskData {
  name: string;
  value: number;
}

export interface TaskBucket {
  category: string;
  tasks: {
    name: string;
    value: number;
  }[];
}

export type ChartType = 'treemap' | 'propensity';