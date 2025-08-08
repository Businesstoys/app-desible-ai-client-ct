'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export function CalendarDropdown({ value, onChange, options }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="flex items-center text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-100 transition">
        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
        <SelectValue placeholder="Select range" />
      </SelectTrigger>
      <SelectContent>
        {options.map(opt => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}