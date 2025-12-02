// src/pages/Admin/Drivers/DriverList.jsx
import React, { useEffect, useState } from "react";
import Dashboard from "../../../components/Admin/Dashboard";
import { useUser } from "../../../hooks/useUser";
import { Plus, Users, Search, Car } from "lucide-react";
import DriversTable from "./DriversTable";
import axiosConfig from "../../../Utill/axiosConfig";
import { API_ENDPOINTS } from "../../../Utill/apiEndPoints";
import toast from "react-hot-toast";
import Modal from "../../../components/Admin/Modal";
import DriverForm from "./DriverForm";

const DriverList = () => {
  useUser();

  const [loading, setLoading] = useState(false);
  const [driverData, setDriverData] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddDriverModal, setOpenAddDriverModal] = useState(false);
  const [openEditDriverModal, setOpenEditDriverModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const fetchDriverDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_DRIVERS);
      if (response.status === 200) {
        setDriverData(response.data);
        setFilteredDrivers(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch drivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverDetails();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = driverData.filter(
        (driver) =>
          driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.licenseNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          driver.nicNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.contact?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDrivers(filtered);
    } else {
      setFilteredDrivers(driverData);
    }
  }, [searchTerm, driverData]);

  const handleAddDriver = async (driverData, isEditing = false) => {
    try {
      let response;

      if (isEditing && selectedDriver) {
        response = await axiosConfig.put(
          API_ENDPOINTS.UPDATE_DRIVER(selectedDriver.id),
          driverData
        );
      } else {
        response = await axiosConfig.post(API_ENDPOINTS.ADD_DRIVER, driverData);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Driver ${isEditing ? "updated" : "added"} successfully!`
        );
        setOpenAddDriverModal(false);
        setOpenEditDriverModal(false);
        setSelectedDriver(null);
        fetchDriverDetails();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "add"} driver!`
      );
      throw error; // Re-throw to be caught in the form
    }
  };

  const handleEditDriver = (driverToEdit) => {
    setSelectedDriver(driverToEdit);
    setOpenEditDriverModal(true);
  };

  const handleDeleteDriver = async (driverToDelete) => {
    if (
      !window.confirm(
        `Delete driver "${driverToDelete.name}"? This action cannot be undone.`
      )
    )
      return;

    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_DRIVER(driverToDelete.id));
      toast.success("Driver deleted successfully!");
      fetchDriverDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete driver.");
    }
  };

  return (
    <Dashboard activeMenu="Drivers">
      <div className="my-5 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Car className="text-[#4F46E5]" size={28} />
              Driver Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage drivers and their information
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
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent w-full sm:w-64"
              />
            </div>

            <button
              onClick={() => setOpenAddDriverModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C73E6] text-white px-4 py-2.5 rounded-lg cursor-pointer hover:shadow-lg hover:from-[#3E36D5] hover:to-[#6B63D6] transition-all duration-300 shadow-md"
            >
              <Plus size={18} />
              <span>Add Driver</span>
            </button>
          </div>
        </div>

        <DriversTable
          drivers={filteredDrivers}
          onEditDriver={handleEditDriver}
          onDeleteDriver={handleDeleteDriver}
          loading={loading}
        />

        {/* Add Driver Modal */}
        <Modal
          isOpen={openAddDriverModal}
          onClose={() => setOpenAddDriverModal(false)}
          title="Add New Driver"
        >
          <DriverForm onAddDriver={handleAddDriver} />
        </Modal>

        {/* Edit Driver Modal */}
        <Modal
          isOpen={openEditDriverModal}
          onClose={() => {
            setOpenEditDriverModal(false);
            setSelectedDriver(null);
          }}
          title="Edit Driver"
        >
          <DriverForm
            initialDriverData={selectedDriver}
            onAddDriver={handleAddDriver}
            isEditing={true}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default DriverList;
