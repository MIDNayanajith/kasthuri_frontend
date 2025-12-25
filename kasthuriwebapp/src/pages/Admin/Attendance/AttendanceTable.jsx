// AttendanceTable.jsx
import React from "react";
import {
  Edit2,
  Trash2,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const AttendanceTable = ({
  attendanceRecords,
  onEditAttendance,
  onDeleteAttendance,
  loading,
}) => {
  const [expandedRows, setExpandedRows] = React.useState({});

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[150px] bg-gray-50">
                  Recipient
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px] bg-gray-50">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] bg-gray-50">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] bg-gray-50">
                  Times
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] bg-gray-50">
                  Total Hours
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px] bg-gray-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendanceRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        {record.recipientName} ({record.recipientType})
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(record.attendanceDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {record.status === "Present" ? (
                        <span className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                          {record.status}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <XCircle className="w-4 h-4 mr-1 text-red-500" />
                          {record.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {record.checkInTime
                          ? record.checkInTime.slice(11, 16)
                          : "N/A"}{" "}
                        -{" "}
                        {record.checkOutTime
                          ? record.checkOutTime.slice(11, 16)
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3">{record.totalHours || "0"}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onEditAttendance(record)}
                        className="mr-2 text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteAttendance(record)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="lg:hidden">
        {attendanceRecords.map((record) => {
          const isExpanded = expandedRows[record.id];
          return (
            <div key={record.id} className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">
                    {record.recipientName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(record.attendanceDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => toggleRow(record.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {isExpanded ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </button>
              </div>
              {isExpanded && (
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Status:</span> {record.status}
                  </p>
                  <p>
                    <span className="font-medium">Times:</span>{" "}
                    {record.checkInTime
                      ? record.checkInTime.slice(11, 16)
                      : "N/A"}{" "}
                    -{" "}
                    {record.checkOutTime
                      ? record.checkOutTime.slice(11, 16)
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Total Hours:</span>{" "}
                    {record.totalHours || "0"}
                  </p>
                  <p>
                    <span className="font-medium">Notes:</span>{" "}
                    {record.notes || "N/A"}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() => onEditAttendance(record)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => onDeleteAttendance(record)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceTable;
