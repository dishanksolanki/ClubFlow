import React, { useState } from 'react';
import {
  Award,
  CalendarCheck2,
  UserX,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';
import { AttendanceRecord, Member } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';

interface AttendancePageProps {
  records: AttendanceRecord[];
  currentUser: Member;
  onAddAttendanceExcuse?: (excuse: AttendanceRecord) => void;
}

export const AttendancePage: React.FC<AttendancePageProps> = ({
  records: initialRecords,
  currentUser,
}) => {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExcuseModalOpen, setIsExcuseModalOpen] = useState(false);
  const [excuseEvent, setExcuseEvent] = useState('Upcoming Committee Standup');
  const [excuseReason, setExcuseReason] = useState('');

  const presentCount = records.filter((r) => r.status === 'Present').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;
  const excusedCount = records.filter((r) => r.status === 'Excused').length;
  const totalEvents = records.length;
  const attendanceRate = totalEvents > 0 ? Math.round((presentCount / totalEvents) * 100) : 0;

  const filteredRecords = records.filter((r) => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.eventName.toLowerCase().includes(q);
      const matchVerifier = r.verifiedBy.toLowerCase().includes(q);
      if (!matchName && !matchVerifier) return false;
    }
    return true;
  });

  const handleExcuseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excuseReason.trim()) return;

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      eventName: excuseEvent,
      date: 'Pending Review',
      type: 'Core Standup',
      status: 'Excused',
      verifiedBy: 'Pending Faculty Advisor Approval',
      durationHours: 2.0,
      notes: `Excuse note: ${excuseReason}`,
    };

    setRecords([newRecord, ...records]);
    setExcuseReason('');
    setIsExcuseModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Attendance Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track personal session compliance, roll call sign-offs, and official university meeting credits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExcuseModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-slate-500" />
          <span>Request Session Excuse</span>
        </button>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Attendance Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {attendanceRate}%
            </span>
            <span className="text-xs text-emerald-600 font-medium">Good Standing</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Required threshold for certification: 75%</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Tracked Events</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalEvents}
            </span>
            <span className="text-xs text-slate-500">Scheduled Sessions</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Fall 2026 Academic Cycle</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Present Check-Ins</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {presentCount}
            </span>
            <span className="text-xs text-blue-600 font-medium">Verified by leads</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Logged in physical attendance register</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Absences & Leaves</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {absentCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">{excusedCount} excused</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">2 unexplained missed standups</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="All">All Records ({records.length})</option>
            <option value="Present">Present Only ({presentCount})</option>
            <option value="Absent">Absent Only ({absentCount})</option>
            <option value="Excused">Excused Only ({excusedCount})</option>
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search event name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Event / Meeting</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Session Type</th>
                <th className="py-3 px-4">Hours</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Verified By</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No attendance records match the filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 min-w-[220px]">
                      {r.eventName}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-700">
                      {r.date}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                      {r.type}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono tabular-nums text-slate-800 font-semibold">
                      {r.durationHours}h
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={r.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {r.verifiedBy}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                      {r.notes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Excuse Request Modal */}
      <Modal
        isOpen={isExcuseModalOpen}
        onClose={() => setIsExcuseModalOpen(false)}
        title="Submit Absence Excuse"
        description="Provide academic or medical justification for missing a required club meeting."
      >
        <form onSubmit={handleExcuseSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event / Standup Meeting *
            </label>
            <input
              type="text"
              required
              value={excuseEvent}
              onChange={(e) => setExcuseEvent(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason & Supporting Context *
            </label>
            <textarea
              rows={3}
              required
              value={excuseReason}
              onChange={(e) => setExcuseReason(e.target.value)}
              placeholder="e.g. Midterm examination clash with CS 301, or varsity athletics competition..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsExcuseModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
            >
              Submit Excuse
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
