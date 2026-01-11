// Updated InvoiceList.jsx (add update and delete functionality)
import React, { useEffect, useState, useContext } from "react";
import Dashboard from "../../../../components/Admin/Dashboard";
import { FileText, Search, Download, DollarSign, Trash2 } from "lucide-react"; // Added Trash2
import axiosConfig from "../../../../Utill/axiosConfig";
import { API_ENDPOINTS } from "../../../../Utill/apiEndPoints";
import toast from "react-hot-toast";
import InvoiceTable from "./InvoiceTable";
import { AppContext } from "../../../../context/AppContext";
import Modal from "../../../../components/Admin/Modal";
import InvoiceForm from "./InvoiceForm";

const InvoiceList = () => {
  const { user } = useContext(AppContext);
  const isAdmin = user?.role === "ADMIN";
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openEditInvoiceModal, setOpenEditInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchInvoices = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INVOICES);
      if (response.status === 200) {
        setInvoiceData(response.data);
        setFilteredInvoices(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = invoiceData.filter(
        (invoice) =>
          invoice.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoiceData);
    }
  }, [searchTerm, invoiceData]);

  const handleDownloadInvoice = async (invoiceId, invoiceNo) => {
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.DOWNLOAD_INVOICE_PDF(invoiceId),
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${invoiceNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Invoice PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download invoice PDF");
      console.error("Download error:", error);
    }
  };

  const handleUpdateInvoice = async (invoiceData) => {
    try {
      const response = await axiosConfig.put(
        API_ENDPOINTS.UPDATE_INVOICE(selectedInvoice.id),
        invoiceData
      );
      if (response.status === 200) {
        toast.success("Invoice updated successfully!");
        setOpenEditInvoiceModal(false);
        setSelectedInvoice(null);
        fetchInvoices();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update invoice!");
      throw error;
    }
  };

  const handleEditInvoice = (invoiceToEdit) => {
    setSelectedInvoice(invoiceToEdit);
    setOpenEditInvoiceModal(true);
  };

  // Helper function for actual deletion
  const performDelete = async (invoiceToDelete) => {
    try {
      await axiosConfig.delete(
        API_ENDPOINTS.DELETE_INVOICE(invoiceToDelete.id)
      );
      toast.success("Invoice deleted successfully!");
      fetchInvoices();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete invoice.");
    }
  };

  const handleDeleteInvoice = async (invoiceToDelete) => {
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
                  Delete invoice "{invoiceToDelete.invoiceNo}"?
                  <span className="block text-red-600 font-medium mt-1">
                    This action cannot be undone.
                  </span>
                </p>
                <div className="mt-4 flex space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                    onClick={() => {
                      toast.dismiss(t.id);
                      performDelete(invoiceToDelete);
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

  // Function to get current month in YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  // Function to format month as "25/12" (YY/MM)
  const formatMonthAsYYMM = (monthString) => {
    if (!monthString) return "";
    const parts = monthString.split("-");
    if (parts.length === 2) {
      // Take last 2 digits of year and month
      const year = parts[0].slice(-2);
      const month = parts[1];
      return `${year}/${month}`;
    }
    return monthString;
  };

  // Calculate current month totals (for Total Amount and Total Items cards)
  const calculateCurrentMonthTotals = () => {
    const currentMonth = getCurrentMonth();

    // Filter invoices for current month based on generationDate
    const currentMonthInvoices = filteredInvoices.filter((item) => {
      if (!item.generationDate) return false;
      const itemMonth = item.generationDate.slice(0, 7); // Get YYYY-MM from generationDate
      return itemMonth === currentMonth;
    });

    const currentMonthTotalAmount = currentMonthInvoices
      .reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0)
      .toFixed(2);

    const currentMonthTotalItems = currentMonthInvoices.reduce(
      (sum, item) => sum + (item.items ? item.items.length : 0),
      0
    );

    return {
      totalAmount: currentMonthTotalAmount,
      totalItems: currentMonthTotalItems,
      displayMonth: formatMonthAsYYMM(currentMonth),
    };
  };

  const currentMonthTotals = calculateCurrentMonthTotals();

  return (
    <Dashboard activeMenu="Invoice">
      <div className="my-5 mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="text-[#4F46E5]" size={28} />
              Invoice Management
            </h2>
            <p className="text-gray-600 mt-1">View and manage invoices</p>
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
            placeholder="Search by invoice number or client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
          />
        </div>

        {/* Stats Summary - Updated to match your requirements */}
        {filteredInvoices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Total Invoices Card - ALL RECORDS (not just current month) */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {filteredInvoices.length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Total Amount Card - CURRENT MONTH ONLY */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-800">
                    LKR{" "}
                    {parseFloat(currentMonthTotals.totalAmount).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    For {currentMonthTotals.displayMonth}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Total Items Card - CURRENT MONTH ONLY */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {currentMonthTotals.totalItems}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    For {currentMonthTotals.displayMonth}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Empty div to maintain layout */}
            <div className="hidden md:block"></div>
          </div>
        )}

        {/* Invoice Table */}
        <InvoiceTable
          invoiceRecords={filteredInvoices}
          onDownloadInvoice={handleDownloadInvoice}
          onEditInvoice={handleEditInvoice}
          onDeleteInvoice={handleDeleteInvoice}
          loading={loading}
          isAdmin={isAdmin}
        />

        {/* Edit Invoice Modal */}
        <Modal
          isOpen={openEditInvoiceModal}
          onClose={() => {
            setOpenEditInvoiceModal(false);
            setSelectedInvoice(null);
          }}
          title="Edit Invoice"
        >
          <InvoiceForm
            initialInvoiceData={selectedInvoice}
            onUpdateInvoice={handleUpdateInvoice}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default InvoiceList;
