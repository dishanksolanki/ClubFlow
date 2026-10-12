import React, { useState } from 'react';
import {
  Search,
  Plus,
  LayoutList,
  Kanban,
  Clock,
  User,
} from 'lucide-react';
import { DepartmentType, Member, Task, TaskStatus } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Avatar } from '../components/common/Avatar';

interface TasksPageProps {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onOpenCreateTask: () => void;
  departments: DepartmentType[];
  members: Member[];
}

export const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  onUpdateTaskStatus,
  onOpenCreateTask,
  departments,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allStatuses: TaskStatus[] = [
    'Pending',
    'In Progress',
    'Submitted',
    'Approved',
    'Completed',
    'Overdue',
  ];

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (deptFilter !== 'All' && t.department !== deptFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchAssignee = t.assignedTo.toLowerCase().includes(q);
      const matchAssigner = t.assignedBy.toLowerCase().includes(q);
      if (!matchTitle && !matchAssignee && !matchAssigner) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Department Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track operational assignments, deliverables, and submissions across committees.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="Table list view"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              aria-label="Kanban board view"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenCreateTask}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="All">All Statuses</option>
            {allStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, assignee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Render Table List View */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Task</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Assigned By</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      No matching tasks found.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Title & Description */}
                      <td className="py-3.5 px-4 min-w-[240px]">
                        <p className="font-semibold text-slate-900">{t.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {t.description}
                        </p>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                        {t.department}
                      </td>

                      {/* Assigned To */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={t.assignedToAvatar}
                            name={t.assignedTo}
                            size="xs"
                          />
                          <span className="font-medium text-slate-800">{t.assignedTo}</span>
                        </div>
                      </td>

                      {/* Assigned By */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                        {t.assignedBy}
                      </td>

                      {/* Deadline */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-700">
                        {t.deadline}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={t.priority} size="sm" />
                      </td>

                      {/* Status / Interactive Changer */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={t.status}
                          onChange={(e) =>
                            onUpdateTaskStatus(t.id, e.target.value as TaskStatus)
                          }
                          className="text-xs font-semibold px-2 py-1 rounded-md border border-slate-200 bg-white hover:border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800 cursor-pointer"
                        >
                          {allStatuses.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Render Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
          {allStatuses.map((status) => {
            const columnTasks = filteredTasks.filter((t) => t.status === status);
            return (
              <div
                key={status}
                className="bg-slate-50/90 rounded-xl border border-slate-200 p-3 min-h-[350px] flex flex-col"
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-bold text-slate-800">{status}</span>
                  <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {columnTasks.length === 0 ? (
                    <div className="h-24 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[11px] text-slate-400">
                      Empty
                    </div>
                  ) : (
                    columnTasks.map((t) => (
                      <div
                        key={t.id}
                        className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-semibold text-slate-500">
                            {t.department}
                          </span>
                          <StatusBadge status={t.priority} size="sm" />
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {t.title}
                        </h4>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <div className="flex items-center gap-1.5 truncate">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{t.assignedTo.split(' ')[0]}</span>
                          </div>
                          <div className="flex items-center gap-1 font-mono text-[10px] shrink-0">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{t.deadline.split(',')[0]}</span>
                          </div>
                        </div>

                        {/* Quick state cycle */}
                        <div className="pt-1 flex justify-end">
                          <select
                            value={t.status}
                            onChange={(e) =>
                              onUpdateTaskStatus(t.id, e.target.value as TaskStatus)
                            }
                            className="text-[10px] px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700"
                          >
                            {allStatuses.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
