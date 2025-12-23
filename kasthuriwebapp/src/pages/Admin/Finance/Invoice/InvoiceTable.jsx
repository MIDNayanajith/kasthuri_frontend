// Updated InvoiceTable.jsx (add edit and delete buttons)
import React from "react";
import {
  Download,
  FileText,
  User,
  Calendar,
  DollarSign,
  ChevronRight,
  ChevronDown,
  Edit2,
  Trash2,
} from "lucide-react";

const InvoiceTable = ({
  invoiceRecords,
  onDownloadInvoice,
  onEditInvoice,
  onDeleteInvoice,
  loading,
  isAdmin,
}) => {
  const [expandedRows, setExpandedRows] = React.useState({});
  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A594F9]"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[150px]">
                Invoice No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[150px]">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                Total Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[200px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoiceRecords.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-lg font-medium text-gray-400">
                    No invoices found
                  </p>
                </td>
              </tr>
            ) : (
              invoiceRecords.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <FileText className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                      <div className="truncate max-w-[140px]">
                        {record.invoiceNo}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <User className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                      <div className="truncate max-w-[140px]">
                        {record.clientName}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate">
                        {record.generationDate
                          ? new Date(record.generationDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                      <span className="font-medium">
                        {record.totalAmount || "0"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {record.status}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          onDownloadInvoice(record.id, record.invoiceNo)
                        }
                        className="inline-flex items-center px-2 py-1 border border-[#A594F9] text-[#A594F9] rounded text-sm hover:bg-[#F5EFFF] transition-colors duration-200 cursor-pointer whitespace-nowrap"
                      >
                        <Download size={14} className="mr-1" />
                        PDF
                      </button>
                      <button
                        onClick={() => onEditInvoice(record)}
                        className="inline-flex items-center px-2 py-1 border border-[#A594F9] text-[#A594F9] rounded text-sm hover:bg-[#F5EFFF] transition-colors duration-200 cursor-pointer whitespace-nowrap"
                      >
                        <Edit2 size={14} className="mr-1" />
                        Edit
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => onDeleteInvoice(record)}
                          className="inline-flex items-center px-2 py-1 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50 transition-colors duration-200 cursor-pointer whitespace-nowrap"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden">
        {invoiceRecords.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-400">
              No invoices found
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {invoiceRecords.map((record) => {
              const isExpanded = expandedRows[record.id];
              return (
                <div
                  key={record.id}
                  className="p-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                          <h4 className="font-medium text-gray-900 truncate">
                            {record.invoiceNo}
                          </h4>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <User className="w-3 h-3 mr-1" />
                          <span className="truncate">{record.clientName}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleRow(record.id)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {/* Basic Info Row */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        {record.generationDate
                          ? new Date(record.generationDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">
                        {record.totalAmount || "0"}
                      </span>
                    </div>
                  </div>
                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-gray-500">Status</p>
                          <p className="font-medium">{record.status}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Created At</p>
                          <p className="font-medium">
                            {record.createdAt
                              ? new Date(record.createdAt).toLocaleString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500">
                          Items ({record.items ? record.items.length : 0})
                        </p>
                        <div className="mt-2 overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 text-xs">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-2 py-1 text-left font-semibold text-gray-600">
                                  Date
                                </th>
                                <th className="px-2 py-1 text-left font-semibold text-gray-600">
                                  Vehicle
                                </th>
                                <th className="px-2 py-1 text-left font-semibold text-gray-600">
                                  Rate
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {record.items &&
                                record.items.map((item) => (
                                  <tr key={item.id}>
                                    <td className="px-2 py-1 whitespace-nowrap">
                                      {item.date
                                        ? new Date(
                                            item.date
                                          ).toLocaleDateString()
                                        : "N/A"}
                                    </td>
                                    <td className="px-2 py-1 whitespace-nowrap">
                                      {item.vehicleRegNo}
                                    </td>
                                    <td className="px-2 py-1 whitespace-nowrap">
                                      {item.rate}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() =>
                            onDownloadInvoice(record.id, record.invoiceNo)
                          }
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-[#A594F9] text-[#A594F9] rounded text-sm hover:bg-[#F5EFFF] transition-colors duration-200 cursor-pointer"
                        >
                          <Download size={14} className="mr-1" />
                          Download PDF
                        </button>
                        <button
                          onClick={() => onEditInvoice(record)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-[#A594F9] text-[#A594F9] rounded text-sm hover:bg-[#F5EFFF] transition-colors duration-200 cursor-pointer"
                        >
                          <Edit2 size={14} className="mr-1" />
                          Edit
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => onDeleteInvoice(record)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50 transition-colors duration-200 cursor-pointer"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default InvoiceTable;
