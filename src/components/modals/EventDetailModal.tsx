import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ClubEvent, Member, Task, EventStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Avatar } from '../common/Avatar';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckSquare,
  CheckCircle2,
  Tag,
  ChevronRight,
  UserCheck,
  Building,
  Layers,
} from 'lucide-react';

interface EventDetailModalProps {
  event: ClubEvent | null;
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  tasks: Task[];
  currentUser: Member;
  onUpdateEvent: (updatedEvent: ClubEvent) => void;
  onSelectTask?: (task: Task) => void;
  onSelectMember?: (member: Member) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  members,
  tasks,
  currentUser,
  onUpdateEvent,
  onSelectTask,
  onSelectMember,
}) => {
  if (!event) return null;

  const isUserRSVPed =
    event.participatingMembers?.some(
      (m) =>
        m.toLowerCase() === currentUser.name.toLowerCase() ||
        currentUser.name.toLowerCase().includes(m.toLowerCase())
    ) || false;

  const handleToggleRSVP = () => {
    let updatedList = [...(event.participatingMembers || [])];
    let newCount = event.attendeesCount;

    if (isUserRSVPed) {
      updatedList = updatedList.filter(
        (m) =>
          m.toLowerCase() !== currentUser.name.toLowerCase() &&
          !currentUser.name.toLowerCase().includes(m.toLowerCase())
      );
      newCount = Math.max(0, newCount - 1);
    } else {
      updatedList.push(currentUser.name);
      newCount += 1;
    }

    const updated: ClubEvent = {
      ...event,
      participatingMembers: updatedList,
      attendeesCount: newCount,
    };

    onUpdateEvent(updated);
  };

  const handleStatusChange = (newStatus: EventStatus) => {
    const updated: ClubEvent = {
      ...event,
      status: newStatus,
    };
    onUpdateEvent(updated);
  };

  // Find organizer member
  const organizerMember = members.find(
    (m) =>
      m.name.toLowerCase() === event.organizer.toLowerCase() ||
      event.organizer.toLowerCase().includes(m.name.toLowerCase())
  );

  // Participating members lookup
  const participatingMembersList = (event.participatingMembers || [])
    .map((name) => {
      const found = members.find(
        (m) => m.name.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(m.name.toLowerCase())
      );
      return (
        found || {
          id: `guest-${name}`,
          name,
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
          initials: name
            .split(' ')
            .map((p) => p[0])
            .slice(0, 2)
            .join(''),
          role: 'Club Participant',
          hierarchyRole: 'Department Member' as const,
          department: event.department,
          studentId: 'ST-2026-X',
          year: 'Undergraduate',
          attendanceRate: 85,
          tasksCompleted: 4,
          workingHours: 12,
          status: 'Active' as const,
          joinDate: 'Sept 2026',
        }
      );
    });

  // Find related tasks
  const relatedTasksList = tasks.filter((t) => {
    if (event.relatedTaskIds?.includes(t.id)) return true;
    const eventKeywords = event.title.toLowerCase().split(/\s+/);
    return eventKeywords.some((kw) => kw.length > 4 && t.title.toLowerCase().includes(kw));
  });

  const percentCapacity = Math.min(
    100,
    Math.round((event.attendeesCount / Math.max(1, event.capacity)) * 100)
  );

  const allStatuses: EventStatus[] = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event.title}
      description={`${event.department} Department · ${event.date}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Top Badges & Status Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={event.status} size="md" />
            <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs">
              {event.department} Department
            </span>
            <span className="text-xs font-mono font-medium text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs">
              {event.date}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Update Status:</span>
            <select
              value={event.status}
              onChange={(e) => handleStatusChange(e.target.value as EventStatus)}
              className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900/5 cursor-pointer shadow-2xs"
            >
              {allStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-2.5 shadow-2xs">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono">
              Time & Venue
            </h4>

            <div className="flex items-start gap-2.5 text-slate-700">
              <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">
                  {event.startTime} – {event.endTime}
                </p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-700 pt-2 border-t border-slate-100">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">{event.venue}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Campus Authorized Facility</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-2.5 shadow-2xs">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono">
              Organized By
            </h4>

            <div
              onClick={() => organizerMember && onSelectMember && onSelectMember(organizerMember)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 cursor-pointer transition-colors group shadow-2xs"
            >
              <Avatar
                src={organizerMember?.avatarUrl}
                name={event.organizer}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  {event.organizer}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {event.organizerRole || `${event.department} Lead`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Event Overview & Run of Show</h4>
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 text-xs text-slate-700 leading-relaxed whitespace-pre-line shadow-2xs">
            {event.description}
          </div>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {event.tags.map((t, idx) => (
                <React.Fragment key={t}>
                  <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">{t}</span>
                  {idx < event.tags!.length - 1 && <span aria-hidden="true" className="text-slate-300">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Attendance & RSVP Summary */}
        <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-3 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Attendance & Capacity Summary
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                <strong className="font-mono text-slate-900 font-bold">{event.attendeesCount}</strong> of{' '}
                <strong className="font-mono text-slate-900 font-bold">{event.capacity}</strong> seats registered ({percentCapacity}%)
              </p>
            </div>

            {event.status !== 'Completed' && event.status !== 'Cancelled' && (
              <button
                type="button"
                onClick={handleToggleRSVP}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-xs self-start sm:self-auto ${
                  isUserRSVPed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {isUserRSVPed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Registered (Click to Cancel)</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>RSVP / Register for Event</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Capacity Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                percentCapacity >= 90 ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${percentCapacity}%` }}
            />
          </div>
        </div>

        {/* Participating Members Roster */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>Participating Members ({participatingMembersList.length})</span>
            </h4>
            <span className="text-[11px] text-slate-400">
              Registered committee delegates
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {participatingMembersList.map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectMember && onSelectMember(m as Member)}
                className="p-2.5 rounded-xl border border-slate-200/70 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-colors flex items-center gap-2.5 cursor-pointer group shadow-2xs"
              >
                <Avatar
                  src={m.avatarUrl}
                  name={m.name}
                  initials={m.initials}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {m.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tasks Section */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
              <span>Related Tasks & Deliverables ({relatedTasksList.length})</span>
            </h4>
            <span className="text-[11px] text-slate-400">
              Assigned milestones for this event
            </span>
          </div>

          {relatedTasksList.length === 0 ? (
            <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400 border border-slate-100">
              No tasks currently linked to this event.
            </div>
          ) : (
            <div className="space-y-2">
              {relatedTasksList.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onSelectTask && onSelectTask(task)}
                  className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-3 cursor-pointer group shadow-2xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <StatusBadge status={task.status} size="sm" />
                      <StatusBadge status={task.priority} size="sm" />
                      <span className="text-[11px] font-mono text-slate-500">
                        Deadline: {task.deadline}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      {task.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                    <span className="hidden sm:inline">Assigned to: <strong className="text-slate-800">{task.assignedTo}</strong></span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
