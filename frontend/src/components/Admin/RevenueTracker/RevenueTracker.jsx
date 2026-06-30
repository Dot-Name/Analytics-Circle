import React from 'react';

export default function RevenueTracker() {
  // Mock Metric Data
  const financialStats = [
    { label: 'Gross Revenue', value: '$24,892.50', change: '+12.3%', up: true },
    { label: 'Active Subscriptions', value: '1,420', change: '+8.1%', up: true },
    { label: 'Course Sales Count', value: '382', change: '-2.4%', up: false },
    { label: 'Net Profit Margin', value: '88.4%', change: '+4.2%', up: true },
  ];

  return (
    <div className="space-y-6  animate-fadeIn m-10 sm:m-15">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Revenue & Insights Control</h2>
        <p className="text-xs text-gray-500 mt-0.5">Track institutional earnings, live transaction registries, and subscription tier statistics.</p>
      </div>

      {/* 📊 High-Level Metrics Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        {financialStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
            <div className="flex items-baseline justify-between mt-4">
              <span className="text-2xl font-black text-slate-950">{stat.value}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 🧾 Bottom Visual Framework Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Transaction History Table Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-800 text-base">Recent Ledger Streams</h3>
            <span className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer">Export CSV</span>
          </div>
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="p-4">User</th>
                  <th className="p-4">Course Ref</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium text-slate-700">
                <tr>
                  <td className="p-4">alex@example.com</td>
                  <td className="p-4">React Framework Complete</td>
                  <td className="p-4 text-slate-950 font-bold">$49.00</td>
                  <td className="p-4"><span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Settled</span></td>
                </tr>
                <tr>
                  <td className="p-4">sarah.j@example.com</td>
                  <td className="p-4">Advanced Node Architecture</td>
                  <td className="p-4 text-slate-950 font-bold">$89.00</td>
                  <td className="p-4"><span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Settled</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Course Sales Share Distribution breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base mb-1">Subscription Ratios</h3>
            <p className="text-xs text-gray-400">Distribution analysis by consumer account archetypes.</p>
          </div>
          <div className="p-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 text-center text-xs text-gray-400 font-medium my-4">
            [Chart Canvas Insertion Area]
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Monthly Pass</span>
              <span className="font-bold text-slate-900">72%</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Annual Plan</span>
              <span className="font-bold text-slate-900">28%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}