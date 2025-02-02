import React, { useState } from 'react';
import { BarChart, Trees as TreeMap } from 'lucide-react';
import { TreemapChart } from './components/TreemapChart';
import { PropensityChart } from './components/PropensityChart';
import clsx from 'clsx';

// Sample data - replace with your actual data
const treemapData = [
  {
    name: 'Category A',
    value: 1000,
    children: [
      { name: 'A1', value: 400 },
      { name: 'A2', value: 300 },
      { name: 'A3', value: 300 },
    ],
  },
  {
    name: 'Category B',
    value: 800,
    children: [
      { name: 'B1', value: 400 },
      { name: 'B2', value: 400 },
    ],
  },
];

const propensityData = [
  { group: 'A', propensity: 65, frequency: 120 },
  { group: 'B', propensity: 45, frequency: 80 },
  { group: 'C', propensity: 75, frequency: 150 },
  { group: 'D', propensity: 35, frequency: 60 },
  { group: 'E', propensity: 85, frequency: 200 },
];

type ChartType = 'treemap' | 'propensity';

function App() {
  const [activeChart, setActiveChart] = useState<ChartType>('treemap');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Interactive Data Visualization
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveChart('treemap')}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-md transition-colors',
                  activeChart === 'treemap'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                <TreeMap size={20} />
                Treemap
              </button>
              <button
                onClick={() => setActiveChart('propensity')}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-md transition-colors',
                  activeChart === 'propensity'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                <BarChart size={20} />
                Propensity
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            {activeChart === 'treemap' ? (
              <TreemapChart data={treemapData} />
            ) : (
              <PropensityChart data={propensityData} />
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              This visualization is iframe-compatible and can be embedded in WordPress.
              Simply use the iframe HTML tag with the deployed URL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;