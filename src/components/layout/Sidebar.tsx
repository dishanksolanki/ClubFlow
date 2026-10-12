import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  ClipboardCheck,
  Clock,
  Users,
  FolderKanban,
  GitFork,
  Megaphone,
  User,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Member } from '../../types';

export type NavTab =
  | 'Dashboard'
  | 'Events'
  | 'Tasks'
  | 'Attendance'
  | 'Working Hours'
  | 'Members'
  | 'Departments'
  | 'Hierarchy'
  | 'Announcements'
  | 'Profile';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentUser: Member;
  pendingTasksCount: number;
  unreadAnnouncementsCount: number;
}

interface NavItemConfig {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  pendingTasksCount,
  unreadAnnouncementsCount,
}) => {
  const navItems: NavItemConfig[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Events', label: 'Events', icon: Calendar },
    { id: 'Tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'Attendance', label: 'Attendance', icon: ClipboardCheck },
    { id: 'Working Hours', label: 'Working Hours', icon: Clock },
    { id: 'Members', label: 'Members', icon: Users },
    { id: 'Departments', label: 'Departments', icon: FolderKanban },
    { id: 'Hierarchy', label: 'Hierarchy', icon: GitFork },
    { id: 'Announcements', label: 'Announcements', icon: Megaphone, badge: unreadAnnouncementsCount },
    { id: 'Profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200/90 h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Brand Zone */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 tracking-tight text-lg leading-tight">
            ClubFlow
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            Campus Club Operations
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left group ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`ml-2 px-1.5 py-0.5 text-[11px] font-mono tabular-nums font-semibold rounded-md ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Pro/Semester Info banner */}
      <div className="p-3 mx-3 mb-3 rounded-lg bg-slate-50 border border-slate-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Fall Term 2026</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-normal">
          Accredited Student Organization · 18 Active Leads
        </p>
      </div>

      {/* User profile footer */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <button
          type="button"
          onClick={() => onTabChange('Profile')}
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors text-left"
        >
          <Avatar
            src={currentUser.avatarUrl}
            name={currentUser.name}
            initials={currentUser.initials}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {currentUser.name}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {currentUser.role}
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
};
