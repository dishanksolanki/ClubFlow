import React, { useState } from 'react';
import {
  Users,
  CheckSquare,
  Calendar,
  Layers,
  Wrench,
  ChevronRight,
} from 'lucide-react';
import { DepartmentInfo, Member, Task, ClubEvent } from '../types';
import { Avatar } from '../components/common/Avatar';
import { NavTab } from '../components/layout/Sidebar';

interface DepartmentsPageProps {
  departments: DepartmentInfo[];
  members: Member[];
  tasks: Task[];
  events: ClubEvent[];
  onNavigate: (tab: NavTab) => void;
  onSelectMember: (member: Member) => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  departments,
  members,
  tasks,
  events,
  onNavigate,
  onSelectMember,
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(departments[0]?.id || 'dept-tech');

  const activeDept = departments.find((d) => d.id === selectedDeptId) || departments[0];

  const deptMembers = members.filter((m) => m.department === activeDept.name);
  const deptTasks = tasks.filter((t) => t.department === activeDept.name);
  const deptEvents = events.filter((e) => e.department === activeDept.name);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Club Departments
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore specialized operational committees, team rosters, active tools, and active milestones.
        </p>
      </div>

      {/* Departments Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const isSelected = dept.id === activeDept.id;
          return (
            <div
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer bg-white shadow-2xs ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-50'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">{dept.name}</span>
                <span className="text-xs font-mono font-medium text-slate-500">
                  {dept.memberCount} members
                </span>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {dept.shortDesc}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div>
                  <span className="text-slate-400">Lead: </span>
                  <span className="font-semibold text-slate-800">{dept.leadName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-500">
                    {deptTasks.filter((t) => t.department === dept.name).length} tasks
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Department Panel */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{activeDept.name} Department</h2>
              <span className="px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-md">
                Active Committee
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {activeDept.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('Tasks')}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>View Tasks ({deptTasks.length})</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('Events')}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Events ({deptEvents.length})</span>
            </button>
          </div>
        </div>

        {/* Leadership & Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Leadership
            </span>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-slate-400">Department Head</p>
                <p className="text-sm font-bold text-slate-900">{activeDept.leadName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Department Co-Head</p>
                <p className="text-sm font-bold text-slate-900">{activeDept.coLeadName}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Operations & Metrics
            </span>
            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="p-2 bg-white rounded-md border border-slate-200">
                <p className="text-base font-bold font-mono tabular-nums text-slate-900">
                  {deptMembers.length}
                </p>
                <p className="text-[10px] text-slate-500">Members</p>
              </div>
              <div className="p-2 bg-white rounded-md border border-slate-200">
                <p className="text-base font-bold font-mono tabular-nums text-slate-900">
                  {deptTasks.length}
                </p>
                <p className="text-[10px] text-slate-500">Tasks</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>Tooling Stack</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeDept.tools.map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 text-xs font-medium bg-white border border-slate-200 rounded-md text-slate-700 font-mono"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Department Members Roster */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Department Roster</h3>
            <span className="text-xs text-slate-500">{deptMembers.length} active leads & members</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deptMembers.map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectMember(m)}
                className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    src={m.avatarUrl}
                    name={m.name}
                    initials={m.initials}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {m.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{m.role}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 shrink-0 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
