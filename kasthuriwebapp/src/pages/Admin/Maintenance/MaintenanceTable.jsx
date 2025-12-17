// MaintenanceTable.jsx
import React from "react";
import {
  Edit2,
  Trash2,
  Truck,
  Calendar,
  FileText,
  Gauge,
  Package,
  DollarSign,
  Wrench,
} from "lucide-react";
const MaintenanceTable = ({
  maintenanceRecords,
  onEditMaintenance,
  onDeleteMaintenance,
  loading,
  isAdmin,
}) => {
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
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto">
          <thead className="bg-gray-50 border-b border-gray-200 hidden md:table-header-group">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Mileage
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {maintenanceRecords.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                  <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-lg font-medium text-gray-400">
                    No maintenance records found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Get started by adding your first maintenance record
                  </p>
                </td>
              </tr>
            ) : (
              maintenanceRecords.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50 transition-colors duration-150 block md:table-row border-b md:border-none"
                >
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Vehicle'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="flex items-center text-sm text-gray-900 pt-6 md:pt-0">
                      <Truck className="w-4 h-4 mr-2 text-gray-400" />
                      {record.vehicleRegNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Date'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="flex items-center text-sm text-gray-900 pt-6 md:pt-0">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {record.date
                        ? new Date(record.date).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Description'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="flex items-center text-sm text-gray-900 pt-6 md:pt-0">
                      <FileText className="w-4 h-4 mr-2 text-gray-400" />
                      {record.description || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Mileage'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="flex items-center text-sm text-gray-900 pt-6 md:pt-0">
                      <Gauge className="w-4 h-4 mr-2 text-gray-400" />
                      {record.mileage || "N/A"} km
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Quantity'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="flex items-center text-sm text-gray-900 pt-6 md:pt-0">
                      <Package className="w-4 h-4 mr-2 text-gray-400" />
                      {record.quantity || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Unit_Price'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="flex items-center text-sm text-gray-900 pt-6 md:pt-0">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      {record.unitPrice || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Total_Price'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="flex items-center text-sm text-gray-900 pt-6 md:pt-0">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      {record.totalPrice || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Created_At'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="flex items-center text-sm text-gray-900 pt-6 md:pt-0">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {record.createdAt
                        ? new Date(record.createdAt).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium block md:table-cell relative md:static before:content-['Actions'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden pb-6 md:pb-4">
                    <div className="flex items-center space-x-2 pt-6 md:pt-0">
                      <button
                        onClick={() => onEditMaintenance(record)}
                        className="inline-flex items-center px-3 py-1.5 border border-[#A594F9] text-[#A594F9] rounded-lg text-sm hover:bg-[#F5EFFF] transition-colors duration-200 cursor-pointer"
                      >
                        <Edit2 size={14} className="mr-1" />
                        Edit
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => onDeleteMaintenance(record)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors duration-200 cursor-pointer"
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
  );
};
export default MaintenanceTable;
