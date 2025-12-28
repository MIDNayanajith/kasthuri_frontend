import React, { useEffect, useState } from "react";
import Input from "../../../../components/Input";
import { LoaderCircle, Fuel } from "lucide-react";

const FuelForm = ({
  onAddFuel,
  initialFuelData,
  isEditing,
  ownVehicles,
  transports,
}) => {
  const [fuel, setFuel] = useState({
    fuelDate: "",
    vehicleId: null,
    tripId: null,
    odometerReading: "",
    fuelQuantity: "",
    totalCost: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filteredTransports, setFilteredTransports] = useState([]);

  useEffect(() => {
    if (isEditing && initialFuelData) {
      setFuel({
        id: initialFuelData.id,
        fuelDate: initialFuelData.fuelDate || "",
        vehicleId: initialFuelData.vehicleId || null,
        tripId: initialFuelData.tripId || null,
        odometerReading: initialFuelData.odometerReading || "",
        fuelQuantity: initialFuelData.fuelQuantity || "",
        totalCost: initialFuelData.totalCost || "",
        notes: initialFuelData.notes || "",
      });
    } else {
      setFuel({
        fuelDate: new Date().toISOString().split("T")[0],
        vehicleId: null,
        tripId: null,
        odometerReading: "",
        fuelQuantity: "",
        totalCost: "",
        notes: "",
      });
    }
  }, [isEditing, initialFuelData]);

  // Filter transports based on selected vehicle
  useEffect(() => {
    if (fuel.vehicleId) {
      const filtered = transports.filter(
        (t) =>
          t.ownVehicleId === fuel.vehicleId ||
          t.externalVehicleId === fuel.vehicleId
      );
      setFilteredTransports(filtered);
    } else {
      setFilteredTransports(transports);
    }
  }, [fuel.vehicleId, transports]);

  const handleChange = (key, value) => {
    setFuel({ ...fuel, [key]: value });
  };

  const validateForm = () => {
    if (!fuel.fuelDate) {
      setError("Fuel date is required");
      return false;
    }
    if (!fuel.vehicleId) {
      setError("Vehicle is required");
      return false;
    }
    if (!fuel.fuelQuantity || parseFloat(fuel.fuelQuantity) <= 0) {
      setError("Valid fuel quantity is required");
      return false;
    }
    if (!fuel.totalCost || parseFloat(fuel.totalCost) <= 0) {
      setError("Valid total cost is required");
      return false;
    }
    if (fuel.odometerReading && parseFloat(fuel.odometerReading) < 0) {
      setError("Odometer reading must be positive");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setError("");
    setLoading(true);
    try {
      const fuelData = {
        fuelDate: fuel.fuelDate,
        vehicleId: parseInt(fuel.vehicleId),
        tripId: fuel.tripId ? parseInt(fuel.tripId) : null,
        odometerReading: fuel.odometerReading
          ? parseFloat(fuel.odometerReading)
          : null,
        fuelQuantity: parseFloat(fuel.fuelQuantity),
        totalCost: parseFloat(fuel.totalCost),
        notes: fuel.notes || "",
      };

      if (isEditing) {
        fuelData.id = fuel.id;
      }

      await onAddFuel(fuelData, isEditing);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const vehicleOptions = ownVehicles.map((v) => ({
    value: v.id,
    label: `${v.regNumber} - ${v.model || v.make || "Vehicle"}`,
  }));
  vehicleOptions.unshift({ value: "", label: "Select Vehicle" });

  const transportOptions = filteredTransports.map((t) => ({
    value: t.id,
    label: `${t.clientName} - ${t.startingPoint} to ${t.destination} (${t.loadingDate})`,
  }));
  transportOptions.unshift({ value: "", label: "Select Trip (Optional)" });

  const calculateUnitPrice = () => {
    if (fuel.fuelQuantity && fuel.totalCost) {
      const quantity = parseFloat(fuel.fuelQuantity);
      const cost = parseFloat(fuel.totalCost);
      if (quantity > 0) {
        return (cost / quantity).toFixed(2);
      }
    }
    return "0.00";
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          value={fuel.fuelDate}
          onChange={({ target }) => handleChange("fuelDate", target.value)}
          label={
            <>
              Fuel Date{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Select fuel date"
          type="date"
        />

        <Input
          isSelect={true}
          value={fuel.vehicleId || ""}
          onChange={({ target }) =>
            handleChange("vehicleId", target.value || null)
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
          value={fuel.tripId || ""}
          onChange={({ target }) =>
            handleChange("tripId", target.value || null)
          }
          label={
            <>
              Trip <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          options={transportOptions}
          disabled={!fuel.vehicleId}
          helpText={
            !fuel.vehicleId ? "Select a vehicle first to see trips" : ""
          }
        />

        <Input
          value={fuel.odometerReading}
          onChange={({ target }) =>
            handleChange("odometerReading", target.value)
          }
          label={
            <>
              Odometer Reading{" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter odometer reading"
          type="number"
          step="0.01"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <Input
          value={fuel.fuelQuantity}
          onChange={({ target }) => handleChange("fuelQuantity", target.value)}
          label={
            <>
              Fuel Quantity (Liters){" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter fuel quantity in liters"
          type="number"
          step="0.01"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <Input
          value={fuel.totalCost}
          onChange={({ target }) => handleChange("totalCost", target.value)}
          label={
            <>
              Total Cost (LKR){" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter total cost"
          type="number"
          step="0.01"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        {/* Unit Price Display */}
        <div className="md:col-span-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                Unit Price:
              </span>
              <span className="text-lg font-bold text-blue-900">
                LKR {calculateUnitPrice()} per liter
              </span>
            </div>
            {fuel.fuelQuantity && fuel.totalCost && (
              <p className="text-xs text-blue-600 mt-1">
                Calculated automatically from total cost and quantity
              </p>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="text-[13px] text-slate-800 block mb-1">
            Notes <span className="text-gray-300 text-sm">(Optional)</span>
          </label>
          <textarea
            value={fuel.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Enter any additional notes"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
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
            <>
              <Fuel className="w-4 h-4" />
              {isEditing ? "Update Fuel Record" : "Add Fuel Record"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FuelForm;
