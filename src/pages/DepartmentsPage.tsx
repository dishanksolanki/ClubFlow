import React, { useState } from 'react';
import {
  Users,
  CheckSquare,
  Calendar,
  Layers,
  Wrench,
  ChevronRight,
  ShieldCheck,
  Search,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';
import { DepartmentInfo, Member, Task, ClubEvent } from '../types';
import { Avatar } from '../components/common/Avatar';
import { StatusBadge } from '../components/common/StatusBadge';
import { NavTab } from '../components/layout/Sidebar';

interface DepartmentsPageProps {
  departments: DepartmentInfo[];
  members: Member[];
  tasks: Task[];
  events: ClubEvent[];
  onNavigate: (tab: NavTab) => void;
  onSelectMember: (member: Member) => void;
  onSelectTask?: (task: Task) => void;
  onSelectEvent?: (event: ClubEvent) => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  departments,
  members,
  tasks,
  events,
  onNavigate,
  onSelectMember,
  onSelectTask,
  onSelectEvent,
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(departments[0]?.id || 'dept-tech');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  const activeDept = departments.find((d) => d.id === selectedDeptId) || departments[0];

  const deptMembers = members.filter((m) => m.department === activeDept.name);
  const deptTasks = tasks.filter((t) => t.department === activeDept.name);
  const deptEvents = events.filter((e) => e.department === activeDept.name);

  // Department leadership member lookups
  const headMember = members.find((m) => m.name === activeDept.leadName);
  const coHeadMember = members.find((m) => m.name === activeDept.coLeadName);

  // Filter department members by search query
  const filteredDeptMembers = deptMembers.filter((m) => {
    if (!memberSearchQuery.trim()) return true;
    const q = memberSearchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.studentId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Club Departments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore committees, department heads, member rosters, active projects, and toolchains.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200/90 px-3 py-1.5 rounded-lg shadow-2xs self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>{departments.length} Operational Departments</span>
        </div>
      </div>

      {/* Departments Overview Cards (6 core departments) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const isSelected = dept.id === activeDept.id;
          const currentDeptMembers = members.filter((m) => m.department === dept.name);
          const currentDeptTasks = tasks.filter((t) => t.department === dept.name);

          return (
            <div
              key={dept.id}
              onClick={() => {
                setSelectedDeptId(dept.id);
                setMemberSearchQuery('');
              }}
              className={`p-5 rounded-xl border transition-all cursor-pointer bg-white shadow-2xs flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-50 shadow-xs'
                  : 'border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold text-slate-900">{dept.name}</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {currentDeptMembers.length} members
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {dept.shortDesc}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Head:</span>
                    <span className="font-semibold text-slate-800">{dept.leadName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Co-Head:</span>
                    <span className="font-medium text-slate-700">{dept.coLeadName}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-slate-500">
                  {currentDeptTasks.length} active tasks
                </span>
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    isSelected ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                >
                  {isSelected ? 'Viewing' : 'Open'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Selected Department Panel */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
        {/* Header bar of selected department */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {activeDept.name} Department
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
                Active Committee
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {activeDept.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('Tasks')}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>All Tasks ({deptTasks.length})</span>
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

        {/* Leadership & Department Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Department Leadership Cards */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Department Leadership
            </span>

            {/* Department Head */}
            <div
              onClick={() => headMember && onSelectMember(headMember)}
              className="flex items-center gap-3 p-2 rounded-lg bg-white border border-slate-200/80 hover:border-indigo-300 transition-colors cursor-pointer group"
            >
              <Avatar
                src={headMember?.avatarUrl}
                name={activeDept.leadName}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                  {activeDept.leadName}
                </p>
                <p className="text-[11px] text-indigo-600 font-medium truncate">Department Head</p>
              </div>
            </div>

            {/* Co-Head */}
            <div
              onClick={() => coHeadMember && onSelectMember(coHeadMember)}
              className="flex items-center gap-3 p-2 rounded-lg bg-white border border-slate-200/80 hover:border-indigo-300 transition-colors cursor-pointer group"
            >
              <Avatar
                src={coHeadMember?.avatarUrl}
                name={activeDept.coLeadName}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                  {activeDept.coLeadName}
                </p>
                <p className="text-[11px] text-slate-500 truncate">Department Co-Head</p>
              </div>
            </div>
          </div>

          {/* Department Metrics */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Operational Statistics
            </span>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <p className="text-lg font-bold font-mono tabular-nums text-slate-900">
                  {deptMembers.length}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">Members</p>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <p className="text-lg font-bold font-mono tabular-nums text-slate-900">
                  {deptTasks.length}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">Tasks</p>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <p className="text-lg font-bold font-mono tabular-nums text-slate-900">
                  {deptEvents.length}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">Events</p>
              </div>
            </div>
          </div>

          {/* Tooling Stack */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>Tooling & Environment</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeDept.tools.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 rounded-md text-slate-700 font-mono shadow-2xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Department Member List (Roster) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Department Member List ({deptMembers.length})
              </h3>
              <p className="text-xs text-slate-500">
                Students and leads currently assigned to the {activeDept.name} committee.
              </p>
            </div>

            {/* Member search inside department */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search department members..."
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDeptMembers.length === 0 ? (
              <div className="col-span-full py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-slate-100">
                No members in this department match your search.
              </div>
            ) : (
              filteredDeptMembers.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onSelectMember(m)}
                  className="p-3 rounded-xl border border-slate-200/80 hover:border-indigo-300 bg-white hover:bg-slate-50/50 transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      src={m.avatarUrl}
                      name={m.name}
                      initials={m.initials}
                      size="md"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {m.name}
                        </p>
                        <StatusBadge status={m.status} size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{m.role}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                        <span>{m.attendanceRate}% Att</span>
                        <span>·</span>
                        <span>{m.tasksCompleted} Tasks</span>
                        <span>·</span>
                        <span>{m.workingHours}h</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 shrink-0 transition-colors" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Department Tasks Preview Section */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Active Department Tasks ({deptTasks.length})
              </h3>
              <p className="text-xs text-slate-500">
                Milestones and operational tasks assigned to the {activeDept.name} committee.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('Tasks')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Open all in Tasks <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {deptTasks.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-lg text-center text-xs text-slate-400">
                No active tasks logged for this department yet.
              </div>
            ) : (
              deptTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    if (onSelectTask) {
                      onSelectTask(t);
                    } else {
                      onNavigate('Tasks');
                    }
                  }}
                  className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={t.status} size="sm" />
                      <StatusBadge status={t.priority} size="sm" />
                      <span className="text-[11px] font-mono text-slate-400">Due {t.deadline}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {t.title}
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-500 shrink-0 flex items-center gap-1.5">
                    <span>Assigned to:</span>
                    <strong className="text-slate-800">{t.assignedTo}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Department Events Section */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Department Events & Workshops ({deptEvents.length})
              </h3>
              <p className="text-xs text-slate-500">
                Initiatives, keynotes, and hackathons hosted by the {activeDept.name} department.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('Events')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Open all in Events <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {deptEvents.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-lg text-center text-xs text-slate-400">
                No events currently scheduled under this department.
              </div>
            ) : (
              deptEvents.map((e) => (
                <div
                  key={e.id}
                  onClick={() => {
                    if (onSelectEvent) {
                      onSelectEvent(e);
                    } else {
                      onNavigate('Events');
                    }
                  }}
                  className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <StatusBadge status={e.status} size="sm" />
                      <span className="text-[11px] font-mono text-slate-500">{e.date}</span>
                      <span className="text-[11px] font-mono text-slate-400">· {e.startTime} – {e.endTime}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {e.title}
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-500 shrink-0 flex items-center gap-3">
                    <span>Venue: <strong className="text-slate-700">{e.venue}</strong></span>
                    <span>RSVPs: <strong className="text-slate-700">{e.attendeesCount}/{e.capacity}</strong></span>
                    <span className="text-indigo-600 font-semibold group-hover:underline">View Details →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
