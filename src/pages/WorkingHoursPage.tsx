import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  TrendingUp,
} from 'lucide-react';
import { WorkingHourRecord, Member } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

interface WorkingHoursPageProps {
  records: WorkingHourRecord[];
  currentUser: Member;
  onOpenLogHours: () => void;
}

export const WorkingHoursPage: React.FC<WorkingHoursPageProps> = ({
  records,
  onOpenLogHours,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Verified' | 'Pending Verification'>('All');

  const totalHours = records.reduce((acc, r) => acc + r.hours, 0);
  const weeklyHours = 8.5; // realistic dummy weekly hours
  const monthlyHours = 24.0; // realistic dummy monthly hours
  const targetTermHours = 40.0;
  const progressPercent = Math.min(100, Math.round((totalHours / targetTermHours) * 100));

  const filteredRecords = records.filter((r) => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchProject = r.project.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchDept = r.department.toLowerCase().includes(q);
      if (!matchProject && !matchDesc && !matchDept) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Working Hours & Contribution Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Log engineering development, graphic design, and logistics volunteer time for dean accreditation.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenLogHours}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Working Hours</span>
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Logged Hours</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalHours.toFixed(1)}h
            </span>
            <span className="text-xs text-indigo-600 font-medium">Verified + Pending</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Target goal: {targetTermHours}h per semester</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Weekly Hours</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {weeklyHours.toFixed(1)}h
            </span>
            <span className="text-xs text-emerald-600 font-medium">+2.5h vs last week</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Active sprints & hackathon prep</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Monthly Hours</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {monthlyHours.toFixed(1)}h
            </span>
            <span className="text-xs text-blue-600 font-medium">October 2026</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Rank: Top 5% contributor</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Semester Progress</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {progressPercent}%
            </span>
            <span className="text-xs text-amber-600 font-medium">{(targetTermHours - totalHours).toFixed(1)}h to goal</span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {(['All', 'Verified', 'Pending Verification'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                statusFilter === filter
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search project or task..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Project / Milestone</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Hours</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Verified By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No work records match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 min-w-[200px]">
                      {r.project}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 min-w-[260px] leading-relaxed">
                      {r.description}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                      {r.department}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-600">
                      {r.date}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-center font-mono font-bold text-slate-900 tabular-nums">
                      {r.hours.toFixed(1)}h
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={r.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {r.verifiedBy}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
