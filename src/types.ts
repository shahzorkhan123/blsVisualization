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