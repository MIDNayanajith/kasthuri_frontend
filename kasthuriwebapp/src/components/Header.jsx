import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom"; // Add this import

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };
  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-md z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <img
              src={assets.logo}
              alt="Kasthuri Enterprises Logo"
              className="h-12 w-12 rounded-full object-cover ring-2 ring-[#A594F9]"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#A594F9]">
                Kasthuri Enterprises
              </span>
              <span className="text-xs text-gray-600">Transport Solutions</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-gray-700 hover:text-[#A594F9] font-medium transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-gray-700 hover:text-[#A594F9] font-medium transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-gray-700 hover:text-[#A594F9] font-medium transition-colors"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-700 hover:text-[#A594F9] font-medium transition-colors"
            >
              Contact
            </button>
            <Link to="/login">
              <button className="bg-gradient-to-r from-[#A594F9] to-[#CDC1FF] text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                Login
              </button>
            </Link>
          </div>
          <button
            className="md:hidden text-gray-700 hover:text-[#A594F9] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white shadow-lg py-4 animate-slide-down">
            <div className="flex flex-col gap-4 px-4">
              <button
                onClick={() => scrollToSection("home")}
                className="text-gray-700 hover:text-[#A594F9] font-medium py-2 text-left transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-700 hover:text-[#A594F9] font-medium py-2 text-left transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-gray-700 hover:text-[#A594F9] font-medium py-2 text-left transition-colors"
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-700 hover:text-[#A594F9] font-medium py-2 text-left transition-colors"
              >
                Contact
              </button>
              <Link to="/login">
                <button className="bg-gradient-to-r from-[#A594F9] to-[#CDC1FF] text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                  Login
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
