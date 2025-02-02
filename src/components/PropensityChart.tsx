import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { PropensityData } from '../types';

interface PropensityChartProps {
  data: PropensityData[];
}

export const PropensityChart: React.FC<PropensityChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis 
            type="number" 
            dataKey="propensity" 
            name="Propensity"
            unit="%" 
          />
          <YAxis 
            type="number" 
            dataKey="frequency" 
            name="Frequency"
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter 
            name="Propensity Analysis" 
            data={data} 
            fill="#8884d8"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};