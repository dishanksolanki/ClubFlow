import React, { useState } from 'react';
import {
  Megaphone,
  Pin,
  Calendar,
  Search,
  Filter,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { Announcement, DepartmentType } from '../types';
import { Avatar } from '../components/common/Avatar';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';

interface AnnouncementsPageProps {
  announcements: Announcement[];
  onOpenCreateAnnouncement?: () => void;
  departments?: DepartmentType[];
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({
  announcements: initialAnnouncements,
  onOpenCreateAnnouncement,
  departments,
}) => {
  const [announcementsList, setAnnouncementsList] =
    useState<Announcement[]>(initialAnnouncements);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [isInternalModalOpen, setIsInternalModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newDepartment, setNewDepartment] = useState<DepartmentType | 'General'>('General');
  const [newPriority, setNewPriority] = useState<'Normal' | 'Important' | 'Urgent'>(
    'Normal'
  );
  const [newIsPinned, setNewIsPinned] = useState(false);

  const filteredAnnouncements = announcementsList.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      priorityFilter === 'All' || a.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const pinnedAnnouncements = filteredAnnouncements.filter((a) => a.pinned);
  const regularAnnouncements = filteredAnnouncements.filter((a) => !a.pinned);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newRecord: Announcement = {
      id: `ann-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      department: newDepartment,
      date: new Date().toISOString().split('T')[0],
      postedBy: 'Alex Chen (You)',
      authorRole: 'Club President',
      priority: newPriority,
      pinned: newIsPinned,
    };

    setAnnouncementsList([newRecord, ...announcementsList]);
    setNewTitle('');
    setNewContent('');
    setNewDepartment('General');
    setNewPriority('Normal');
    setNewIsPinned(false);
    setIsInternalModalOpen(false);
  };

  const openModal = () => {
    if (onOpenCreateAnnouncement) {
      onOpenCreateAnnouncement();
    } else {
      setIsInternalModalOpen(true);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-slate-900 text-white">
              Official Feed
            </span>
            <span className="text-xs text-slate-500 font-medium">Broadcasts & Directives</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Announcements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Campus-wide communications, leadership directives, and important club updates.
          </p>
        </div>

        <button
          onClick={openModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search directives, topics, departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="Normal">Normal</option>
            <option value="Important">Important</option>
            <option value="Urgent">Urgent</option>
          </select>
          {(searchTerm || priorityFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setPriorityFilter('All');
              }}
              className="px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Pinned Section */}
      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 px-1">
            <Pin className="w-4 h-4 text-amber-600 fill-amber-500/20" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Pinned Directives ({pinnedAnnouncements.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedAnnouncements.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-xl border border-amber-200/80 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all p-5 flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={a.priority} />
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {a.department}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
                      <Pin className="w-3 h-3 fill-amber-600/30" />
                      Pinned
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {a.content}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Avatar name={a.postedBy} size="sm" src={a.authorAvatar} />
                    <div>
                      <p className="font-medium text-slate-900 leading-tight">
                        {a.postedBy}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {a.authorRole}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-[11px] font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{a.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Feed */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-slate-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Recent Broadcasts ({regularAnnouncements.length})
            </h2>
          </div>
        </div>

        {regularAnnouncements.length === 0 && pinnedAnnouncements.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              No announcements found
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              No broadcasts match your query. Clear the filters or create a new announcement.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {regularAnnouncements.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={a.priority} />
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {a.department}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 pt-1">
                      {a.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{a.date}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {a.content}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                  <Avatar name={a.postedBy} size="sm" src={a.authorAvatar} />
                  <div>
                    <span className="font-semibold text-slate-900">
                      {a.postedBy}
                    </span>
                    <span className="text-slate-400 ml-1.5">
                      • {a.authorRole}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Internal Modal fallback */}
      <Modal
        isOpen={isInternalModalOpen}
        onClose={() => setIsInternalModalOpen(false)}
        title="Broadcast New Announcement"
        description="Publish an official communication to club members and department channels."
        maxWidth="md"
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Announcement Title *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Mandatory Mid-Semester Review Meeting"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Department
              </label>
              <select
                value={newDepartment}
                onChange={(e) =>
                  setNewDepartment(
                    e.target.value as DepartmentType | 'General'
                  )
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200/90 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer"
              >
                <option value="General">General / All Club</option>
                {(departments || [
                  'Technical',
                  'Design',
                  'Marketing',
                  'Event Management',
                  'Media',
                  'Content',
                ]).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Priority Level
              </label>
              <select
                value={newPriority}
                onChange={(e) =>
                  setNewPriority(
                    e.target.value as 'Normal' | 'Important' | 'Urgent'
                  )
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200/90 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer"
              >
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Directive Body / Content *
            </label>
            <textarea
              required
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Provide complete instructions, links, deliverables, or agenda details..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPinned"
              checked={newIsPinned}
              onChange={(e) => setNewIsPinned(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <label
              htmlFor="isPinned"
              className="text-xs font-medium text-slate-700 cursor-pointer"
            >
              Pin to top of feed as high-priority directive
            </label>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsInternalModalOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Publish Announcement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
