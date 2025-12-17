import React, { useEffect, useState } from "react";
import Input from "../../../components/Input";
import { LoaderCircle } from "lucide-react";

const ExVehicleForm = ({ onAddVehicle, initialVehicleData, isEditing }) => {
  const [vehicle, setVehicle] = useState({
    regNumber: "",
    ownerName: "",
    ownerContact: "",
    hireRate: "",
    vehicleUsage: "",
    advance: "",
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
        advance: initialVehicleData.advance || "",
      });
    } else {
      setVehicle({
        regNumber: "",
        ownerName: "",
        ownerContact: "",
        hireRate: "",
        vehicleUsage: "",
        advance: "",
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
      !vehicle.vehicleUsage ||
      isNaN(vehicle.vehicleUsage) ||
      parseFloat(vehicle.vehicleUsage) <= 0
    ) {
      setError("Vehicle Usage must be a valid positive number");
      return false;
    }
    if (
      vehicle.advance &&
      (isNaN(vehicle.advance) || parseFloat(vehicle.advance) < 0)
    ) {
      setError("Advance must be a valid non-negative number");
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
        vehicleUsage: parseFloat(vehicle.vehicleUsage),
        advance: vehicle.advance ? parseFloat(vehicle.advance) : 0,
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
              Hire Rate (LKR){" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter hire rate"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Input
          value={vehicle.vehicleUsage}
          onChange={({ target }) => handleChange("vehicleUsage", target.value)}
          label={
            <>
              Vehicle Usage (km/days){" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter vehicle usage"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Input
          value={vehicle.advance}
          onChange={({ target }) => handleChange("advance", target.value)}
          label={
            <>
              Advance (LKR){" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter advance"
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
            <>{isEditing ? "Update Vehicle" : "Add Vehicle"}</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExVehicleForm;
