// PaymentForm.jsx
import React, { useEffect, useState } from "react";
import Input from "../../../../components/Input";
import { LoaderCircle } from "lucide-react";

const PaymentForm = ({
  onAddPayment,
  initialPaymentData,
  isEditing,
  drivers,
  users,
}) => {
  const [payment, setPayment] = useState({
    recipientType: "Driver",
    recipientId: null,
    periodMonth: "",
    periodYear: "",
    baseAmount: "",
    tripBonus: "",
    deductions: "",
    advancesDeducted: "",
    paymentDate: "",
    status: "Pending",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing && initialPaymentData) {
      setPayment({
        id: initialPaymentData.id,
        recipientType: initialPaymentData.recipientType || "Driver",
        recipientId: initialPaymentData.recipientId || null,
        periodMonth: initialPaymentData.periodMonth || "",
        periodYear: initialPaymentData.periodYear || "",
        baseAmount: initialPaymentData.baseAmount || "",
        tripBonus: initialPaymentData.tripBonus || "",
        deductions: initialPaymentData.deductions || "",
        advancesDeducted: initialPaymentData.advancesDeducted || "",
        paymentDate: initialPaymentData.paymentDate || "",
        status: initialPaymentData.status || "Pending",
        notes: initialPaymentData.notes || "",
      });
    } else {
      setPayment({
        recipientType: "Driver",
        recipientId: null,
        periodMonth: "",
        periodYear: "",
        baseAmount: "",
        tripBonus: "",
        deductions: "",
        advancesDeducted: "",
        paymentDate: "",
        status: "Pending",
        notes: "",
      });
    }
  }, [isEditing, initialPaymentData]);

  const handleChange = (key, value) => {
    setPayment({ ...payment, [key]: value });
  };

  const validateForm = () => {
    if (!payment.recipientType) {
      setError("Recipient type is required");
      return false;
    }
    if (!payment.recipientId) {
      setError("Recipient ID is required");
      return false;
    }
    if (!payment.periodMonth || !payment.periodYear) {
      setError("Period month and year are required");
      return false;
    }
    if (!payment.baseAmount) {
      setError("Base amount is required");
      return false;
    }
    if (!payment.status) {
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
      const paymentData = {
        recipientType: payment.recipientType,
        recipientId: parseInt(payment.recipientId),
        periodMonth: parseInt(payment.periodMonth),
        periodYear: parseInt(payment.periodYear),
        baseAmount: parseFloat(payment.baseAmount),
        tripBonus: payment.tripBonus ? parseFloat(payment.tripBonus) : null,
        deductions: payment.deductions ? parseFloat(payment.deductions) : null,
        advancesDeducted: payment.advancesDeducted
          ? parseFloat(payment.advancesDeducted)
          : null,
        paymentDate: payment.paymentDate || null,
        status: payment.status,
        notes: payment.notes,
      };
      if (isEditing) {
        paymentData.id = payment.id;
      }
      await onAddPayment(paymentData, isEditing);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const recipientOptions =
    payment.recipientType === "Driver"
      ? drivers.map((d) => ({ value: d.id, label: d.name }))
      : users.map((u) => ({ value: u.id, label: u.username }));

  recipientOptions.unshift({ value: "", label: "Select Recipient" });

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Paid", label: "Paid" },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          isSelect={true}
          value={payment.recipientType}
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
          value={payment.recipientId || ""}
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
          value={payment.periodMonth}
          onChange={({ target }) => handleChange("periodMonth", target.value)}
          label={
            <>
              Period Month{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter month (1-12)"
          type="number"
        />
        <Input
          value={payment.periodYear}
          onChange={({ target }) => handleChange("periodYear", target.value)}
          label={
            <>
              Period Year{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter year"
          type="number"
        />
        <Input
          value={payment.baseAmount}
          onChange={({ target }) => handleChange("baseAmount", target.value)}
          label={
            <>
              Base Amount{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter base amount"
          type="number"
        />
        <Input
          value={payment.tripBonus}
          onChange={({ target }) => handleChange("tripBonus", target.value)}
          label={
            <>
              Trip Bonus{" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter trip bonus"
          type="number"
        />
        <Input
          value={payment.deductions}
          onChange={({ target }) => handleChange("deductions", target.value)}
          label={
            <>
              Deductions{" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter deductions"
          type="number"
        />
        <Input
          value={payment.advancesDeducted}
          onChange={({ target }) =>
            handleChange("advancesDeducted", target.value)
          }
          label={
            <>
              Advances Deducted{" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter advances deducted"
          type="number"
        />
        <Input
          value={payment.paymentDate}
          onChange={({ target }) => handleChange("paymentDate", target.value)}
          label={
            <>
              Payment Date{" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Select date"
          type="date"
        />
        <Input
          isSelect={true}
          value={payment.status}
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
            value={payment.notes}
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
            <>{isEditing ? "Update Payment" : "Add Payment"}</>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
