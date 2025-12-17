import React, { useEffect, useState } from "react";
import Input from "../../../components/Input";
import { LoaderCircle } from "lucide-react";
const MaintenanceForm = ({
  onAddMaintenance,
  initialMaintenanceData,
  isEditing,
  vehicles,
}) => {
  const [maintenance, setMaintenance] = useState({
    vehicleId: null,
    date: "",
    description: "",
    mileage: "",
    quantity: 1,
    unitPrice: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (isEditing && initialMaintenanceData) {
      setMaintenance({
        id: initialMaintenanceData.id,
        vehicleId: initialMaintenanceData.vehicleId || null,
        date: initialMaintenanceData.date || "",
        description: initialMaintenanceData.description || "",
        mileage: initialMaintenanceData.mileage || "",
        quantity: initialMaintenanceData.quantity || 1,
        unitPrice: initialMaintenanceData.unitPrice || "",
      });
    } else {
      setMaintenance({
        vehicleId: null,
        date: "",
        description: "",
        mileage: "",
        quantity: 1,
        unitPrice: "",
      });
    }
  }, [isEditing, initialMaintenanceData]);
  const handleChange = (key, value) => {
    setMaintenance({ ...maintenance, [key]: value });
  };
  const validateForm = () => {
    if (!maintenance.vehicleId) {
      setError("Vehicle is required");
      return false;
    }
    if (!maintenance.date) {
      setError("Date is required");
      return false;
    }
    if (!maintenance.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (maintenance.mileage && isNaN(maintenance.mileage)) {
      setError("Mileage must be a valid number");
      return false;
    }
    if (maintenance.quantity <= 0) {
      setError("Quantity must be greater than 0");
      return false;
    }
    if (maintenance.unitPrice && isNaN(maintenance.unitPrice)) {
      setError("Unit Price must be a valid number");
      return false;
    }
    return true;
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setError("");
    setLoading(true);
    try {
      const maintenanceData = {
        vehicleId: maintenance.vehicleId,
        date: maintenance.date,
        description: maintenance.description,
        mileage: maintenance.mileage ? parseFloat(maintenance.mileage) : null,
        quantity: parseInt(maintenance.quantity),
        unitPrice: maintenance.unitPrice
          ? parseFloat(maintenance.unitPrice)
          : null,
      };
      if (isEditing) {
        maintenanceData.id = maintenance.id;
      }
      await onAddMaintenance(maintenanceData, isEditing);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  const vehicleOptions = vehicles.map((v) => ({
    value: v.id,
    label: v.regNumber,
  }));
  vehicleOptions.unshift({ value: "", label: "Select Vehicle" });
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          isSelect={true}
          value={maintenance.vehicleId || ""}
          onChange={({ target }) =>
            handleChange(
              "vehicleId",
              target.value ? parseInt(target.value) : null
            )
          }
          label={
            <>
              Vehicle <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          options={vehicleOptions}
        />
        <Input
          value={maintenance.date}
          onChange={({ target }) => handleChange("date", target.value)}
          label={
            <>
              Date <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Select date"
          type="date"
        />
        <Input
          value={maintenance.description}
          onChange={({ target }) => handleChange("description", target.value)}
          label={
            <>
              Description{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter description"
          type="text"
        />
        <Input
          value={maintenance.mileage}
          onChange={({ target }) => handleChange("mileage", target.value)}
          label={
            <>
              Mileage (km){" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter mileage"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Input
          value={maintenance.quantity}
          onChange={({ target }) => handleChange("quantity", target.value)}
          label={
            <>
              Quantity{" "}
              <span className="text-gray-300 text-sm">(Default: 1)</span>
            </>
          }
          placeholder="Enter quantity"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Input
          value={maintenance.unitPrice}
          onChange={({ target }) => handleChange("unitPrice", target.value)}
          label={
            <>
              Unit Price{" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter unit price"
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
            <>{isEditing ? "Update Maintenance" : "Add Maintenance"}</>
          )}
        </button>
      </div>
    </div>
  );
};
export default MaintenanceForm;
