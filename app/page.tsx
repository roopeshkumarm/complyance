"use client";

import { useState } from "react";
// Import Link for navigation
import Link from "next/link"; 
import { supabase } from "@/lib/supabaseClient"; 
import RoiForm from "./components/RoiForm";
import ResultsCard from "./components/ResultsCard";

export default function Home() {
  const [results, setResults] = useState<null | {
    monthly_savings: number;
    cumulative_savings: number;
    net_savings: number;
    payback_months: number;
    roi_percentage: number;
  }>(null);

  const [form, setForm] = useState({
    scenario_name: "",
    monthly_invoice_volume: 2000,
    num_ap_staff: 3,
    avg_hours_per_invoice: 0.17,
    hourly_wage: 30,
    error_rate_manual: 0.5,
    error_cost: 100,
    time_horizon_months: 36,
    one_time_implementation_cost: 50000,
  });

  // Internal constants (functionality UNCHANGED)
  const automated_cost_per_invoice = 0.2;
  const error_rate_auto = 0.1; // %
  const min_roi_boost_factor = 1.1;

  // Calculate ROI (functionality UNCHANGED)
  const calculateROI = () => {
    // ... (ROI calculation logic remains here)
    const labor_cost_manual =
        form.num_ap_staff *
        form.hourly_wage *
        form.avg_hours_per_invoice *
        form.monthly_invoice_volume;

    const auto_cost = form.monthly_invoice_volume * automated_cost_per_invoice;

    const error_savings =
        ((form.error_rate_manual - error_rate_auto) / 100) *
        form.monthly_invoice_volume *
        form.error_cost;

    const monthly_savings =
        (labor_cost_manual + error_savings - auto_cost) * min_roi_boost_factor;

    const cumulative_savings = monthly_savings * form.time_horizon_months;
    const net_savings = cumulative_savings - form.one_time_implementation_cost;
    const payback_months = form.one_time_implementation_cost / monthly_savings;
    const roi_percentage = (net_savings / form.one_time_implementation_cost) * 100;

    setResults({ monthly_savings, cumulative_savings, net_savings, payback_months, roi_percentage });
  };

  // Save scenario (functionality UNCHANGED)
  const saveScenario = async () => {
    // ... (Save scenario logic remains here)
    if (!results) return alert("Run simulation first!");
    const { error } = await supabase.from("scenarios").insert([{ ...form, results }]);
    if (error) alert("Error saving scenario: " + error.message);
    else alert("Scenario saved!");
  };

  const navItems = [
    { name: 'Home', href: '/', isActive: true },
    { name: 'Scenarios', href: '/scenarios', isActive: false },
    { name: 'Report', href: '/report', isActive: false },
  ];
  
  // Styling for the navigation links
  const NavLink = ({ name, href, isActive }: typeof navItems[0]) => (
    <Link href={href}>
      <p className={`
        px-4 py-2 rounded-lg font-medium transition duration-150 cursor-pointer
        ${isActive 
          ? 'text-green-600 bg-green-50 shadow-sm border border-green-200' // Active style with green accent
          : 'text-gray-600 hover:bg-gray-100' // Inactive style
        }
      `}>
        {name}
      </p>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10 flex flex-col items-center">
      
      {/* Title */}
      <h1 className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight select-none">
        Invoicing ROI Simulator
      </h1>

      {/* Navigation Bar */}
      <nav className="w-full max-w-4xl flex justify-center space-x-2 p-3 bg-white rounded-xl shadow-lg mb-8 border border-gray-100">
        {navItems.map((item) => (
          <NavLink key={item.name} {...item} />
        ))}
      </nav>
      {/* End Navigation Bar */}

      {/* Input Parameters Section Card */}
      <section className="w-full max-w-4xl rounded-xl bg-white shadow-xl p-6 sm:p-10 mb-8">
        <h2 className="text-xl font-medium text-gray-700 mb-6">Input Parameters</h2>
        <RoiForm
          form={form}
          setForm={setForm}
          onCalculate={calculateROI}
          onSave={saveScenario}
          resultsAvailable={!!results}
        />
      </section>

      {/* Simulation Results Section Card */}
      {results && (
        <section className="w-full max-w-4xl rounded-xl bg-white shadow-xl p-6 sm:p-10">
          <h2 className="text-xl font-medium text-gray-700 mb-6">Simulation Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ResultsCard results={results} />
          </div>
        </section>
      )}
    </div>
  );
}