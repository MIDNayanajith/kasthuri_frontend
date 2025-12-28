import React, { useEffect, useState, useContext } from "react";
import Dashboard from "../../../../components/Admin/Dashboard";
import { useUser } from "../../../../hooks/useUser";
import {
  Plus,
  Search,
  Fuel,
  Download,
  Filter,
  RotateCcw,
  Calendar,
  Truck,
  DollarSign,
  Droplets,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import FuelTable from "./FuelTable";
import axiosConfig from "../../../../Utill/axiosConfig";
import { API_ENDPOINTS } from "../../../../Utill/apiEndPoints";
import toast from "react-hot-toast";
import Modal from "../../../../components/Admin/Modal";
import FuelForm from "./FuelForm";
import { AppContext } from "../../../../context/AppContext";

const FuelList = () => {
  useUser();
  const { user } = useContext(AppContext);
  const isAdmin = user?.role === "ADMIN";
  const [loading, setLoading] = useState(false);
  const [fuelData, setFuelData] = useState([]);
  const [ownVehicleData, setOwnVehicleData] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [filteredFuel, setFilteredFuel] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVehicleId, setFilterVehicleId] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [openAddFuelModal, setOpenAddFuelModal] = useState(false);
  const [openEditFuelModal, setOpenEditFuelModal] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchFuelDetails = async (vehicleId = null, month = null) => {
    if (loading) return;
    setLoading(true);
    try {
      const params = {};
      if (vehicleId) params.vehicleId = vehicleId;
      if (month) params.month = month;

      const [fuelResponse, vehiclesResponse, transportsResponse] =
        await Promise.all([
          axiosConfig.get(API_ENDPOINTS.GET_ALL_FUELS, { params }),
          axiosConfig.get(API_ENDPOINTS.GET_ALL_OWN_VEHICLES),
          axiosConfig.get(API_ENDPOINTS.GET_ALL_TRANSPORTS),
        ]);

      if (fuelResponse.status === 200) {
        setFuelData(fuelResponse.data);
        setFilteredFuel(fuelResponse.data);
        setCurrentPage(1);
      }

      if (vehiclesResponse.status === 200) {
        setOwnVehicleData(vehiclesResponse.data);
      }

      if (transportsResponse.status === 200) {
        setTransportData(transportsResponse.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch fuel data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuelDetails();
  }, []);

  // Apply search filter
  useEffect(() => {
    if (searchTerm) {
      const filtered = fuelData.filter(
        (fuel) =>
          fuel.vehicleRegNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          fuel.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fuel.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fuel.tripDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFuel(filtered);
      setCurrentPage(1);
    } else {
      setFilteredFuel(fuelData);
    }
  }, [searchTerm, fuelData]);

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFuel.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFuel.length / itemsPerPage);

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleApplyFilter = () => {
    fetchFuelDetails(filterVehicleId || null, filterMonth || null);
  };

  const handleResetFilter = () => {
    setFilterVehicleId("");
    setFilterMonth("");
    setSearchTerm("");
    fetchFuelDetails();
  };

  const handleDownloadExcel = async () => {
    try {
      const params = {};
      if (filterVehicleId) {
        const vehicle = ownVehicleData.find((v) => v.id == filterVehicleId);
        if (vehicle) {
          params.regNumber = vehicle.regNumber;
        }
      }
      if (filterMonth) params.month = filterMonth;

      const response = await axiosConfig.get(
        API_ENDPOINTS.DOWNLOAD_FUEL_EXCEL,
        {
          params,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      let filename = "fuel_report";
      if (filterVehicleId) {
        const vehicle = ownVehicleData.find((v) => v.id == filterVehicleId);
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

  const handleAddFuel = async (fuelData, isEditing = false) => {
    try {
      let response;
      if (isEditing && selectedFuel) {
        response = await axiosConfig.put(
          API_ENDPOINTS.UPDATE_FUEL(selectedFuel.id),
          fuelData
        );
      } else {
        response = await axiosConfig.post(API_ENDPOINTS.ADD_FUEL, fuelData);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Fuel record ${isEditing ? "updated" : "added"} successfully!`
        );
        setOpenAddFuelModal(false);
        setOpenEditFuelModal(false);
        setSelectedFuel(null);
        fetchFuelDetails(filterVehicleId || null, filterMonth || null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "add"} fuel record!`
      );
      throw error;
    }
  };

  const handleEditFuel = (fuelToEdit) => {
    setSelectedFuel(fuelToEdit);
    setOpenEditFuelModal(true);
  };

  const handleDeleteFuel = async (fuelToDelete) => {
    if (
      !window.confirm(
        `Delete fuel record for "${
          fuelToDelete.vehicleRegNumber
        }" on ${new Date(
          fuelToDelete.fuelDate
        ).toLocaleDateString()}? This action cannot be undone.`
      )
    )
      return;
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_FUEL(fuelToDelete.id));
      toast.success("Fuel record deleted successfully!");
      fetchFuelDetails(filterVehicleId || null, filterMonth || null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete fuel record."
      );
    }
  };

  // Calculate stats for current month or filtered month
  const getStats = () => {
    let fuelsToSum = filteredFuel;

    // Filter by month if specified
    if (filterMonth) {
      const [year, month] = filterMonth.split("-").map(Number);
      fuelsToSum = filteredFuel.filter((fuel) => {
        const fuelDate = new Date(fuel.fuelDate);
        return (
          fuelDate.getFullYear() === year && fuelDate.getMonth() + 1 === month
        );
      });
    } else {
      // Default to current month
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      fuelsToSum = filteredFuel.filter((fuel) => {
        const fuelDate = new Date(fuel.fuelDate);
        return (
          !isNaN(fuelDate) &&
          fuelDate.getFullYear() === currentYear &&
          fuelDate.getMonth() + 1 === currentMonth
        );
      });
    }

    const totalRecords = fuelsToSum.length;
    const totalCost = fuelsToSum
      .reduce((sum, item) => sum + (parseFloat(item.totalCost) || 0), 0)
      .toFixed(2);
    const totalLiters = fuelsToSum
      .reduce((sum, item) => sum + (parseFloat(item.fuelQuantity) || 0), 0)
      .toFixed(2);
    const avgUnitPrice =
      totalLiters > 0 ? (totalCost / totalLiters).toFixed(2) : "0.00";

    return {
      totalRecords,
      totalCost,
      totalLiters,
      avgUnitPrice,
      period: filterMonth ? filterMonth : "Current Month",
    };
  };

  const stats = getStats();

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const vehicleOptions = ownVehicleData.map((v) => ({
    value: v.id,
    label: `${v.regNumber} - ${v.model || v.make || "Vehicle"}`,
  }));
  vehicleOptions.unshift({ value: "", label: "All Vehicles" });

  return (
    <Dashboard activeMenu="Fuel">
      <div className="my-5 mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Fuel className="text-[#4F46E5]" size={28} />
              Fuel Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage fuel consumption and costs
            </p>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <button
              onClick={() => setOpenAddFuelModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C73E6] text-white px-4 py-2.5 rounded-lg cursor-pointer hover:shadow-lg hover:from-[#3E36D5] hover:to-[#6B63D6] transition-all duration-300 shadow-md flex-1 lg:flex-none justify-center"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Fuel Record</span>
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
            placeholder="Search by vehicle, client, or notes..."
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
                  {vehicleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
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
                      {ownVehicleData.find((v) => v.id == filterVehicleId)
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

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Records Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalRecords}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stats.period}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Fuel className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          {/* Total Liters Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Liters</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalLiters} L
                </p>
                <p className="text-xs text-gray-500 mt-1">{stats.period}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          {/* Total Cost Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-green-600">
                  LKR {stats.totalCost}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stats.period}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          {/* Average Unit Price Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Unit Price</p>
                <p className="text-2xl font-bold text-amber-600">
                  LKR {stats.avgUnitPrice}/L
                </p>
                <p className="text-xs text-gray-500 mt-1">Per liter average</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div>
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{currentItems.length}</span> of{" "}
              <span className="font-semibold">{filteredFuel.length}</span>{" "}
              records
              {(filterVehicleId || filterMonth) && (
                <span className="text-[#4F46E5] ml-2">(Filtered)</span>
              )}
            </p>
            {filteredFuel.length > itemsPerPage && (
              <p className="text-xs text-gray-500 mt-1">
                Page {currentPage} of {totalPages}
              </p>
            )}
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

        {/* Fuel Table */}
        <div className="relative">
          <FuelTable
            fuelRecords={currentItems}
            onEditFuel={handleEditFuel}
            onDeleteFuel={handleDeleteFuel}
            loading={loading}
            isAdmin={isAdmin}
          />
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200 gap-4">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredFuel.length)} of{" "}
              {filteredFuel.length} entries
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    currentPage === page
                      ? "bg-gradient-to-r from-[#4F46E5] to-[#7C73E6] text-white shadow-sm"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <span>Items per page:</span>
              <span className="ml-2 font-medium">{itemsPerPage}</span>
            </div>
          </div>
        )}

        {/* Add Fuel Modal */}
        <Modal
          isOpen={openAddFuelModal}
          onClose={() => setOpenAddFuelModal(false)}
          title="Add New Fuel Record"
        >
          <FuelForm
            onAddFuel={handleAddFuel}
            ownVehicles={ownVehicleData}
            transports={transportData}
          />
        </Modal>

        {/* Edit Fuel Modal */}
        <Modal
          isOpen={openEditFuelModal}
          onClose={() => {
            setOpenEditFuelModal(false);
            setSelectedFuel(null);
          }}
          title="Edit Fuel Record"
        >
          <FuelForm
            initialFuelData={selectedFuel}
            onAddFuel={handleAddFuel}
            isEditing={true}
            ownVehicles={ownVehicleData}
            transports={transportData}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default FuelList;
