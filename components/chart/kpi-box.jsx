'use client';

import React from 'react';
import numeral from 'numeral';
import { CalendarDropdown } from '../ui/calendar-dropdown';

export function KpiBox({ metricsRange, setMetricsRange, topMetrics = [], bottomMetrics = [] }) {
  const fmt = n => numeral(n).format('0.[0]a');

  const rangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Call Status Report</h2>
        <CalendarDropdown
          value={metricsRange}
          onChange={setMetricsRange}
          options={rangeOptions}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {topMetrics.map(m =>
          m ? (
            <div
              key={m.label}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-center h-32 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm font-medium text-gray-600">
                  <span className="mr-2">{m.icon}</span>
                  {m.label}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded font-medium ${
                    m.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}
                >
                  {m.trend}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mt-1">
                {typeof m.value === 'number' ? fmt(m.value) : m.value}
              </div>
            </div>
          ) : null
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {bottomMetrics.map((m, idx) =>
          m ? (
            <div
              key={m.label}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-center h-32 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm font-medium text-gray-600">
                  <span className="mr-2">{m.icon}</span>
                  {m.label}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded font-medium ${
                    m.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}
                >
                  {m.trend}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mt-1">
                {typeof m.value === 'number' ? fmt(m.value) : m.value}
              </div>
            </div>
          ) : (
            <div key={idx} />
          )
        )}
      </div>
    </div>
  );
}