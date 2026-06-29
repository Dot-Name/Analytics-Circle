import React from "react";
import { HelpCircle, AlertCircle, Zap, Check } from "lucide-react";

const ProblemSolution = () => {
  const challenges = [
    "Information overload with too many learning resources",
    "Difficulty applying theoretical knowledge to real-world problems",
    "Struggling to keep up with rapidly evolving technologies",
    "Lack of structured learning paths for career advancement",
  ];

  const solutions = [
    "Curated content from industry experts that cuts through the noise",
    "Practical tutorials with real-world applications and examples",
    "Regular updates on the latest technologies and methodologies",
    "Structured learning paths for various data career trajectories",
  ];

  return (
    <section className="mt-16 md:mt-24 mb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-0">
      <div 
        data-aos="fade-up"
        className="flex flex-col md:flex-row bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100"
      >
        
        {/* Left Side (Blue Box - Challenges) */}
        <div className="bg-[#2563EB] text-white p-8 sm:p-10 md:p-12 flex flex-col justify-between md:w-[50%] shrink-0">
          <div>
            {/* Icon Banner */}
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/20">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>

            {/* Heading */}
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              Struggling with Data Overload?
            </h3>
            
            <p className="text-blue-100 text-sm sm:text-base mb-8 font-medium">
              In today's data-driven world, professionals face common challenges:
            </p>

            {/* Challenges List */}
            <div className="flex flex-col gap-5 mb-10">
              {challenges.map((challenge, index) => (
                <div key={index} className="flex items-start gap-3.5">
                  <AlertCircle className="w-5 h-5 text-blue-200 shrink-0 mt-0.5 opacity-90" />
                  <p className="text-sm sm:text-[15px] leading-relaxed text-blue-50">
                    {challenge}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial Quote inside Blue Card */}
          <div className="border-t border-white/10 pt-6 mt-auto">
            <p className="text-sm sm:text-[15px] text-blue-100 italic leading-relaxed font-medium">
              "I was overwhelmed by the amount of information available online. It was hard to know where to start or what to focus on."
            </p>
          </div>
        </div>

        {/* Right Side (White Box - Solutions) */}
        <div className="bg-white p-8 sm:p-10 md:p-12 flex flex-col justify-center md:w-[50%]">
          {/* Icon Banner */}
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-6 border border-blue-100">
            <Zap className="w-6 h-6 text-[#2563EB]" />
          </div>

          {/* Heading */}
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Analytics Circle is Your Solution
          </h3>
          
          <p className="text-gray-600 text-sm sm:text-base mb-8 leading-relaxed">
            We've designed our platform to address these challenges head-on:
          </p>

          {/* Solutions List */}
          <div className="flex flex-col gap-5 mb-8">
            {solutions.map((solution, index) => (
              <div key={index} className="flex items-start gap-3.5">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                <p className="text-sm sm:text-[15px] leading-relaxed text-gray-700 font-medium">
                  {solution}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="w-full sm:w-fit bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl transition-colors shadow-md hover:shadow-lg mt-4">
            Start Learning Today
          </button>
        </div>

      </div>
    </section>
  );
};

export default ProblemSolution;