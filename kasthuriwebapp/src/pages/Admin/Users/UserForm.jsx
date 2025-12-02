// src/components/Admin/UserForm.jsx
import React, { useEffect, useState } from "react";
import Input from "../../../components/Input";
import ProfileImageSelector from "../../../components/Admin/ProfileImageSelector";
import { LoaderCircle } from "lucide-react";
import uploadProfileImage from "../../../Utill/uploadProfileImage";
import { validateEmail } from "../../../Utill/validation";
const UserForm = ({ onAddUser, initialUserData, isEditing }) => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    mobileNo: "",
    profileImg: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (isEditing && initialUserData) {
      setUser({
        id: initialUserData.id,
        username: initialUserData.username || "",
        email: initialUserData.email || "",
        password: "",
        role: initialUserData.role || "user",
        mobileNo: initialUserData.mobileNo || "",
        profileImg: initialUserData.profileImg || "",
        isActive:
          initialUserData.isActive !== undefined
            ? initialUserData.isActive
            : true,
      });
      // If editing and existing image exists, show it
      if (initialUserData.profileImg) {
        setProfileImage(initialUserData.profileImg);
      }
    } else {
      setUser({
        username: "",
        email: "",
        password: "",
        role: "user",
        mobileNo: "",
        profileImg: "",
        isActive: true,
      });
      setProfileImage(null);
    }
  }, [isEditing, initialUserData]);
  const handleChange = (key, value) => {
    setUser({ ...user, [key]: value });
  };
  const handleSubmit = async () => {
    if (!user.username.trim()) {
      setError("Full Name is required");
      return;
    }
    if (!validateEmail(user.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!isEditing && !user.password.trim()) {
      setError("Password is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      let profileImageUrl = user.profileImg;
      // Upload ONLY if user selected a new file (not an existing URL)
      if (profileImage && typeof profileImage !== "string") {
        const uploadedUrl = await uploadProfileImage(profileImage);
        profileImageUrl = uploadedUrl || "";
      }
      let userData = {
        username: user.username,
        email: user.email,
        role: user.role,
        mobileNo: user.mobileNo,
        isActive: user.isActive,
        profileImg: profileImageUrl,
      };
      if (user.password) {
        userData.password = user.password;
      }
      if (isEditing) {
        userData.id = user.id;
      }
      // send JSON — NOT multipart
      await onAddUser(userData, isEditing);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-center mb-4">
        <ProfileImageSelector image={profileImage} setImage={setProfileImage} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          value={user.username}
          onChange={({ target }) => handleChange("username", target.value)}
          label={
            <>
              Full Name{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter full name"
          type="text"
        />
        <Input
          value={user.email}
          onChange={({ target }) => handleChange("email", target.value)}
          label={
            <>
              Email <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Enter email address"
          type="email"
        />
        <Input
          value={user.password}
          onChange={({ target }) => handleChange("password", target.value)}
          label={
            <>
              Password{" "}
              <span className="text-gray-300 text-sm">
                ({isEditing ? "Optional" : "Required"})
              </span>
            </>
          }
          placeholder={
            isEditing ? "Leave blank to keep current" : "Enter password"
          }
          type="password"
        />
        <Input
          value={user.mobileNo}
          onChange={({ target }) => handleChange("mobileNo", target.value)}
          label={
            <>
              Mobile Number{" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Enter mobile number"
          type="text"
        />
        <Input
          label={
            <>
              Role <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          value={user.role}
          onChange={({ target }) => handleChange("role", target.value)}
          isSelect={true}
          options={[
            { value: "admin", label: "Admin" },
            { value: "user", label: "User" },
          ]}
        />
        <Input
          label={
            <>
              Status <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          value={user.isActive}
          onChange={({ target }) =>
            handleChange("isActive", target.value === "true")
          }
          isSelect={true}
          options={[
            { value: true, label: "Active" },
            { value: false, label: "Inactive" },
          ]}
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
            <>{isEditing ? "Update User" : "Add User"}</>
          )}
        </button>
      </div>
    </div>
  );
};
export default UserForm;
