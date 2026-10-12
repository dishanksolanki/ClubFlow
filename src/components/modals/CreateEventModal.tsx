import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ClubEvent, DepartmentType, Member } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: ClubEvent) => void;
  currentUser: Member;
  departments: DepartmentType[];
  members: Member[];
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
  currentUser,
  departments,
  members,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('Nov 15, 2026');
  const [startTime, setStartTime] = useState('03:00 PM');
  const [endTime, setEndTime] = useState('05:30 PM');
  const [venue, setVenue] = useState('CS Auditorium B12');
  const [department, setDepartment] = useState<DepartmentType>('Technical');
  const [organizer, setOrganizer] = useState(currentUser.name);
  const [capacity, setCapacity] = useState('150');
  const [tagsInput, setTagsInput] = useState('Workshop, Hands-on, Campus');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedCapacity = parseInt(capacity) || 100;
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const organizerMember = members.find((m) => m.name === organizer);

    const newEvent: ClubEvent = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'No description provided.',
      date,
      startTime,
      endTime,
      time: `${startTime} - ${endTime}`,
      venue,
      organizer,
      organizerRole: organizerMember?.role || `${department} Lead`,
      department,
      status: 'Upcoming',
      attendeesCount: 1,
      capacity: parsedCapacity,
      tags: tags.length ? tags : ['Club Event'],
      participatingMembers: [organizer],
      relatedTaskIds: [],
    };

    onAddEvent(newEvent);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Club Event"
      description="Schedule a campus workshop, keynote symposium, hackathon, or general meeting."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Event Name *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Next.js 15 Full-Stack Accelerator Lab"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Date *
            </label>
            <input
              type="text"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. Nov 15, 2026"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Start Time *
            </label>
            <input
              type="text"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="e.g. 03:00 PM"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              End Time *
            </label>
            <input
              type="text"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="e.g. 05:30 PM"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Campus Venue *
            </label>
            <input
              type="text"
              required
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Maker Space Lab 3 / Room 402"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Host Department *
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as DepartmentType)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
            >
              {(departments || []).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Organized By *
            </label>
            <select
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
            >
              {(members || []).map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Max Seat Capacity
            </label>
            <input
              type="number"
              min="10"
              max="1000"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Workshop, Hands-on, Career"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Description & Run of Show Overview
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key takeaways, agenda, prerequisites, equipment needs..."
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900 resize-none"
          />
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
            Create Event
          </button>
        </div>
      </form>
    </Modal>
  );
};
