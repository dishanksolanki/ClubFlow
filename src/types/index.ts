export type DepartmentType =
  | 'Technical'
  | 'Design'
  | 'Marketing'
  | 'Event Management'
  | 'Media'
  | 'Content';

export type TaskStatus =
  | 'Pending'
  | 'In Progress'
  | 'Submitted'
  | 'Approved'
  | 'Rejected'
  | 'Completed'
  | 'Overdue';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type EventStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';

export type HierarchyRole =
  | 'Faculty Advisor'
  | 'President'
  | 'Vice President'
  | 'Head'
  | 'Co-Head'
  | 'Department Head'
  | 'Department Co-Head'
  | 'Department Member';

export interface Member {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
  role: string;
  hierarchyRole: HierarchyRole;
  department: DepartmentType;
  studentId: string;
  year: string;
  attendanceRate: number; // percentage e.g. 92
  tasksCompleted: number;
  workingHours: number;
  status: 'Active' | 'On Leave' | 'Core Lead' | 'Probation';
  joinDate: string;
  bio?: string;
}

export interface TaskActivityEvent {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  note?: string;
}

export interface TaskSubmission {
  submittedAt: string;
  submittedBy: string;
  submissionLink?: string;
  submissionNotes?: string;
  reviewComment?: string;
  reviewStatus?: 'Pending' | 'Approved' | 'Rejected';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  department: DepartmentType;
  assignedBy: string;
  assignedTo: string;
  assignedToAvatar?: string;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  submission?: TaskSubmission;
  history?: TaskActivityEvent[];
}

export interface ClubEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  time: string;
  venue: string;
  organizer: string;
  organizerRole?: string;
  department: DepartmentType;
  status: EventStatus;
  attendeesCount: number;
  capacity: number;
  tags?: string[];
  participatingMembers?: string[];
  relatedTaskIds?: string[];
}

export interface AttendanceRecord {
  id: string;
  eventName: string;
  date: string;
  type: 'General Meeting' | 'Workshop' | 'Core Standup' | 'Event Prep' | 'Hackathon';
  status: 'Present' | 'Absent' | 'Excused';
  verifiedBy: string;
  durationHours: number;
  notes?: string;
}

export interface WorkingHourRecord {
  id: string;
  date: string;
  project: string;
  description: string;
  hours: number;
  department: DepartmentType;
  verifiedBy: string;
  status: 'Verified' | 'Pending Verification';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  authorRole: string;
  authorAvatar?: string;
  department: DepartmentType | 'General';
  date: string;
  priority: 'Normal' | 'Important' | 'Urgent';
  pinned?: boolean;
}

export interface DepartmentInfo {
  id: string;
  name: DepartmentType;
  shortDesc: string;
  description: string;
  leadName: string;
  coLeadName: string;
  memberCount: number;
  activeTasksCount: number;
  upcomingEventsCount: number;
  tools: string[];
  colorTheme: string;
}

export interface ClubNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'task' | 'event' | 'announcement' | 'attendance';
  linkTab?: string;
}
