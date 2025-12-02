import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import AdminHome from "./pages/Admin/AdminHome";
import UserList from "./pages/Admin/Users/UserList";
import MaintenanceList from "./pages/Admin/Maintenance/MaintenanceList";
import AttendanceList from "./pages/Admin/Attendance/AttendanceList";
import VehiclesList from "./pages/Admin/Vehicles/VehiclesList";
import TransportList from "./pages/Admin/Transport/TransportList";
import DriversList from "./pages/Admin/Drivers/DriversList";

const App = () => {
  return (
    <>
      <Toaster />
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<AdminHome />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/maintenance" element={<MaintenanceList />} />
            <Route path="/attendance" element={<AttendanceList />} />
            <Route path="/vehicles" element={<VehiclesList />} />
            <Route path="/transports" element={<TransportList />} />
            <Route path="/drivers" element={<DriversList />} />
            {/* Add more routes here for admin dashboard, etc. */}
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;
