import React from "react";
import {
  Edit2,
  Trash2,
  Truck,
  User,
  Phone,
  DollarSign,
  Calendar,
} from "lucide-react";

const ExVehiclesTable = ({
  vehicles,
  onEditVehicle,
  onDeleteVehicle,
  loading,
  isAdmin,
}) => {
  const getPaymentStatusBadge = (status) => {
    let colorClass = "";
    let label = "";
    if (status === 1) {
      colorClass = "bg-yellow-100 text-yellow-800";
      label = "Pending";
    } else if (status === 2) {
      colorClass = "bg-blue-100 text-blue-800";
      label = "Advance Paid";
    } else if (status === 3) {
      colorClass = "bg-green-100 text-green-800";
      label = "Fully Paid";
    } else {
      colorClass = "bg-gray-100 text-gray-800";
      label = "Unknown";
    }
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        {label}
      </span>
    );
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
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto">
          <thead className="bg-gray-50 border-b border-gray-200 hidden md:table-header-group">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rates & Usage
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Payments
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
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
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-lg font-medium text-gray-400">
                    No vehicles found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Get started by adding your first vehicle
                  </p>
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="hover:bg-gray-50 transition-colors duration-150 block md:table-row border-b md:border-none"
                >
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Vehicle'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="flex items-center pt-6 md:pt-0">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#A594F9] to-[#CDC1FF] flex items-center justify-center">
                          <Truck className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.regNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {vehicle.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Owner'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="flex flex-col space-y-1 pt-6 md:pt-0">
                      <div className="flex items-center text-sm text-gray-900">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        {vehicle.ownerName}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {vehicle.ownerContact}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Rates_&_Usage'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="flex flex-col space-y-1 pt-6 md:pt-0">
                      <div className="text-sm text-gray-900">
                        Hire Rate: {vehicle.hireRate || "N/A"} LKR
                      </div>
                      <div className="text-sm text-gray-500">
                        Usage: {vehicle.vehicleUsage || "N/A"} km/days
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Payments'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="flex flex-col space-y-1 pt-6 md:pt-0">
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                        Advance: {vehicle.advance || "0"} LKR
                      </div>
                      <div className="text-sm text-gray-500">
                        Balance: {vehicle.balance || "0"} LKR
                      </div>
                      <div className="text-sm text-gray-500">
                        Total: {vehicle.totalCost || "0"} LKR
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Status'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="pt-6 md:pt-0">
                      {getPaymentStatusBadge(vehicle.paymentStatus)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Created_At'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="flex items-center text-sm text-gray-900 pt-6 md:pt-0">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {vehicle.createdAt
                        ? new Date(vehicle.createdAt).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium block md:table-cell relative md:static before:content-['Actions'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden pb-6 md:pb-4">
                    <div className="flex items-center space-x-2 pt-6 md:pt-0">
                      <button
                        onClick={() => onEditVehicle(vehicle)}
                        className="inline-flex items-center px-3 py-1.5 border border-[#A594F9] text-[#A594F9] rounded-lg text-sm hover:bg-[#F5EFFF] transition-colors duration-200 cursor-pointer"
                      >
                        <Edit2 size={14} className="mr-1" />
                        Edit
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => onDeleteVehicle(vehicle)}
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

export default ExVehiclesTable;
