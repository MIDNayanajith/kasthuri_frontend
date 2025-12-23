// New InvoiceForm.jsx
import React, { useEffect, useState } from "react";
import Input from "../../../../components/Input";
import { LoaderCircle } from "lucide-react";

const InvoiceForm = ({ onUpdateInvoice, initialInvoiceData }) => {
  const [invoice, setInvoice] = useState({
    status: "Draft",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialInvoiceData) {
      setInvoice({
        status: initialInvoiceData.status || "Draft",
      });
    }
  }, [initialInvoiceData]);

  const handleChange = (key, value) => {
    setInvoice({ ...invoice, [key]: value });
  };

  const validateForm = () => {
    if (!invoice.status) {
      setError("Status is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setError("");
    setLoading(true);
    try {
      const invoiceData = {
        status: invoice.status,
      };
      await onUpdateInvoice(invoiceData);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: "Draft", label: "Draft" },
    { value: "Sent", label: "Sent" },
    { value: "Paid", label: "Paid" },
    { value: "Overdue", label: "Overdue" },
  ];

  return (
    <div className="p-4 space-y-4">
      <Input
        isSelect={true}
        value={invoice.status}
        onChange={({ target }) => handleChange("status", target.value)}
        label={
          <>
            Status <span className="text-gray-300 text-sm">(Required)</span>
          </>
        }
        options={statusOptions}
      />
      {error && (
        <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
          {error}
        </p>
      )}
      <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-[#8A75EB] to-[#A594F9] text-white px-6 py-2.5 rounded-lg cursor-pointer hover:shadow-lg hover:from-[#7A65DB] hover:to-[#9584E9] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>Update Invoice</>
          )}
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;
