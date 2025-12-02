import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type,
  isSelect,
  options,
  className = "",
  hideLabel = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      {!hideLabel && (
        <label className="text-[13px] text-slate-800 block mb-1">{label}</label>
      )}
      <div className="relative">
        {isSelect ? (
          <select
            className={`w-full bg-transparent outline-none border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 ${className}`}
            value={value}
            onChange={(e) => onChange(e)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            className={`w-full bg-transparent outline-none border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 ${className}`}
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e)}
          />
        )}
        {type === "password" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
            {showPassword ? (
              <Eye
                size={20}
                className="text-purple-800"
                onClick={toggleShowPassword}
              />
            ) : (
              <EyeOff
                size={20}
                className="text-slate-400"
                onClick={toggleShowPassword}
              />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
