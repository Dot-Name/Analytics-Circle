import React from "react";
import { Star } from "lucide-react";

// Mock data based on your image
const testimonialsData = [
  {
    id: 1,
    quote: '"The Python tutorials helped me switch from marketing to data analyst in 6 months. Step-by-step and actually practical."',
    name: "Jessica Taylor",
    role: "Data Analyst @ Microsoft",
    initials: "JT",
    avatarColor: "bg-[#5B45FF]", // Blue/Purple
  },
  {
    id: 2,
    quote: '"I recommend Analytics Circle to every new hire on my team. Content is always current and maps directly to real projects."',
    name: "Mark Anderson",
    role: "Data Science Lead @ Amazon",
    initials: "MA",
    avatarColor: "bg-emerald-500", // Green
  },
  {
    id: 3,
    quote: '"Completely transformed how I present to stakeholders. My dashboards now get compliments in every review meeting."',
    name: "Rajiv Patel",
    role: "BI Analyst @ Google",
    initials: "RP",
    avatarColor: "bg-amber-500", // Orange
  }
];

const Testimonials = () => {
  return (
    <section className="mt-2 md:mt-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header (Center Aligned as per image) */}
      <div className="text-center mb-10 md:mb-14" data-aos="fade-up">
        <p className="text-gray-500 font-bold text-xs tracking-[0.2em] uppercase mb-2">
          Social Proof
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
          What readers say
        </h2>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {testimonialsData.map((testimonial, index) => (
          <div
            key={testimonial.id}
            data-aos="fade-up"
            data-aos-delay={index * 100}
            className="bg-white rounded-[1.5rem] border border-gray-200 p-6 sm:p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-gray-300 transition-all duration-300 flex flex-col"
          >
            {/* 5 Stars */}
            <div className="flex gap-1 mb-5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" 
                />
              ))}
            </div>

            {/* Quote Text */}
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed italic mb-8 flex-1 font-medium">
              {testimonial.quote}
            </p>

            {/* User Info */}
            <div className="flex items-center gap-3.5 mt-auto">
              {/* Avatar */}
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-inner shrink-0 ${testimonial.avatarColor}`}>
                {testimonial.initials}
              </div>
              
              {/* Name & Role */}
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-[15px]">
                  {testimonial.name}
                </span>
                <span className="text-gray-500 text-xs sm:text-sm">
                  {testimonial.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;