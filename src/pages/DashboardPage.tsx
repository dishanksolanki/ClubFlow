import React from 'react';
import {
  Calendar,
  CheckSquare,
  Clock,
  Award,
  ArrowUpRight,
  Plus,
  ChevronRight,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Member, Task, ClubEvent, WorkingHourRecord, Announcement } from '../types';
import { Avatar } from '../components/common/Avatar';
import { StatusBadge } from '../components/common/StatusBadge';
import { NavTab } from '../components/layout/Sidebar';

interface DashboardPageProps {
  currentUser: Member;
  tasks: Task[];
  events: ClubEvent[];
  workingHours: WorkingHourRecord[];
  announcements: Announcement[];
  onNavigate: (tab: NavTab) => void;
  onOpenCreateTask: () => void;
  onOpenLogHours: () => void;
  onOpenCreateAnnouncement: () => void;
  onOpenCreateEvent: () => void;
  onSelectMember: (memberId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  tasks,
  events,
  announcements,
  onNavigate,
  onOpenCreateTask,
  onOpenLogHours,
  onOpenCreateAnnouncement,
  onOpenCreateEvent,
}) => {
  const pendingTasks = tasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress');
  const completedTasks = tasks.filter((t) => t.status === 'Completed' || t.status === 'Approved');
  const upcomingEvents = events.filter((e) => e.status === 'Upcoming' || e.status === 'In Progress').slice(0, 3);
  const myTasks = tasks.filter((t) => t.assignedTo === currentUser.name || t.assignedTo.includes('Dishank'));

  return (
    <div className="space-y-6">
      {/* Welcome Section & Quick Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fall Term 2026 · Executive Workspace</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, {currentUser.name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Here is your club operations summary. 2 upcoming events need equipment sign-off, and 1 high-priority task is nearing deadline.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenLogHours}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Log Hours</span>
            </button>
            <button
              type="button"
              onClick={onOpenCreateTask}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>New Task</span>
            </button>
            <button
              type="button"
              onClick={onOpenCreateAnnouncement}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>Announcement</span>
            </button>
            <button
              type="button"
              onClick={onOpenCreateEvent}
              className="px-3 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (4 Statistics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance */}
        <div
          onClick={() => onNavigate('Attendance')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">Attendance Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              87%
            </span>
            <span className="text-xs text-emerald-600 font-medium">14 of 16 sessions</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            <span>Required min: 75%</span>
            <span className="group-hover:text-indigo-600 font-medium flex items-center gap-0.5 transition-colors">
              View Log <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div
          onClick={() => onNavigate('Tasks')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">Pending Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {pendingTasks.length}
            </span>
            <span className="text-xs text-amber-600 font-medium">1 due today</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            <span>Across 4 departments</span>
            <span className="group-hover:text-indigo-600 font-medium flex items-center gap-0.5 transition-colors">
              Manage <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div
          onClick={() => onNavigate('Tasks')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">Completed Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              18
            </span>
            <span className="text-xs text-indigo-600 font-medium">+3 this week</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            <span>94% on-time rate</span>
            <span className="group-hover:text-indigo-600 font-medium flex items-center gap-0.5 transition-colors">
              History <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Working Hours */}
        <div
          onClick={() => onNavigate('Working Hours')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">Working Hours</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              32h
            </span>
            <span className="text-xs text-blue-600 font-medium">Goal: 40h/term</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            <span>80% target attained</span>
            <span className="group-hover:text-indigo-600 font-medium flex items-center gap-0.5 transition-colors">
              Log Details <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Events & Task Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Events Box */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Upcoming Events</h2>
                <p className="text-xs text-slate-500">Official club workshops, keynotes, and competitions</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('Events')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => onNavigate('Events')}
                  className="p-4 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={evt.status} size="sm" />
                        <span className="text-xs text-slate-500 font-medium">{evt.department}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {evt.title}
                      </h3>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-xs font-semibold text-slate-800 font-mono">
                        {evt.date}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {evt.time}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-slate-600 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{evt.attendeesCount} / {evt.capacity} seats filled</span>
                      <span className="text-indigo-600 font-medium">Lead: {evt.organizer.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Progress (Assigned to Me) */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Assigned To Me</h2>
                <p className="text-xs text-slate-500">Active tasks requiring your technical review or submission</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('Tasks')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Go to Tasks <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {myTasks.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No active tasks assigned to you.</p>
              ) : (
                myTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onNavigate('Tasks')}
                    className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-white transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={t.status} size="sm" />
                        <StatusBadge status={t.priority} size="sm" />
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500">Due {t.deadline}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {t.title}
                      </p>
                    </div>
                    <div className="text-xs text-slate-500 shrink-0">
                      Assigned by <strong className="text-slate-700 font-medium">{t.assignedBy}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Recent Activity & Latest Announcements */}
        <div className="space-y-6">
          {/* Latest Announcements */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Announcements</h2>
              <button
                type="button"
                onClick={() => onNavigate('Announcements')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View board
              </button>
            </div>

            <div className="space-y-3.5">
              {announcements.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  onClick={() => onNavigate('Announcements')}
                  className="p-3 rounded-lg bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-sm ${
                      a.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {a.priority}
                    </span>
                    <span className="text-[11px] text-slate-400">{a.date}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {a.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {a.content}
                  </p>
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Avatar
                      src={a.authorAvatar}
                      name={a.postedBy}
                      size="xs"
                    />
                    <span>{a.postedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Club Activity Feed */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">Recent Activity</h2>
            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
              <div className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white" />
                <p className="text-xs text-slate-800 font-semibold">HackNova Registration Portal</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Dishank logged 4.5 hours of frontend integration.</p>
                <span className="text-[10px] text-slate-400">2 hours ago</span>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                <p className="text-xs text-slate-800 font-semibold">Venue Sanction Approved</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Sophia secured Dean approval for Central Atrium.</p>
                <span className="text-[10px] text-slate-400">5 hours ago</span>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                <p className="text-xs text-slate-800 font-semibold">Autonomous Rover Demo</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Aryan & Hardware team marked attendance for 85 members.</p>
                <span className="text-[10px] text-slate-400">Yesterday</span>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-purple-600 ring-4 ring-white" />
                <p className="text-xs text-slate-800 font-semibold">New Asset Kit Published</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Mira added 3D isometric vectors to Design drive.</p>
                <span className="text-[10px] text-slate-400">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
