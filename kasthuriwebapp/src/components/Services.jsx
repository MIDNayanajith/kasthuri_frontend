import React from "react";
import { Package, MapPin, Clock, Shield, Truck, FileText } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Truck,
      title: "Container Transport",
      description:
        "Specialized container transportation with 20ft and 40ft options for all your cargo needs.",
      color: "from-[#A594F9] to-[#CDC1FF]",
    },
    {
      icon: MapPin,
      title: "Nationwide Coverage",
      description:
        "Comprehensive transport solutions across Sri Lanka with real-time tracking and updates.",
      color: "from-[#CDC1FF] to-[#E5D9F2]",
    },
    {
      icon: Clock,
      title: "Time-Sensitive Delivery",
      description:
        "Express delivery services ensuring your cargo arrives on schedule, every single time.",
      color: "from-[#A594F9] to-[#F5EFFF]",
    },
    {
      icon: Shield,
      title: "Safe and Secure Transport",
      description:
        "Experienced drivers and well-maintained vehicles ensure your cargo is handled with the utmost care and security.",
      color: "from-[#E5D9F2] to-[#CDC1FF]",
    },
    {
      icon: Package, // Or replace with a better icon, e.g., import { Repeat } from "lucide-react"; for scalability
      title: "Flexible Fleet Options",
      description:
        "Our containers combined with trusted external partners allow us to scale for jobs of any size.",
      color: "from-[#CDC1FF] to-[#A594F9]",
    },
    {
      icon: FileText, // Or import { Navigation } from "lucide-react"; for routes
      title: "Efficient Route Planning",
      description:
        "Customized trip planning from origin to destination, optimizing for speed, cost, and reliability.",
      color: "from-[#F5EFFF] to-[#A594F9]",
    },
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#A594F9] font-semibold text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-4">
            Comprehensive Transport Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From container transport to complete logistics management, we offer
            end-to-end solutions for all your transportation needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-[#F5EFFF] to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#E5D9F2]"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <service.icon className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
