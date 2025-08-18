import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function StatsCard({ title, value, change, period }) {
  const isPositive = change?.startsWith('+');

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{value}</p>
        {change && (
          <p
            className={`ml-2 flex items-center text-sm ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive ? (
              <ArrowUp className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 mr-1" />
            )}
            {change}
          </p>
        )}
      </div>
      {period && <p className="mt-1 text-sm text-gray-500">{period}</p>}
    </div>
  );
}