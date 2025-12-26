// AdvanceTable.jsx
import React from "react";
import {
  Edit2,
  Trash2,
  User,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const AdvanceTable = ({
  advancesRecords,
  onEditAdvance,
  onDeleteAdvance,
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
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] bg-gray-50">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[150px] bg-gray-50">
                  Notes
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px] bg-gray-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {advancesRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No advance records found
                  </td>
                </tr>
              ) : (
                advancesRecords.map((record) => (
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
                        {record.advanceDate}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                        {record.amount}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {record.status === "Deducted" ? (
                        <span className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                          Deducted
                        </span>
                      ) : record.status === "Partial" ? (
                        <span className="flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1 text-orange-500" />
                          Partial
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1 text-yellow-500" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {record.notes || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onEditAdvance(record)}
                        className="mr-2 text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteAdvance(record)}
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
        {advancesRecords.map((record) => {
          const isExpanded = expandedRows[record.id];
          return (
            <div key={record.id} className="p-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{record.recipientName}</p>
                  <p className="text-sm text-gray-600">{record.advanceDate}</p>
                </div>
                <button
                  onClick={() => toggleRow(record.id)}
                  className="text-gray-500"
                >
                  {isExpanded ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </button>
              </div>
              {isExpanded && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm">Amount: {record.amount}</p>
                  <p className="text-sm">Status: {record.status}</p>
                  <p className="text-sm">Notes: {record.notes || "-"}</p>
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() => onEditAdvance(record)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteAdvance(record)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {advancesRecords.length === 0 && (
          <p className="p-4 text-center text-gray-500">
            No advance records found
          </p>
        )}
      </div>
    </div>
  );
};

export default AdvanceTable;
