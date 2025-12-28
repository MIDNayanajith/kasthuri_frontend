import React, { useEffect, useState } from "react";
import Input from "../../../../components/Input";
import { LoaderCircle } from "lucide-react";

const TireMaintenanceForm = ({
  onAddTireMaintenance,
  initialTireMaintenanceData,
  isEditing,
  vehicles,
}) => {
  const [tireMaintenance, setTireMaintenance] = useState({
    vehicleId: null,
    position: "",
    date: "",
    tireBrand: "",
    tireSize: "",
    serialNumber: "",
    description: "",
    mileage: "",
    quantity: 1,
    unitPrice: "",
    totalPrice: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Position options as per your requirement
  const positionOptions = [
    { value: "", label: "Select Position" },
    { value: "ON INVENTORY", label: "ON INVENTORY" },
    { value: "FROUNT LEFT", label: "FROUNT LEFT" },
    { value: "FROUNT RIGHT", label: "FROUNT RIGHT" },
    { value: "REAR MID OUT LEFT", label: "REAR MID OUT LEFT" },
    { value: "REAR MID IN LEFT", label: "REAR MID IN LEFT" },
    { value: "REAR MID IN RIGHT", label: "REAR MID IN RIGHT" },
    { value: "REAR MID OUT RIGHT", label: "REAR MID OUT RIGHT" },
    { value: "REAR BACK OUT LEFT", label: "REAR BACK OUT LEFT" },
    { value: "REAR BACK IN LEFT", label: "REAR BACK IN LEFT" },
    { value: "REAR BACK IN RIGHT", label: "REAR BACK IN RIGHT" },
    { value: "REAR BACK OUT RIGHT", label: "REAR BACK OUT RIGHT" },
    { value: "SPARE WHEEL", label: "SPARE WHEEL" },
    { value: "REAR IN LEFT", label: "REAR IN LEFT" },
    { value: "REAR IN RIGHT", label: "REAR IN RIGHT" },
    { value: "REAR LEFT", label: "REAR LEFT" },
  ];

  useEffect(() => {
    if (isEditing && initialTireMaintenanceData) {
      setTireMaintenance({
        id: initialTireMaintenanceData.id,
        vehicleId: initialTireMaintenanceData.vehicleId || null,
        position: initialTireMaintenanceData.position || "",
        date: initialTireMaintenanceData.date || "",
        tireBrand: initialTireMaintenanceData.tireBrand || "",
        tireSize: initialTireMaintenanceData.tireSize || "",
        serialNumber: initialTireMaintenanceData.serialNumber || "",
        description: initialTireMaintenanceData.description || "",
        mileage: initialTireMaintenanceData.mileage || "",
        quantity: initialTireMaintenanceData.quantity || 1,
        unitPrice: initialTireMaintenanceData.unitPrice || "",
        totalPrice: initialTireMaintenanceData.totalPrice || "",
      });
    } else {
      setTireMaintenance({
        vehicleId: null,
        position: "",
        date: "",
        tireBrand: "",
        tireSize: "",
        serialNumber: "",
        description: "",
        mileage: "",
        quantity: 1,
        unitPrice: "",
        totalPrice: "",
      });
    }
  }, [isEditing, initialTireMaintenanceData]);

  const handleChange = (key, value) => {
    setTireMaintenance({ ...tireMaintenance, [key]: value });
  };

  const validateForm = () => {
    if (!tireMaintenance.vehicleId) {
      setError("Vehicle is required");
      return false;
    }
    if (!tireMaintenance.position) {
      setError("Position is required");
      return false;
    }
    if (!tireMaintenance.date) {
      setError("Date is required");
      return false;
    }
    if (!tireMaintenance.totalPrice) {
      setError("Total Price is required");
      return false;
    }
    if (
      isNaN(tireMaintenance.totalPrice) ||
      parseFloat(tireMaintenance.totalPrice) < 0
    ) {
      setError("Total Price must be a valid number and non-negative");
      return false;
    }
    if (tireMaintenance.mileage && isNaN(tireMaintenance.mileage)) {
      setError("Mileage must be a valid number");
      return false;
    }
    if (
      tireMaintenance.quantity &&
      (isNaN(tireMaintenance.quantity) || tireMaintenance.quantity <= 0)
    ) {
      setError("Quantity must be greater than 0");
      return false;
    }
    if (tireMaintenance.unitPrice && isNaN(tireMaintenance.unitPrice)) {
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
      const tireMaintenanceData = {
        vehicleId: tireMaintenance.vehicleId,
        position: tireMaintenance.position,
        date: tireMaintenance.date,
        tireBrand: tireMaintenance.tireBrand,
        tireSize: tireMaintenance.tireSize,
        serialNumber: tireMaintenance.serialNumber,
        description: tireMaintenance.description,
        mileage: tireMaintenance.mileage
          ? parseFloat(tireMaintenance.mileage)
          : null,
        quantity: parseInt(tireMaintenance.quantity) || 1,
        unitPrice: tireMaintenance.unitPrice
          ? parseFloat(tireMaintenance.unitPrice)
          : null,
        totalPrice: parseFloat(tireMaintenance.totalPrice),
      };

      if (isEditing) {
        tireMaintenanceData.id = tireMaintenance.id;
      }

      await onAddTireMaintenance(tireMaintenanceData, isEditing);
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
          value={tireMaintenance.vehicleId || ""}
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
          isSelect={true}
          value={tireMaintenance.position}
          onChange={({ target }) => handleChange("position", target.value)}
          label={
            <>
              Position <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          options={positionOptions}
        />

        <Input
          value={tireMaintenance.date}
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
          value={tireMaintenance.tireBrand}
          onChange={({ target }) => handleChange("tireBrand", target.value)}
          label="Tire Brand"
          placeholder="Enter tire brand"
          type="text"
        />

        <Input
          value={tireMaintenance.tireSize}
          onChange={({ target }) => handleChange("tireSize", target.value)}
          label="Tire Size"
          placeholder="Enter tire size"
          type="text"
        />

        <Input
          value={tireMaintenance.serialNumber}
          onChange={({ target }) => handleChange("serialNumber", target.value)}
          label="Serial Number"
          placeholder="Enter serial number"
          type="text"
        />

        <Input
          value={tireMaintenance.description}
          onChange={({ target }) => handleChange("description", target.value)}
          label="Description"
          placeholder="Enter description"
          type="text"
        />

        <Input
          value={tireMaintenance.mileage}
          onChange={({ target }) => handleChange("mileage", target.value)}
          label="Mileage (km)"
          placeholder="Enter mileage"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <Input
          value={tireMaintenance.quantity}
          onChange={({ target }) => handleChange("quantity", target.value)}
          label="Quantity"
          placeholder="Enter quantity"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <Input
          value={tireMaintenance.unitPrice}
          onChange={({ target }) => handleChange("unitPrice", target.value)}
          label="Unit Price"
          placeholder="Enter unit price"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <Input
          value={tireMaintenance.totalPrice}
          onChange={({ target }) => handleChange("totalPrice", target.value)}
          label={
            <>
              Total Price{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter total price"
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
            <>
              {isEditing ? "Update Tire Maintenance" : "Add Tire Maintenance"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TireMaintenanceForm;
