import React, { useState } from "react";

const TimeHeatmap = ({
  data = [],
  width = "100%",
  height = "400px",
  colorScale = ["#f3f4f6", "#ddd6fe", "#a78bfa", "#7c3aed", "#5b21b6"],
  showValues = true,
}) => {
  // Default sample data if none provided
  const defaultData = [
    { day: "Monday", "10 AM": 45, "12 PM": 60, "2 PM": 30, "4 PM": 80, "6 PM": 90, "8 PM": 70, "10 PM": 20, "12 AM": 5, "2 AM": 2, "4 AM": 1, "6 AM": 15, "8 AM": 35 },
    { day: "Tuesday", "10 AM": 50, "12 PM": 65, "2 PM": 35, "4 PM": 75, "6 PM": 85, "8 PM": 60, "10 PM": 25, "12 AM": 8, "2 AM": 3, "4 AM": 2, "6 AM": 20, "8 AM": 40 },
    { day: "Wednesday", "10 AM": 55, "12 PM": 70, "2 PM": 40, "4 PM": 85, "6 PM": 95, "8 PM": 75, "10 PM": 30, "12 AM": 10, "2 AM": 4, "4 AM": 1, "6 AM": 18, "8 AM": 42 },
    { day: "Thursday", "10 AM": 48, "12 PM": 68, "2 PM": 38, "4 PM": 82, "6 PM": 88, "8 PM": 65, "10 PM": 28, "12 AM": 7, "2 AM": 3, "4 AM": 2, "6 AM": 22, "8 AM": 38 },
    { day: "Friday", "10 AM": 52, "12 PM": 72, "2 PM": 42, "4 PM": 88, "6 PM": 100, "8 PM": 85, "10 PM": 45, "12 AM": 15, "2 AM": 8, "4 AM": 3, "6 AM": 12, "8 AM": 30 },
    { day: "Saturday", "10 AM": 35, "12 PM": 50, "2 PM": 45, "4 PM": 70, "6 PM": 80, "8 PM": 90, "10 PM": 60, "12 AM": 25, "2 AM": 12, "4 AM": 5, "6 AM": 8, "8 AM": 20 },
    { day: "Sunday", "10 AM": 30, "12 PM": 45, "2 PM": 40, "4 PM": 65, "6 PM": 75, "8 PM": 85, "10 PM": 55, "12 AM": 20, "2 AM": 10, "4 AM": 4, "6 AM": 10, "8 AM": 25 }
  ];

  const heatmapData = data.length > 0 ? data : defaultData;
  
  const timeSlots = ["10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM", "12 AM", "2 AM", "4 AM", "6 AM", "8 AM"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Calculate max value for color scaling
  const maxValue = Math.max(
    ...heatmapData.flatMap(dayData => 
      timeSlots.map(time => dayData[time] || 0)
    )
  );

  // Get color based on value
  const getColor = (value) => {
    if (!value || value === 0) return colorScale[0];
    const intensity = value / maxValue;
    if (intensity <= 0.2) return colorScale[0];
    if (intensity <= 0.4) return colorScale[1];
    if (intensity <= 0.6) return colorScale[2];
    if (intensity <= 0.8) return colorScale[3];
    return colorScale[4];
  };

  // Get text color based on background
  const getTextColor = (value) => {
    const intensity = value / maxValue;
    return intensity > 0.5 ? "text-white" : "text-gray-700";
  };

  const [hoveredCell, setHoveredCell] = useState(null);

  return (
    <div className="w-full bg-white rounded-lg border shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Heatmap</h3>
        <p className="text-sm text-gray-600">Daily activity patterns across different time periods</p>
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Header with time slots */}
          <div className="flex mb-1">
            <div className="w-20 flex-shrink-0"></div>
            {timeSlots.map((time) => (
              <div key={time} className="w-16 text-xs font-medium text-gray-600 text-center py-2">
                {time}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          {days.map((day) => {
            const dayData = heatmapData.find(d => d.day === day) || {};
            return (
              <div key={day} className="flex mb-1">
                {/* Day label */}
                <div className="w-20 flex-shrink-0 text-sm font-medium text-gray-700 py-3 pr-4 text-right">
                  {day}
                </div>
                
                {/* Time slot cells */}
                {timeSlots.map((time) => {
                  const value = dayData[time] || 0;
                  const cellKey = `${day}-${time}`;
                  return (
                    <div
                      key={time}
                      className={`w-16 h-12 mx-0.5 rounded-sm cursor-pointer transition-all duration-200 flex items-center justify-center text-xs font-medium border ${
                        hoveredCell === cellKey ? 'ring-2 ring-blue-400 ring-opacity-50' : 'border-gray-200'
                      } ${getTextColor(value)}`}
                      style={{ backgroundColor: getColor(value) }}
                      onMouseEnter={() => setHoveredCell(cellKey)}
                      onMouseLeave={() => setHoveredCell(null)}
                      title={`${day} at ${time}: ${value}`}
                    >
                      {showValues && value > 0 && (
                        <span className="select-none">{value}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600">Less</span>
          {colorScale.map((color, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-sm border border-gray-200"
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="text-xs text-gray-600">More</span>
        </div>
        
        <div className="text-xs text-gray-500">
          Max value: {maxValue}
        </div>
      </div>
      
      {/* Tooltip for hovered cell */}
      {hoveredCell && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md border">
          <div className="text-sm font-medium text-gray-900">
            {hoveredCell.replace('-', ' at ')}
          </div>
          <div className="text-sm text-gray-600">
            Activity level: {heatmapData.find(d => d.day === hoveredCell.split('-')[0])?.[hoveredCell.split('-')[1]] || 0}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeHeatmap;