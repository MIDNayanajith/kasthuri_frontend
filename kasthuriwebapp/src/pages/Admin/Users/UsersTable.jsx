// src/components/Admin/UsersTable.jsx
import React from "react";
import { Edit2, Trash2, User, Mail, Phone, Shield } from "lucide-react";
const UsersTable = ({ users, onEditUser, onDeleteUser, loading }) => {
  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: "bg-red-100 text-red-800", icon: Shield },
      user: { color: "bg-blue-100 text-blue-800", icon: User },
    };
    const config = roleConfig[role.toLowerCase()] || roleConfig.user;
    const IconComponent = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent size={12} />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };
  const getStatusBadge = (isActive) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A594F9]"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto">
          <thead className="bg-gray-50 border-b border-gray-200 hidden md:table-header-group">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-lg font-medium text-gray-400">
                    No users found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Get started by adding your first user
                  </p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors duration-150 block md:table-row border-b md:border-none"
                >
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['User'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="flex items-center pt-6 md:pt-0">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.profileImg ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.profileImg}
                            alt={user.username}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#A594F9] to-[#CDC1FF] flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Contact'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="flex flex-col space-y-1 pt-6 md:pt-0">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                      {user.mobileNo && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {user.mobileNo}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Role'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="pt-6 md:pt-0">
                      {getRoleBadge(user.role)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap block md:table-cell relative md:static before:content-['Status'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden">
                    <div className="pt-6 md:pt-0">
                      {getStatusBadge(user.isActive)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium block md:table-cell relative md:static before:content-['Actions'] before:font-semibold before:text-xs before:uppercase before:text-gray-600 before:absolute before:left-6 before:top-2 md:before:hidden pb-6 md:pb-4">
                    <div className="flex items-center space-x-2 pt-6 md:pt-0">
                      <button
                        onClick={() => onEditUser(user)}
                        className="inline-flex items-center px-3 py-1.5 border border-[#A594F9] text-[#A594F9] rounded-lg text-sm hover:bg-[#F5EFFF] transition-colors duration-200 cursor-pointer"
                      >
                        <Edit2 size={14} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteUser(user)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors duration-200 cursor-pointer"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default UsersTable;
