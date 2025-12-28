// AdvanceList.jsx
import React, { useEffect, useState } from "react";
import Dashboard from "../../../../components/Admin/Dashboard";
import { useUser } from "../../../../hooks/useUser";
import {
  Plus,
  Search,
  DollarSign,
  Download,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
} from "lucide-react";
import AdvanceTable from "./AdvanceTable";
import axiosConfig from "../../../../Utill/axiosConfig";
import { API_ENDPOINTS } from "../../../../Utill/apiEndPoints";
import toast from "react-hot-toast";
import Modal from "../../../../components/Admin/Modal";
import AdvanceForm from "./AdvanceForm";
const AdvanceList = () => {
  useUser();
  const [loading, setLoading] = useState(false);
  const [advancesData, setAdvancesData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [filteredAdvances, setFilteredAdvances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRecipientType, setFilterRecipientType] = useState("");
  const [filterRecipientId, setFilterRecipientId] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [openAddAdvanceModal, setOpenAddAdvanceModal] = useState(false);
  const [openEditAdvanceModal, setOpenEditAdvanceModal] = useState(false);
  const [selectedAdvance, setSelectedAdvance] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const fetchAdvancesDetails = async (
    recipientType = null,
    recipientId = null,
    month = null
  ) => {
    if (loading) return;
    setLoading(true);
    try {
      const params = {};
      if (recipientType) params.recipientType = recipientType;
      if (recipientId) params.recipientId = recipientId;
      if (month) params.month = month;
      const [advancesResponse, driversResponse, usersResponse] =
        await Promise.all([
          axiosConfig.get(API_ENDPOINTS.GET_ALL_ADVANCES, { params }),
          axiosConfig.get(API_ENDPOINTS.GET_ALL_DRIVERS),
          axiosConfig.get(API_ENDPOINTS.GET_ALL_USERS),
        ]);
      if (advancesResponse.status === 200) {
        const advancesWithDetails = advancesResponse.data.map((a) => ({
          ...a,
          recipientName:
            a.recipientType === "Driver"
              ? driversResponse.data.find((d) => d.id === a.recipientId)
                  ?.name || "Unknown"
              : usersResponse.data.find((u) => u.id === a.recipientId)
                  ?.username || "Unknown",
        }));
        setAdvancesData(advancesWithDetails);
        setFilteredAdvances(advancesWithDetails);
        setCurrentPage(1);
      }
      if (driversResponse.status === 200) {
        setDriverData(driversResponse.data);
      }
      if (usersResponse.status === 200) {
        setUserData(usersResponse.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAdvancesDetails();
  }, []);
  useEffect(() => {
    if (searchTerm) {
      const filtered = advancesData.filter(
        (advance) =>
          advance.recipientName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          advance.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAdvances(filtered);
      setCurrentPage(1);
    } else {
      setFilteredAdvances(advancesData);
    }
  }, [searchTerm, advancesData]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAdvances.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAdvances.length / itemsPerPage);
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
    fetchAdvancesDetails(
      filterRecipientType,
      filterRecipientId ? parseInt(filterRecipientId) : null,
      filterMonth
    );
  };
  const handleResetFilter = () => {
    setFilterRecipientType("");
    setFilterRecipientId("");
    setFilterMonth("");
    setSearchTerm("");
    fetchAdvancesDetails();
  };
  const handleDownloadExcel = async () => {
    try {
      const params = {};
      if (filterRecipientType) params.recipientType = filterRecipientType;
      if (filterRecipientId) params.recipientId = filterRecipientId;
      if (filterMonth) params.month = filterMonth;
      const response = await axiosConfig.get(
        API_ENDPOINTS.DOWNLOAD_ADVANCES_EXCEL,
        {
          params,
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      let filename = "advances_report.xlsx";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Excel downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download Excel");
    }
  };
  const handleAddAdvance = async (advanceData, isEditing = false) => {
    try {
      let response;
      if (isEditing && selectedAdvance) {
        response = await axiosConfig.put(
          API_ENDPOINTS.UPDATE_ADVANCE(selectedAdvance.id),
          advanceData
        );
      } else {
        response = await axiosConfig.post(
          API_ENDPOINTS.ADD_ADVANCE,
          advanceData
        );
      }
      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Advance record ${isEditing ? "updated" : "added"} successfully!`
        );
        setOpenAddAdvanceModal(false);
        setOpenEditAdvanceModal(false);
        setSelectedAdvance(null);
        fetchAdvancesDetails(
          filterRecipientType,
          filterRecipientId,
          filterMonth
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "add"} advance record!`
      );
      throw error;
    }
  };
  const handleEditAdvance = (advanceToEdit) => {
    setSelectedAdvance(advanceToEdit);
    setOpenEditAdvanceModal(true);
  };
  const handleDeleteAdvance = async (advanceToDelete) => {
    if (!window.confirm(`Delete advance record? This action cannot be undone.`))
      return;
    try {
      await axiosConfig.delete(
        API_ENDPOINTS.DELETE_ADVANCE(advanceToDelete.id)
      );
      toast.success("Advance record deleted successfully!");
      fetchAdvancesDetails(filterRecipientType, filterRecipientId, filterMonth);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete advance record."
      );
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
  const recipientOptions =
    filterRecipientType === "Driver"
      ? driverData.map((d) => ({ value: d.id, label: d.name }))
      : userData.map((u) => ({ value: u.id, label: u.username }));
  recipientOptions.unshift({ value: "", label: "All Recipients" });
  // Calculate stats
  let advancesToSum = filteredAdvances;
  if (!filterMonth) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    advancesToSum = filteredAdvances.filter((a) => {
      if (!a.advanceDate) return false;
      const date = new Date(a.advanceDate);
      return (
        !isNaN(date) &&
        date.getFullYear() === currentYear &&
        date.getMonth() + 1 === currentMonth
      );
    });
  }
  const totalAmount = advancesToSum
    .reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0)
    .toFixed(2);
  return (
    <Dashboard activeMenu="Finance">
      <div className="my-5 mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="text-[#4F46E5]" size={28} />
              Advances Management
            </h2>
            <p className="text-gray-600 mt-1">Manage advance records</p>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <button
              onClick={() => setOpenAddAdvanceModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C73E6] text-white px-4 py-2.5 rounded-lg cursor-pointer hover:shadow-lg hover:from-[#3E36D5] hover:to-[#6B63D6] transition-all duration-300 shadow-md flex-1 lg:flex-none justify-center"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Advance</span>
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
            placeholder="Search by recipient or status..."
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
              {/* Recipient Type Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4" />
                  Recipient Type
                </label>
                <select
                  value={filterRecipientType}
                  onChange={(e) => setFilterRecipientType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-white cursor-pointer"
                >
                  <option value="">All Types</option>
                  <option value="Driver">Driver</option>
                  <option value="User">User</option>
                </select>
              </div>
              {/* Recipient Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4" />
                  Recipient
                </label>
                <select
                  value={filterRecipientId}
                  onChange={(e) => setFilterRecipientId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-white cursor-pointer"
                  disabled={!filterRecipientType}
                >
                  {recipientOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
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
            {(filterRecipientType || filterRecipientId || filterMonth) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {filterRecipientType && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-full">
                      <User size={12} />
                      Type: {filterRecipientType}
                      <button
                        onClick={() => setFilterRecipientType("")}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filterRecipientId && (
                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-3 py-1.5 rounded-full">
                      <User size={12} />
                      Recipient:{" "}
                      {recipientOptions.find(
                        (r) => r.value == filterRecipientId
                      )?.label || filterRecipientId}
                      <button
                        onClick={() => setFilterRecipientId("")}
                        className="ml-1 text-purple-600 hover:text-purple-800"
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
        {filteredAdvances.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Total Records Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {filteredAdvances.length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            {/* Total Amount Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Advances</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {totalAmount}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
            {/* Empty space to maintain layout */}
            <div className="hidden md:block"></div>
            <div className="hidden md:block"></div>
          </div>
        )}
        {/* Quick Actions Bar */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredAdvances.length}</span>{" "}
              advance records
              {(filterRecipientType || filterRecipientId || filterMonth) && (
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
        {/* Advance Table */}
        <AdvanceTable
          advancesRecords={currentItems}
          onEditAdvance={handleEditAdvance}
          onDeleteAdvance={handleDeleteAdvance}
          loading={loading}
        />
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200 gap-4">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredAdvances.length)} of{" "}
              {filteredAdvances.length} entries
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
        {/* Add Advance Modal */}
        <Modal
          isOpen={openAddAdvanceModal}
          onClose={() => setOpenAddAdvanceModal(false)}
          title="Add New Advance Record"
        >
          <AdvanceForm
            onAddAdvance={handleAddAdvance}
            drivers={driverData}
            users={userData}
          />
        </Modal>
        {/* Edit Advance Modal */}
        <Modal
          isOpen={openEditAdvanceModal}
          onClose={() => {
            setOpenEditAdvanceModal(false);
            setSelectedAdvance(null);
          }}
          title="Edit Advance Record"
        >
          <AdvanceForm
            initialAdvanceData={selectedAdvance}
            onAddAdvance={handleAddAdvance}
            isEditing={true}
            drivers={driverData}
            users={userData}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};
export default AdvanceList;
