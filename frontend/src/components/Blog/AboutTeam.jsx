import React from "react";
// FIXED: data folder ke andar se teamAndBadges data hub ko sahi path se import kiya
import { team } from "../../data/teamAndBadges";

const AboutTeam = () => {
  // Safe validation check: Agar team data array array format me na mile toh fallback check empty array lagaya
  const teamData = Array.isArray(team) ? team : [];

  return (
    <section className="mt-16 md:mt-24 mb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 font-sans antialiased">
      
      {/* Section Header */}
      <div className="text-center mb-10 md:mb-14" data-aos="fade-up">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          Our Leadership & Mentor Core
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 tracking-tight font-serif">
          Meet Our Faculty & Industry Experts
        </h2>
        <p className="text-sm md:text-base text-gray-500 mt-2 max-w-2xl mx-auto font-normal">
          Learn from elite data engineers and cloud artificial intelligence advisors rewriting scalable corporate frameworks globally.
        </p>
      </div>

      {/* Dynamic Experts Grid Framework - Renders exactly 3 items from teamAndBadges.js */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamData.map((member, index) => (
          <div
            key={member.name || index}
            className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 text-center flex flex-col items-center select-none"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            {/* Avatar block handles layout fallback url structure nicely */}
            <img
              src={member.avatar || member.fallback || "https://i.pravatar.cc/150"}
              alt={member.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-sm border-2 border-gray-50 bg-gray-50 mb-4"
              loading="lazy"
            />
            
            {/* Name and Professional Title */}
            <h4 className="font-bold text-gray-900 text-lg mb-1 font-serif tracking-tight">
              {member.name}
            </h4>
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-wider mb-3">
              {member.role || "Technical Expert"}
            </p>
            
            {/* Bio Description Details Text Snippet */}
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-normal flex-1">
              {member.bio}
            </p>

            {/* Micro Social Network Connection Handles */}
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-50 w-full justify-center text-gray-400">
              {member.linkedin && (
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-blue-600 transition-colors"
                >
                  <i className="ri-linkedin-box-fill text-xl"></i>
                </a>
              )}
              {member.twitter && (
                <a 
                  href={member.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-gray-900 transition-colors"
                >
                  <i className="ri-twitter-x-fill text-lg"></i>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Featured In Branding Section Panel */}
      <div className="mt-20 text-center" data-aos="fade-up">
        <h4 className="font-bold text-gray-400 text-xs tracking-[0.2em] uppercase mb-8">
          Featured In
        </h4>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale select-none">
          <span className="font-serif font-bold text-xl md:text-2xl tracking-tighter text-gray-900">Forbes</span>
          <span className="font-sans font-black text-xl md:text-2xl tracking-widest border-2 border-black px-2 py-0.5 text-gray-900">WIRED</span>
          <span className="font-serif font-bold text-lg md:text-xl text-gray-900">TechCrunch</span>
          <span className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-gray-900">Business Insider</span>
        </div>
      </div>

    </section>
  );
};

export default AboutTeam;