import React from "react";
import { assets } from "../assets/assets";
import { TruckIcon, ShieldCheck, Clock, Award } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="home"
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F5EFFF] via-white to-[#E5D9F2]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block">
              <span className="bg-gradient-to-r from-[#A594F9] to-[#CDC1FF] text-white px-4 py-2 rounded-full text-sm font-semibold">
                Trusted Transport Solutions
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Your Reliable Partner in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A594F9] to-[#CDC1FF]">
                Container Transport
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              At Kasthuri Enterprises, we specialize in safe, efficient, and
              timely container transportation services. With our modern fleet
              and experienced drivers, we ensure your cargo reaches its
              destination on time, every time.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-[#A594F9] to-[#CDC1FF] text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Contact Us
              </button>
              <button className="bg-white border-2 border-[#CDC1FF] text-[#A594F9] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#F5EFFF] hover:shadow-lg transition-all duration-300">
                Learn More
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#E5D9F2] p-3 rounded-full mb-2">
                  <TruckIcon className="text-[#A594F9]" size={24} />
                </div>
                <span className="text-2xl font-bold text-gray-900">03+</span>
                <span className="text-sm text-gray-600">Vehicles</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#E5D9F2] p-3 rounded-full mb-2">
                  <ShieldCheck className="text-[#A594F9]" size={24} />
                </div>
                <span className="text-2xl font-bold text-gray-900">100%</span>
                <span className="text-sm text-gray-600">Safe</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#E5D9F2] p-3 rounded-full mb-2">
                  <Clock className="text-[#A594F9]" size={24} />
                </div>
                <span className="text-2xl font-bold text-gray-900">24/7</span>
                <span className="text-sm text-gray-600">Service</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#E5D9F2] p-3 rounded-full mb-2">
                  <Award className="text-[#A594F9]" size={24} />
                </div>
                <span className="text-2xl font-bold text-gray-900">10+</span>
                <span className="text-sm text-gray-600">Years</span>
              </div>
            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#A594F9] to-[#CDC1FF] rounded-3xl blur-2xl opacity-30"></div>
            <img
              src={assets.hero}
              alt="Transport Services"
              className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-[#A594F9] to-[#CDC1FF] p-3 rounded-full">
                  <TruckIcon className="text-white" size={28} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">500+</p>
                  <p className="text-sm text-gray-600">Successful Deliveries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
