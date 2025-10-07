"use client";

import ScenarioList from "../components/ScenarioList";
import { useState } from "react";
// Ensure jspdf and html2canvas are installed in your project
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


export default function ReportPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  // Functionality UNCHANGED
  const handleSubmitEmail = () => {
    if (!email.includes("@")) return alert("Enter a valid email!");
    setSubmitted(true);
    // Changed alert to a less intrusive console log/message structure if possible, 
    // but keeping original functionality:
    alert("Email submitted! You can now download the report."); 
  };

  // Functionality UNCHANGED
  const generatePDF = async () => {
    if (!submitted) return alert("Enter your email first!");
    if (!selectedScenario) return alert("Select a scenario first!");

    const element = document.getElementById("report-content");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 }); // Increased scale for better PDF quality
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${selectedScenario.scenario_name}_ROI_Report.pdf`);
  };

  // Helper to format currency (consistent with other components)
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  // Helper component for the result display within the report
  const ReportMetric = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between border-b border-gray-100 py-2 last:border-b-0">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="text-gray-900 font-semibold">{value}</span>
    </div>
  );

  return (
    // Wrapper: Light gray background consistent with Home.tsx
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10 flex flex-col items-center">
      
      {/* Title */}
      <h1 className="text-4xl font-semibold text-gray-900 mb-10 tracking-tight select-none">
        Download ROI Report
      </h1>

      {/* Email Submission Card */}
      {!submitted && (
        <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-xl shadow-xl mb-8 border border-gray-100">
          <h2 className="text-xl font-medium text-gray-700 mb-5">
            1. Enter Your Email to Unlock
          </h2>
          <input
            type="email"
            placeholder="your.name@company.com"
            value={email}
            onChange={handleEmailChange}
            // Styled Input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-900 mb-4"
          />
          <button
            onClick={handleSubmitEmail}
            // Styled Button: Primary blue for submission action
            className="px-6 py-3 text-white font-semibold bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50 w-full"
          >
            Submit Email
          </button>
        </div>
      )}

      {submitted && (
        <>
          {/* Scenario Selection (Assuming ScenarioList is styled separately) */}
          <div className="w-full max-w-3xl mb-8">
             {/* Note: ScenarioList component needs to be styled separately, 
             but it's placed here to maintain the flow. */}
             <h2 className="text-xl font-medium text-gray-700 mb-4">2. Select a Scenario</h2>
             <ScenarioList onSelect={setSelectedScenario} />
          </div>

          {selectedScenario && (
            // Report Content Card
            <div className="w-full max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-xl mt-4 border border-gray-100">
              
              {/* Report Content for PDF */}
              <div id="report-content" className="space-y-4 p-4">
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">
                    ROI Report: {selectedScenario.scenario_name}
                </h2>
                
                <p className="text-lg font-medium text-gray-700">Key Results</p>

                {/* Styled Metric Display */}
                <div className="space-y-1">
                    <ReportMetric 
                        label="ROI %" 
                        value={`${selectedScenario.results.roi_percentage.toFixed(0)}%`} 
                    />
                    <ReportMetric 
                        label="Net Savings" 
                        value={currencyFormatter.format(selectedScenario.results.net_savings)} 
                    />
                    <ReportMetric 
                        label="Payback Period" 
                        value={`${selectedScenario.results.payback_months.toFixed(1)} months`} 
                    />
                    <ReportMetric 
                        label="Monthly Savings" 
                        value={currencyFormatter.format(selectedScenario.results.monthly_savings)} 
                    />
                    <ReportMetric 
                        label="Cumulative Savings" 
                        value={currencyFormatter.format(selectedScenario.results.cumulative_savings)} 
                    />
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={generatePDF}
                // Styled Button: Green accent color for the final action
                className="mt-6 px-8 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/50 w-full"
              >
                Download PDF
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}