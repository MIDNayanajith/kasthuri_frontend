// Updated InvoiceList.jsx (add update and delete functionality)
import React, { useEffect, useState, useContext } from "react";
import Dashboard from "../../../../components/Admin/Dashboard";
import { FileText, Search, Download } from "lucide-react";
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

  const handleDeleteInvoice = async (invoiceToDelete) => {
    if (
      !window.confirm(
        `Delete invoice "${invoiceToDelete.invoiceNo}"? This action cannot be undone.`
      )
    )
      return;
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
        {/* Stats Summary */}
        {filteredInvoices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Invoices Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {filteredInvoices.length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            {/* Total Amount Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {filteredInvoices
                      .reduce(
                        (sum, item) =>
                          sum + (parseFloat(item.totalAmount) || 0),
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
            {/* Total Items Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {filteredInvoices.reduce(
                      (sum, item) => sum + (item.items ? item.items.length : 0),
                      0
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
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
