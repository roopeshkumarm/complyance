"use client";

import React from "react";

interface RoiFormProps {
  form: any;
  setForm: (form: any) => void;
  onCalculate: () => void;
  onSave: () => void;
  resultsAvailable: boolean;
}

export default function RoiForm({ form, setForm, onCalculate, onSave, resultsAvailable }: RoiFormProps) {
  
  // Adjusted to correctly handle the 'scenario_name' as a string
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Check if the field should be treated as a number or a string
    const isNumeric = name !== 'scenario_name';
    
    setForm({ 
        ...form, 
        [name]: isNumeric ? parseFloat(value) || 0 : value 
    });
  };

  // Helper function to format the label text
  const formatLabel = (key: string) => {
    // Replace underscores with space and capitalize the first letter of each word
    const formatted = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    
    // Custom label overrides for clarity
    if (key === 'error_rate_manual') return 'Error Rate (Manual %)';
    if (key === 'one_time_implementation_cost') return 'One-Time Implementation Cost ($)';
    if (key === 'avg_hours_per_invoice') return 'Avg. Hours per Invoice (Manual)';
    
    return formatted;
  };

  return (
    // Removed outer container since it's already wrapped in a card in Home.tsx. 
    // If used standalone, keep it simple.
    <div className="space-y-6"> 
      
      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {Object.keys(form).map((key) => {
          const isScenarioName = key === 'scenario_name';
          return (
            <div 
              key={key} 
              className={`flex flex-col ${isScenarioName ? 'sm:col-span-2' : ''}`}
            >
              {/* Label Styling */}
              <label 
                className="mb-1 text-sm font-medium text-gray-700"
              >
                {formatLabel(key)}
              </label>
              
              {/* Input Styling */}
              <input
                // Set type to text for scenario_name to prevent keyboard issues on mobile
                type={isScenarioName ? "text" : "number"}
                step="any"
                name={key}
                value={(form as any)[key]}
                onChange={handleChange}
                // Key UI Change: Rounded corners, light border, clean focus style
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-900"
                // Add a placeholder for a cleaner look
                placeholder={isScenarioName ? "e.g., Q4 Automation Scenario" : "Enter value"}
              />
            </div>
          )
        })}
      </div>

      {/* Buttons - Styled and right-aligned */}
      <div className="flex justify-end space-x-4 pt-4">
        
        {/* Calculate ROI Button - Vibrant Green Accent */}
        <button
          onClick={onCalculate}
          // Key UI Change: Green accent color, rounded corners, soft shadow
          className="px-6 py-3 text-white font-semibold bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/50"
        >
          Calculate ROI
        </button>
        
        {/* Save Scenario Button - Subtle, secondary style */}
        <button
          onClick={onSave}
          disabled={!resultsAvailable}
          // Key UI Change: Subtle background, gray text, disabled state style
          className={`px-6 py-3 font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-4 ${
            resultsAvailable
              ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          Save Scenario
        </button>
      </div>
    </div>
  );
}