import React from 'react';
import {
  Treemap,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { DataPoint } from '../types';

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

interface TreemapChartProps {
  data: DataPoint[];
}

export const TreemapChart: React.FC<TreemapChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="value"
          aspectRatio={4 / 3}
          stroke="#fff"
          fill="#8884d8"
          content={({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => {
            return (
              <g>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  style={{
                    fill: COLORS[index % COLORS.length],
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                  }}
                />
                {depth === 1 && (
                  <text
                    x={x + width / 2}
                    y={y + height / 2 + 7}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={14}
                  >
                    {name}
                  </text>
                )}
              </g>
            );
          }}
        >
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <p className="font-medium">{payload[0].payload.name}</p>
                    <p>Value: {payload[0].value}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};