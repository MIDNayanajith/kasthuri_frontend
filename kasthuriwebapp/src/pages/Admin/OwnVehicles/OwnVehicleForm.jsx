import React, { useEffect, useState } from "react";
import Input from "../../../components/Input";
import { LoaderCircle } from "lucide-react";

const OwnVehicleForm = ({
  onAddVehicle,
  initialVehicleData,
  isEditing,
  drivers,
}) => {
  const [vehicle, setVehicle] = useState({
    regNumber: "",
    type: "",
    capacity: "",
    currentMileage: "",
    status: "Available",
    assignedDriverId: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing && initialVehicleData) {
      setVehicle({
        id: initialVehicleData.id,
        regNumber: initialVehicleData.regNumber || "",
        type: initialVehicleData.type || "",
        capacity: initialVehicleData.capacity || "",
        currentMileage: initialVehicleData.currentMileage || "",
        status: initialVehicleData.status || "Available",
        assignedDriverId: initialVehicleData.assignedDriverId || null,
      });
    } else {
      setVehicle({
        regNumber: "",
        type: "",
        capacity: "",
        currentMileage: "",
        status: "Available",
        assignedDriverId: null,
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
    if (vehicle.capacity && isNaN(vehicle.capacity)) {
      setError("Capacity must be a valid number");
      return false;
    }
    if (vehicle.currentMileage && isNaN(vehicle.currentMileage)) {
      setError("Current Mileage must be a valid number");
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
        type: vehicle.type || null,
        capacity: vehicle.capacity ? parseFloat(vehicle.capacity) : null,
        currentMileage: vehicle.currentMileage
          ? parseFloat(vehicle.currentMileage)
          : null,
        status: vehicle.status,
        assignedDriverId: vehicle.assignedDriverId || null,
      };
      if (isEditing) {
        vehicleData.id = vehicle.id;
      }
      await onAddVehicle(vehicleData, isEditing);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const driverOptions = drivers.map((d) => ({
    value: d.id,
    label: d.name,
  }));
  driverOptions.unshift({ value: null, label: "None" });

  const statusOptions = [
    { value: "Available", label: "Available" },
    { value: "Busy", label: "Busy" },
    { value: "Maintenance", label: "Maintenance" },
  ];

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
          value={vehicle.type}
          onChange={({ target }) => handleChange("type", target.value)}
          label={
            <>
              Vehicle Type{" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter vehicle type (e.g., Container)"
          type="text"
        />
        <Input
          value={vehicle.capacity}
          onChange={({ target }) => handleChange("capacity", target.value)}
          label={
            <>
              Capacity (kg){" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter capacity"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Input
          value={vehicle.currentMileage}
          onChange={({ target }) =>
            handleChange("currentMileage", target.value)
          }
          label={
            <>
              Current Mileage (km){" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter current mileage"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Input
          isSelect={true}
          value={vehicle.status}
          onChange={({ target }) => handleChange("status", target.value)}
          label={
            <>
              Status <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          options={statusOptions}
        />
        <Input
          isSelect={true}
          value={vehicle.assignedDriverId || ""}
          onChange={({ target }) =>
            handleChange(
              "assignedDriverId",
              target.value ? parseInt(target.value) : null
            )
          }
          label={
            <>
              Assigned Driver{" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          options={driverOptions}
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
            <>{isEditing ? "Update Vehicle" : "Add Vehicle"}</>
          )}
        </button>
      </div>
    </div>
  );
};

export default OwnVehicleForm;
