import React from "react";
import { ShieldCheck, Check } from "lucide-react";

const QualityGuarantee = () => {
  const guaranteeItems = [
    {
      title: "Expert-Verified Content",
      desc: "All articles and tutorials are reviewed by subject matter experts to ensure accuracy and relevance.",
    },
    {
      title: "Up-to-Date Information",
      desc: "We regularly review and update our content to reflect the latest developments and best practices in the field.",
    },
    {
      title: "Practical Application",
      desc: "Our tutorials are tested to ensure they work in real-world scenarios, not just in theory.",
    },
    {
      title: "Satisfaction Guarantee",
      desc: "If you're not satisfied with any premium course or content, we offer a 30-day money-back guarantee, no questions asked.",
    },
  ];

  return (
    <section className="mt-16 md:mt-24 mb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-0">
      <div 
        data-aos="fade-up"
        className="flex flex-col md:flex-row bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100"
      >
        
        {/* Left Side (Blue Box) */}
        <div className="bg-[#2563EB] text-white p-10 md:p-12 flex flex-col items-center justify-center text-center md:w-[35%] shrink-0 relative overflow-hidden">
          {/* Decorative faint circle in background to make it look premium */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-400 opacity-20 rounded-full blur-2xl pointer-events-none"></div>

          {/* Icon in White Circle */}
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg relative z-10">
            <ShieldCheck className="w-10 h-10 text-[#2563EB]" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold mb-3 relative z-10 leading-snug">
            Our Quality<br />Guarantee
          </h3>
          <p className="text-blue-100 text-sm sm:text-base relative z-10 font-medium">
            We stand behind everything<br className="hidden sm:block" /> we publish
          </p>
        </div>

        {/* Right Side (White Content List) */}
        <div className="p-8 md:p-12 flex flex-col gap-6 md:w-[65%]">
          {guaranteeItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="shrink-0 mt-0.5">
                <Check className="w-5 h-5 md:w-6 md:h-6 text-emerald-500 stroke-[3]" />
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-gray-900 text-[15px] md:text-base mb-1.5">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default QualityGuarantee;