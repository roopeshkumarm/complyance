"use client";

import React from 'react';

interface ResultsCardProps {
  scenarioName?: string;
  results: {
    monthly_savings: number;
    cumulative_savings: number;
    net_savings: number;
    payback_months: number;
    roi_percentage: number;
  };
}

// Helper to format currency (USD, no decimals for cleaner display)
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

// Helper component for an individual result metric card
// This replicates the look of the individual boxes in the "Simulation Results" section of the UI image.
const ResultMetric: React.FC<{ label: string; value: string | number; accent: boolean; unit: string }> = ({ label, value, accent = false, unit }) => (
  // Key UI Change: Rounded corners, soft background, shadow-like border
  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-full">
    {/* Label Styling */}
    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
    
    {/* Value Styling - Prominent, bold, with green accent */}
    <p className={`mt-1 text-3xl font-bold ${accent ? 'text-green-600' : 'text-gray-900'} leading-none`}>
      {value}
      <span className="text-xl font-medium ml-1 text-gray-500">{unit}</span>
    </p>
  </div>
);

export default function ResultsCard({ scenarioName, results }: ResultsCardProps) {
  
  // Format the numbers
  const formattedResults = {
    monthly_savings: currencyFormatter.format(results.monthly_savings),
    cumulative_savings: currencyFormatter.format(results.cumulative_savings),
    net_savings: currencyFormatter.format(results.net_savings),
    payback_months: results.payback_months.toFixed(1),
    roi_percentage: results.roi_percentage.toFixed(0),
  };

  return (
    // Removed the outer card div since this component is now designed to be placed inside a card wrapper
    // (as was done in the updated Home.tsx). 
    <div className="space-y-4"> 
      
      {/* Scenario Name (if provided) - Styled as a clean subheading */}
      {scenarioName && (
        <p className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">
          Scenario: {scenarioName}
        </p>
      )}

      {/* Grid of Results - This assumes the parent component (Home.tsx) provides a grid wrapper */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1: ROI % (Primary focus - Green Accent) */}
        <ResultMetric
          label="ROI %"
          value={formattedResults.roi_percentage}
          unit="%"
          accent={true}
        />
        
        {/* Metric 2: Net Savings (Key financial result) */}
        <ResultMetric
          label="Net Savings"
          value={formattedResults.net_savings}
          unit="" // Currency symbol is part of the formatted value
          accent={false}
        />
        
        {/* Metric 3: Payback Period (Key time result - Green Accent) */}
        <ResultMetric
          label="Payback Period"
          value={formattedResults.payback_months}
          unit="Months"
          accent={true}
        />
        
        {/* Metric 4: Monthly Savings (Secondary financial result) */}
        <ResultMetric
          label="Monthly Savings"
          value={formattedResults.monthly_savings}
          unit=""
          accent={false}
        />
      </div>

      {/* Secondary Metrics (Can be displayed in a second row if space allows or needed) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Cumulative Savings */}
        <ResultMetric
          label="Cumulative Savings"
          value={formattedResults.cumulative_savings}
          unit=""
          accent={false}
        />
        
        {/* Net Savings (Optional repeat if the design requires it) */}
        <ResultMetric
          label="Net Savings (Full Term)"
          value={formattedResults.net_savings}
          unit=""
          accent={false}
        />
      </div>
    </div>
  );
}