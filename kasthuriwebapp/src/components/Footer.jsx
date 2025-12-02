import React from "react";
import { assets } from "../assets/assets";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={assets.logo}
                alt="Kasthuri Enterprises Logo"
                className="h-12 w-12 rounded-full object-cover ring-2 ring-[#A594F9]"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">
                  Kasthuri Enterprises
                </span>
                <span className="text-xs text-gray-400">
                  Transport Solutions
                </span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner in container transport and logistics
              solutions across Sri Lanka. Excellence in every delivery.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="bg-[#A594F9] p-2 rounded-full hover:bg-[#CDC1FF] transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="bg-[#A594F9] p-2 rounded-full hover:bg-[#CDC1FF] transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="bg-[#A594F9] p-2 rounded-full hover:bg-[#CDC1FF] transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="bg-[#A594F9] p-2 rounded-full hover:bg-[#CDC1FF] transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-[#CDC1FF]">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#home"
                  className="text-gray-400 hover:text-[#CDC1FF] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-[#CDC1FF] transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-gray-400 hover:text-[#CDC1FF] transition-colors"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#CDC1FF] transition-colors"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-[#CDC1FF]">Services</h3>
            <ul className="space-y-3">
              <li className="text-gray-400">Container Transport</li>
              <li className="text-gray-400">Nationwide Coverage</li>
              <li className="text-gray-400">Time-Sensitive Delivery</li>
              <li className="text-gray-400">Flexible Fleet Options</li>
              <li className="text-gray-400">Safe and Secure Transport</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-[#CDC1FF]">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin
                  className="text-[#A594F9] flex-shrink-0 mt-1"
                  size={20}
                />
                <span className="text-gray-400">
                  Kasthuri Enterprises, Colombo, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-[#A594F9] flex-shrink-0" size={20} />
                <span className="text-gray-400">+94 XX XXX XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-[#A594F9] flex-shrink-0" size={20} />
                <span className="text-gray-400">info@kasthuri.lk</span>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">
                B.R. NO: EHE/DS/ADM/07/02329
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; 2025 Kasthuri Enterprises. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-gray-400 hover:text-[#CDC1FF] text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#CDC1FF] text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#CDC1FF] text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
