"use client";

import React from "react";

const Checkbox = ({ id, checked, onChange, label }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        className="peer h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 checked:bg-orange-500"
        checked={checked}
        onChange={onChange}
      />
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 peer-checked:text-orange-500"
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
