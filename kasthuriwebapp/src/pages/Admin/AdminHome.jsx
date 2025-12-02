import React from "react";
import Dashboard from "../../components/Admin/Dashboard";
//import { useUser } from "../hooks/useUser";

const AdminHome = () => {
  //useUser();
  return (
    <div>
      <Dashboard activeMenu="Dashboard">This is Dashboard</Dashboard>
    </div>
  );
};

export default AdminHome;
