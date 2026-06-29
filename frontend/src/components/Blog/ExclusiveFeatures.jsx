import React from "react";
import { Lightbulb, Database, Users, BookOpen, ChevronRight } from "lucide-react";

const ExclusiveFeatures = () => {
  const features = [
    {
      id: 1,
      title: "Interactive Code Examples",
      desc: "Don't just read about code—run it, modify it, and see results in real-time directly in your browser. Our interactive examples help you learn by doing.",
      icon: <Lightbulb className="w-5 h-5 text-[#2563EB]" />,
    },
    {
      id: 2,
      title: "Downloadable Resources",
      desc: "Access to datasets, templates, cheat sheets, and notebooks that you can download and use in your own projects to accelerate your work.",
      icon: <Database className="w-5 h-5 text-[#2563EB]" />,
    },
    {
      id: 3,
      title: "Expert Community Access",
      desc: "Connect with a community of data professionals, ask questions, share insights, and collaborate on projects to accelerate your learning.",
      icon: <Users className="w-5 h-5 text-[#2563EB]" />,
    },
    {
      id: 4,
      title: "Learning Path Roadmaps",
      desc: "Structured learning paths for different career goals, helping you focus on the most relevant skills and knowledge for your specific objectives.",
      icon: <BookOpen className="w-5 h-5 text-[#2563EB]" />,
    }
  ];

  return (
    <section className="mt-16 md:mt-24 mb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Section */}
      <div className="text-center mb-12 md:mb-16" data-aos="fade-up">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          Exclusive Features for Data Professionals
        </h2>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
          Tools and resources designed to accelerate your learning and career growth
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-16 gap-y-10 md:gap-y-12">
        {features.map((feature, index) => (
          <div 
            key={feature.id}
            data-aos="fade-up"
            data-aos-delay={index * 100}
            // Left border styling right here
            className="flex flex-col relative pl-5 md:pl-6 border-l-[3px] border-[#2563EB] hover:border-blue-400 transition-colors duration-300"
          >
            {/* Icon and Title */}
            <div className="flex items-center gap-4 mb-3 md:mb-4">
              <div className="bg-blue-50/70 p-2.5 md:p-3 rounded-xl flex items-center justify-center shrink-0">
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                {feature.title}
              </h3>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed mb-4 md:mb-5">
              {feature.desc}
            </p>
            
            {/* Learn More Link */}
            <a 
              href="#" 
              className="text-[#2563EB] font-medium text-sm flex items-center gap-1 hover:text-blue-700 transition-colors group w-fit mt-auto"
            >
              Learn more <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        ))}
      </div>

    </section>
  );
};

export default ExclusiveFeatures;