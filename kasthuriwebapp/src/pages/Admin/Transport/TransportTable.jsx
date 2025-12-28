// Updated TransportTable.jsx with ID column
import React from "react";
import {
  Edit2,
  Trash2,
  User,
  MapPin,
  Calendar,
  FileText,
  Truck,
  Ruler,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
  Hash,
} from "lucide-react";

const getPaymentStatusLabel = (status) => {
  switch (status) {
    case 1:
      return "Pending";
    case 2:
      return "Advance Paid";
    case 3:
      return "Fully Paid";
    default:
      return "Unknown";
  }
};

const getTripStatusLabel = (status) => {
  switch (status) {
    case 1:
      return "Pending";
    case 2:
      return "Completed";
    case 3:
      return "Cancelled";
    default:
      return "Unknown";
  }
};

const getTripStatusIcon = (status) => {
  switch (status) {
    case 1:
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case 2:
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 3:
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};

const TransportTable = ({
  transportRecords,
  onEditTransport,
  onDeleteTransport,
  loading,
  isAdmin,
  selectedIds = [],
  onSelectChange,
  onSelectAll,
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

  const allSelected =
    transportRecords.length > 0 &&
    transportRecords.every((record) => selectedIds.includes(record.id));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-10 bg-gray-50">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="form-checkbox rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[80px] bg-gray-50">
                  <div className="flex items-center">
                    <Hash className="w-3 h-3 mr-1" />
                    ID
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[150px] bg-gray-50">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px] bg-gray-50">
                  Route
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] bg-gray-50">
                  Dates
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] bg-gray-50">
                  Vehicle
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] bg-gray-50">
                  Amounts
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] bg-gray-50">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px] bg-gray-50">
                  Invoice Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px] bg-gray-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
              {transportRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-400">
                      No transport records found
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Get started by adding your first transport record
                    </p>
                  </td>
                </tr>
              ) : (
                transportRecords.map((record) => {
                  const isSelected = selectedIds.includes(record.id);
                  return (
                    <tr
                      key={record.id}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            onSelectChange(record.id, e.target.checked)
                          }
                          className="form-checkbox rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]"
                          disabled={
                            record.invoiceStatus &&
                            record.invoiceStatus !== "Not Invoiced"
                          }
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-medium">
                          <div className="flex items-center">
                            <Hash className="w-3 h-3 mr-1 text-gray-400" />
                            {record.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <User className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                          <div className="truncate max-w-[140px]">
                            {record.clientName}
                            {record.description && (
                              <span className="block text-gray-500 text-xs truncate">
                                {record.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                          <div className="max-w-[110px]">
                            <div className="truncate">
                              {record.startingPoint} →
                            </div>
                            <div className="truncate text-gray-700">
                              {record.destination}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span className="truncate">
                              {record.loadingDate
                                ? new Date(
                                    record.loadingDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                          {record.unloadingDate && (
                            <div className="text-xs text-gray-500 mt-1">
                              Unload:{" "}
                              {new Date(
                                record.unloadingDate
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <Truck className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span className="truncate max-w-[90px]">
                              {record.vehicleRegNumber}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {record.vehicleType}
                            {record.driverName !== "N/A" && (
                              <span className="block truncate">
                                Driver: {record.driverName}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                            <span className="font-medium">
                              {record.agreedAmount || "0"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1 space-y-1">
                            <div className="flex justify-between">
                              <span>Adv:</span>
                              <span>{record.advanceReceived || "0"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Bal:</span>
                              <span>{record.balanceReceived || "0"}</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                              <span>Held:</span>
                              <span>{record.heldUp || "0"}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            {getTripStatusIcon(record.tripStatus)}
                            <span className="truncate">
                              {getTripStatusLabel(record.tripStatus)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {getPaymentStatusLabel(record.paymentStatus)}
                          </div>
                          {record.distanceKm && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                              <Ruler className="w-3 h-3 mr-1" />
                              {record.distanceKm} km
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FileText className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                          <div className="truncate max-w-[110px]">
                            {record.invoiceStatus || "Not Invoiced"}
                            {record.invoiceId && (
                              <span className="block text-gray-500 text-xs">
                                ID: {record.invoiceId}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onEditTransport(record)}
                            className="inline-flex items-center px-2 py-1 border border-[#A594F9] text-[#A594F9] rounded text-sm hover:bg-[#F5EFFF] transition-colors duration-200 cursor-pointer whitespace-nowrap"
                          >
                            <Edit2 size={14} className="mr-1" />
                            Edit
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => onDeleteTransport(record)}
                              className="inline-flex items-center px-2 py-1 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50 transition-colors duration-200 cursor-pointer whitespace-nowrap"
                            >
                              <Trash2 size={14} className="mr-1" />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {transportRecords.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-400">
              No transport records found
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Get started by adding your first transport record
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
            {transportRecords.map((record) => {
              const isSelected = selectedIds.includes(record.id);
              const isExpanded = expandedRows[record.id];
              return (
                <div
                  key={record.id}
                  className={`p-4 hover:bg-gray-50 transition-colors duration-150 ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) =>
                          onSelectChange(record.id, e.target.checked)
                        }
                        className="form-checkbox rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5] mt-1"
                        disabled={
                          record.invoiceStatus &&
                          record.invoiceStatus !== "Not Invoiced"
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900 truncate">
                              {record.clientName}
                            </h4>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Hash className="w-3 h-3 mr-1" />
                              ID: {record.id}
                            </div>
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Truck className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {record.vehicleRegNumber} ({record.vehicleType})
                            </span>
                          </div>
                          <div className="mt-1">
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                              <div className="truncate">
                                {record.startingPoint} →
                              </div>
                            </div>
                            <div className="truncate pl-4">
                              {record.destination}
                            </div>
                          </div>
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
                        {record.loadingDate
                          ? new Date(record.loadingDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">
                        {record.agreedAmount || "0"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{record.invoiceStatus || "Not Invoiced"}</span>
                    </div>
                    <div className="flex items-center">
                      {getTripStatusIcon(record.tripStatus)}
                      <span className="ml-1">
                        {getTripStatusLabel(record.tripStatus)}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-gray-500">Driver</p>
                          <p className="font-medium">{record.driverName}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Distance</p>
                          <p className="font-medium">{record.distanceKm} km</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500">Amount Details</p>
                        <div className="mt-1 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-gray-600 text-xs">Advance</p>
                            <p className="font-medium">
                              {record.advanceReceived || "0"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-xs">Balance</p>
                            <p className="font-medium">
                              {record.balanceReceived || "0"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-red-600 text-xs">Held Up</p>
                            <p className="font-medium text-red-600">
                              {record.heldUp || "0"}
                            </p>
                          </div>
                        </div>
                      </div>
                      {record.description && (
                        <div>
                          <p className="text-gray-500">Description</p>
                          <p className="mt-1 text-gray-700">
                            {record.description}
                          </p>
                        </div>
                      )}
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() => onEditTransport(record)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-[#A594F9] text-[#A594F9] rounded text-sm hover:bg-[#F5EFFF] transition-colors duration-200 cursor-pointer"
                        >
                          <Edit2 size={14} className="mr-1" />
                          Edit
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => onDeleteTransport(record)}
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

export default TransportTable;
