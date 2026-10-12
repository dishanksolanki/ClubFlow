import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  Building,
  Check,
  Calendar,
  CheckSquare,
  Users,
  Megaphone,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Member, ClubNotification } from '../../types';
import { NavTab } from './Sidebar';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenMobileMenu: () => void;
  currentUser: Member;
  notifications: ClubNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onGlobalSearchSelect: (type: 'event' | 'task' | 'member' | 'announcement', id: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenMobileMenu,
  currentUser,
  notifications,
  onMarkNotificationAsRead,
  onClearAllNotifications,
  searchQuery,
  onSearchQueryChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showClubDropdown, setShowClubDropdown] = useState(false);
  const [selectedClub, setSelectedClub] = useState('ACM Student Chapter');

  const notifRef = useRef<HTMLDivElement>(null);
  const clubRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (clubRef.current && !clubRef.current.contains(event.target as Node)) {
        setShowClubDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clubsList = [
    'ACM Student Chapter',
    'Google Developer Student Club',
    'Robotics & AI Guild',
    'Product Design Society',
  ];

  const getNotifIcon = (type: ClubNotification['type']) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-3.5 h-3.5 text-blue-600" />;
      case 'task':
        return <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />;
      case 'announcement':
        return <Megaphone className="w-3.5 h-3.5 text-amber-600" />;
      case 'attendance':
        return <Users className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left zone: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Club Switcher dropdown */}
        <div className="relative" ref={clubRef}>
          <button
            type="button"
            onClick={() => setShowClubDropdown(!showClubDropdown)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <Building className="w-3.5 h-3.5 text-indigo-600" />
            <span className="truncate max-w-[140px] sm:max-w-[200px]">{selectedClub}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showClubDropdown && (
            <div className="absolute left-0 mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Organization
              </div>
              {clubsList.map((club) => (
                <button
                  key={club}
                  type="button"
                  onClick={() => {
                    setSelectedClub(club);
                    setShowClubDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left transition-colors"
                >
                  <span className={club === selectedClub ? 'font-semibold text-indigo-600' : ''}>
                    {club}
                  </span>
                  {club === selectedClub && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center text-xs text-slate-400">
          <span className="mx-2">/</span>
          <span className="font-semibold text-slate-800">{activeTab}</span>
        </div>
      </div>

      {/* Middle zone: Quick Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, events, members..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchQueryChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right zone: Notifications & User profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono tabular-nums font-semibold bg-indigo-100 text-indigo-700 rounded-md">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onClearAllNotifications}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No notifications right now
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onMarkNotificationAsRead(notif.id);
                        if (notif.linkTab) onTabChange(notif.linkTab as NavTab);
                        setShowNotifications(false);
                      }}
                      className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 text-left ${
                        !notif.read ? 'bg-indigo-50/30' : ''
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        {getNotifIcon(notif.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Pill Button */}
        <button
          type="button"
          onClick={() => onTabChange('Profile')}
          className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Avatar
            src={currentUser.avatarUrl}
            name={currentUser.name}
            initials={currentUser.initials}
            size="sm"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-none">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-slate-500 leading-none mt-1">
              {currentUser.role.split('&')[0].trim()}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};
