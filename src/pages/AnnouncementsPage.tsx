import React, { useState } from 'react';
import {
  Megaphone,
  Pin,
  Search,
  Plus,
  Calendar,
  AlertTriangle,
  User,
} from 'lucide-react';
import { Announcement, DepartmentType } from '../types';
import { Avatar } from '../components/common/Avatar';

interface AnnouncementsPageProps {
  announcements: Announcement[];
  onOpenCreateAnnouncement: () => void;
  departments: DepartmentType[];
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({
  announcements,
  onOpenCreateAnnouncement,
  departments,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAnnouncements = announcements.filter((a) => {
    if (selectedDept !== 'All' && a.department !== selectedDept) return false;
    if (priorityFilter !== 'All' && a.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchContent = a.content.toLowerCase().includes(q);
      const matchAuthor = a.postedBy.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchAuthor) return false;
    }
    return true;
  });

  const pinnedList = filteredAnnouncements.filter((a) => a.pinned);
  const regularList = filteredAnnouncements.filter((a) => !a.pinned);

  const PriorityPill = ({ priority }: { priority: Announcement['priority'] }) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
            <AlertTriangle className="w-3 h-3" /> Urgent
          </span>
        );
      case 'Important':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            Important
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            Notice
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Announcements & Bulletins
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official executive memos, campus approvals, rehearsal notices, and club administrative releases.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateAnnouncement}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post Announcement</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="All">All Departments</option>
            <option value="General">General / All-Hands</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent Only</option>
            <option value="Important">Important Only</option>
            <option value="Normal">Normal</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Pinned Announcements */}
      {pinnedList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Pin className="w-3.5 h-3.5 text-indigo-600 rotate-45" />
            <span>Pinned Bulletins</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedList.map((anc) => (
              <div
                key={anc.id}
                className="bg-white rounded-xl border border-indigo-200/90 bg-linear-to-b from-indigo-50/20 to-white p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <PriorityPill priority={anc.priority} />
                      <span className="text-xs font-semibold text-slate-700">
                        {anc.department}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{anc.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {anc.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                    {anc.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={anc.authorAvatar}
                      name={anc.postedBy}
                      size="sm"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        {anc.postedBy}
                      </p>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {anc.authorRole}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Announcements */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
          <span>Recent Releases</span>
          <span className="text-slate-400 font-mono tabular-nums">{regularList.length} items</span>
        </div>

        {regularList.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-400">
            No regular announcements found.
          </div>
        ) : (
          <div className="space-y-3">
            {regularList.map((anc) => (
              <div
                key={anc.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <PriorityPill priority={anc.priority} />
                    <span className="text-xs font-semibold text-slate-700">
                      {anc.department}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-mono text-slate-400">{anc.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {anc.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {anc.content}
                  </p>
                </div>

                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-semibold text-slate-900">{anc.postedBy}</p>
                      <p className="text-[10px] text-slate-400">{anc.authorRole}</p>
                    </div>
                    <Avatar
                      src={anc.authorAvatar}
                      name={anc.postedBy}
                      size="sm"
                    />
                  </div>
                  <span className="sm:hidden text-xs text-slate-500 font-medium">
                    {anc.postedBy} ({anc.authorRole})
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
