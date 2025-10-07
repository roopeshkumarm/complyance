"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // Import Link for navigation
import { supabase } from "@/lib/supabaseClient";

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState<any[]>([]);

  // Helper to format currency (consistent with other components)
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  // Functionality UNCHANGED
  const fetchScenarios = async () => {
    const { data, error } = await supabase
      .from("scenarios")
      .select("*, results") // Ensure results column is selected
      .order("created_at", { ascending: false });
    if (error) console.log(error);
    else setScenarios(data);
  };

  // Functionality UNCHANGED
  const deleteScenario = async (id: number) => {
    if (!confirm("Are you sure you want to delete this scenario?")) return;
    const { error } = await supabase.from("scenarios").delete().eq("id", id);
    if (error) alert("Error deleting scenario: " + error.message);
    else fetchScenarios();
  };

  // Functionality UNCHANGED
  useEffect(() => {
    fetchScenarios();
  }, []);

  return (
    // Wrapper: Light gray background consistent with Home.tsx
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10 flex flex-col items-center">
      
      {/* Title - Clean and prominent */}
      <h1 className="text-4xl font-semibold text-black mb-4 tracking-tight select-none">
        Saved Scenarios
      </h1>

      {/* Back to Home Button (New Addition) */}
      <div className="w-full max-w-4xl flex justify-center mb-8">
        <Link href="/">
          <p
            // Styled as a subtle, secondary action button
            className="px-6 py-2 text-black font-medium  rounded-lg shadow-md border border-gray-200 hover:bg-gray-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            ← Back to Simulator
          </p>
        </Link>
      </div>
      {/* End Back to Home Button */}

      {/* Main Content Card */}
      <div className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-100">
        
        {scenarios.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No scenarios saved yet. Go back to the simulator to create one!
          </p>
        ) : (
          <ul className="space-y-4">
            {scenarios.map((s) => (
              // Styled List Item - Each one acts as a clean mini-card
              <li 
                key={s.id} 
                className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-100 transition duration-150 hover:shadow-md"
              >
                {/* Scenario Details */}
                <div className="flex flex-col mb-3 sm:mb-0">
                  <strong className="text-lg font-medium text-gray-800">
                    {s.scenario_name}
                  </strong>
                  <span className="text-sm text-gray-500 mt-1">
                    Created: {new Date(s.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-md font-semibold text-green-600 mt-1">
                    ROI: {s.results?.roi_percentage?.toFixed(0) || 'N/A'}%
                    <span className="text-gray-600 font-normal ml-3">
                        Payback: {s.results?.payback_months?.toFixed(1) || 'N/A'} mo
                    </span>
                  </span>
                </div>
                
                {/* Delete Button */}
                <button
                  onClick={() => deleteScenario(s.id)}
                  // Styled Button: Red for dangerous action, rounded, clean hover effect
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-4 focus:ring-red-500/50"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}