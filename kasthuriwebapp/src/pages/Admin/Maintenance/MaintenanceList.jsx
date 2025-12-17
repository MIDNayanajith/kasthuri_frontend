// MaintenanceList.jsx
import React, { useEffect, useState, useContext } from "react";
import Dashboard from "../../../components/Admin/Dashboard";
import { useUser } from "../../../hooks/useUser";
import {
  Plus,
  Search,
  Wrench,
  Download,
  Filter,
  RotateCcw,
  Calendar,
  Truck,
} from "lucide-react";
import MaintenanceTable from "./MaintenanceTable";
import axiosConfig from "../../../Utill/axiosConfig";
import { API_ENDPOINTS } from "../../../Utill/apiEndPoints";
import toast from "react-hot-toast";
import Modal from "../../../components/Admin/Modal";
import MaintenanceForm from "./MaintenanceForm";
import { AppContext } from "../../../context/AppContext";

const MaintenanceList = () => {
  useUser();
  const { user } = useContext(AppContext);
  const isAdmin = user?.role === "ADMIN";

  const [loading, setLoading] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [filteredMaintenance, setFilteredMaintenance] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVehicleId, setFilterVehicleId] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [openAddMaintenanceModal, setOpenAddMaintenanceModal] = useState(false);
  const [openEditMaintenanceModal, setOpenEditMaintenanceModal] =
    useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);

  const fetchMaintenanceDetails = async (vehicleId = null, month = null) => {
    if (loading) return;
    setLoading(true);
    try {
      const params = {};
      if (vehicleId) params.vehicleId = vehicleId;
      if (month) params.month = month;

      const [maintenanceResponse, vehiclesResponse] = await Promise.all([
        axiosConfig.get(API_ENDPOINTS.GET_ALL_MAINTENANCE, { params }),
        axiosConfig.get(API_ENDPOINTS.GET_ALL_OWN_VEHICLES),
      ]);

      if (maintenanceResponse.status === 200) {
        // Add vehicle registration number to each maintenance record
        const maintenanceWithVehicle = maintenanceResponse.data.map((m) => ({
          ...m,
          vehicleRegNumber:
            vehiclesResponse.data.find((v) => v.id === m.vehicleId)
              ?.regNumber || "Unknown",
        }));
        setMaintenanceData(maintenanceWithVehicle);
        setFilteredMaintenance(maintenanceWithVehicle);
      }

      if (vehiclesResponse.status === 200) {
        setVehicleData(vehiclesResponse.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceDetails();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = maintenanceData.filter(
        (maintenance) =>
          maintenance.vehicleRegNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          maintenance.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredMaintenance(filtered);
    } else {
      setFilteredMaintenance(maintenanceData);
    }
  }, [searchTerm, maintenanceData]);

  const handleApplyFilter = () => {
    fetchMaintenanceDetails(filterVehicleId, filterMonth);
  };

  const handleResetFilter = () => {
    setFilterVehicleId("");
    setFilterMonth("");
    setSearchTerm("");
    fetchMaintenanceDetails();
  };

  const handleDownloadExcel = async () => {
    try {
      const params = {};
      if (filterVehicleId) params.vehicleId = filterVehicleId;
      if (filterMonth) params.month = filterMonth;

      const response = await axiosConfig.get(
        API_ENDPOINTS.DOWNLOAD_MAINTENANCE_EXCEL,
        {
          params,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Generate dynamic filename
      let filename = "maintenance_report";
      if (filterVehicleId) {
        const vehicle = vehicleData.find((v) => v.id == filterVehicleId);
        if (vehicle) {
          filename += `_${vehicle.regNumber}`;
        }
      }
      if (filterMonth) {
        filename += `_${filterMonth}`;
      }
      filename += ".xlsx";

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Excel downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download Excel");
      console.error("Download error:", error);
    }
  };

  const handleAddMaintenance = async (maintenanceData, isEditing = false) => {
    try {
      let response;
      if (isEditing && selectedMaintenance) {
        response = await axiosConfig.put(
          API_ENDPOINTS.UPDATE_MAINTENANCE(selectedMaintenance.id),
          maintenanceData
        );
      } else {
        response = await axiosConfig.post(
          API_ENDPOINTS.ADD_MAINTENANCE,
          maintenanceData
        );
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Maintenance record ${isEditing ? "updated" : "added"} successfully!`
        );
        setOpenAddMaintenanceModal(false);
        setOpenEditMaintenanceModal(false);
        setSelectedMaintenance(null);
        fetchMaintenanceDetails(filterVehicleId, filterMonth);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "add"} maintenance record!`
      );
      throw error;
    }
  };

  const handleEditMaintenance = (maintenanceToEdit) => {
    setSelectedMaintenance(maintenanceToEdit);
    setOpenEditMaintenanceModal(true);
  };

  const handleDeleteMaintenance = async (maintenanceToDelete) => {
    if (
      !window.confirm(
        `Delete maintenance record for "${maintenanceToDelete.vehicleRegNumber}"? This action cannot be undone.`
      )
    )
      return;

    try {
      await axiosConfig.delete(
        API_ENDPOINTS.DELETE_MAINTENANCE(maintenanceToDelete.id)
      );
      toast.success("Maintenance record deleted successfully!");
      fetchMaintenanceDetails(filterVehicleId, filterMonth);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete maintenance record."
      );
    }
  };

  return (
    <Dashboard activeMenu="Maintenance">
      <div className="my-5 mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Wrench className="text-[#4F46E5]" size={28} />
              Maintenance Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage vehicle maintenance records
            </p>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <button
              onClick={() => setOpenAddMaintenanceModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C73E6] text-white px-4 py-2.5 rounded-lg cursor-pointer hover:shadow-lg hover:from-[#3E36D5] hover:to-[#6B63D6] transition-all duration-300 shadow-md flex-1 lg:flex-none justify-center"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Maintenance</span>
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-300"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by vehicle or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
          />
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#4F46E5]" />
                Filter Options
              </h3>
              <button
                onClick={handleResetFilter}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors duration-200"
              >
                <RotateCcw size={16} />
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Vehicle Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Truck className="w-4 h-4" />
                  Select Vehicle
                </label>
                <select
                  value={filterVehicleId}
                  onChange={(e) => setFilterVehicleId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-white cursor-pointer"
                >
                  <option value="">All Vehicles</option>
                  {vehicleData.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.regNumber} {v.name ? `- ${v.name}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4" />
                  Select Month
                </label>
                <input
                  type="month"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col justify-end space-y-2">
                <label className="text-sm font-medium text-gray-700 opacity-0">
                  Actions
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={handleApplyFilter}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C73E6] text-white px-4 py-2.5 rounded-lg cursor-pointer hover:shadow-lg hover:from-[#3E36D5] hover:to-[#6B63D6] transition-all duration-300 shadow-md"
                  >
                    Apply Filters
                  </button>

                  <button
                    onClick={handleDownloadExcel}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2.5 rounded-lg hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md"
                    title="Download Excel Report"
                  >
                    <Download size={18} />
                    <span className="hidden sm:inline">Excel</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filterVehicleId || filterMonth) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {filterVehicleId && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-full">
                      <Truck size={12} />
                      Vehicle:{" "}
                      {vehicleData.find((v) => v.id == filterVehicleId)
                        ?.regNumber || filterVehicleId}
                      <button
                        onClick={() => setFilterVehicleId("")}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filterMonth && (
                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-3 py-1.5 rounded-full">
                      <Calendar size={12} />
                      Month: {filterMonth}
                      <button
                        onClick={() => setFilterMonth("")}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Summary - Changed from 4 cards to 2 cards */}
        {filteredMaintenance.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Total Records Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {filteredMaintenance.length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Total Cost Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {filteredMaintenance
                      .reduce(
                        (sum, item) => sum + (parseFloat(item.totalPrice) || 0),
                        0
                      )
                      .toFixed(2)}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-bold">$</span>
                </div>
              </div>
            </div>

            {/* Empty space to maintain layout - you can remove these two empty divs if you want */}
            <div className="hidden md:block"></div>
            <div className="hidden md:block"></div>
          </div>
        )}

        {/* Quick Actions Bar */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {filteredMaintenance.length}
              </span>{" "}
              maintenance records
              {(filterVehicleId || filterMonth) && (
                <span className="text-[#4F46E5] ml-2">(Filtered)</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!showFilters && (
              <button
                onClick={handleDownloadExcel}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-300 text-sm"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Download Excel</span>
              </button>
            )}
          </div>
        </div>

        {/* Maintenance Table */}
        <MaintenanceTable
          maintenanceRecords={filteredMaintenance}
          onEditMaintenance={handleEditMaintenance}
          onDeleteMaintenance={handleDeleteMaintenance}
          loading={loading}
          isAdmin={isAdmin}
        />

        {/* Add Maintenance Modal */}
        <Modal
          isOpen={openAddMaintenanceModal}
          onClose={() => setOpenAddMaintenanceModal(false)}
          title="Add New Maintenance Record"
        >
          <MaintenanceForm
            onAddMaintenance={handleAddMaintenance}
            vehicles={vehicleData}
          />
        </Modal>

        {/* Edit Maintenance Modal */}
        <Modal
          isOpen={openEditMaintenanceModal}
          onClose={() => {
            setOpenEditMaintenanceModal(false);
            setSelectedMaintenance(null);
          }}
          title="Edit Maintenance Record"
        >
          <MaintenanceForm
            initialMaintenanceData={selectedMaintenance}
            onAddMaintenance={handleAddMaintenance}
            isEditing={true}
            vehicles={vehicleData}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default MaintenanceList;
