import React, { useState } from 'react';
import { BarChart, Trees as TreeMap } from 'lucide-react';
import { TreemapChart } from './components/TreemapChart';
import { PropensityChart } from './components/PropensityChart';
import { useQuery } from '@tanstack/react-query';
import { fetchAvailableYears, fetchOccupations, fetchTaskData } from './api/bls';
import clsx from 'clsx';
import type { ChartType, BLSYear, BLSOccupation } from './types';

function App() {
  const [activeChart, setActiveChart] = useState<ChartType>('treemap');
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [selectedOccupation, setSelectedOccupation] = useState<string>('Chief Executives');

  const { data: years = [], isLoading: yearsLoading } = useQuery({
    queryKey: ['years'],
    queryFn: fetchAvailableYears,
  });

  const { data: occupations = [], isLoading: occupationsLoading } = useQuery({
    queryKey: ['occupations'],
    queryFn: fetchOccupations,
  });

  console.log('Occupations:', occupations); // Add this line
  console.log('Occupations Loading:', occupationsLoading); // Add this line

  const { 
    data: taskData = [], 
    isLoading: taskDataLoading,
    error: taskError
  } = useQuery({
    queryKey: ['taskData', selectedYear, selectedOccupation],
    queryFn: () => fetchTaskData(selectedYear, selectedOccupation),
  });

  // Transform task data for visualization
  // const treemapData = taskData.map(category => ({
  //   name: category.category,
  //   value: category.tasks.reduce((sum, task) => sum + task.value, 0),
  //   children: category.tasks.map(task => ({
  //     name: task.name,
  //     value: task.value,
  //   })),
  // }));

  const treemapData = taskData.map(task => ({
    name: task.name,
    value: task.value
  }));

  // const propensityData = taskData.flatMap(category =>
  //   category.tasks.map(task => ({
  //     group: task.name,
  //     propensity: task.value,
  //     frequency: Math.round(task.value * 1.5), // Example calculation
  //   }))
  // );
  const propensityData = taskData.flatMap(task => ({
      group: task.name,
      propensity: task.value,
      frequency: Math.round(task.value * 1.5), // Example calculation
    }));

  if (yearsLoading || occupationsLoading || taskDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading data...</div>
      </div>
    );
  }

  if (taskError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Error loading data. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              ONET Task Analysis
            </h1>
            <div className="flex gap-4">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="rounded-md border-gray-300 shadow-sm px-4 py-2"
              >
                {years.map((year) => (
                  <option key={year.year} value={year.year}>
                    {year.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedOccupation}
                onChange={(e) => setSelectedOccupation(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm px-4 py-2"
              >
                {occupations.map((occupation) => (
                  <option key={occupation.code} value={occupation.title}>
                    {occupation.title}
                  </option>
                ))}
              </select>
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
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            {activeChart === 'treemap' ? (
              <TreemapChart data={treemapData} />
            ) : (
              <PropensityChart data={propensityData} />
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>Data source: O*NET 29.1 Database</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;