// AttendanceList.jsx
import React, { useEffect, useState, useContext } from "react";
import Dashboard from "../../../components/Admin/Dashboard";
import { useUser } from "../../../hooks/useUser";
import {
  Plus,
  Search,
  CalendarCheck,
  Download,
  Filter,
  RotateCcw,
  Calendar,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AttendanceTable from "./AttendanceTable";
import axiosConfig from "../../../Utill/axiosConfig";
import { API_ENDPOINTS } from "../../../Utill/apiEndPoints";
import toast from "react-hot-toast";
import Modal from "../../../components/Admin/Modal";
import AttendanceForm from "./AttendanceForm";
import { AppContext } from "../../../context/AppContext";
const AttendanceList = () => {
  useUser();
  const { user } = useContext(AppContext);
  const isAdmin = user?.role === "ADMIN";
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRecipientType, setFilterRecipientType] = useState("");
  const [filterRecipientId, setFilterRecipientId] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [openAddAttendanceModal, setOpenAddAttendanceModal] = useState(false);
  const [openEditAttendanceModal, setOpenEditAttendanceModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const fetchAttendanceDetails = async (
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
      const [attendanceResponse, driversResponse, usersResponse] =
        await Promise.all([
          axiosConfig.get(API_ENDPOINTS.GET_ALL_ATTENDANCE, { params }),
          axiosConfig.get(API_ENDPOINTS.GET_ALL_DRIVERS),
          axiosConfig.get(API_ENDPOINTS.GET_ALL_USERS),
        ]);
      if (attendanceResponse.status === 200) {
        const attendanceWithDetails = attendanceResponse.data.map((a) => {
          const recipientName =
            a.recipientType === "Driver"
              ? driversResponse.data.find((d) => d.id === a.recipientId)
                  ?.name || "Unknown"
              : usersResponse.data.find((u) => u.id === a.recipientId)
                  ?.username || "Unknown";
          // Format times for display
          const formattedCheckIn = a.checkInTime
            ? (() => {
                let dateStr = a.checkInTime;
                if (!a.checkInTime.includes("T")) {
                  dateStr = `1970-01-01T${a.checkInTime}`;
                }
                const date = new Date(dateStr);
                return isNaN(date.getTime())
                  ? null
                  : date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    });
              })()
            : null;
          const formattedCheckOut = a.checkOutTime
            ? (() => {
                let dateStr = a.checkOutTime;
                if (!a.checkOutTime.includes("T")) {
                  dateStr = `1970-01-01T${a.checkOutTime}`;
                }
                const date = new Date(dateStr);
                return isNaN(date.getTime())
                  ? null
                  : date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    });
              })()
            : null;
          return {
            ...a,
            recipientName,
            formattedCheckIn,
            formattedCheckOut,
            // Use backend calculated total hours
            totalHours: a.totalHours || 0,
          };
        });
        setAttendanceData(attendanceWithDetails);
        setFilteredAttendance(attendanceWithDetails);
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
    fetchAttendanceDetails();
  }, []);
  useEffect(() => {
    if (searchTerm) {
      const filtered = attendanceData.filter(
        (attendance) =>
          attendance.recipientName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          attendance.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAttendance(filtered);
      setCurrentPage(1);
    } else {
      setFilteredAttendance(attendanceData);
    }
  }, [searchTerm, attendanceData]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAttendance.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
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
    fetchAttendanceDetails(
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
    fetchAttendanceDetails();
  };
  const handleDownloadExcel = async () => {
    try {
      const params = {};
      if (filterRecipientType) params.recipientType = filterRecipientType;
      if (filterRecipientId) params.recipientId = filterRecipientId;
      if (filterMonth) params.month = filterMonth;
      const response = await axiosConfig.get(
        API_ENDPOINTS.DOWNLOAD_ATTENDANCE_EXCEL,
        {
          params,
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      // Generate dynamic filename
      let filename = "attendance_report";
      if (filterRecipientType && filterRecipientId) {
        const recipient =
          filterRecipientType === "Driver"
            ? driverData.find((d) => d.id == filterRecipientId)
            : userData.find((u) => u.id == filterRecipientId);
        if (recipient) {
          const name = recipient.name || recipient.username;
          filename += `_${name}`;
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
    }
  };
  const handleAddAttendance = async (attendanceData, isEditing = false) => {
    try {
      let response;
      if (isEditing && selectedAttendance) {
        response = await axiosConfig.put(
          API_ENDPOINTS.UPDATE_ATTENDANCE(selectedAttendance.id),
          attendanceData
        );
      } else {
        response = await axiosConfig.post(
          API_ENDPOINTS.ADD_ATTENDANCE,
          attendanceData
        );
      }
      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Attendance record ${isEditing ? "updated" : "added"} successfully!`
        );
        setOpenAddAttendanceModal(false);
        setOpenEditAttendanceModal(false);
        setSelectedAttendance(null);
        fetchAttendanceDetails(
          filterRecipientType,
          filterRecipientId,
          filterMonth
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "add"} attendance record!`
      );
      throw error;
    }
  };
  const handleEditAttendance = (attendanceToEdit) => {
    setSelectedAttendance(attendanceToEdit);
    setOpenEditAttendanceModal(true);
  };
  const handleDeleteAttendance = async (attendanceToDelete) => {
    if (
      !window.confirm(`Delete attendance record? This action cannot be undone.`)
    )
      return;
    try {
      await axiosConfig.delete(
        API_ENDPOINTS.DELETE_ATTENDANCE(attendanceToDelete.id)
      );
      toast.success("Attendance record deleted successfully!");
      fetchAttendanceDetails(
        filterRecipientType,
        filterRecipientId,
        filterMonth
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete attendance record."
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
  const presentCount = filteredAttendance.filter(
    (a) => a.status === "Present"
  ).length;
  const absentCount = filteredAttendance.filter(
    (a) => a.status === "Absent"
  ).length;
  const leaveCount = filteredAttendance.filter(
    (a) => a.status === "Leave"
  ).length;
  const totalHours = filteredAttendance.reduce(
    (sum, a) => sum + (parseFloat(a.totalHours) || 0),
    0
  );
  return (
    <Dashboard activeMenu="Attendance">
      <div className="my-5 mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarCheck className="text-[#4F46E5]" size={28} />
              Attendance Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage attendance records for drivers and users
            </p>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <button
              onClick={() => setOpenAddAttendanceModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C73E6] text-white px-4 py-2.5 rounded-lg cursor-pointer hover:shadow-lg hover:from-[#3E36D5] hover:to-[#6B63D6] transition-all duration-300 shadow-md flex-1 lg:flex-none justify-center"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Attendance</span>
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
            placeholder="Search by recipient name or status..."
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
        {filteredAttendance.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Total Records Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {filteredAttendance.length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            {/* Present Count Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-green-600">
                    {presentCount}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            {/* Absent Count Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Absent</p>
                  <p className="text-2xl font-bold text-red-600">
                    {absentCount}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
            {/* Total Hours Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {totalHours.toFixed(2)}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
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
              <span className="font-semibold">{currentItems.length}</span>{" "}
              attendance records
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
        {/* Attendance Table */}
        <AttendanceTable
          attendanceRecords={currentItems}
          onEditAttendance={handleEditAttendance}
          onDeleteAttendance={handleDeleteAttendance}
          loading={loading}
          isAdmin={isAdmin}
        />
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200 gap-4">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredAttendance.length)} of{" "}
              {filteredAttendance.length} entries
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
        {/* Add Attendance Modal */}
        <Modal
          isOpen={openAddAttendanceModal}
          onClose={() => setOpenAddAttendanceModal(false)}
          title="Add New Attendance Record"
        >
          <AttendanceForm
            onAddAttendance={handleAddAttendance}
            drivers={driverData}
            users={userData}
          />
        </Modal>
        {/* Edit Attendance Modal */}
        <Modal
          isOpen={openEditAttendanceModal}
          onClose={() => {
            setOpenEditAttendanceModal(false);
            setSelectedAttendance(null);
          }}
          title="Edit Attendance Record"
        >
          <AttendanceForm
            initialAttendanceData={selectedAttendance}
            onAddAttendance={handleAddAttendance}
            isEditing={true}
            drivers={driverData}
            users={userData}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};
export default AttendanceList;
