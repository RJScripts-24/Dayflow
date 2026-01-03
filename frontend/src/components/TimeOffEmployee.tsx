import { useState } from 'react';
import { Plus, X, Upload, Info } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    timeOffType: 'Paid Time Off',
    startDate: '',
    endDate: '',
    allocation: '',
    attachment: null as File | null,
  });

  // Mock time off records for the employee
  const timeOffRecords: TimeOffRecord[] = [
    {
      id: '1',
      employeeName: 'John Doe',
      startDate: '28/10/2025',
      endDate: '30/10/2025',
      timeOffType: 'Paid Time Off',
      status: 'approved',
    },
    {
      id: '2',
      employeeName: 'John Doe',
      startDate: '15/11/2025',
      endDate: '20/11/2025',
      timeOffType: 'Paid Time Off',
      status: 'pending',
    },
    {
      id: '3',
      employeeName: 'John Doe',
      startDate: '05/12/2025',
      endDate: '05/12/2025',
      timeOffType: 'Sick Time Off',
      status: 'approved',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#E6A23C';
      case 'approved':
        return '#2E8B57';
      case 'rejected':
        return '#D64545';
      default:
        return '#6E6A7C';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

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
              {timeOffRecords.map((record, index) => (
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
                      {record.employeeName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                      {record.startDate}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                      {record.endDate}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                      {record.timeOffType}
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
              ))}
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
                {/* Employee (Read-only) */}
                <div>
                  <label
                    className="block text-[#6E6A7C] mb-2"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                  >
                    Employee
                  </label>
                  <input
                    type="text"
                    value="[Employee]"
                    disabled
                    className="w-full px-4 py-2.5 border border-[#E2E0EA] rounded-lg bg-[#F7F6FB] text-[#6E6A7C] cursor-not-allowed"
                    style={{ fontSize: '14px' }}
                  />
                </div>

                {/* Time Off Type */}
                <div>
                  <label
                    className="block text-[#6E6A7C] mb-2"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                  >
                    Time off Type
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-[#E2E0EA] rounded-lg text-[#2AB7CA] focus:outline-none focus:border-[#2AB7CA] focus:ring-2 focus:ring-[#2AB7CA] focus:ring-opacity-20 transition-all"
                    style={{ fontSize: '14px', fontWeight: 500 }}
                    value={formData.timeOffType}
                    onChange={(e) => setFormData({ ...formData, timeOffType: e.target.value })}
                  >
                    <option>[Paid time off]</option>
                    <option>Sick Leave</option>
                    <option>Unpaid Leave</option>
                  </select>
                </div>

                {/* Validity Period */}
                <div>
                  <label
                    className="block text-[#6E6A7C] mb-2"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                  >
                    Validity Period
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
                    />
                  </div>
                </div>

                {/* Allocation */}
                <div>
                  <label
                    className="block text-[#6E6A7C] mb-2"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                  >
                    Allocation
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value="01.00"
                      className="w-24 px-4 py-2.5 border border-[#E2E0EA] rounded-lg text-[#2AB7CA] focus:outline-none focus:border-[#2AB7CA] focus:ring-2 focus:ring-[#2AB7CA] focus:ring-opacity-20 transition-all"
                      style={{ fontSize: '14px', fontWeight: 500 }}
                      onChange={(e) => setFormData({ ...formData, allocation: e.target.value })}
                    />
                    <span className="text-[#6E6A7C]" style={{ fontSize: '14px' }}>
                      Days
                    </span>
                  </div>
                  <p className="text-[#6E6A7C] mt-1.5" style={{ fontSize: '12px' }}>
                    Auto-calculated based on validity period
                  </p>
                </div>

                {/* Attachment (Conditional) */}
                {formData.timeOffType === 'Sick Leave' && (
                  <div>
                    <label
                      className="block text-[#6E6A7C] mb-2"
                      style={{ fontSize: '13px', fontWeight: 500 }}
                    >
                      Attachment
                    </label>
                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2.5 border border-[#2AB7CA] text-[#2AB7CA] rounded-lg flex items-center gap-2 hover:bg-[#E8F5F8] transition-colors">
                        <Upload className="w-4 h-4" />
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>Upload</span>
                      </button>
                      <p className="text-[#6E6A7C]" style={{ fontSize: '13px' }}>
                        (For sick leave certificate)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="px-6 py-5 border-t border-[#E2E0EA] flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowNewRequestModal(false)}
                  className="px-5 py-2.5 text-[#6E6A7C] rounded-lg hover:bg-[#F7F6FB] transition-colors"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  Discard
                </button>
                <button
                  onClick={() => setShowNewRequestModal(false)}
                  className="px-6 py-2.5 bg-[#2AB7CA] text-white rounded-lg hover:bg-[#239BAA] transition-colors"
                  style={{ fontSize: '14px', fontWeight: 500, boxShadow: '0 2px 8px rgba(42, 183, 202, 0.2)' }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}