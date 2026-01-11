import React, { useEffect, useState, useContext } from "react";
import Dashboard from "../../../components/Admin/Dashboard";
import { useUser } from "../../../hooks/useUser";
import { Plus, Users, Search, Truck, Trash2 } from "lucide-react"; // Added Trash2
import OwnVehiclesTable from "./OwnVehiclesTable"; // Adjust path if needed
import axiosConfig from "../../../Utill/axiosConfig";
import { API_ENDPOINTS } from "../../../Utill/apiEndPoints";
import toast from "react-hot-toast";
import Modal from "../../../components/Admin/Modal";
import OwnVehicleForm from "./OwnVehicleForm"; // Adjust path if needed
import { AppContext } from "../../../context/AppContext";

const OwnVehiclesList = () => {
  useUser();
  const { user } = useContext(AppContext);
  const isAdmin = user?.role === "ADMIN";
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddVehicleModal, setOpenAddVehicleModal] = useState(false);
  const [openEditVehicleModal, setOpenEditVehicleModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchVehicleDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const [vehiclesResponse, driversResponse] = await Promise.all([
        axiosConfig.get(API_ENDPOINTS.GET_ALL_OWN_VEHICLES),
        axiosConfig.get(API_ENDPOINTS.GET_ALL_DRIVERS),
      ]);
      if (vehiclesResponse.status === 200) {
        const vehiclesWithDriverNames = vehiclesResponse.data.map((v) => ({
          ...v,
          assignedDriverName:
            driversResponse.data.find((d) => d.id === v.assignedDriverId)
              ?.name || "None",
        }));
        setVehicleData(vehiclesWithDriverNames);
        setFilteredVehicles(vehiclesWithDriverNames);
      }
      if (driversResponse.status === 200) {
        setDriverData(driversResponse.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleDetails();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = vehicleData.filter(
        (vehicle) =>
          vehicle.regNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicleData);
    }
  }, [searchTerm, vehicleData]);

  const handleAddVehicle = async (vehicleData, isEditing = false) => {
    try {
      let response;
      if (isEditing && selectedVehicle) {
        response = await axiosConfig.put(
          API_ENDPOINTS.UPDATE_OWN_VEHICLE(selectedVehicle.id),
          vehicleData
        );
      } else {
        response = await axiosConfig.post(
          API_ENDPOINTS.ADD_OWN_VEHICLE,
          vehicleData
        );
      }
      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Vehicle ${isEditing ? "updated" : "added"} successfully!`
        );
        setOpenAddVehicleModal(false);
        setOpenEditVehicleModal(false);
        setSelectedVehicle(null);
        fetchVehicleDetails();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "add"} vehicle!`
      );
      throw error;
    }
  };

  const handleEditVehicle = (vehicleToEdit) => {
    setSelectedVehicle(vehicleToEdit);
    setOpenEditVehicleModal(true);
  };

  // Helper function for actual deletion
  const performDelete = async (vehicleToDelete) => {
    try {
      await axiosConfig.delete(
        API_ENDPOINTS.DELETE_OWN_VEHICLE(vehicleToDelete.id)
      );
      toast.success("Vehicle deleted successfully!");
      fetchVehicleDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete vehicle.");
    }
  };

  const handleDeleteVehicle = async (vehicleToDelete) => {
    // Show toast confirmation instead of window.confirm
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 border-red-500`}
        >
          <div className="w-full p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Confirm Delete
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Delete vehicle "{vehicleToDelete.regNumber}"?
                  <span className="block text-red-600 font-medium mt-1">
                    This action cannot be undone.
                  </span>
                </p>
                <div className="mt-4 flex space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                    onClick={() => {
                      toast.dismiss(t.id);
                      performDelete(vehicleToDelete);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Don't auto-dismiss
      }
    );
  };

  return (
    <Dashboard activeMenu="Vehicles">
      <div className="my-5 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="text-[#4F46E5]" size={28} />
              Vehicle Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage own vehicles and their information
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent w-full sm:w-64"
              />
            </div>
            <button
              onClick={() => setOpenAddVehicleModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C73E6] text-white px-4 py-2.5 rounded-lg cursor-pointer hover:shadow-lg hover:from-[#3E36D5] hover:to-[#6B63D6] transition-all duration-300 shadow-md"
            >
              <Plus size={18} />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>
        <OwnVehiclesTable
          vehicles={filteredVehicles}
          onEditVehicle={handleEditVehicle}
          onDeleteVehicle={handleDeleteVehicle}
          loading={loading}
          isAdmin={isAdmin}
        />
        {/* Add Vehicle Modal */}
        <Modal
          isOpen={openAddVehicleModal}
          onClose={() => setOpenAddVehicleModal(false)}
          title="Add New Vehicle"
        >
          <OwnVehicleForm
            onAddVehicle={handleAddVehicle}
            drivers={driverData}
          />
        </Modal>
        {/* Edit Vehicle Modal */}
        <Modal
          isOpen={openEditVehicleModal}
          onClose={() => {
            setOpenEditVehicleModal(false);
            setSelectedVehicle(null);
          }}
          title="Edit Vehicle"
        >
          <OwnVehicleForm
            initialVehicleData={selectedVehicle}
            onAddVehicle={handleAddVehicle}
            isEditing={true}
            drivers={driverData}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default OwnVehiclesList;
