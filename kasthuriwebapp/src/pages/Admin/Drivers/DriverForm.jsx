// src/components/Admin/DriverForm.jsx
import React, { useEffect, useState } from "react";
import Input from "../../../components/Input";
import { LoaderCircle } from "lucide-react";
import { Calendar } from "lucide-react";

const DriverForm = ({ onAddDriver, initialDriverData, isEditing }) => {
  const [driver, setDriver] = useState({
    name: "",
    licenseNumber: "",
    nicNo: "",
    contact: "",
    address: "",
    hireDate: "",
    paymentRate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing && initialDriverData) {
      // Format the date for the input field
      const formattedDate = initialDriverData.hireDate
        ? new Date(initialDriverData.hireDate).toISOString().split("T")[0]
        : "";

      setDriver({
        id: initialDriverData.id,
        name: initialDriverData.name || "",
        licenseNumber: initialDriverData.licenseNumber || "",
        nicNo: initialDriverData.nicNo || "",
        contact: initialDriverData.contact || "",
        address: initialDriverData.address || "",
        hireDate: formattedDate,
        paymentRate: initialDriverData.paymentRate || "",
      });
    } else {
      // Reset form for new driver
      setDriver({
        name: "",
        licenseNumber: "",
        nicNo: "",
        contact: "",
        address: "",
        hireDate: "",
        paymentRate: "",
      });
    }
  }, [isEditing, initialDriverData]);

  const handleChange = (key, value) => {
    setDriver({ ...driver, [key]: value });
  };

  const validateForm = () => {
    if (!driver.name.trim()) {
      setError("Driver Name is required");
      return false;
    }
    if (!driver.licenseNumber.trim()) {
      setError("License Number is required");
      return false;
    }
    if (!driver.nicNo.trim()) {
      setError("NIC Number is required");
      return false;
    }

    if (driver.paymentRate && isNaN(driver.paymentRate)) {
      setError("Payment Rate must be a valid number");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setError("");
    setLoading(true);

    try {
      // Prepare driver data
      const driverData = {
        name: driver.name,
        licenseNumber: driver.licenseNumber,
        nicNo: driver.nicNo,
        contact: driver.contact,
        address: driver.address || "",
        hireDate: driver.hireDate || null,
        paymentRate: driver.paymentRate ? parseFloat(driver.paymentRate) : null,
      };

      // If editing, include the ID
      if (isEditing) {
        driverData.id = driver.id;
      }

      await onAddDriver(driverData, isEditing);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          value={driver.name}
          onChange={({ target }) => handleChange("name", target.value)}
          label={
            <>
              Driver Name{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter driver full name"
          type="text"
        />

        <Input
          value={driver.licenseNumber}
          onChange={({ target }) => handleChange("licenseNumber", target.value)}
          label={
            <>
              License Number{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter license number"
          type="text"
        />

        <Input
          value={driver.nicNo}
          onChange={({ target }) => handleChange("nicNo", target.value)}
          label={
            <>
              NIC Number{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter NIC number"
          type="text"
        />

        <Input
          value={driver.contact}
          onChange={({ target }) => handleChange("contact", target.value)}
          label={
            <>
              Contact Number{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter contact number"
          type="text"
        />

        <div className="col-span-2">
          <Input
            value={driver.address}
            onChange={({ target }) => handleChange("address", target.value)}
            label={
              <>
                Address{" "}
                <span className="text-gray-300 text-sm">(Optional)</span>
              </>
            }
            placeholder="Enter full address"
            type="text"
          />
        </div>

        <Input
          value={driver.hireDate}
          onChange={({ target }) => handleChange("hireDate", target.value)}
          label={
            <>
              Hire Date{" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Select hire date"
          type="date"
        />

        <Input
          value={driver.paymentRate}
          onChange={({ target }) => handleChange("paymentRate", target.value)}
          label={
            <>
              Payment Rate (LKR){" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter payment rate"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
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
            <>{isEditing ? "Update Driver" : "Add Driver"}</>
          )}
        </button>
      </div>
    </div>
  );
};

export default DriverForm;
