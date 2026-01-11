import React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wrench,
  CreditCard,
} from "lucide-react";

const DashboardCards = ({ dashboardData, loading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const cards = [
    {
      title: "Total Income",
      value: formatCurrency(dashboardData?.totalIncome || 0),
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: dashboardData?.totalIncome > 0,
    },
    {
      title: "Total Expense",
      value: formatCurrency(dashboardData?.totalExpense || 0),
      icon: CreditCard,
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
      trend: false,
    },
    {
      title: "Total Maintenance Cost",
      value: formatCurrency(dashboardData?.totalMaintenanceCost || 0),
      icon: Wrench,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      trend: false,
    },
    {
      title: "Net Profit",
      value: formatCurrency(dashboardData?.netProfit || 0),
      icon: dashboardData?.netProfit >= 0 ? TrendingUp : TrendingDown,
      color:
        dashboardData?.netProfit >= 0
          ? "from-blue-500 to-blue-600"
          : "from-red-500 to-red-600",
      bgColor: dashboardData?.netProfit >= 0 ? "bg-blue-50" : "bg-red-50",
      iconColor:
        dashboardData?.netProfit >= 0 ? "text-blue-600" : "text-red-600",
      trend: dashboardData?.netProfit >= 0,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="h-3 bg-gray-200 rounded w-20 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-28"></div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-600 mb-1">{card.title}</p>
              <h3 className="text-xl font-bold text-gray-900">{card.value}</h3>
              <div className="mt-2 flex items-center">
                {card.trend ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    Positive
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    <TrendingDown className="w-3 h-3" />
                    Negative
                  </span>
                )}
              </div>
            </div>
            <div
              className={`${card.bgColor} w-10 h-10 rounded-lg flex items-center justify-center`}
            >
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div
              className={`h-1 rounded-full bg-gradient-to-r ${card.color}`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
