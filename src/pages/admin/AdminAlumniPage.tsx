import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Student, GraduationStatus } from '../../types/index.ts';
import { useToast } from '../../context/ToastContext.tsx';
import {
  GraduationCap,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface AdminAlumniPageProps {
  navigate: (path: string) => void;
}

export const AdminAlumniPage: React.FC<AdminAlumniPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAllStudents();
      if (res.success) {
        setStudents(res.students);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStatusChange = async (studentId: string, status: GraduationStatus) => {
    try {
      const res = await api.updateStudentStatus(studentId, status);
      if (res.success) {
        success(
          'Graduation Clearance Updated',
          `Student ${res.student.name} marked as ${status}`
        );
        fetchStudents();
      }
    } catch (err: any) {
      error('Update failed', err.message);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesStatus = filterStatus === 'ALL' || s.graduationStatus === filterStatus;
    const matchesQuery =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.branch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/admin')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Suite</span>
      </button>

      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              College Convocation & Student Database
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
              {students.length} Total Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official academic clearance registry controlling alumni activation eligibility.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, enrollment no, or branch..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
          />
        </div>

        <div className="flex gap-2">
          {['ALL', 'COMPLETE', 'IN_PROGRESS', 'BACKLOG_PENDING'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                filterStatus === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-4">Enrollment No</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Degree & Branch</th>
                <th className="p-4">Class Year</th>
                <th className="p-4">CGPA</th>
                <th className="p-4">Alumni ID</th>
                <th className="p-4">Graduation Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Loading student database records...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No matching student records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{st.enrollmentNo}</td>
                    <td className="p-4 font-semibold text-slate-900">{st.name}</td>
                    <td className="p-4 text-slate-600">{st.branch} ({st.degree})</td>
                    <td className="p-4 text-slate-600">{st.graduationYear}</td>
                    <td className="p-4 font-bold text-indigo-600">{st.cgpa}</td>
                    <td className="p-4">
                      {st.isAlumniActivated ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Activated
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Not Activated</span>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        id={`student-status-${st.id}`}
                        value={st.graduationStatus}
                        onChange={(e) =>
                          handleStatusChange(st.id, e.target.value as GraduationStatus)
                        }
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer ${
                          st.graduationStatus === 'COMPLETE'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : st.graduationStatus === 'IN_PROGRESS'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="COMPLETE">COMPLETE (Eligible)</option>
                        <option value="IN_PROGRESS">IN PROGRESS (Ineligible)</option>
                        <option value="BACKLOG_PENDING">BACKLOG PENDING (Ineligible)</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
