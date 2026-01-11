import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart as LineChartIcon,
} from "lucide-react";

const DashboardCharts = ({ dashboardData, loading }) => {
  const [chartType, setChartType] = useState("bar");
  const [dataType, setDataType] = useState("both");

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = dashboardData?.monthlyIncomes?.map((income, index) => ({
    month: income.month,
    income: income.amount || 0,
    expense: dashboardData?.monthlyExpenses[index]?.amount || 0,
  }));

  // Custom tooltip formatter
  const formatTooltipValue = (value) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tick formatter for Y-axis
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `LKR ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `LKR ${(value / 1000).toFixed(0)}K`;
    }
    return `LKR ${value}`;
  };

  // Chart colors
  const colors = {
    income: "#10b981",
    expense: "#ef4444",
    grid: "#f3f4f6",
    text: "#6b7280",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#4F46E5]" />
            Financial Overview
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Monthly income vs expenses for the current year
          </p>
        </div>

        {/* Chart Controls */}
        <div className="flex flex-wrap gap-2">
          {/* Chart Type Toggle */}
          <div className="inline-flex rounded-lg border border-gray-300 p-1">
            <button
              onClick={() => setChartType("bar")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                chartType === "bar"
                  ? "bg-[#4F46E5] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Bar
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                chartType === "line"
                  ? "bg-[#4F46E5] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <LineChartIcon className="w-4 h-4 inline mr-1" />
              Line
            </button>
          </div>

          {/* Data Type Filter */}
          <div className="inline-flex rounded-lg border border-gray-300 p-1">
            <button
              onClick={() => setDataType("income")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1 ${
                dataType === "income"
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              Income
            </button>
            <button
              onClick={() => setDataType("expense")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1 ${
                dataType === "expense"
                  ? "bg-rose-100 text-rose-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <TrendingDown className="w-3 h-3" />
              Expense
            </button>
            <button
              onClick={() => setDataType("both")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                dataType === "both"
                  ? "bg-[#4F46E5] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Both
            </button>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.text }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.text }}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                formatter={formatTooltipValue}
                labelStyle={{ color: colors.text }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend />
              {(dataType === "income" || dataType === "both") && (
                <Bar
                  dataKey="income"
                  name="Income"
                  fill={colors.income}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              )}
              {(dataType === "expense" || dataType === "both") && (
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill={colors.expense}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              )}
            </BarChart>
          ) : (
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.text }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.text }}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                formatter={formatTooltipValue}
                labelStyle={{ color: colors.text }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend />
              {(dataType === "income" || dataType === "both") && (
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke={colors.income}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              {(dataType === "expense" || dataType === "both") && (
                <Line
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke={colors.expense}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 justify-center">
          {dataType !== "expense" && (
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors.income }}
              ></div>
              <span className="text-sm text-gray-700">Income</span>
            </div>
          )}
          {dataType !== "income" && (
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors.expense }}
              ></div>
              <span className="text-sm text-gray-700">Expense</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
