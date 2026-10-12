import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { DepartmentType, Member, WorkingHourRecord } from '../../types';

interface LogHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogHours: (record: WorkingHourRecord) => void;
  currentUser: Member;
  departments: DepartmentType[];
}

export const LogHoursModal: React.FC<LogHoursModalProps> = ({
  isOpen,
  onClose,
  onLogHours,
  currentUser,
  departments,
}) => {
  const [project, setProject] = useState('');
  const [hours, setHours] = useState('3.5');
  const [department, setDepartment] = useState<DepartmentType>(currentUser.department);
  const [date, setDate] = useState('Today, Oct 12');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numHours = parseFloat(hours);
    if (!project.trim() || isNaN(numHours) || numHours <= 0) return;

    const newRecord: WorkingHourRecord = {
      id: `wh-${Date.now()}`,
      date,
      project: project.trim(),
      description: description.trim() || 'General club operational activity.',
      hours: numHours,
      department,
      verifiedBy: 'Pending Faculty/Lead Sign-off',
      status: 'Pending Verification',
    };

    onLogHours(newRecord);
    setProject('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Working Hours"
      description="Record hours invested in club development, event staging, or workshops."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Project / Milestone Name *
          </label>
          <input
            type="text"
            required
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="e.g. HackNova Staging Infrastructure or Audio Calibration"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hours Invested *
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="24"
              required
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as DepartmentType)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Work Summary & Deliverables
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe what was completed or resolved during this session..."
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
          >
            Submit for Verification
          </button>
        </div>
      </form>
    </Modal>
  );
};
