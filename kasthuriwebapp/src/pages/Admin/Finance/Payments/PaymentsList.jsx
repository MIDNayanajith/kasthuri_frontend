// PaymentsList.jsx
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
} from "lucide-react";
import PaymentsTable from "./PaymentsTable";
import axiosConfig from "../../../../Utill/axiosConfig";
import { API_ENDPOINTS } from "../../../../Utill/apiEndPoints";
import toast from "react-hot-toast";
import Modal from "../../../../components/Admin/Modal";
import PaymentForm from "./PaymentForm";

const PaymentsList = () => {
  useUser();
  const [loading, setLoading] = useState(false);
  const [paymentsData, setPaymentsData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRecipientType, setFilterRecipientType] = useState("");
  const [filterRecipientId, setFilterRecipientId] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [openAddPaymentModal, setOpenAddPaymentModal] = useState(false);
  const [openEditPaymentModal, setOpenEditPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchPaymentsDetails = async (
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
      const [paymentsResponse, driversResponse, usersResponse] =
        await Promise.all([
          axiosConfig.get(API_ENDPOINTS.GET_ALL_PAYMENTS, { params }),
          axiosConfig.get(API_ENDPOINTS.GET_ALL_DRIVERS),
          axiosConfig.get(API_ENDPOINTS.GET_ALL_USERS),
        ]);
      if (paymentsResponse.status === 200) {
        const paymentsWithDetails = paymentsResponse.data.map((p) => ({
          ...p,
          recipientName:
            p.recipientType === "Driver"
              ? driversResponse.data.find((d) => d.id === p.recipientId)
                  ?.name || "Unknown"
              : usersResponse.data.find((u) => u.id === p.recipientId)
                  ?.username || "Unknown",
        }));
        setPaymentsData(paymentsWithDetails);
        setFilteredPayments(paymentsWithDetails);
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
    fetchPaymentsDetails();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = paymentsData.filter(
        (payment) =>
          payment.recipientName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPayments(filtered);
      setCurrentPage(1);
    } else {
      setFilteredPayments(paymentsData);
    }
  }, [searchTerm, paymentsData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

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
    fetchPaymentsDetails(
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
    fetchPaymentsDetails();
  };

  const handleDownloadExcel = async () => {
    try {
      const params = {};
      if (filterRecipientType) params.recipientType = filterRecipientType;
      if (filterRecipientId) params.recipientId = filterRecipientId;
      if (filterMonth) params.month = filterMonth;
      const response = await axiosConfig.get(
        API_ENDPOINTS.DOWNLOAD_PAYMENTS_EXCEL,
        {
          params,
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      let filename = "payments_report.xlsx";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Excel downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download Excel");
    }
  };

  const handleAddPayment = async (paymentData, isEditing = false) => {
    try {
      let response;
      if (isEditing && selectedPayment) {
        response = await axiosConfig.put(
          API_ENDPOINTS.UPDATE_PAYMENT(selectedPayment.id),
          paymentData
        );
      } else {
        response = await axiosConfig.post(
          API_ENDPOINTS.ADD_PAYMENT,
          paymentData
        );
      }
      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Payment record ${isEditing ? "updated" : "added"} successfully!`
        );
        setOpenAddPaymentModal(false);
        setOpenEditPaymentModal(false);
        setSelectedPayment(null);
        fetchPaymentsDetails(
          filterRecipientType,
          filterRecipientId,
          filterMonth
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "add"} payment record!`
      );
      throw error;
    }
  };

  const handleEditPayment = (paymentToEdit) => {
    setSelectedPayment(paymentToEdit);
    setOpenEditPaymentModal(true);
  };

  const handleDeletePayment = async (paymentToDelete) => {
    if (!window.confirm(`Delete payment record? This action cannot be undone.`))
      return;
    try {
      await axiosConfig.delete(
        API_ENDPOINTS.DELETE_PAYMENT(paymentToDelete.id)
      );
      toast.success("Payment record deleted successfully!");
      fetchPaymentsDetails(filterRecipientType, filterRecipientId, filterMonth);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete payment record."
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

  return (
    <Dashboard activeMenu="Finance">
      <div className="my-5 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="text-[#4F46E5]" size={28} />
              Payments Management
            </h2>
            <p className="text-gray-600 mt-1">Manage payment records</p>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <button
              onClick={() => setOpenAddPaymentModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C73E6] text-white px-4 py-2.5 rounded-lg cursor-pointer hover:shadow-lg hover:from-[#3E36D5] hover:to-[#6B63D6] transition-all duration-300 shadow-md flex-1 lg:flex-none justify-center"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Payment</span>
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
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
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
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
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
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
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
              >
                <Download size={18} />
                <span className="hidden sm:inline">Excel</span>
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div>
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{currentItems.length}</span> of{" "}
              <span className="font-semibold">{filteredPayments.length}</span>{" "}
              records
            </p>
          </div>
        </div>
        <PaymentsTable
          paymentsRecords={currentItems}
          onEditPayment={handleEditPayment}
          onDeletePayment={handleDeletePayment}
          loading={loading}
        />
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200 gap-4">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredPayments.length)} of{" "}
              {filteredPayments.length} entries
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
        <Modal
          isOpen={openAddPaymentModal}
          onClose={() => setOpenAddPaymentModal(false)}
          title="Add New Payment Record"
        >
          <PaymentForm
            onAddPayment={handleAddPayment}
            drivers={driverData}
            users={userData}
          />
        </Modal>
        <Modal
          isOpen={openEditPaymentModal}
          onClose={() => {
            setOpenEditPaymentModal(false);
            setSelectedPayment(null);
          }}
          title="Edit Payment Record"
        >
          <PaymentForm
            initialPaymentData={selectedPayment}
            onAddPayment={handleAddPayment}
            isEditing={true}
            drivers={driverData}
            users={userData}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default PaymentsList;
