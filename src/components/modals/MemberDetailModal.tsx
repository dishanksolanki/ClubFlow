import React from 'react';
import { Modal } from '../common/Modal';
import { Member, Task } from '../../types';
import { Avatar } from '../common/Avatar';
import { StatusBadge } from '../common/StatusBadge';
import {
  Mail,
  GraduationCap,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  CheckSquare,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface MemberDetailModalProps {
  member: Member | null;
  onClose: () => void;
  tasks?: Task[];
  onSelectTask?: (task: Task) => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  onClose,
  tasks = [],
  onSelectTask,
}) => {
  if (!member) return null;

  // Filter tasks assigned to this member
  const memberTasks = tasks.filter(
    (t) =>
      t.assignedTo.trim().toLowerCase() === member.name.trim().toLowerCase() ||
      t.assignedTo.toLowerCase().includes(member.name.toLowerCase()) ||
      member.name.toLowerCase().includes(t.assignedTo.toLowerCase())
  );

  return (
    <Modal
      isOpen={Boolean(member)}
      onClose={onClose}
      title="Member Profile"
      description={`${member.department} Department · ${member.hierarchyRole}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Profile Card Header */}
        <div className="flex items-start gap-4">
          <Avatar
            src={member.avatarUrl}
            name={member.name}
            initials={member.initials}
            size="xl"
            className="ring-4 ring-indigo-50"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-bold text-slate-900">{member.name}</h4>
              <StatusBadge status={member.status} size="sm" />
            </div>
            <p className="text-xs font-semibold text-indigo-600 mt-0.5">
              {member.role}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {member.department} Department · {member.hierarchyRole}
            </p>
          </div>
        </div>

        {/* Bio */}
        {member.bio && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 leading-relaxed">
            {member.bio}
          </div>
        )}

        {/* University & Contact details */}
        <div className="space-y-2 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <a
              href={`mailto:${member.email}`}
              className="hover:text-indigo-600 transition-colors truncate"
            >
              {member.email}
            </a>
          </div>
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
            <span>ID: <strong className="font-mono text-slate-700">{member.studentId}</strong> · {member.year}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Joined Organization: <strong>{member.joinDate}</strong></span>
          </div>
        </div>

        {/* Operational Metrics */}
        <div>
          <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Performance & Track Record
          </h5>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <Award className="w-3.5 h-3.5" />
              </div>
              <p className="text-lg font-bold font-mono tabular-nums text-slate-900">
                {member.attendanceRate}%
              </p>
              <p className="text-[10px] text-slate-500 font-medium">Attendance</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-lg font-bold font-mono tabular-nums text-slate-900">
                {member.tasksCompleted}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">Completed</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <p className="text-lg font-bold font-mono tabular-nums text-slate-900">
                {member.workingHours}h
              </p>
              <p className="text-[10px] text-slate-500 font-medium">Work Hours</p>
            </div>
          </div>
        </div>

        {/* Assigned Tasks & Statuses Section */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <h5 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
              <span>Assigned Tasks ({memberTasks.length})</span>
            </h5>
            <span className="text-[11px] text-slate-400">
              {memberTasks.filter((t) => t.status === 'Completed').length} of {memberTasks.length} finished
            </span>
          </div>

          {memberTasks.length === 0 ? (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center text-xs text-slate-400">
              No tasks currently assigned to this member.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {memberTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    if (onSelectTask) {
                      onSelectTask(task);
                    }
                  }}
                  className={`p-3 rounded-lg border border-slate-200/80 bg-white hover:border-indigo-300 hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-3 ${
                    onSelectTask ? 'cursor-pointer group' : ''
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <StatusBadge status={task.status} size="sm" />
                      <StatusBadge status={task.priority} size="sm" />
                      <span className="text-[11px] font-mono text-slate-500">
                        Due {task.deadline}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {task.title}
                    </p>
                  </div>

                  {onSelectTask && (
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 shrink-0 transition-colors" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
