// ExVehicleForm.jsx
import React, { useEffect, useState } from "react";
import Input from "../../../components/Input";
import { LoaderCircle } from "lucide-react";

const ExVehicleForm = ({
  onAddVehicle,
  initialVehicleData,
  isEditing,
  onMakePayment,
}) => {
  const [vehicle, setVehicle] = useState({
    regNumber: "",
    ownerName: "",
    ownerContact: "",
    hireRate: "",
    vehicleUsage: "",
    advancePaid: "",
    date: "",
    newPayment: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing && initialVehicleData) {
      setVehicle({
        id: initialVehicleData.id,
        regNumber: initialVehicleData.regNumber || "",
        ownerName: initialVehicleData.ownerName || "",
        ownerContact: initialVehicleData.ownerContact || "",
        hireRate: initialVehicleData.hireRate || "",
        vehicleUsage: initialVehicleData.vehicleUsage || "",
        advancePaid: initialVehicleData.advancePaid || "",
        date: initialVehicleData.date || "",
        newPayment: "",
      });
    } else {
      setVehicle({
        regNumber: "",
        ownerName: "",
        ownerContact: "",
        hireRate: "",
        vehicleUsage: "",
        advancePaid: "",
        date: "",
        newPayment: "",
      });
    }
  }, [isEditing, initialVehicleData]);

  const handleChange = (key, value) => {
    setVehicle({ ...vehicle, [key]: value });
  };

  const validateForm = () => {
    if (!vehicle.regNumber.trim()) {
      setError("Registration Number is required");
      return false;
    }
    if (!vehicle.ownerName.trim()) {
      setError("Owner Name is required");
      return false;
    }
    if (!vehicle.ownerContact.trim()) {
      setError("Owner Contact is required");
      return false;
    }
    if (
      !vehicle.hireRate ||
      isNaN(vehicle.hireRate) ||
      parseFloat(vehicle.hireRate) <= 0
    ) {
      setError("Hire Rate must be a valid positive number");
      return false;
    }
    if (
      vehicle.vehicleUsage &&
      (isNaN(vehicle.vehicleUsage) || parseFloat(vehicle.vehicleUsage) <= 0)
    ) {
      setError("Vehicle Usage must be a valid positive number if provided");
      return false;
    }
    if (
      vehicle.advancePaid &&
      (isNaN(vehicle.advancePaid) || parseFloat(vehicle.advancePaid) < 0)
    ) {
      setError("Advance must be a valid non-negative number");
      return false;
    }
    if (!vehicle.date) {
      setError("Date is required");
      return false;
    }
    if (
      isEditing &&
      vehicle.newPayment &&
      (isNaN(vehicle.newPayment) || parseFloat(vehicle.newPayment) <= 0)
    ) {
      setError("Payment amount must be a valid positive number");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setError("");
    setLoading(true);
    try {
      const vehicleData = {
        regNumber: vehicle.regNumber,
        ownerName: vehicle.ownerName,
        ownerContact: vehicle.ownerContact,
        hireRate: parseFloat(vehicle.hireRate),
        vehicleUsage: vehicle.vehicleUsage
          ? parseFloat(vehicle.vehicleUsage)
          : null,
        advancePaid: vehicle.advancePaid ? parseFloat(vehicle.advancePaid) : 0,
        date: vehicle.date,
      };

      if (isEditing) {
        vehicleData.id = vehicle.id;
        if (vehicle.newPayment) {
          vehicleData.newPayment = parseFloat(vehicle.newPayment);
        }
      }

      await onAddVehicle(vehicleData, isEditing);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleMakePayment = async () => {
    if (
      !vehicle.newPayment ||
      isNaN(vehicle.newPayment) ||
      parseFloat(vehicle.newPayment) <= 0
    ) {
      setError("Payment amount must be a valid positive number");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onMakePayment(vehicle.id, parseFloat(vehicle.newPayment));
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          value={vehicle.regNumber}
          onChange={({ target }) => handleChange("regNumber", target.value)}
          label={
            <>
              Registration Number{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter registration number"
          type="text"
        />
        <Input
          value={vehicle.ownerName}
          onChange={({ target }) => handleChange("ownerName", target.value)}
          label={
            <>
              Owner Name{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter owner name"
          type="text"
        />
        <Input
          value={vehicle.ownerContact}
          onChange={({ target }) => handleChange("ownerContact", target.value)}
          label={
            <>
              Owner Contact{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter owner contact"
          type="text"
        />
        <Input
          value={vehicle.hireRate}
          onChange={({ target }) => handleChange("hireRate", target.value)}
          label={
            <>
              Total Hire Rate (LKR){" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter total hire rate"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Input
          value={vehicle.vehicleUsage}
          onChange={({ target }) => handleChange("vehicleUsage", target.value)}
          label={
            <>
              Vehicle Usage (km/days){" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter vehicle usage"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Input
          value={vehicle.advancePaid}
          onChange={({ target }) => handleChange("advancePaid", target.value)}
          label={
            <>
              Advance Paid (LKR){" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter advance paid"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Input
          value={vehicle.date}
          onChange={({ target }) => handleChange("date", target.value)}
          label={
            <>
              Date <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Select date"
          type="date"
        />
      </div>

      {isEditing && initialVehicleData && initialVehicleData.balance > 0 && (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Make Additional Payment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-3 rounded border">
              <p className="text-sm text-gray-600">Total Hire Rate</p>
              <p className="text-lg font-bold text-gray-800">
                {initialVehicleData.hireRate
                  ? parseFloat(initialVehicleData.hireRate).toFixed(2)
                  : "0.00"}{" "}
                LKR
              </p>
            </div>
            <div className="bg-white p-3 rounded border">
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-lg font-bold text-green-600">
                {initialVehicleData.totalPaid
                  ? parseFloat(initialVehicleData.totalPaid).toFixed(2)
                  : "0.00"}{" "}
                LKR
              </p>
            </div>
            <div className="bg-white p-3 rounded border">
              <p className="text-sm text-gray-600">Balance</p>
              <p className="text-lg font-bold text-red-600">
                {initialVehicleData.balance
                  ? parseFloat(initialVehicleData.balance).toFixed(2)
                  : "0.00"}{" "}
                LKR
              </p>
            </div>
          </div>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Input
                value={vehicle.newPayment}
                onChange={({ target }) =>
                  handleChange("newPayment", target.value)
                }
                label="Additional Payment Amount (LKR)"
                placeholder="Enter payment amount"
                type="number"
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <button
              type="button"
              onClick={handleMakePayment}
              disabled={
                loading ||
                !vehicle.newPayment ||
                parseFloat(vehicle.newPayment) <= 0
              }
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-lg cursor-pointer hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-md h-10"
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Record Payment</>
              )}
            </button>
          </div>
        </div>
      )}

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
            <>{isEditing ? "Update Vehicle" : "Add Vehicle"}</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExVehicleForm;
