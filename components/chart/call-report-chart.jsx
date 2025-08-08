'use client';

import React from 'react';
import numeral from 'numeral';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { CalendarDropdown } from '../ui/calendar-dropdown';

export function CallReportChart({ data, chartRange, setChartRange }) {
  const fmt = n => numeral(n).format('0.[0]a');

  const options = [
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: 'all', label: 'All Time' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-600">
            <span className="inline-block w-3 h-3 bg-gray-500 rounded-sm mr-2" />
            Calls Triggered: {fmt(payload[0].value)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="inline-block w-3 h-3 bg-indigo-500 rounded-sm mr-2" />
            Qualified Calls: {fmt(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Weekly Calls Report</h3>
        <CalendarDropdown
          value={chartRange}
          onChange={setChartRange}
          options={options}
        />
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barSize={40}
            barGap={0}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={fmt}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="callsTriggered" stackId="a" fill="#64748B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="qualifiedCalls" stackId="a" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center mt-6 space-x-8">
        <div className="flex items-center">
          <span className="w-4 h-4 bg-gray-500 rounded mr-2" />
          <span className="text-sm font-medium text-gray-700">Calls Triggered</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-indigo-500 rounded mr-2" />
          <span className="text-sm font-medium text-gray-700">Qualified Calls</span>
        </div>
      </div>
    </div>
  );
}