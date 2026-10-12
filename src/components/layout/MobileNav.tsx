import React from 'react';
import {
  X,
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
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Member } from '../../types';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentUser: Member;
  pendingTasksCount: number;
  unreadAnnouncementsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  currentUser,
  pendingTasksCount,
  unreadAnnouncementsCount,
}) => {
  if (!isOpen) return null;

  const navItems = [
    { id: 'Dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Events' as NavTab, label: 'Events', icon: Calendar },
    { id: 'Tasks' as NavTab, label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'Attendance' as NavTab, label: 'Attendance', icon: ClipboardCheck },
    { id: 'Working Hours' as NavTab, label: 'Working Hours', icon: Clock },
    { id: 'Members' as NavTab, label: 'Members', icon: Users },
    { id: 'Departments' as NavTab, label: 'Departments', icon: FolderKanban },
    { id: 'Hierarchy' as NavTab, label: 'Hierarchy', icon: GitFork },
    { id: 'Announcements' as NavTab, label: 'Announcements', icon: Megaphone, badge: unreadAnnouncementsCount },
    { id: 'Profile' as NavTab, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-lg">ClubFlow</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-xs font-mono font-semibold rounded-md ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={() => {
              onTabChange('Profile');
              onClose();
            }}
            className="flex items-center gap-3 w-full text-left"
          >
            <Avatar
              src={currentUser.avatarUrl}
              name={currentUser.name}
              initials={currentUser.initials}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500 truncate">{currentUser.role}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
