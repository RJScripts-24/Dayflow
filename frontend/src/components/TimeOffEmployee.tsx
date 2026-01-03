import { useState, useEffect } from 'react';
import { Plus, X, Upload, Info } from 'lucide-react';
import { EmployeeService } from '../services';
import type { Leave } from '../types/api.types';

interface TimeOffRecord {
  id: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  timeOffType: 'Paid Time Off' | 'Sick Time Off';
  status: 'pending' | 'approved' | 'rejected';
}

export function TimeOffEmployee() {
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [timeOffRecords, setTimeOffRecords] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
    attachment: null as File | null,
  });

  // Fetch leaves on component mount
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const leaves = await EmployeeService.getMyLeaves();
      setTimeOffRecords(leaves);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching leaves:', err);
      setError(err.response?.data?.message || 'Failed to fetch leave records');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLeave = async () => {
    try {
      if (!formData.startDate || !formData.endDate || !formData.reason) {
        alert('Please fill all required fields');
        return;
      }

      setLoading(true);
      await EmployeeService.applyLeave({
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      });

      // Reset form
      setFormData({
        leaveType: 'Casual Leave',
        startDate: '',
        endDate: '',
        reason: '',
        attachment: null,
      });
      
      setShowNewRequestModal(false);
      fetchLeaves(); // Refresh the list
      alert('Leave request submitted successfully!');
    } catch (err: any) {
      console.error('Error submitting leave:', err);
      alert(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'pending':
        return '#E6A23C';
      case 'Approved':
      case 'approved':
        return '#2E8B57';
      case 'Rejected':
      case 'rejected':
        return '#D64545';
      default:
        return '#6E6A7C';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'pending':
        return 'Pending';
      case 'Approved':
      case 'approved':
        return 'Approved';
      case 'Rejected':
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  if (loading && timeOffRecords.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#6E6A7C]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div
        className="bg-[#F7F6FB] rounded-xl p-6 border border-[#E2E0EA]"
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#1F1B2E] mb-1" style={{ fontSize: '24px', fontWeight: 600 }}>
              Time Off
            </h1>
            <p className="text-[#6E6A7C]" style={{ fontSize: '14px' }}>
              Your leave records and balances
            </p>
          </div>
          {/* New Request Button */}
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="px-5 py-2.5 bg-[#2AB7CA] text-white rounded-lg flex items-center gap-2 hover:bg-[#239BAA] transition-all duration-200"
            style={{ fontSize: '14px', fontWeight: 500, boxShadow: '0 2px 8px rgba(42, 183, 202, 0.15)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(42, 183, 202, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(42, 183, 202, 0.15)';
            }}
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>
      </div>

      {/* Leave Balance Summary */}
      <div className="grid grid-cols-2 gap-4">
        {/* Paid Time Off */}
        <div
          className="bg-white rounded-xl p-6 border border-[#E2E0EA]"
          style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
        >
          <p className="text-[#6E6A7C] mb-2" style={{ fontSize: '13px', fontWeight: 500 }}>
            Paid Time Off
          </p>
          <p className="text-[#1F1B2E]" style={{ fontSize: '24px', fontWeight: 600 }}>
            24 Days Available
          </p>
        </div>

        {/* Sick Time Off */}
        <div
          className="bg-white rounded-xl p-6 border border-[#E2E0EA]"
          style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
        >
          <p className="text-[#6E6A7C] mb-2" style={{ fontSize: '13px', fontWeight: 500 }}>
            Sick Time Off
          </p>
          <p className="text-[#1F1B2E]" style={{ fontSize: '24px', fontWeight: 600 }}>
            07 Days Available
          </p>
        </div>
      </div>

      {/* Time Off History Table */}
      <div
        className="bg-[#F7F6FB] rounded-xl border border-[#E2E0EA] overflow-hidden"
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white border-b border-[#E2E0EA]">
                <th
                  className="px-6 py-4 text-left text-[#1F1B2E]"
                  style={{ fontSize: '13px', fontWeight: 600 }}
                >
                  Name
                </th>
                <th
                  className="px-6 py-4 text-center text-[#1F1B2E]"
                  style={{ fontSize: '13px', fontWeight: 600 }}
                >
                  Start Date
                </th>
                <th
                  className="px-6 py-4 text-center text-[#1F1B2E]"
                  style={{ fontSize: '13px', fontWeight: 600 }}
                >
                  End Date
                </th>
                <th
                  className="px-6 py-4 text-center text-[#1F1B2E]"
                  style={{ fontSize: '13px', fontWeight: 600 }}
                >
                  Time Off Type
                </th>
                <th
                  className="px-6 py-4 text-center text-[#1F1B2E]"
                  style={{ fontSize: '13px', fontWeight: 600 }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {timeOffRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <span className="text-[#6E6A7C]" style={{ fontSize: '14px' }}>
                      No leave records found. Submit a request to get started.
                    </span>
                  </td>
                </tr>
              ) : (
                timeOffRecords.map((record, index) => (
                  <tr
                    key={record.id}
                    className="border-b border-[#E2E0EA] hover:bg-white transition-colors"
                    style={{
                      backgroundColor: index % 2 === 0 ? '#F7F6FB' : '#FFFFFF',
                    }}
                  >
                    <td className="px-6 py-4">
                      <span
                        className="text-[#1F1B2E]"
                        style={{ fontSize: '14px', fontWeight: 500 }}
                      >
                        You
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                        {formatDate(record.startDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                        {formatDate(record.endDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                        {record.leaveType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: getStatusColor(record.status),
                            boxShadow: `0 0 4px ${getStatusColor(record.status)}40`,
                          }}
                        />
                        <span
                          className="text-[#1F1B2E]"
                          style={{ fontSize: '13px', fontWeight: 500 }}
                        >
                          {getStatusLabel(record.status)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal (placeholder) */}
      {showNewRequestModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(75, 42, 106, 0.4)' }}
          onClick={() => setShowNewRequestModal(false)}
        >
          <div className="flex items-center gap-6 max-w-4xl w-full">
            {/* Main Modal */}
            <div
              className="bg-white rounded-2xl w-full max-w-lg border border-[#E2E0EA]"
              style={{ boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-[#E2E0EA] flex items-center justify-between">
                <h2 className="text-[#1F1B2E]" style={{ fontSize: '20px', fontWeight: 600 }}>
                  Time off Type Request
                </h2>
                <button
                  onClick={() => setShowNewRequestModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F7F6FB] transition-colors"
                >
                  <X className="w-5 h-5 text-[#6E6A7C]" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-6 space-y-5">
                {/* Time Off Type */}
                <div>
                  <label
                    className="block text-[#6E6A7C] mb-2"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                  >
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-[#E2E0EA] rounded-lg text-[#2AB7CA] focus:outline-none focus:border-[#2AB7CA] focus:ring-2 focus:ring-[#2AB7CA] focus:ring-opacity-20 transition-all"
                    style={{ fontSize: '14px', fontWeight: 500 }}
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  >
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Earned Leave">Earned Leave</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                  </select>
                </div>

                {/* Validity Period */}
                <div>
                  <label
                    className="block text-[#6E6A7C] mb-2"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                  >
                    Leave Period <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="date"
                      className="flex-1 px-4 py-2.5 border border-[#E2E0EA] rounded-lg text-[#2AB7CA] focus:outline-none focus:border-[#2AB7CA] focus:ring-2 focus:ring-[#2AB7CA] focus:ring-opacity-20 transition-all"
                      style={{ fontSize: '14px', fontWeight: 500 }}
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                    <span className="text-[#6E6A7C]" style={{ fontSize: '14px' }}>
                      To
                    </span>
                    <input
                      type="date"
                      className="flex-1 px-4 py-2.5 border border-[#E2E0EA] rounded-lg text-[#2AB7CA] focus:outline-none focus:border-[#2AB7CA] focus:ring-2 focus:ring-[#2AB7CA] focus:ring-opacity-20 transition-all"
                      style={{ fontSize: '14px', fontWeight: 500 }}
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      min={formData.startDate}
                    />
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label
                    className="block text-[#6E6A7C] mb-2"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                  >
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2.5 border border-[#E2E0EA] rounded-lg text-[#1F1B2E] focus:outline-none focus:border-[#2AB7CA] focus:ring-2 focus:ring-[#2AB7CA] focus:ring-opacity-20 transition-all resize-none"
                    style={{ fontSize: '14px' }}
                    placeholder="Please explain the reason for your leave request..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                </div>

                {/* Attachment (Optional) */}
                {formData.leaveType === 'Sick Leave' && (
                  <div>
                    <label
                      className="block text-[#6E6A7C] mb-2"
                      style={{ fontSize: '13px', fontWeight: 500 }}
                    >
                      Attachment (Optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2.5 border border-[#2AB7CA] text-[#2AB7CA] rounded-lg flex items-center gap-2 hover:bg-[#E8F5F8] transition-colors">
                        <Upload className="w-4 h-4" />
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>Upload</span>
                      </button>
                      <p className="text-[#6E6A7C]" style={{ fontSize: '13px' }}>
                        Medical certificate or doctor's note
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="px-6 py-5 border-t border-[#E2E0EA] flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowNewRequestModal(false);
                    setFormData({
                      leaveType: 'Casual Leave',
                      startDate: '',
                      endDate: '',
                      reason: '',
                      attachment: null,
                    });
                  }}
                  disabled={loading}
                  className="px-5 py-2.5 text-[#6E6A7C] rounded-lg hover:bg-[#F7F6FB] transition-colors disabled:opacity-50"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitLeave}
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#2AB7CA] text-white rounded-lg hover:bg-[#239BAA] transition-colors disabled:opacity-50"
                  style={{ fontSize: '14px', fontWeight: 500, boxShadow: '0 2px 8px rgba(42, 183, 202, 0.2)' }}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}