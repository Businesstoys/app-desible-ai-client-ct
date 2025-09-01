import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DropdownSelect = ({ label, value, onChange, options, placeholder, width = '200px' }) => {
  return (
    <div className="flex gap-4 items-center">
    {label && <label className="mb-1 block w-28 text-sm font-medium text-gray-700">{label}</label> }
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`w-[${width}]`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option, index) => (
            <SelectItem key={index} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DropdownSelect;
