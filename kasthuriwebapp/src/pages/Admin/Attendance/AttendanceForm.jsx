// AttendanceForm.jsx
import React, { useEffect, useState } from "react";
import Input from "../../../components/Input";
import { LoaderCircle } from "lucide-react";

const AttendanceForm = ({
  onAddAttendance,
  initialAttendanceData,
  isEditing,
  drivers,
  users,
}) => {
  const [attendance, setAttendance] = useState({
    recipientType: "Driver",
    recipientId: null,
    attendanceDate: "",
    status: "Present",
    checkInTime: "",
    checkOutTime: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing && initialAttendanceData) {
      setAttendance({
        id: initialAttendanceData.id,
        recipientType: initialAttendanceData.recipientType || "Driver",
        recipientId: initialAttendanceData.recipientId || null,
        attendanceDate: initialAttendanceData.attendanceDate || "",
        status: initialAttendanceData.status || "Present",
        checkInTime: initialAttendanceData.checkInTime
          ? initialAttendanceData.checkInTime.slice(11, 16)
          : "",
        checkOutTime: initialAttendanceData.checkOutTime
          ? initialAttendanceData.checkOutTime.slice(11, 16)
          : "",
        notes: initialAttendanceData.notes || "",
      });
    } else {
      setAttendance({
        recipientType: "Driver",
        recipientId: null,
        attendanceDate: "",
        status: "Present",
        checkInTime: "",
        checkOutTime: "",
        notes: "",
      });
    }
  }, [isEditing, initialAttendanceData]);

  const handleChange = (key, value) => {
    setAttendance({ ...attendance, [key]: value });
  };

  const validateForm = () => {
    if (!attendance.recipientType) {
      setError("Recipient type is required");
      return false;
    }
    if (!attendance.recipientId) {
      setError("Recipient ID is required");
      return false;
    }
    if (!attendance.attendanceDate) {
      setError("Attendance date is required");
      return false;
    }
    if (!attendance.status) {
      setError("Status is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setError("");
    setLoading(true);
    try {
      const attendanceData = {
        recipientType: attendance.recipientType,
        recipientId: parseInt(attendance.recipientId),
        attendanceDate: attendance.attendanceDate,
        status: attendance.status,
        checkInTime: attendance.checkInTime
          ? `${attendance.attendanceDate}T${attendance.checkInTime}:00`
          : null,
        checkOutTime: attendance.checkOutTime
          ? `${attendance.attendanceDate}T${attendance.checkOutTime}:00`
          : null,
        notes: attendance.notes,
      };
      if (isEditing) {
        attendanceData.id = attendance.id;
      }
      await onAddAttendance(attendanceData, isEditing);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const recipientOptions =
    attendance.recipientType === "Driver"
      ? drivers.map((d) => ({ value: d.id, label: d.name }))
      : users.map((u) => ({ value: u.id, label: u.username }));
  recipientOptions.unshift({ value: "", label: "Select Recipient" });

  const statusOptions = [
    { value: "Present", label: "Present" },
    { value: "Absent", label: "Absent" },
    { value: "Leave", label: "Leave" },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          isSelect={true}
          value={attendance.recipientType}
          onChange={({ target }) => handleChange("recipientType", target.value)}
          label={
            <>
              Recipient Type{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          options={[
            { value: "Driver", label: "Driver" },
            { value: "User", label: "User" },
          ]}
        />
        <Input
          isSelect={true}
          value={attendance.recipientId || ""}
          onChange={({ target }) =>
            handleChange(
              "recipientId",
              target.value ? parseInt(target.value) : null
            )
          }
          label={
            <>
              Recipient{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          options={recipientOptions}
        />
        <Input
          value={attendance.attendanceDate}
          onChange={({ target }) =>
            handleChange("attendanceDate", target.value)
          }
          label={
            <>
              Attendance Date{" "}
              <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          placeholder="Select date"
          type="date"
        />
        <Input
          isSelect={true}
          value={attendance.status}
          onChange={({ target }) => handleChange("status", target.value)}
          label={
            <>
              Status <span className="text-gray-300 text-sm">(Required)</span>
            </>
          }
          options={statusOptions}
        />
        <Input
          value={attendance.checkInTime}
          onChange={({ target }) => handleChange("checkInTime", target.value)}
          label={
            <>
              Check In Time{" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Select time"
          type="time"
        />
        <Input
          value={attendance.checkOutTime}
          onChange={({ target }) => handleChange("checkOutTime", target.value)}
          label={
            <>
              Check Out Time{" "}
              <span className="text-gray-300 text-sm">(Optional)</span>
            </>
          }
          placeholder="Select time"
          type="time"
        />
        <div className="col-span-2">
          <Input
            value={attendance.notes}
            onChange={({ target }) => handleChange("notes", target.value)}
            label={
              <>
                Notes <span className="text-gray-300 text-sm">(Optional)</span>
              </>
            }
            placeholder="Enter notes"
            type="text"
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
            <>{isEditing ? "Update Attendance" : "Add Attendance"}</>
          )}
        </button>
      </div>
    </div>
  );
};

export default AttendanceForm;
