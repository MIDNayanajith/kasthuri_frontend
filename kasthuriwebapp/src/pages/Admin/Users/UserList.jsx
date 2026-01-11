// src/pages/Admin/Users/UserList.jsx
import React, { useEffect, useState } from "react";
import Dashboard from "../../../components/Admin/Dashboard";
import { useUser } from "../../../hooks/useUser";
import { Plus, Users, Search, Trash2 } from "lucide-react"; // Added Trash2 icon
import UsersTable from "./UsersTable";
import axiosConfig from "../../../Utill/axiosConfig";
import { API_ENDPOINTS } from "../../../Utill/apiEndPoints";
import toast from "react-hot-toast";
import Modal from "../../../components/Admin/Modal";
import UserForm from "./UserForm";

const UserList = () => {
  useUser();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [openEditUserModal, setOpenEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUserDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_USERS);
      if (response.status === 200) {
        setUserData(response.data);
        setFilteredUsers(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = userData.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(userData);
    }
  }, [searchTerm, userData]);

  const handleAddUser = async (userData, isEditing = false) => {
    try {
      let response;

      if (isEditing && selectedUser) {
        response = await axiosConfig.put(
          API_ENDPOINTS.UPDATE_USER(selectedUser.id),
          userData
        );
      } else {
        response = await axiosConfig.post(API_ENDPOINTS.REGISTER, userData);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(`User ${isEditing ? "updated" : "added"} successfully!`);
        setOpenAddUserModal(false);
        setOpenEditUserModal(false);
        setSelectedUser(null);
        fetchUserDetails();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "add"} user!`
      );
    }
  };

  const handleEditUser = (userToEdit) => {
    setSelectedUser(userToEdit);
    setOpenEditUserModal(true);
  };

  // Helper function for actual deletion
  const performDelete = async (userToDelete) => {
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_USER(userToDelete.id));
      toast.success("User deleted successfully!");
      fetchUserDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleDeleteUser = async (userToDelete) => {
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
                  Delete user "{userToDelete.username}"?
                  <span className="block text-red-600 font-medium mt-1">
                    This cannot be undone.
                  </span>
                </p>
                <div className="mt-4 flex space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                    onClick={() => {
                      toast.dismiss(t.id);
                      performDelete(userToDelete);
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
    <Dashboard activeMenu="Users">
      <div className="my-5 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="text-[#8A75EB]" size={28} />
              User Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage system users and their permissions
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A75EB] focus:border-transparent w-full sm:w-64"
              />
            </div>

            <button
              onClick={() => setOpenAddUserModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#8A75EB] to-[#A594F9] text-white px-4 py-2.5 rounded-lg cursor-pointer hover:shadow-lg hover:from-[#7A65DB] hover:to-[#9584E9] transition-all duration-300 shadow-md"
            >
              <Plus size={18} />
              <span>Add User</span>
            </button>
          </div>
        </div>

        <UsersTable
          users={filteredUsers}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          loading={loading}
        />

        <Modal
          isOpen={openAddUserModal}
          onClose={() => setOpenAddUserModal(false)}
          title="Add New User"
        >
          <UserForm onAddUser={handleAddUser} />
        </Modal>

        <Modal
          isOpen={openEditUserModal}
          onClose={() => {
            setOpenEditUserModal(false);
            setSelectedUser(null);
          }}
          title="Edit User"
        >
          <UserForm
            initialUserData={selectedUser}
            onAddUser={handleAddUser}
            isEditing={true}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default UserList;
