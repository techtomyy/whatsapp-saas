import React from 'react';
import { Check, X, Clock } from 'lucide-react';

export default function MessageCard({ message }) {
  const statusColors = {
    delivered: 'text-green-500',
    failed: 'text-red-500',
    pending: 'text-yellow-500'
  };

  const StatusIcon = () => {
    switch (message.status.toLowerCase()) {
      case 'delivered':
        return <Check className={statusColors.delivered} />;
      case 'failed':
        return <X className={statusColors.failed} />;
      default:
        return <Clock className={statusColors.pending} />;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{message.recipient}</h3>
          <p className="text-sm text-gray-500">
            {new Date(message.timestamp).toLocaleString()}
          </p>
        </div>
        <StatusIcon />
      </div>
      <p className="text-gray-700">{message.content}</p>
      <div className="mt-3 flex gap-2">
        <button 
          onClick={() => message.onResend?.(message.id)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Resend
        </button>
        <button 
          onClick={() => message.onDelete?.(message.id)}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}