/**
 * TimeOffAdmin - Admin view for managing time off requests
 */

import { useState } from 'react';
import { Search, Info } from 'lucide-react';
import { getTimeOffStatusColor, getTimeOffStatusLabel } from '../utils/helpers';
import { TIME_OFF_STATUS, type TimeOffStatus, type TimeOffType } from '../utils/constants';

interface TimeOffRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  timeOffType: TimeOffType;
  status: TimeOffStatus;
}

export function TimeOffAdmin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'timeoff' | 'allocation'>('timeoff');
  const [requests, setRequests] = useState<TimeOffRequest[]>([
    {
      id: '1',
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP-2020-001',
      startDate: '28/10/2025',
      endDate: '30/10/2025',
      timeOffType: 'Paid Time Off',
      status: TIME_OFF_STATUS.PENDING,
    },
    {
      id: '2',
      employeeName: 'Michael Chen',
      employeeId: 'EMP-2020-002',
      startDate: '01/11/2025',
      endDate: '05/11/2025',
      timeOffType: 'Paid Time Off',
      status: TIME_OFF_STATUS.APPROVED,
    },
    {
      id: '3',
      employeeName: 'Emily Rodriguez',
      employeeId: 'EMP-2020-003',
      startDate: '25/10/2025',
      endDate: '25/10/2025',
      timeOffType: 'Sick Time Off',
      status: TIME_OFF_STATUS.PENDING,
    },
    {
      id: '4',
      employeeName: 'David Kim',
      employeeId: 'EMP-2020-004',
      startDate: '15/10/2025',
      endDate: '18/10/2025',
      timeOffType: 'Paid Time Off',
      status: TIME_OFF_STATUS.REJECTED,
    },
    {
      id: '5',
      employeeName: 'Jessica Martinez',
      employeeId: 'EMP-2020-005',
      startDate: '22/10/2025',
      endDate: '22/10/2025',
      timeOffType: 'Sick Time Off',
      status: TIME_OFF_STATUS.APPROVED,
    },
  ]);

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: TIME_OFF_STATUS.APPROVED } : req
    ));
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: TIME_OFF_STATUS.REJECTED } : req
    ));
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Review and manage employee leave requests
            </p>
          </div>
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6E6A7C]" />
            <input
              type="text"
              placeholder="Search employee name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#E2E0EA] rounded-lg w-80 text-[#1F1B2E] placeholder-[#6E6A7C] focus:outline-none focus:border-[#2AB7CA] focus:ring-2 focus:ring-[#2AB7CA] focus:ring-opacity-20 transition-all"
              style={{ fontSize: '14px' }}
            />
          </div>
        </div>
      </div>

      {/* Sub-Nav Tabs */}
      <div
        className="bg-[#F7F6FB] rounded-xl border border-[#E2E0EA]"
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
      >
        <div className="flex items-center px-6 border-b border-[#E2E0EA]">
          <button
            onClick={() => setActiveSubTab('timeoff')}
            className="relative py-4 px-4 transition-all duration-200"
            style={{
              color: activeSubTab === 'timeoff' ? '#4B2A6A' : '#6E6A7C',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Time Off
            {activeSubTab === 'timeoff' && (
              <div
                className="absolute bottom-0 left-0 right-0 bg-[#2AB7CA]"
                style={{ height: '2px' }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('allocation')}
            className="relative py-4 px-4 transition-all duration-200"
            style={{
              color: activeSubTab === 'allocation' ? '#4B2A6A' : '#6E6A7C',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Allocation
            {activeSubTab === 'allocation' && (
              <div
                className="absolute bottom-0 left-0 right-0 bg-[#2AB7CA]"
                style={{ height: '2px' }}
              />
            )}
          </button>
        </div>

        {activeSubTab === 'timeoff' && (
          <div className="p-6">
            {/* Summary Strip */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Paid Time Off */}
              <div className="bg-white rounded-lg p-4 border border-[#E2E0EA]">
                <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                  Paid Time Off
                </p>
                <p className="text-[#1F1B2E]" style={{ fontSize: '20px', fontWeight: 600 }}>
                  24 Days Available
                </p>
              </div>

              {/* Sick Time Off */}
              <div className="bg-white rounded-lg p-4 border border-[#E2E0EA]">
                <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                  Sick Time Off
                </p>
                <p className="text-[#1F1B2E]" style={{ fontSize: '20px', fontWeight: 600 }}>
                  07 Days Available
                </p>
              </div>
            </div>

            {/* Time Off Requests Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white border-b border-[#E2E0EA]">
                    <th
                      className="px-6 py-4 text-left text-[#1F1B2E]"
                      style={{ fontSize: '13px', fontWeight: 600 }}
                    >
                      Employee Name
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
                    <th
                      className="px-6 py-4 text-center text-[#1F1B2E]"
                      style={{ fontSize: '13px', fontWeight: 600 }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request, index) => (
                    <tr
                      key={request.id}
                      className="border-b border-[#E2E0EA] hover:bg-white transition-colors"
                      style={{
                        backgroundColor: index % 2 === 0 ? '#F7F6FB' : '#FFFFFF',
                      }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p
                            className="text-[#1F1B2E]"
                            style={{ fontSize: '14px', fontWeight: 500 }}
                          >
                            {request.employeeName}
                          </p>
                          <p className="text-[#6E6A7C]" style={{ fontSize: '12px' }}>
                            {request.employeeId}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                          {request.startDate}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                          {request.endDate}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                          {request.timeOffType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: getTimeOffStatusColor(request.status),
                              boxShadow: `0 0 4px ${getTimeOffStatusColor(request.status)}40`,
                            }}
                          />
                          <span
                            className="text-[#1F1B2E]"
                            style={{ fontSize: '13px', fontWeight: 500 }}
                          >
                            {getTimeOffStatusLabel(request.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {request.status === TIME_OFF_STATUS.PENDING ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="px-4 py-2 bg-[#2E8B57] text-white rounded-lg hover:bg-[#267347] transition-colors"
                              style={{ fontSize: '13px', fontWeight: 500 }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="px-4 py-2 bg-[#D64545] text-white rounded-lg hover:bg-[#B83838] transition-colors"
                              style={{ fontSize: '13px', fontWeight: 500 }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <span className="text-[#6E6A7C]" style={{ fontSize: '13px' }}>
                              —
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSubTab === 'allocation' && (
          <div className="p-6 text-center py-20">
            <p className="text-[#6E6A7C]" style={{ fontSize: '16px' }}>
              Allocation content coming soon...
            </p>
          </div>
        )}
      </div>

      {/* Role-Based Access Note */}
      <div className="bg-[#F7F6FB] rounded-xl p-4 border border-[#E2E0EA] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#2AB7CA] mt-0.5 flex-shrink-0" />
        <p className="text-[#6E6A7C]" style={{ fontSize: '13px', lineHeight: '1.6' }}>
          Admins and HR officers can review and approve time off requests for all employees. All
          actions are logged for audit purposes and policy compliance.
        </p>
      </div>
    </div>
  );
}
