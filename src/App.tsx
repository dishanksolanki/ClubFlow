import React, { useState } from 'react';
import { NavTab, Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { EventsPage } from './pages/EventsPage';
import { TasksPage } from './pages/TasksPage';
import { AttendancePage } from './pages/AttendancePage';
import { WorkingHoursPage } from './pages/WorkingHoursPage';
import { MembersPage } from './pages/MembersPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { HierarchyPage } from './pages/HierarchyPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ProfilePage } from './pages/ProfilePage';

// Modals
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { LogHoursModal } from './components/modals/LogHoursModal';
import { CreateAnnouncementModal } from './components/modals/CreateAnnouncementModal';
import { CreateEventModal } from './components/modals/CreateEventModal';
import { MemberDetailModal } from './components/modals/MemberDetailModal';
import { TaskDetailModal } from './components/modals/TaskDetailModal';
import { EventDetailModal } from './components/modals/EventDetailModal';

// Mock Data
import {
  CURRENT_USER,
  MEMBERS,
  DEPARTMENTS,
  TASKS,
  EVENTS,
  ATTENDANCE_HISTORY,
  WORKING_HOURS_LOG,
  ANNOUNCEMENTS,
  NOTIFICATIONS,
} from './data/mockData';

import {
  DepartmentType,
  Member,
  Task,
  TaskStatus,
  ClubEvent,
  WorkingHourRecord,
  Announcement,
  ClubNotification,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('Dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Core application states
  const [currentUser, setCurrentUser] = useState<Member>(CURRENT_USER);
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [events, setEvents] = useState<ClubEvent[]>(EVENTS);
  const [workingHours, setWorkingHours] = useState<WorkingHourRecord[]>(WORKING_HOURS_LOG);
  const [announcements, setAnnouncements] = useState<Announcement[]>(ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<ClubNotification[]>(NOTIFICATIONS);

  // Modal visibility states
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isLogHoursOpen, setIsLogHoursOpen] = useState(false);
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<ClubEvent | null>(null);

  const departmentsList: DepartmentType[] = [
    'Technical',
    'Design',
    'Marketing',
    'Event Management',
    'Media',
    'Content',
  ];

  // Actions
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newEvent = {
            id: `act-${Date.now()}`,
            action: `Status changed to ${newStatus}`,
            actor: currentUser.name,
            timestamp: 'Just now',
          };
          return {
            ...t,
            status: newStatus,
            history: [...(t.history || []), newEvent],
          };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
    // Also push a notification
    const notif: ClubNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Task Created',
      message: `"${newTask.title}" assigned to ${newTask.assignedTo}.`,
      timestamp: 'Just now',
      read: false,
      type: 'task',
      linkTab: 'Tasks',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleLogHours = (record: WorkingHourRecord) => {
    setWorkingHours((prev) => [record, ...prev]);
    // update current user hours
    setCurrentUser((prev) => ({
      ...prev,
      workingHours: prev.workingHours + record.hours,
    }));
  };

  const handleAddAnnouncement = (newAnnouncement: Announcement) => {
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    const notif: ClubNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Announcement',
      message: `"${newAnnouncement.title}" posted by ${newAnnouncement.postedBy}.`,
      timestamp: 'Just now',
      read: false,
      type: 'announcement',
      linkTab: 'Announcements',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleAddEvent = (newEvent: ClubEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    const notif: ClubNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Event Scheduled',
      message: `"${newEvent.title}" on ${newEvent.date} at ${newEvent.venue}.`,
      timestamp: 'Just now',
      read: false,
      type: 'event',
      linkTab: 'Events',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleUpdateEvent = (updatedEvent: ClubEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
    if (selectedEventForDetail?.id === updatedEvent.id) {
      setSelectedEventForDetail(updatedEvent);
    }
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleUpdateCurrentUser = (updated: Partial<Member>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectMemberById = (id: string) => {
    const found = members.find((m) => m.id === id || m.name.includes(id));
    if (found) setSelectedMember(found);
  };

  // Pending counts for sidebar badges
  const pendingTasksCount = tasks.filter(
    (t) => t.status === 'Pending' || t.status === 'In Progress' || t.status === 'Rejected'
  ).length;

  const unreadAnnouncementsCount = notifications.filter(
    (n) => !n.read && n.type === 'announcement'
  ).length;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        pendingTasksCount={pendingTasksCount}
        unreadAnnouncementsCount={unreadAnnouncementsCount}
      />

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        pendingTasksCount={pendingTasksCount}
        unreadAnnouncementsCount={unreadAnnouncementsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          currentUser={currentUser}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onClearAllNotifications={handleClearAllNotifications}
          onGlobalSearchSelect={(type, id) => {
            if (type === 'event') {
              const found = events.find((e) => e.id === id);
              if (found) setSelectedEventForDetail(found);
            } else if (type === 'task') {
              const found = tasks.find((t) => t.id === id);
              if (found) setSelectedTaskForDetail(found);
            } else if (type === 'member') {
              const found = members.find((m) => m.id === id);
              if (found) setSelectedMember(found);
            }
          }}
          searchQuery={globalSearchQuery}
          onSearchQueryChange={setGlobalSearchQuery}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'Dashboard' && (
            <DashboardPage
              currentUser={currentUser}
              tasks={tasks}
              events={events}
              workingHours={workingHours}
              announcements={announcements}
              onNavigate={setActiveTab}
              onOpenCreateTask={() => setIsCreateTaskOpen(true)}
              onOpenLogHours={() => setIsLogHoursOpen(true)}
              onOpenCreateAnnouncement={() => setIsCreateAnnouncementOpen(true)}
              onOpenCreateEvent={() => setIsCreateEventOpen(true)}
              onSelectMember={handleSelectMemberById}
              onSelectEvent={(event) => setSelectedEventForDetail(event)}
            />
          )}

          {activeTab === 'Events' && (
            <EventsPage
              events={events}
              onOpenCreateEvent={() => setIsCreateEventOpen(true)}
              departments={departmentsList}
              members={members}
              tasks={tasks}
              currentUser={currentUser}
              onUpdateEvent={handleUpdateEvent}
              onSelectTask={(task) => {
                setSelectedEventForDetail(null);
                setSelectedTaskForDetail(task);
              }}
              onSelectMember={(member) => {
                setSelectedEventForDetail(null);
                setSelectedMember(member);
              }}
              onSelectEvent={(event) => setSelectedEventForDetail(event)}
            />
          )}

          {activeTab === 'Tasks' && (
            <TasksPage
              tasks={tasks}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onUpdateTask={handleUpdateTask}
              onOpenCreateTask={() => setIsCreateTaskOpen(true)}
              departments={departmentsList}
              members={members}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'Attendance' && (
            <AttendancePage
              records={ATTENDANCE_HISTORY}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'Working Hours' && (
            <WorkingHoursPage
              records={workingHours}
              currentUser={currentUser}
              onOpenLogHours={() => setIsLogHoursOpen(true)}
            />
          )}

          {activeTab === 'Members' && (
            <MembersPage
              members={members}
              departments={departmentsList}
              tasks={tasks}
              onSelectMember={(m) => setSelectedMember(m)}
            />
          )}

          {activeTab === 'Departments' && (
            <DepartmentsPage
              departments={DEPARTMENTS}
              members={members}
              tasks={tasks}
              events={events}
              onNavigate={setActiveTab}
              onSelectMember={(m) => setSelectedMember(m)}
              onSelectTask={(task) => setSelectedTaskForDetail(task)}
              onSelectEvent={(event) => setSelectedEventForDetail(event)}
            />
          )}

          {activeTab === 'Hierarchy' && (
            <HierarchyPage
              members={members}
              onSelectMember={(m) => setSelectedMember(m)}
            />
          )}

          {activeTab === 'Announcements' && (
            <AnnouncementsPage
              announcements={announcements}
              onOpenCreateAnnouncement={() => setIsCreateAnnouncementOpen(true)}
              departments={departmentsList}
            />
          )}

          {activeTab === 'Profile' && (
            <ProfilePage
              currentUser={currentUser}
              onUpdateCurrentUser={handleUpdateCurrentUser}
              myTasks={tasks.filter((t) => t.assignedTo === currentUser.name || t.assignedTo.includes('Dishank'))}
              myHours={workingHours}
            />
          )}
        </main>
      </div>

      {/* Interactive Global Modals */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onAddTask={handleAddTask}
        members={members}
        departments={departmentsList}
        currentUser={currentUser}
      />

      <LogHoursModal
        isOpen={isLogHoursOpen}
        onClose={() => setIsLogHoursOpen(false)}
        onLogHours={handleLogHours}
        currentUser={currentUser}
        departments={departmentsList}
      />

      <CreateAnnouncementModal
        isOpen={isCreateAnnouncementOpen}
        onClose={() => setIsCreateAnnouncementOpen(false)}
        onAddAnnouncement={handleAddAnnouncement}
        currentUser={currentUser}
        departments={departmentsList}
      />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onAddEvent={handleAddEvent}
        currentUser={currentUser}
        departments={departmentsList}
        members={members}
      />

      <MemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        tasks={tasks}
        onSelectTask={(task) => {
          setSelectedMember(null);
          setSelectedTaskForDetail(task);
        }}
      />

      <TaskDetailModal
        task={selectedTaskForDetail}
        isOpen={Boolean(selectedTaskForDetail)}
        onClose={() => setSelectedTaskForDetail(null)}
        currentUser={currentUser}
        onUpdateTask={(updatedTask) => {
          handleUpdateTask(updatedTask);
          setSelectedTaskForDetail(updatedTask);
        }}
      />

      <EventDetailModal
        event={selectedEventForDetail}
        isOpen={Boolean(selectedEventForDetail)}
        onClose={() => setSelectedEventForDetail(null)}
        members={members}
        tasks={tasks}
        currentUser={currentUser}
        onUpdateEvent={handleUpdateEvent}
        onSelectTask={(task) => {
          setSelectedEventForDetail(null);
          setSelectedTaskForDetail(task);
        }}
        onSelectMember={(member) => {
          setSelectedEventForDetail(null);
          setSelectedMember(member);
        }}
      />
    </div>
  );
}
