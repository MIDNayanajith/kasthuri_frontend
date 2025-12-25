// PaymentsTable.jsx
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

const PaymentsTable = ({
  paymentsRecords,
  onEditPayment,
  onDeletePayment,
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
                  Period
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] bg-gray-50">
                  Amounts
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] bg-gray-50">
                  Net Pay
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] bg-gray-50">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px] bg-gray-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentsRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No payment records found
                  </td>
                </tr>
              ) : (
                paymentsRecords.map((record) => (
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
                        {record.periodMonth}/{record.periodYear}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        Base: {record.baseAmount} <br />
                        Bonus: {record.tripBonus || 0} <br />
                        Deduct: {record.deductions || 0} <br />
                        Adv: {record.advancesDeducted || 0}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                        {record.netPay}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {record.status === "Paid" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      {record.status}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onEditPayment(record)}
                        className="mr-2"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => onDeletePayment(record)}>
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
        {paymentsRecords.map((record) => {
          const isExpanded = expandedRows[record.id];
          return (
            <div key={record.id} className="p-4 border-b">
              <div className="flex justify-between">
                <div>
                  <p>{record.recipientName}</p>
                  <p>
                    {record.periodMonth}/{record.periodYear}
                  </p>
                </div>
                <button onClick={() => toggleRow(record.id)}>
                  {isExpanded ? <ChevronDown /> : <ChevronRight />}
                </button>
              </div>
              {isExpanded && (
                <div>
                  {/* Expanded details */}
                  <p>Net Pay: {record.netPay}</p>
                  <p>Status: {record.status}</p>
                  <button onClick={() => onEditPayment(record)}>Edit</button>
                  <button onClick={() => onDeletePayment(record)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentsTable;
