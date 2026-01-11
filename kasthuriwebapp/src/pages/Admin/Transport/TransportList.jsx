// TransportList.jsx - Add invoice status filter
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
  Calendar,
  MapPin,
  FileText,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Trash2, // Added Trash2 icon
} from "lucide-react";
import TransportTable from "./TransportTable";
import axiosConfig from "../../../Utill/axiosConfig";
import { API_ENDPOINTS } from "../../../Utill/apiEndPoints";
import toast from "react-hot-toast";
import Modal from "../../../components/Admin/Modal";
import TransportForm from "./TransportForm";
import { AppContext } from "../../../context/AppContext";

const TransportList = () => {
  useUser();
  const { user } = useContext(AppContext);
  const isAdmin = user?.role === "ADMIN";
  const [loading, setLoading] = useState(false);
  const [transportData, setTransportData] = useState([]);
  const [ownVehicleData, setOwnVehicleData] = useState([]);
  const [exVehicleData, setExVehicleData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [filteredTransport, setFilteredTransport] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVehicleId, setFilterVehicleId] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterInvoiceStatus, setFilterInvoiceStatus] = useState(""); // Add invoice status filter state
  const [showFilters, setShowFilters] = useState(false);
  const [openAddTransportModal, setOpenAddTransportModal] = useState(false);
  const [openEditTransportModal, setOpenEditTransportModal] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedTransportIds, setSelectedTransportIds] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchTransportDetails = async (
    ownVehicleId = null,
    externalVehicleId = null,
    month = null,
    invoiceStatus = null // Add invoiceStatus parameter
  ) => {
    if (loading) return;
    setLoading(true);
    try {
      const params = {};
      if (ownVehicleId) params.ownVehicleId = ownVehicleId;
      if (externalVehicleId) params.externalVehicleId = externalVehicleId;
      if (month) params.month = month;
      if (invoiceStatus) params.invoiceStatus = invoiceStatus; // Add to params

      const [
        transportResponse,
        ownVehiclesResponse,
        exVehiclesResponse,
        driversResponse,
      ] = await Promise.all([
        axiosConfig.get(API_ENDPOINTS.GET_ALL_TRANSPORTS, { params }),
        axiosConfig.get(API_ENDPOINTS.GET_ALL_OWN_VEHICLES),
        axiosConfig.get(API_ENDPOINTS.GET_ALL_EX_VEHICLES),
        axiosConfig.get(API_ENDPOINTS.GET_ALL_DRIVERS),
      ]);

      if (transportResponse.status === 200) {
        // Add vehicle reg number and driver name to each transport record
        const transportWithDetails = transportResponse.data.map((t) => ({
          ...t,
          vehicleRegNumber: t.ownVehicleId
            ? ownVehiclesResponse.data.find((v) => v.id === t.ownVehicleId)
                ?.regNumber || "Unknown"
            : t.externalVehicleId
            ? exVehiclesResponse.data.find((v) => v.id === t.externalVehicleId)
                ?.regNumber || "Unknown"
            : "N/A",
          vehicleType: t.ownVehicleId ? "Own" : "External",
          driverName: t.internalDriverId
            ? driversResponse.data.find((d) => d.id === t.internalDriverId)
                ?.name || "Unknown"
            : "N/A",
        }));
        setTransportData(transportWithDetails);
        setFilteredTransport(transportWithDetails);
        // Reset to first page when data changes
        setCurrentPage(1);
      }

      if (ownVehiclesResponse.status === 200) {
        setOwnVehicleData(ownVehiclesResponse.data);
      }

      if (exVehiclesResponse.status === 200) {
        setExVehicleData(exVehiclesResponse.data);
      }

      if (driversResponse.status === 200) {
        setDriverData(driversResponse.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransportDetails();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = transportData.filter(
        (transport) =>
          transport.clientName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transport.vehicleRegNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transport.startingPoint
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transport.destination
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredTransport(filtered);
      // Reset to first page when search changes
      setCurrentPage(1);
    } else {
      setFilteredTransport(transportData);
    }
  }, [searchTerm, transportData]);

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransport.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTransport.length / itemsPerPage);

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
    let ownVehicleId = null;
    let externalVehicleId = null;

    if (filterVehicleId) {
      const [vehType, idStr] = filterVehicleId.split(":");
      const id = parseInt(idStr, 10);
      if (vehType === "own") {
        ownVehicleId = id;
      } else if (vehType === "external") {
        externalVehicleId = id;
      }
    }

    const month = filterMonth || null;
    if (month && !/^\d{4}-\d{2}$/.test(month)) {
      toast.error("Invalid month format. Use YYYY-MM");
      return;
    }

    fetchTransportDetails(
      ownVehicleId,
      externalVehicleId,
      month,
      filterInvoiceStatus
    );
  };

  const handleResetFilter = () => {
    setFilterVehicleId("");
    setFilterMonth("");
    setFilterInvoiceStatus(""); // Reset invoice status filter
    setSearchTerm("");
    fetchTransportDetails();
  };

  const handleDownloadExcel = async () => {
    try {
      const params = {};
      let ownVehicleId = null;
      let externalVehicleId = null;

      if (filterVehicleId) {
        const [vehType, idStr] = filterVehicleId.split(":");
        const id = parseInt(idStr, 10);
        if (vehType === "own") ownVehicleId = id;
        else if (vehType === "external") externalVehicleId = id;
      }

      if (ownVehicleId) params.ownVehicleId = ownVehicleId;
      if (externalVehicleId) params.externalVehicleId = externalVehicleId;
      if (filterMonth) params.month = filterMonth;
      if (filterInvoiceStatus) params.invoiceStatus = filterInvoiceStatus; // Add to Excel download

      const response = await axiosConfig.get(
        API_ENDPOINTS.DOWNLOAD_TRANSPORT_EXCEL,
        {
          params,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      let filename = "transport_report";
      if (filterVehicleId) {
        const [vehType, idStr] = filterVehicleId.split(":");
        const allVehicles = [...ownVehicleData, ...exVehicleData];
        const vehicle = allVehicles.find((v) => v.id == parseInt(idStr));
        if (vehicle) {
          filename += `_${vehicle.regNumber}`;
        }
      }
      if (filterMonth) {
        filename += `_${filterMonth}`;
      }
      if (filterInvoiceStatus) {
        filename += `_${filterInvoiceStatus.replace(/\s+/g, "_")}`;
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

  const handleAddTransport = async (transportData, isEditing = false) => {
    try {
      let response;
      if (isEditing && selectedTransport) {
        response = await axiosConfig.put(
          API_ENDPOINTS.UPDATE_TRANSPORT(selectedTransport.id),
          transportData
        );
      } else {
        response = await axiosConfig.post(
          API_ENDPOINTS.ADD_TRANSPORT,
          transportData
        );
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Transport record ${isEditing ? "updated" : "added"} successfully!`
        );
        setOpenAddTransportModal(false);
        setOpenEditTransportModal(false);
        setSelectedTransport(null);
        fetchTransportDetails(
          filterVehicleId,
          filterMonth,
          filterInvoiceStatus
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "add"} transport record!`
      );
      throw error;
    }
  };

  const handleEditTransport = (transportToEdit) => {
    setSelectedTransport(transportToEdit);
    setOpenEditTransportModal(true);
  };

  // Helper function for actual deletion
  const performDelete = async (transportToDelete) => {
    try {
      await axiosConfig.delete(
        API_ENDPOINTS.DELETE_TRANSPORT(transportToDelete.id)
      );
      toast.success("Transport record deleted successfully!");
      fetchTransportDetails(filterVehicleId, filterMonth, filterInvoiceStatus);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete transport record."
      );
    }
  };

  const handleDeleteTransport = async (transportToDelete) => {
    // Show toast confirmation instead of window.confirm
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 border-red-500`}
        >
          <div className="w-full p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Confirm Delete
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Delete transport record for "{transportToDelete.clientName}"?
                  <span className="block text-red-600 font-medium mt-1">
                    This cannot be undone.
                  </span>
                </p>
                <div className="mt-4 flex space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                    onClick={() => {
                      toast.dismiss(t.id);
                      performDelete(transportToDelete);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Don't auto-dismiss
      }
    );
  };

  const handleSelectTransport = (id, isSelected) => {
    if (isSelected) {
      setSelectedTransportIds((prev) => [...prev, id]);
    } else {
      setSelectedTransportIds((prev) => prev.filter((tid) => tid !== id));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedTransportIds(
        currentItems
          .filter((t) => !t.invoiceStatus || t.invoiceStatus === "Not Invoiced")
          .map((t) => t.id)
      );
    } else {
      setSelectedTransportIds([]);
    }
  };

  const handleGenerateInvoice = async () => {
    if (selectedTransportIds.length === 0) {
      toast.error("Please select at least one transport to invoice.");
      return;
    }

    const selectedTransports = filteredTransport.filter((t) =>
      selectedTransportIds.includes(t.id)
    );
    const clientNames = new Set(selectedTransports.map((t) => t.clientName));

    if (clientNames.size > 1) {
      toast.error("All selected transports must have the same client name");
      return;
    }

    // Show confirmation toast instead of window.confirm
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 border-[#8A75EB]`}
        >
          <div className="w-full p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-10 h-10 rounded-full bg-[#F5EFFF] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#8A75EB]" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Generate Invoice
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Generate invoice for {selectedTransportIds.length} selected
                  transport(s)?
                </p>
                <div className="mt-4 flex space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#8A75EB] to-[#A594F9] hover:from-[#7A65DB] hover:to-[#9584E9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8A75EB] transition-all duration-300"
                    onClick={() => {
                      toast.dismiss(t.id);
                      performInvoiceGeneration();
                    }}
                  >
                    Generate
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      }
    );
  };

  // Helper function for actual invoice generation
  const performInvoiceGeneration = async () => {
    try {
      setLoading(true);
      const request = {
        transportIds: selectedTransportIds,
        createdByUserId: user.id,
      };
      const response = await axiosConfig.post(
        API_ENDPOINTS.CREATE_INVOICE,
        request
      );
      if (response.status === 200) {
        const invoice = response.data;
        toast.success(`Invoice ${invoice.invoiceNo} generated successfully!`);
        const pdfResponse = await axiosConfig.get(
          API_ENDPOINTS.DOWNLOAD_INVOICE_PDF(invoice.id),
          {
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice_${invoice.invoiceNo}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        fetchTransportDetails();
        setSelectedTransportIds([]);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate invoice."
      );
    } finally {
      setLoading(false);
    }
  };

  const allVehicles = [
    ...ownVehicleData.map((v) => ({ ...v, type: "Own" })),
    ...exVehicleData.map((v) => ({ ...v, type: "External" })),
  ];

  // Generate page numbers for pagination
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

  // Function to get current month in YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  // Format month as YYYY/MM for display
  const formatDisplayMonth = (monthStr) => {
    if (!monthStr) return "";
    return monthStr.replace("-", "/");
  };

  // Calculate stats for current month or filtered month
  let transportsToSum = filteredTransport;
  if (!filterMonth) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    transportsToSum = filteredTransport.filter((t) => {
      if (!t.loadingDate) return false;
      const date = new Date(t.loadingDate);
      return (
        !isNaN(date) &&
        date.getFullYear() === currentYear &&
        date.getMonth() + 1 === currentMonth
      );
    });
  }

  // Calculate totals for the current month (or filtered month)
  const totalAgreed = transportsToSum
    .reduce((sum, item) => sum + (parseFloat(item.agreedAmount) || 0), 0)
    .toFixed(2);
  const totalReceived = transportsToSum
    .reduce(
      (sum, item) =>
        sum +
        (parseFloat(item.advanceReceived) || 0) +
        (parseFloat(item.balanceReceived) || 0),
      0
    )
    .toFixed(2);
  const totalHeldUp = transportsToSum
    .reduce((sum, item) => sum + (parseFloat(item.heldUp) || 0), 0)
    .toFixed(2);

  const displayMonth = formatDisplayMonth(filterMonth || getCurrentMonth());

  return (
    <Dashboard activeMenu="Transport">
      <div className="my-5 mx-auto">
        {/* Header Section - NO CHANGES */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="text-[#4F46E5]" size={28} />
              Transport Management
            </h2>
            <p className="text-gray-600 mt-1">Manage transport records</p>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <button
              onClick={() => setOpenAddTransportModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C73E6] text-white px-4 py-2.5 rounded-lg cursor-pointer hover:shadow-lg hover:from-[#3E36D5] hover:to-[#6B63D6] transition-all duration-300 shadow-md flex-1 lg:flex-none justify-center"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Transport</span>
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

        {/* Search Bar - NO CHANGES */}
        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by client, vehicle, starting point or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
          />
        </div>

        {/* Filter Panel - Updated with Invoice Status Filter */}
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
                  {allVehicles.map((v) => (
                    <option
                      key={`${v.type.toLowerCase()}-${v.id}`}
                      value={`${v.type.toLowerCase()}:${v.id}`}
                    >
                      {v.type}: {v.regNumber}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4" />
                  Select Month/Year
                </label>
                <input
                  type="text"
                  placeholder="YYYY-MM"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                />
              </div>

              {/* Invoice Status Filter - NEW */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4" />
                  Invoice Status
                </label>
                <select
                  value={filterInvoiceStatus}
                  onChange={(e) => setFilterInvoiceStatus(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-white cursor-pointer"
                >
                  <option value="">All Status</option>
                  <option value="Not Invoiced">Not Invoiced</option>
                  <option value="Invoiced">Invoiced</option>
                </select>
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

            {/* Active Filters Display - Updated with Invoice Status */}
            {(filterVehicleId || filterMonth || filterInvoiceStatus) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {filterVehicleId && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-full">
                      <Truck size={12} />
                      Vehicle:{" "}
                      {(() => {
                        const [vehType, idStr] = filterVehicleId.split(":");
                        const allVehicles = [
                          ...ownVehicleData,
                          ...exVehicleData,
                        ];
                        const vehicle = allVehicles.find(
                          (v) => v.id == parseInt(idStr)
                        );
                        return `${
                          vehType.charAt(0).toUpperCase() + vehType.slice(1)
                        }: ${vehicle?.regNumber || idStr}`;
                      })()}
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
                  {filterInvoiceStatus && (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-3 py-1.5 rounded-full">
                      <FileText size={12} />
                      Invoice: {filterInvoiceStatus}
                      <button
                        onClick={() => setFilterInvoiceStatus("")}
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

        {/* Stats Summary - NO CHANGES */}
        {filteredTransport.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Total Records Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {filteredTransport.length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Total Agreed Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-800">
                    LKR {totalAgreed}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    For {displayMonth}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Total Received Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Received</p>
                  <p className="text-2xl font-bold text-green-600">
                    LKR {totalReceived}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    For {displayMonth}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            {/* Total Held Up Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Held Up</p>
                  <p className="text-2xl font-bold text-red-600">
                    LKR {totalHeldUp}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    For {displayMonth}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Bar - Updated text to include invoice filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div>
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{currentItems.length}</span> of{" "}
              <span className="font-semibold">{filteredTransport.length}</span>{" "}
              records
              {(filterVehicleId || filterMonth || filterInvoiceStatus) && (
                <span className="text-[#4F46E5] ml-2">(Filtered)</span>
              )}
            </p>
            {filteredTransport.length > itemsPerPage && (
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
            <button
              onClick={handleGenerateInvoice}
              disabled={selectedTransportIds.length === 0 || loading}
              className="flex items-center gap-2 bg-gradient-to-r from-[#A594F9] to-[#8A75EB] text-white px-4 py-2.5 rounded-lg cursor-pointer hover:shadow-lg hover:from-[#9584E9] hover:to-[#7A65DB] transition-all duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FileText size={18} />
              <span className="hidden sm:inline">
                Generate Invoice ({selectedTransportIds.length})
              </span>
            </button>
          </div>
        </div>

        {/* Transport Table - NO CHANGES */}
        <div className="relative">
          <TransportTable
            transportRecords={currentItems}
            onEditTransport={handleEditTransport}
            onDeleteTransport={handleDeleteTransport}
            loading={loading}
            isAdmin={isAdmin}
            selectedIds={selectedTransportIds}
            onSelectChange={handleSelectTransport}
            onSelectAll={handleSelectAll}
          />
        </div>

        {/* Pagination Controls - NO CHANGES */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200 gap-4">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredTransport.length)} of{" "}
              {filteredTransport.length} entries
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

        {/* Add Transport Modal - NO CHANGES */}
        <Modal
          isOpen={openAddTransportModal}
          onClose={() => setOpenAddTransportModal(false)}
          title="Add New Transport Record"
        >
          <TransportForm
            onAddTransport={handleAddTransport}
            ownVehicles={ownVehicleData}
            exVehicles={exVehicleData}
            drivers={driverData}
          />
        </Modal>

        {/* Edit Transport Modal - NO CHANGES */}
        <Modal
          isOpen={openEditTransportModal}
          onClose={() => {
            setOpenEditTransportModal(false);
            setSelectedTransport(null);
          }}
          title="Edit Transport Record"
        >
          <TransportForm
            initialTransportData={selectedTransport}
            onAddTransport={handleAddTransport}
            isEditing={true}
            ownVehicles={ownVehicleData}
            exVehicles={exVehicleData}
            drivers={driverData}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default TransportList;
