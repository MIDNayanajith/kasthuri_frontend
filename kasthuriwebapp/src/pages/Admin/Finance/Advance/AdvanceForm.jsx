// AdvanceForm.jsx
import React, { useEffect, useState } from "react";
import Input from "../../../../components/Input";
import { LoaderCircle } from "lucide-react";
import { API_ENDPOINTS } from "../../../../Utill/apiEndPoints";
const AdvanceForm = ({
  onAddAdvance,
  initialAdvanceData,
  isEditing,
  drivers,
  users,
}) => {
  const [advance, setAdvance] = useState({
    recipientType: "Driver",
    recipientId: null,
    amount: "",
    advanceDate: "",
    notes: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (isEditing && initialAdvanceData) {
      setAdvance({
        id: initialAdvanceData.id,
        recipientType: initialAdvanceData.recipientType || "Driver",
        recipientId: initialAdvanceData.recipientId || null,
        amount: initialAdvanceData.amount || "",
        advanceDate: initialAdvanceData.advanceDate || "",
        notes: initialAdvanceData.notes || "",
        status: initialAdvanceData.status || "Pending",
      });
    } else {
      setAdvance({
        recipientType: "Driver",
        recipientId: null,
        amount: "",
        advanceDate: "",
        notes: "",
        status: "Pending",
      });
    }
  }, [isEditing, initialAdvanceData]);
  const handleChange = (key, value) => {
    setAdvance({ ...advance, [key]: value });
  };
  const validateForm = () => {
    if (!advance.recipientType) {
      setError("Recipient type is required");
      return false;
    }
    if (!advance.recipientId) {
      setError("Recipient ID is required");
      return false;
    }
    if (!advance.amount || parseFloat(advance.amount) <= 0) {
      setError("Amount is required and must be positive");
      return false;
    }
    if (!advance.advanceDate) {
      setError("Advance date is required");
      return false;
    }
    if (!advance.status) {
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
      const advanceData = {
        recipientType: advance.recipientType,
        recipientId: parseInt(advance.recipientId),
        amount: parseFloat(advance.amount),
        advanceDate: advance.advanceDate,
        notes: advance.notes,
        status: advance.status,
      };
      if (isEditing) {
        advanceData.id = advance.id;
      }
      await onAddAdvance(advanceData, isEditing);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  const recipientOptions =
    advance.recipientType === "Driver"
      ? drivers.map((d) => ({ value: d.id, label: d.name }))
      : users.map((u) => ({ value: u.id, label: u.username }));
  recipientOptions.unshift({ value: "", label: "Select Recipient" });
  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Partial", label: "Partial" },
    { value: "Deducted", label: "Deducted" },
  ];
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          isSelect={true}
          value={advance.recipientType}
          onChange={({ target }) => handleChange("recipientType", target.value)}
          label={
            <>
              Recipient Type{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          options={[
            { value: "Driver", label: "Driver" },
            { value: "User", label: "User" },
          ]}
        />
        <Input
          isSelect={true}
          value={advance.recipientId || ""}
          onChange={({ target }) =>
            handleChange(
              "recipientId",
              target.value ? parseInt(target.value) : null
            )
          }
          label={
            <>
              Recipient{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          options={recipientOptions}
        />
        <Input
          value={advance.amount}
          onChange={({ target }) => handleChange("amount", target.value)}
          label={
            <>
              Amount <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter amount"
          type="number"
        />
        <Input
          value={advance.advanceDate}
          onChange={({ target }) => handleChange("advanceDate", target.value)}
          label={
            <>
              Advance Date{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Select date"
          type="date"
        />
        <Input
          isSelect={true}
          value={advance.status}
          onChange={({ target }) => handleChange("status", target.value)}
          label={
            <>
              Status <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          options={statusOptions}
        />
        <div className="col-span-2">
          <Input
            value={advance.notes}
            onChange={({ target }) => handleChange("notes", target.value)}
            label={
              <>
                Notes <span className="text-gray-300 text-sm">(Optional)</span>
              </>
            }
            placeholder="Enter notes"
            type="text"
          />
        </div>
      </div>
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
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>{isEditing ? "Update Advance" : "Add Advance"}</>
          )}
        </button>
      </div>
    </div>
  );
};
export default AdvanceForm;
