import React, { useState } from 'react';
import {
  ArrowDown,
  Mail,
  GraduationCap,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Member, HierarchyRole } from '../types';
import { Avatar } from '../components/common/Avatar';
import { StatusBadge } from '../components/common/StatusBadge';

interface HierarchyPageProps {
  members: Member[];
  onSelectMember: (member: Member) => void;
}

export const HierarchyPage: React.FC<HierarchyPageProps> = ({
  members,
  onSelectMember,
}) => {
  const [filterLevel, setFilterLevel] = useState<'All' | 'Executive' | 'DepartmentLeads' | 'Members'>('All');

  // Hierarchy levels
  const faculty = members.filter((m) => m.hierarchyRole === 'Faculty Advisor');
  const president = members.filter((m) => m.hierarchyRole === 'President');
  const vp = members.filter((m) => m.hierarchyRole === 'Vice President');
  const deptHeads = members.filter((m) => m.hierarchyRole === 'Department Head');
  const deptCoHeads = members.filter((m) => m.hierarchyRole === 'Department Co-Head');
  const deptMembers = members.filter((m) => m.hierarchyRole === 'Department Member');

  const MemberCard = ({ member }: { member: Member }) => (
    <div
      onClick={() => onSelectMember(member)}
      className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group text-left max-w-sm w-full mx-auto"
    >
      <div className="flex items-start gap-3">
        <Avatar
          src={member.avatarUrl}
          name={member.name}
          initials={member.initials}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
              {member.name}
            </h4>
            <StatusBadge status={member.status} size="sm" />
          </div>
          <p className="text-xs font-semibold text-indigo-600 mt-0.5 truncate">
            {member.role}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {member.department} Department
          </p>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="font-mono">{member.studentId}</span>
        <span className="font-mono tabular-nums">{member.attendanceRate}% Attendance</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Organizational Hierarchy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official chain of command from university faculty governance down to committee members.
          </p>
        </div>

        {/* Level Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          {(
            [
              { id: 'All', label: 'Complete Tree' },
              { id: 'Executive', label: 'Executive Board' },
              { id: 'DepartmentLeads', label: 'Department Leads' },
              { id: 'Members', label: 'General Body' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterLevel(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterLevel === tab.id
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Hierarchy Flow */}
      <div className="space-y-8 py-2">
        {/* Tier 1: Faculty Advisor */}
        {(filterLevel === 'All' || filterLevel === 'Executive') && (
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Level 1: Faculty Governance</span>
            </div>
            <div className="flex justify-center">
              {faculty.map((f) => (
                <MemberCard key={f.id} member={f} />
              ))}
            </div>

            <div className="flex justify-center my-4">
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-slate-300" />
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}

        {/* Tier 2: President */}
        {(filterLevel === 'All' || filterLevel === 'Executive') && (
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200">
              <span>Level 2: Club President</span>
            </div>
            <div className="flex justify-center">
              {president.map((p) => (
                <MemberCard key={p.id} member={p} />
              ))}
            </div>

            <div className="flex justify-center my-4">
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-slate-300" />
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}

        {/* Tier 3: Vice President */}
        {(filterLevel === 'All' || filterLevel === 'Executive') && (
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200">
              <span>Level 3: Vice President & General Secretariat</span>
            </div>
            <div className="flex justify-center">
              {vp.map((v) => (
                <MemberCard key={v.id} member={v} />
              ))}
            </div>

            <div className="flex justify-center my-4">
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-slate-300" />
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}

        {/* Tier 4: Department Heads */}
        {(filterLevel === 'All' || filterLevel === 'DepartmentLeads') && (
          <div>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200">
                <span>Level 4: Department Heads</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Directing technical, design, marketing, media & event operations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deptHeads.map((h) => (
                <MemberCard key={h.id} member={h} />
              ))}
            </div>

            <div className="flex justify-center my-6">
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-slate-300" />
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}

        {/* Tier 5: Department Co-Heads */}
        {(filterLevel === 'All' || filterLevel === 'DepartmentLeads') && (
          <div>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200">
                <span>Level 5: Department Co-Heads</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Operational co-leads overseeing daily execution</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deptCoHeads.map((ch) => (
                <MemberCard key={ch.id} member={ch} />
              ))}
            </div>

            <div className="flex justify-center my-6">
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-slate-300" />
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}

        {/* Tier 6: Department Members */}
        {(filterLevel === 'All' || filterLevel === 'Members') && (
          <div>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Level 6: Committee Associates & Members</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Active student contributors across all branches</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deptMembers.map((m) => (
                <MemberCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
