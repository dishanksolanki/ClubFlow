import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Announcement, DepartmentType, Member } from '../../types';

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAnnouncement: (announcement: Announcement) => void;
  currentUser: Member;
  departments: DepartmentType[];
}

export const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onAddAnnouncement,
  currentUser,
  departments,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [department, setDepartment] = useState<DepartmentType | 'General'>('General');
  const [priority, setPriority] = useState<'Normal' | 'Important' | 'Urgent'>('Normal');
  const [pinned, setPinned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newAnnouncement: Announcement = {
      id: `anc-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      postedBy: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatarUrl,
      department,
      date: 'Just now',
      priority,
      pinned,
    };

    onAddAnnouncement(newAnnouncement);
    setTitle('');
    setContent('');
    setPinned(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post Club Announcement"
      description="Broadcast an important operational update or notice to club members."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Announcement Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Mandatory Standup: Final Prep for HackNova 2026"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as DepartmentType | 'General')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
            >
              <option value="General">All Members (General)</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d} Department
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'Normal' | 'Important' | 'Urgent')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
            >
              <option value="Normal">Normal</option>
              <option value="Important">Important</option>
              <option value="Urgent">Urgent Alert</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Message Body *
          </label>
          <textarea
            rows={4}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write clear instructions, dates, venue locations, or deadlines..."
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900 resize-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="pinned-checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="pinned-checkbox" className="text-xs font-medium text-slate-700 cursor-pointer">
            Pin to top of Announcements board
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
          >
            Publish Announcement
          </button>
        </div>
      </form>
    </Modal>
  );
};
