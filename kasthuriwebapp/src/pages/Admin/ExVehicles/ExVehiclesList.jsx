import React, { useEffect, useState, useContext } from "react";
import Dashboard from "../../../components/Admin/Dashboard";
import { useUser } from "../../../hooks/useUser";
import { Plus, Search, Truck } from "lucide-react";
import ExVehiclesTable from "./ExVehiclesTable";
import axiosConfig from "../../../Utill/axiosConfig";
import { API_ENDPOINTS } from "../../../Utill/apiEndPoints";
import toast from "react-hot-toast";
import Modal from "../../../components/Admin/Modal";
import ExVehicleForm from "./ExVehicleForm";
import { AppContext } from "../../../context/AppContext";

const ExVehiclesList = () => {
  useUser();
  const { user } = useContext(AppContext);
  const isAdmin = user?.role === "ADMIN";
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddVehicleModal, setOpenAddVehicleModal] = useState(false);
  const [openEditVehicleModal, setOpenEditVehicleModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchVehicleDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EX_VEHICLES);
      if (response.status === 200) {
        setVehicleData(response.data);
        setFilteredVehicles(response.data);
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
          vehicle.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.ownerContact?.toLowerCase().includes(searchTerm.toLowerCase())
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
          API_ENDPOINTS.UPDATE_EX_VEHICLE(selectedVehicle.id),
          vehicleData
        );
      } else {
        response = await axiosConfig.post(
          API_ENDPOINTS.ADD_EX_VEHICLE,
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

  const handleDeleteVehicle = async (vehicleToDelete) => {
    if (
      !window.confirm(
        `Delete vehicle "${vehicleToDelete.regNumber}"? This action cannot be undone.`
      )
    )
      return;
    try {
      await axiosConfig.delete(
        API_ENDPOINTS.DELETE_EX_VEHICLE(vehicleToDelete.id)
      );
      toast.success("Vehicle deleted successfully!");
      fetchVehicleDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete vehicle.");
    }
  };

  return (
    <Dashboard activeMenu="Ex Vehicles">
      <div className="my-5 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="text-[#4F46E5]" size={28} />
              External Vehicle Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage external vehicles and their information
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
        <ExVehiclesTable
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
          title="Add New External Vehicle"
        >
          <ExVehicleForm onAddVehicle={handleAddVehicle} />
        </Modal>
        {/* Edit Vehicle Modal */}
        <Modal
          isOpen={openEditVehicleModal}
          onClose={() => {
            setOpenEditVehicleModal(false);
            setSelectedVehicle(null);
          }}
          title="Edit External Vehicle"
        >
          <ExVehicleForm
            initialVehicleData={selectedVehicle}
            onAddVehicle={handleAddVehicle}
            isEditing={true}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default ExVehiclesList;
