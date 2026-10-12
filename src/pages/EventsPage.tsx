import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Search,
  Plus,
  Clock,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { ClubEvent, DepartmentType } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

interface EventsPageProps {
  events: ClubEvent[];
  onOpenCreateEvent: () => void;
  departments: DepartmentType[];
}

export const EventsPage: React.FC<EventsPageProps> = ({
  events,
  onOpenCreateEvent,
  departments,
}) => {
  const [filterType, setFilterType] = useState<'All' | 'Upcoming' | 'Past'>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({
    'evt-201': true,
  });

  const toggleRSVP = (eventId: string) => {
    setRegisteredEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const filteredEvents = events.filter((evt) => {
    // Type filter
    if (filterType === 'Upcoming' && evt.status !== 'Upcoming' && evt.status !== 'In Progress') {
      return false;
    }
    if (filterType === 'Past' && evt.status !== 'Completed') {
      return false;
    }

    // Department filter
    if (selectedDept !== 'All' && evt.department !== selectedDept) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchVenue = evt.venue.toLowerCase().includes(q);
      const matchOrg = evt.organizer.toLowerCase().includes(q);
      if (!matchTitle && !matchVenue && !matchOrg) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Events & Workshops
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse upcoming hackathons, tech talks, design sprints, and historical campus sessions.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCreateEvent}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-2xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Event</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Segmented Timeline Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            {(['All', 'Upcoming', 'Past'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  filterType === tab
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Department Filter & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-lg">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search event or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">No events found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or department filter, or schedule a new event for the club.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredEvents.map((evt) => {
            const isRegistered = Boolean(registeredEvents[evt.id]);
            return (
              <div
                key={evt.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={evt.status} size="sm" />
                      <span className="text-xs font-semibold text-slate-700">
                        {evt.department}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {evt.date}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Organized by <strong className="text-slate-800">{evt.organizer}</strong> ({evt.organizerRole})
                      </span>
                    </div>
                  </div>

                  {evt.tags && evt.tags.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {evt.tags.map((t, idx) => (
                          <React.Fragment key={t}>
                            <span>{t}</span>
                            {idx < evt.tags.length - 1 && <span aria-hidden="true">·</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer RSVP / Capacity bar */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                      <span className="font-mono tabular-nums font-semibold">
                        {evt.attendeesCount + (isRegistered ? 1 : 0)} / {evt.capacity}
                      </span>
                      <span className="text-[11px] text-slate-400">RSVPs</span>
                    </div>
                    <div className="w-28 sm:w-36 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{
                          width: `${Math.min(100, Math.round(((evt.attendeesCount + (isRegistered ? 1 : 0)) / evt.capacity) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>

                  {evt.status !== 'Completed' && (
                    <button
                      type="button"
                      onClick={() => toggleRSVP(evt.id)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                        isRegistered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs'
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Registered</span>
                        </>
                      ) : (
                        <span>RSVP Attend</span>
                      )}
                    </button>
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
