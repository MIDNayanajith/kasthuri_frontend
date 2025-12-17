import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import AdminHome from "./pages/Admin/AdminHome";
import UserList from "./pages/Admin/Users/UserList";
import MaintenanceList from "./pages/Admin/Maintenance/MaintenanceList";
import AttendanceList from "./pages/Admin/Attendance/AttendanceList";
import TransportList from "./pages/Admin/Transport/TransportList";
import DriversList from "./pages/Admin/Drivers/DriversList";
import OwnVehiclesList from "./pages/Admin/OwnVehicles/OwnVehiclesList";
import ExVehiclesList from "./pages/Admin/ExVehicles/ExVehiclesList";

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
            <Route path="/ownvehicles" element={<OwnVehiclesList />} />
            <Route path="/exvehicles" element={<ExVehiclesList />} />
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
