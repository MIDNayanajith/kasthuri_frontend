import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { User } from "lucide-react";
import { SIDE_BAR_DATA } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeMenu }) => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-gray-200/50 p-5 sticky top-[61px] z-20">
      {/* Updated Profile Section */}
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.profileImageUrl ? (
          <img
            src={user?.profileImageUrl || ""}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover ring-4 ring-[#A594F9] shadow-lg"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#A594F9] to-[#CDC1FF] flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
        )}
        <h5 className="text-gray-900 font-semibold text-base">
          {user?.name || "Guest"}
        </h5>
      </div>

      {/* Menu Items */}
      {SIDE_BAR_DATA.map((item, index) => (
        <button
          onClick={() => navigate(item.path)}
          key={`menu_${index}`}
          className={`cursor-pointer w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition-all duration-300 ${
            activeMenu === item.label
              ? "text-white bg-gradient-to-r from-[#A594F9] to-[#CDC1FF] shadow-md"
              : "text-gray-700 hover:bg-[#F5EFFF] hover:text-[#A594F9]"
          }`}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
