import React from 'react';
import { TaskStatus, TaskPriority, EventStatus } from '../../types';

interface StatusBadgeProps {
  status: TaskStatus | EventStatus | TaskPriority | 'Active' | 'On Leave' | 'Core Lead' | 'Probation' | 'Present' | 'Absent' | 'Excused' | 'Verified' | 'Pending Verification';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyle = () => {
    switch (status) {
      // Task Statuses
      case 'Pending':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Submitted':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Approved':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Completed':
      case 'Verified':
      case 'Present':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Overdue':
      case 'Absent':
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      // Priorities
      case 'Urgent':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
      case 'High':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Medium':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Low':
        return 'bg-slate-100 text-slate-600 border-slate-200';

      // Member Statuses
      case 'Core Lead':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium';
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'On Leave':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Probation':
        return 'bg-orange-50 text-orange-700 border-orange-200';

      // Attendance
      case 'Excused':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Pending Verification':
        return 'bg-amber-50 text-amber-700 border-amber-200';

      // Event Statuses
      case 'Upcoming':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Ongoing':
      case 'In Progress':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-500 border-slate-200';

      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md whitespace-nowrap shrink-0 transition-colors ${sizeClass} ${getStyle()}`}
    >
      {status}
    </span>
  );
};
