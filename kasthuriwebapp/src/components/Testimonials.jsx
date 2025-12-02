import React from "react";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "Lanka Trading Co.",
      image:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200",
      rating: 5,
      text: "Kasthuri Enterprises has been our trusted transport partner for over 3 years. Their reliability and professionalism are unmatched. Every delivery is on time, and their team is always responsive.",
    },
    {
      name: "Priya Fernando",
      company: "Ceylon Exports Ltd.",
      image:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
      rating: 5,
      text: "Outstanding service! Their container transport solutions have significantly improved our logistics efficiency. The real-time tracking and professional drivers give us complete peace of mind.",
    },
    {
      name: "Anil Perera",
      company: "Island Logistics",
      image:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200",
      rating: 5,
      text: "We've worked with many transport companies, but Kasthuri Enterprises stands out for their commitment to excellence. Their competitive pricing and quality service make them our first choice.",
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F5EFFF] via-white to-[#E5D9F2]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#A594F9] font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients
            have to say about our services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#E5D9F2] relative"
            >
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#A594F9] to-[#CDC1FF] p-3 rounded-full shadow-lg">
                <Quote className="text-white" size={24} />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-[#E5D9F2]"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.company}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="text-yellow-400 fill-yellow-400"
                    size={20}
                  />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-[#A594F9] to-[#CDC1FF] rounded-3xl p-12 text-center shadow-2xl">
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Join 500+ Satisfied Clients
          </h3>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Experience the difference of working with a transport partner that
            puts your needs first. Get started today!
          </p>
          <button className="bg-white text-[#A594F9] px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            Get In Touch
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
