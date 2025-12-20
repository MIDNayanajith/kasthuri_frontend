// TransportForm.jsx
import React, { useEffect, useState } from "react";
import Input from "../../../components/Input";
import { LoaderCircle } from "lucide-react";

const TransportForm = ({
  onAddTransport,
  initialTransportData,
  isEditing,
  ownVehicles,
  exVehicles,
  drivers,
}) => {
  const [transport, setTransport] = useState({
    clientName: "",
    description: "",
    startingPoint: "",
    destination: "",
    loadingDate: "",
    unloadingDate: "",
    distanceKm: "",
    agreedAmount: "",
    advanceReceived: "",
    balanceReceived: "",
    tripStatus: 1,
    ownVehicleId: null,
    externalVehicleId: null,
    internalDriverId: null,
  });
  const [vehicleType, setVehicleType] = useState("own"); // 'own' or 'ex'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing && initialTransportData) {
      const isOwn = !!initialTransportData.ownVehicleId;
      setVehicleType(isOwn ? "own" : "ex");
      setTransport({
        id: initialTransportData.id,
        clientName: initialTransportData.clientName || "",
        description: initialTransportData.description || "",
        startingPoint: initialTransportData.startingPoint || "",
        destination: initialTransportData.destination || "",
        loadingDate: initialTransportData.loadingDate || "",
        unloadingDate: initialTransportData.unloadingDate || "",
        distanceKm: initialTransportData.distanceKm || "",
        agreedAmount: initialTransportData.agreedAmount || "",
        advanceReceived: initialTransportData.advanceReceived || "",
        balanceReceived: initialTransportData.balanceReceived || "",
        tripStatus: initialTransportData.tripStatus || 1,
        ownVehicleId: initialTransportData.ownVehicleId || null,
        externalVehicleId: initialTransportData.externalVehicleId || null,
        internalDriverId: initialTransportData.internalDriverId || null,
      });
    } else {
      setTransport({
        clientName: "",
        description: "",
        startingPoint: "",
        destination: "",
        loadingDate: "",
        unloadingDate: "",
        distanceKm: "",
        agreedAmount: "",
        advanceReceived: "",
        balanceReceived: "",
        tripStatus: 1,
        ownVehicleId: null,
        externalVehicleId: null,
        internalDriverId: null,
      });
      setVehicleType("own");
    }
  }, [isEditing, initialTransportData]);

  const handleChange = (key, value) => {
    setTransport({ ...transport, [key]: value });
  };

  const validateForm = () => {
    if (!transport.clientName.trim()) {
      setError("Client name is required");
      return false;
    }
    if (!transport.startingPoint.trim()) {
      setError("Starting point is required");
      return false;
    }
    if (!transport.destination.trim()) {
      setError("Destination is required");
      return false;
    }
    if (!transport.loadingDate) {
      setError("Loading date is required");
      return false;
    }
    if (isNaN(transport.distanceKm) || parseFloat(transport.distanceKm) <= 0) {
      setError("Valid distance (km) is required");
      return false;
    }
    if (
      isNaN(transport.agreedAmount) ||
      parseFloat(transport.agreedAmount) <= 0
    ) {
      setError("Valid agreed amount is required");
      return false;
    }
    if (vehicleType === "own" && !transport.ownVehicleId) {
      setError("Own vehicle is required");
      return false;
    }
    if (vehicleType === "ex" && !transport.externalVehicleId) {
      setError("External vehicle is required");
      return false;
    }
    // Optional fields validation
    if (transport.advanceReceived && isNaN(transport.advanceReceived)) {
      setError("Advance received must be a valid number");
      return false;
    }
    if (transport.balanceReceived && isNaN(transport.balanceReceived)) {
      setError("Balance received must be a valid number");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setError("");
    setLoading(true);
    try {
      const transportData = {
        clientName: transport.clientName,
        description: transport.description,
        startingPoint: transport.startingPoint,
        destination: transport.destination,
        loadingDate: transport.loadingDate,
        unloadingDate: transport.unloadingDate || null,
        distanceKm: parseFloat(transport.distanceKm),
        agreedAmount: parseFloat(transport.agreedAmount),
        advanceReceived: transport.advanceReceived
          ? parseFloat(transport.advanceReceived)
          : 0,
        balanceReceived: transport.balanceReceived
          ? parseFloat(transport.balanceReceived)
          : 0,
        tripStatus: parseInt(transport.tripStatus),
        ownVehicleId: vehicleType === "own" ? transport.ownVehicleId : null,
        externalVehicleId:
          vehicleType === "ex" ? transport.externalVehicleId : null,
        internalDriverId: transport.internalDriverId || null,
      };
      if (isEditing) {
        transportData.id = transport.id;
      }
      await onAddTransport(transportData, isEditing);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const ownVehicleOptions = ownVehicles.map((v) => ({
    value: v.id,
    label: v.regNumber,
  }));
  ownVehicleOptions.unshift({ value: "", label: "Select Own Vehicle" });

  const exVehicleOptions = exVehicles.map((v) => ({
    value: v.id,
    label: v.regNumber,
  }));
  exVehicleOptions.unshift({ value: "", label: "Select External Vehicle" });

  const driverOptions = drivers.map((d) => ({
    value: d.id,
    label: d.name || `Driver ${d.id}`, // Assume driver has name
  }));
  driverOptions.unshift({ value: "", label: "Select Driver (Optional)" });

  const tripStatusOptions = [
    { value: 1, label: "Pending" },
    { value: 2, label: "Completed" },
    { value: 3, label: "Cancelled" },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          value={transport.clientName}
          onChange={({ target }) => handleChange("clientName", target.value)}
          label={
            <>
              Client Name{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter client name"
          type="text"
        />
        <Input
          value={transport.description}
          onChange={({ target }) => handleChange("description", target.value)}
          label={
            <>
              Description{" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter description"
          type="text"
        />
        <Input
          value={transport.startingPoint}
          onChange={({ target }) => handleChange("startingPoint", target.value)}
          label={
            <>
              Starting Point{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter starting point"
          type="text"
        />
        <Input
          value={transport.destination}
          onChange={({ target }) => handleChange("destination", target.value)}
          label={
            <>
              Destination{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter destination"
          type="text"
        />
        <Input
          value={transport.loadingDate}
          onChange={({ target }) => handleChange("loadingDate", target.value)}
          label={
            <>
              Loading Date{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Select loading date"
          type="date"
        />
        <Input
          value={transport.unloadingDate}
          onChange={({ target }) => handleChange("unloadingDate", target.value)}
          label={
            <>
              Unloading Date{" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Select unloading date"
          type="date"
        />
        <Input
          value={transport.distanceKm}
          onChange={({ target }) => handleChange("distanceKm", target.value)}
          label={
            <>
              Distance (km){" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter distance in km"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Input
          value={transport.agreedAmount}
          onChange={({ target }) => handleChange("agreedAmount", target.value)}
          label={
            <>
              Agreed Amount{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter agreed amount"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Input
          value={transport.advanceReceived}
          onChange={({ target }) =>
            handleChange("advanceReceived", target.value)
          }
          label={
            <>
              Advance Received{" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter advance received"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Input
          value={transport.balanceReceived}
          onChange={({ target }) =>
            handleChange("balanceReceived", target.value)
          }
          label={
            <>
              Balance Received{" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter balance received"
          type="number"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Input
          isSelect={true}
          value={transport.tripStatus}
          onChange={({ target }) => handleChange("tripStatus", target.value)}
          label={
            <>
              Trip Status{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          options={tripStatusOptions}
        />
        {/* Vehicle Type Radio */}
        <div className="col-span-2">
          <label className="text-[13px] text-slate-800 block mb-1">
            Vehicle Type{" "}
            <span className="text-gray-300 text-sm">(Required)</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="own"
                checked={vehicleType === "own"}
                onChange={() => setVehicleType("own")}
                className="form-radio text-blue-600"
              />
              Own Vehicle
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="ex"
                checked={vehicleType === "ex"}
                onChange={() => setVehicleType("ex")}
                className="form-radio text-blue-600"
              />
              External Vehicle
            </label>
          </div>
        </div>
        {/* Conditional Vehicle Dropdown */}
        {vehicleType === "own" ? (
          <>
            <Input
              isSelect={true}
              value={transport.ownVehicleId || ""}
              onChange={({ target }) =>
                handleChange(
                  "ownVehicleId",
                  target.value ? parseInt(target.value) : null
                )
              }
              label={
                <>
                  Own Vehicle{" "}
                  <span className="text-gray-300 text-sm">(Required)</span>
                </>
              }
              options={ownVehicleOptions}
            />
            <Input
              isSelect={true}
              value={transport.internalDriverId || ""}
              onChange={({ target }) =>
                handleChange(
                  "internalDriverId",
                  target.value ? parseInt(target.value) : null
                )
              }
              label={
                <>
                  Internal Driver{" "}
                  <span className="text-gray-300 text-sm">(Optional)</span>
                </>
              }
              options={driverOptions}
            />
          </>
        ) : (
          <Input
            isSelect={true}
            value={transport.externalVehicleId || ""}
            onChange={({ target }) =>
              handleChange(
                "externalVehicleId",
                target.value ? parseInt(target.value) : null
              )
            }
            label={
              <>
                External Vehicle{" "}
                <span className="text-gray-300 text-sm">(Required)</span>
              </>
            }
            options={exVehicleOptions}
          />
        )}
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
            <>{isEditing ? "Update Transport" : "Add Transport"}</>
          )}
        </button>
      </div>
    </div>
  );
};

export default TransportForm;
