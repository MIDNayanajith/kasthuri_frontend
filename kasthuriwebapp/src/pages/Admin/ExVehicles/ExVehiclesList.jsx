// ExVehiclesList.jsx
import React, { useEffect, useState, useContext } from "react";
import Dashboard from "../../../components/Admin/Dashboard";
import { useUser } from "../../../hooks/useUser";
import {
  Plus,
  Search,
  Truck,
  Download,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
} from "lucide-react";
import ExVehiclesTable from "./ExVehiclesTable";
import axiosConfig from "../../../Utill/axiosConfig";
import { API_ENDPOINTS } from "../../../Utill/apiEndPoints";
import toast from "react-hot-toast";
import Modal from "../../../components/Admin/Modal";
import ExVehicleForm from "./ExVehicleForm";
import { AppContext } from "../../../context/AppContext";

const ExVehiclesList = () => {
  useUser();
  const { user } = useContext(AppContext);
  const isAdmin = user?.role === "ADMIN";
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegNumber, setFilterRegNumber] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [openAddVehicleModal, setOpenAddVehicleModal] = useState(false);
  const [openEditVehicleModal, setOpenEditVehicleModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchVehicleDetails = async (regNumber = null, month = null) => {
    if (loading) return;
    setLoading(true);
    try {
      const params = {};
      if (regNumber) params.regNumber = regNumber;
      if (month) params.month = month;
      const response = await axiosConfig.get(
        API_ENDPOINTS.GET_ALL_EX_VEHICLES,
        { params }
      );
      if (response.status === 200) {
        setVehicleData(response.data);
        setFilteredVehicles(response.data);
        setCurrentPage(1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleDetails();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = vehicleData.filter(
        (vehicle) =>
          vehicle.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.ownerContact?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVehicles(filtered);
      setCurrentPage(1);
    } else {
      setFilteredVehicles(vehicleData);
    }
  }, [searchTerm, vehicleData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVehicles.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

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
    fetchVehicleDetails(filterRegNumber, filterMonth);
  };

  const handleResetFilter = () => {
    setFilterRegNumber("");
    setFilterMonth("");
    setSearchTerm("");
    fetchVehicleDetails();
  };

  const handleDownloadExcel = async () => {
    try {
      const params = {};
      if (filterRegNumber) params.regNumber = filterRegNumber;
      if (filterMonth) params.month = filterMonth;
      const response = await axiosConfig.get(
        API_ENDPOINTS.DOWNLOAD_EX_VEHICLES_EXCEL,
        {
          params,
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      let filename = "ex_vehicles_report.xlsx";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Excel downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download Excel");
    }
  };

  const handleAddVehicle = async (vehicleData, isEditing = false) => {
    try {
      let response;
      if (isEditing && selectedVehicle) {
        // For update, use PUT
        response = await axiosConfig.put(
          API_ENDPOINTS.UPDATE_EX_VEHICLE(selectedVehicle.id),
          vehicleData
        );
      } else {
        // For create, use POST
        response = await axiosConfig.post(
          API_ENDPOINTS.ADD_EX_VEHICLE,
          vehicleData
        );
      }
      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Vehicle ${isEditing ? "updated" : "added"} successfully!`
        );
        setOpenAddVehicleModal(false);
        setOpenEditVehicleModal(false);
        setSelectedVehicle(null);
        fetchVehicleDetails(filterRegNumber, filterMonth);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "add"} vehicle!`
      );
      throw error;
    }
  };

  const handleMakePayment = async (vehicleId, paymentAmount) => {
    try {
      const response = await axiosConfig.post(
        API_ENDPOINTS.MAKE_PAYMENT(vehicleId),
        { paymentAmount }
      );
      if (response.status === 200) {
        toast.success("Payment recorded successfully!");
        fetchVehicleDetails(filterRegNumber, filterMonth);
        setOpenEditVehicleModal(false);
        setSelectedVehicle(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to record payment!");
      throw error;
    }
  };

  const handleEditVehicle = (vehicleToEdit) => {
    setSelectedVehicle(vehicleToEdit);
    setOpenEditVehicleModal(true);
  };

  const handleDeleteVehicle = async (vehicleToDelete) => {
    if (
      !window.confirm(
        `Delete vehicle "${vehicleToDelete.regNumber}"? This action cannot be undone.`
      )
    )
      return;
    try {
      await axiosConfig.delete(
        API_ENDPOINTS.DELETE_EX_VEHICLE(vehicleToDelete.id)
      );
      toast.success("Vehicle deleted successfully!");
      fetchVehicleDetails(filterRegNumber, filterMonth);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete vehicle.");
    }
  };

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

  // Calculate stats for current month or filtered month
  let vehiclesToSum = filteredVehicles;
  if (!filterMonth) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    vehiclesToSum = filteredVehicles.filter((v) => {
      if (!v.date) return false;
      const date = new Date(v.date);
      return (
        !isNaN(date) &&
        date.getFullYear() === currentYear &&
        date.getMonth() + 1 === currentMonth
      );
    });
  }

  const totalHire = vehiclesToSum
    .reduce((sum, v) => sum + (parseFloat(v.hireRate) || 0), 0)
    .toFixed(2);
  const totalPaid = vehiclesToSum
    .reduce((sum, v) => sum + (parseFloat(v.totalPaid) || 0), 0)
    .toFixed(2);
  const totalBalance = vehiclesToSum
    .reduce((sum, v) => sum + (parseFloat(v.balance) || 0), 0)
    .toFixed(2);

  return (
    <Dashboard activeMenu="Ex Vehicles">
      <div className="my-5 mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="text-[#4F46E5]" size={28} />
              External Vehicle Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage external vehicles and their information
            </p>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <button
              onClick={() => setOpenAddVehicleModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C73E6] text-white px-4 py-2.5 rounded-lg cursor-pointer hover:shadow-lg hover:from-[#3E36D5] hover:to-[#6B63D6] transition-all duration-300 shadow-md flex-1 lg:flex-none justify-center"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Vehicle</span>
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
            placeholder="Search by owner or contact..."
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
              {/* Reg Number Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Truck className="w-4 h-4" />
                  Registration Number
                </label>
                <input
                  type="text"
                  value={filterRegNumber}
                  onChange={(e) => setFilterRegNumber(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-white"
                  placeholder="Enter reg number..."
                />
              </div>
              {/* Month Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4" />
                  Month
                </label>
                <input
                  type="month"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                />
              </div>
            </div>
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
            {/* Active Filters Display */}
            {(filterRegNumber || filterMonth) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {filterRegNumber && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-full">
                      <Truck size={12} />
                      Reg: {filterRegNumber}
                      <button
                        onClick={() => setFilterRegNumber("")}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filterMonth && (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-3 py-1.5 rounded-full">
                      <Calendar size={12} />
                      Month: {filterMonth}
                      <button
                        onClick={() => setFilterMonth("")}
                        className="ml-1 text-green-600 hover:text-green-800"
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

        {/* Stats Summary */}
        {filteredVehicles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Total Records Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {filteredVehicles.length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            {/* Total Hire Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Hire Rates</p>
                  <p className="text-2xl font-bold text-gray-800">
                    LKR {totalHire}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
            {/* Total Paid Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    LKR {totalPaid}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            {/* Total Balance Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Balance</p>
                  <p className="text-2xl font-bold text-red-600">
                    LKR {totalBalance}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Bar */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredVehicles.length}</span>{" "}
              vehicles
              {(filterRegNumber || filterMonth) && (
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

        {/* ExVehicles Table */}
        <ExVehiclesTable
          vehicles={currentItems}
          onEditVehicle={handleEditVehicle}
          onDeleteVehicle={handleDeleteVehicle}
          loading={loading}
          isAdmin={isAdmin}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200 gap-4">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredVehicles.length)} of{" "}
              {filteredVehicles.length} entries
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Add Vehicle Modal */}
        <Modal
          isOpen={openAddVehicleModal}
          onClose={() => setOpenAddVehicleModal(false)}
          title="Add New External Vehicle"
        >
          <ExVehicleForm onAddVehicle={handleAddVehicle} isEditing={false} />
        </Modal>

        {/* Edit Vehicle Modal */}
        <Modal
          isOpen={openEditVehicleModal}
          onClose={() => {
            setOpenEditVehicleModal(false);
            setSelectedVehicle(null);
          }}
          title="Edit External Vehicle"
        >
          <ExVehicleForm
            initialVehicleData={selectedVehicle}
            onAddVehicle={handleAddVehicle}
            onMakePayment={handleMakePayment}
            isEditing={true}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default ExVehiclesList;
