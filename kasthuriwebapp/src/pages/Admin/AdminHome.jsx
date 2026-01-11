import React, { useEffect, useState } from "react";
import Dashboard from "../../components/Admin/Dashboard";
import DashboardCards from "../../components/Admin/DashboardCards";
import DashboardCharts from "../../components/Admin/DashboardCharts";
import { Calendar, RefreshCw } from "lucide-react";
import axiosConfig from "../../Utill/axiosConfig";
import { API_ENDPOINTS } from "../../Utill/apiEndPoints";
import toast from "react-hot-toast";

const AdminHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosConfig.get(API_ENDPOINTS.GET_DASHBOARD_DATA);
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Set current month in YYYY/MM format
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    setCurrentMonth(`${year}/${month}`);
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  return (
    <Dashboard activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        {/* Header Section - Simplified */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Dashboard Overview
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <p className="text-gray-600">{currentMonth || "Loading..."}</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Stats Summary */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Financial Summary
            </h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              For {currentMonth}
            </span>
          </div>
          <DashboardCards dashboardData={dashboardData} loading={loading} />
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Financial Trends
            </h3>
            <span className="text-sm text-gray-500">
              Data for {new Date().getFullYear()}
            </span>
          </div>
          <DashboardCharts dashboardData={dashboardData} loading={loading} />
        </div>

        {/* Loading State */}
        {loading && !dashboardData && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5] mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        )}

        {/* No Data State */}
        {!loading && !dashboardData && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Dashboard Data Available
            </h3>
            <p className="text-gray-600 mb-4">
              There's no financial data to display for the current period.
            </p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C73E6] text-white px-4 py-2.5 rounded-lg cursor-pointer hover:shadow-lg transition-all duration-300"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default AdminHome;
