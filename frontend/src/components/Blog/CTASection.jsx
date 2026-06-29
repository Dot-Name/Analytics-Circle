import React from "react";
import { Star } from "lucide-react";

const CTASection = () => {
  return (
    <section className="mt-2 md:mt-2 mb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-0">
      <div 
        data-aos="fade-up"
        // Padding yahan kam ki hai: p-6 sm:p-8 md:p-10 kar diya
        className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm hover:shadow-xl transition-shadow duration-500 text-center relative overflow-hidden"
      >
        {/* Subtle background glow/gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-2xl bg-gradient-to-b from-blue-50 to-transparent opacity-50 pointer-events-none rounded-full blur-3xl"></div>

        {/* Top Tag */}
        <p className="text-emerald-600 font-bold text-xs md:text-sm tracking-[0.15em] uppercase mb-3 relative z-10">
          Start Today — It's Free
        </p>

        {/* Heading (Margin bottom kam kiya) */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight relative z-10">
          Ready to level up your data career?
        </h2>   

        {/* Description (Margin aur text size balance kiya) */}
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed relative z-10">
          Join thousands of professionals learning AI, Python, SQL, and more with Analytics Circle.
        </p>

        {/* Buttons (Gap aur margin kam kiya) */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-10 relative z-10">
          <a 
            href="#explore" 
            className="w-full sm:w-auto bg-[#5B45FF] hover:bg-blue-700 text-white font-bold py-3 px-6 md:px-8 rounded-xl transition-all shadow-md hover:shadow-lg text-sm md:text-base"
          >
            Explore all articles
          </a>
          
          <a 
            href="/programs" 
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-bold py-3 px-6 md:px-8 rounded-xl transition-all shadow-sm text-sm md:text-base"
          >
            Browse courses
          </a>
        </div>

        {/* Divider (Spacing kam ki) */}
        <div className="border-t border-gray-100 mb-8 max-w-3xl mx-auto relative z-10"></div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto relative z-10">
          {/* Stat 1 */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              50K+
            </span>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              Active readers
            </span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              200+
            </span>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              Free articles
            </span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-1">
              4.9 <Star className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 fill-gray-900" />
            </span>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              Avg. rating
            </span>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              15+
            </span>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              Categories
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CTASection;