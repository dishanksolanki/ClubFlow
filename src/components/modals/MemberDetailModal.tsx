import React from 'react';
import { Modal } from '../common/Modal';
import { Member } from '../../types';
import { Avatar } from '../common/Avatar';
import { StatusBadge } from '../common/StatusBadge';
import { Mail, GraduationCap, Award, Calendar, CheckCircle2, Clock } from 'lucide-react';

interface MemberDetailModalProps {
  member: Member | null;
  onClose: () => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  onClose,
}) => {
  if (!member) return null;

  return (
    <Modal
      isOpen={Boolean(member)}
      onClose={onClose}
      title="Member Profile"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Profile Card Header */}
        <div className="flex items-start gap-4">
          <Avatar
            src={member.avatarUrl}
            name={member.name}
            initials={member.initials}
            size="xl"
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
            <span>ID: <strong className="font-mono">{member.studentId}</strong> · {member.year}</span>
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

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
