"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Scenario {
  id: number;
  scenario_name: string;
  created_at: string; // Added created_at for display
  results: {
    monthly_savings: number;
    cumulative_savings: number;
    net_savings: number;
    payback_months: number;
    roi_percentage: number;
  };
}

interface ScenarioListProps {
  onSelect: (scenario: Scenario) => void;
  // Optional: Pass the initially selected ID to highlight it on load
  initialSelectedId?: number | null; 
}

// Helper to format currency (consistent with other components)
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function ScenarioList({ onSelect, initialSelectedId = null }: ScenarioListProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(initialSelectedId);
  const [loading, setLoading] = useState(true);

  // Functionality UNCHANGED: Fetches scenarios from Supabase
  const fetchScenarios = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("scenarios")
      .select("*, results") // Ensure all necessary fields are selected
      .order("created_at", { ascending: false });
      
    if (!error && data) setScenarios(data as Scenario[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  const handleSelect = (scenario: Scenario) => {
    setSelectedId(scenario.id);
    onSelect(scenario);
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-xl text-center text-gray-500">
        Loading scenarios...
      </div>
    );
  }

  return (
    // Replaced the outer container with a simple wrapper since it's used inside the ReportPage card
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-gray-700">Select a Scenario</h2>
      
      {scenarios.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <p className="text-gray-500 text-center">
                No scenarios saved yet.
            </p>
        </div>
      ) : (
        // Added scroll for longer lists, consistent card spacing
        <div className="max-h-80 overflow-y-auto pr-2 space-y-3"> 
          {scenarios.map((s) => {
            const isSelected = s.id === selectedId;
            const roi = s.results?.roi_percentage?.toFixed(0) || 'N/A';
            const payback = s.results?.payback_months?.toFixed(1) || 'N/A';

            return (
              <div 
                key={s.id}
                onClick={() => handleSelect(s)}
                // Styled Card: Clean borders, rounded corners, shadow, and green accent on selection
                className={`
                  p-4 rounded-xl cursor-pointer transition duration-200 border-2
                  ${isSelected
                    ? 'bg-green-50 border-green-500 shadow-lg scale-[1.01]' // Selected Style
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md' // Default/Hover Style
                  }
                `}
              >
                <div className="flex justify-between items-center">
                  {/* Scenario Name & Date */}
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold text-gray-900">
                      {s.scenario_name}
                    </p>
                    <span className="text-xs text-gray-500">
                      Saved: {new Date(s.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Key Metrics - Displayed in a structured way */}
                  <div className="flex space-x-4 text-right">
                    <div className="flex flex-col">
                      <span className={`text-xl font-bold ${isSelected ? 'text-green-600' : 'text-blue-600'}`}>
                        {roi}%
                      </span>
                      <span className="text-xs text-gray-500 uppercase">ROI</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-gray-700">
                        {payback}
                      </span>
                      <span className="text-xs text-gray-500 uppercase">Payback (mo)</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}