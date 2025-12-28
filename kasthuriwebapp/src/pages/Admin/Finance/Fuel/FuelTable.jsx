import React from "react";
import {
  Edit2,
  Trash2,
  Calendar,
  Fuel,
  Truck,
  FileText,
  DollarSign,
  Hash,
  Ruler,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const FuelTable = ({
  fuelRecords,
  onEditFuel,
  onDeleteFuel,
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0.00";
    return parseFloat(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const calculateUnitPrice = (quantity, cost) => {
    if (!quantity || !cost || parseFloat(quantity) === 0) return "0.00";
    return (parseFloat(cost) / parseFloat(quantity)).toFixed(2);
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
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[80px] bg-gray-50">
                  <div className="flex items-center">
                    <Hash className="w-3 h-3 mr-1" />
                    ID
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] bg-gray-50">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Date
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px] bg-gray-50">
                  <div className="flex items-center">
                    <Truck className="w-3 h-3 mr-1" />
                    Vehicle
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[150px] bg-gray-50">
                  <div className="flex items-center">
                    <FileText className="w-3 h-3 mr-1" />
                    Trip/Client
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] bg-gray-50">
                  <div className="flex items-center">
                    <Ruler className="w-3 h-3 mr-1" />
                    Odometer
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] bg-gray-50">
                  <div className="flex items-center">
                    <Fuel className="w-3 h-3 mr-1" />
                    Quantity (L)
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px] bg-gray-50">
                  <div className="flex items-center">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Cost & Unit Price
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px] bg-gray-50">
                  Notes
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px] bg-gray-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fuelRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <Fuel className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-400">
                      No fuel records found
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add your first fuel record to get started
                    </p>
                  </td>
                </tr>
              ) : (
                fuelRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
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
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          {formatDate(record.fuelDate)}
                          {record.createdAt && (
                            <div className="text-xs text-gray-500">
                              {new Date(record.createdAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Truck className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium truncate max-w-[100px]">
                            {record.vehicleRegNumber}
                          </span>
                        </div>
                        {record.vehicleModel && (
                          <div className="text-xs text-gray-500 truncate max-w-[100px]">
                            {record.vehicleModel}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.clientName ? (
                          <div>
                            <div className="font-medium truncate max-w-[130px]">
                              {record.clientName}
                            </div>
                            {record.tripDescription && (
                              <div className="text-xs text-gray-500 truncate max-w-[130px]">
                                {record.tripDescription}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">
                            No trip assigned
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.odometerReading ? (
                          <div className="flex items-center">
                            <Ruler className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="font-medium">
                              {formatCurrency(record.odometerReading)}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              km
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Fuel className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium">
                            {formatCurrency(record.fuelQuantity)}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">L</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium">
                            LKR {formatCurrency(record.totalCost)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Unit: LKR{" "}
                          {calculateUnitPrice(
                            record.fuelQuantity,
                            record.totalCost
                          )}
                          /L
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-[150px]">
                        {record.notes ? (
                          <div className="truncate" title={record.notes}>
                            {record.notes}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No notes</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onEditFuel(record)}
                          className="inline-flex items-center px-2 py-1 border border-[#A594F9] text-[#A594F9] rounded text-sm hover:bg-[#F5EFFF] transition-colors duration-200 cursor-pointer whitespace-nowrap"
                        >
                          <Edit2 size={14} className="mr-1" />
                          Edit
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => onDeleteFuel(record)}
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
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {fuelRecords.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <Fuel className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-400">
              No fuel records found
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Add your first fuel record to get started
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {fuelRecords.map((record) => {
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
                          <Truck className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900 truncate">
                              {record.vehicleRegNumber}
                            </h4>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Hash className="w-3 h-3 mr-1" />
                              ID: {record.id}
                            </div>
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {formatDate(record.fuelDate)}
                            </span>
                          </div>
                          {record.clientName && (
                            <div className="mt-1 flex items-center">
                              <FileText className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">
                                {record.clientName}
                              </span>
                            </div>
                          )}
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
                      <Fuel className="w-4 h-4 mr-2 text-gray-400" />
                      <div>
                        <div className="font-medium">
                          {formatCurrency(record.fuelQuantity)} L
                        </div>
                        <div className="text-xs text-gray-500">Quantity</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <div>
                        <div className="font-medium">
                          LKR {formatCurrency(record.totalCost)}
                        </div>
                        <div className="text-xs text-gray-500">Total Cost</div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 text-sm">
                      {record.odometerReading && (
                        <div>
                          <p className="text-gray-500">Odometer Reading</p>
                          <p className="font-medium">
                            {formatCurrency(record.odometerReading)} km
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-gray-500">Unit Price</p>
                        <p className="font-medium">
                          LKR{" "}
                          {calculateUnitPrice(
                            record.fuelQuantity,
                            record.totalCost
                          )}{" "}
                          per liter
                        </p>
                      </div>

                      {record.notes && (
                        <div>
                          <p className="text-gray-500">Notes</p>
                          <p className="mt-1 text-gray-700">{record.notes}</p>
                        </div>
                      )}

                      {record.createdAt && (
                        <div>
                          <p className="text-gray-500">Created At</p>
                          <p className="mt-1 text-gray-700">
                            {new Date(record.createdAt).toLocaleDateString()}{" "}
                            {new Date(record.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() => onEditFuel(record)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-[#A594F9] text-[#A594F9] rounded text-sm hover:bg-[#F5EFFF] transition-colors duration-200 cursor-pointer"
                        >
                          <Edit2 size={14} className="mr-1" />
                          Edit
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => onDeleteFuel(record)}
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

export default FuelTable;
