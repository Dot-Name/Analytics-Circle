import React from 'react';

const baseOptions = [
  {
    id: "classroom",
    title: "Classroom Training",
    desc: "For learners who prefer face-to-face learning at our physical centers.",
    features: [
      "In-person mentorship",
      "Hands-on project sessions",
      "Networking with peers",
      "Weekend & weekday batches"
    ],
    theme: {
      border: "border-indigo-500",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      btnBg: "bg-indigo-600 hover:bg-indigo-700"
    },
    icon: "ri-macbook-line",
    isPopular: false
  },
  {
    id: "live-online",
    title: "Live Online Training",
    desc: "Ideal for working professionals and remote learners.",
    features: [
      "Real-time classes with experts",
      "Live Q&A and interactive sessions",
      "Access to class recordings",
      "Structured batch timings"
    ],
    theme: {
      border: "border-orange-500",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      btnBg: "bg-orange-500 hover:bg-orange-600"
    },
    icon: "ri-computer-line",
    isPopular: true
  },
  {
    id: "self-paced",
    title: "Self-Paced Online Courses",
    desc: "Best for those who prefer learning at their own speed.",
    features: [
      "Lifetime access to HD content",
      "Downloadable resources",
      "Certification after completion",
      "Available 24/7 from any device"
    ],
    theme: {
      border: "border-emerald-500",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      btnBg: "bg-emerald-500 hover:bg-emerald-600"
    },
    icon: "ri-time-line",
    isPopular: false
  }
];

// Ab yahan hum directly `course` prop receive kar rahe hain
const CourseLearningOptions = ({ course }) => {

  const handleEnroll = (optionTitle) => {
    const phoneNumber = '918383817630';
    // WhatsApp message mein ab course ka naam dynamic aayega
    const courseName = course?.title || 'Data Analytics';
    const message = encodeURIComponent(
      `Hi, I'm interested in enrolling for the ${optionTitle} format of the ${courseName} program. Please guide me with the next steps.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="py-20 px-4 bg-gray-50 text-gray-900 font-sans overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        
        {/* Top Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4 border border-indigo-100">
            FLEXIBLE LEARNING OPTIONS
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Choose How You Want To Learn
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            We offer multiple learning formats to fit your schedule, learning style, and career goals.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {baseOptions.map((option, idx) => {
            // Yahan par hum json se price fetch kar rahe hain based on option.id
            const currentPrice = course?.learningOptionsPrice?.[option.id] || "Contact Us";

            return (
              <div 
                key={idx} 
                className={`relative bg-white rounded-xl flex flex-col border-t-4 border-l border-r border-b border-gray-100 shadow-sm ${option.theme.border} transition-all duration-300 hover:-translate-y-2 hover:shadow-lg`}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                {option.isPopular && (
                  <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider rounded-bl-lg rounded-tr-lg shadow-sm">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8 flex-grow flex flex-col">
                  {/* Icon */}
                  <div className={`${option.theme.iconBg} ${option.theme.iconColor} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-sm border border-white`}>
                    <i className={option.icon}></i>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{option.title}</h3>
                  <p className="text-sm text-gray-600 mb-8 leading-relaxed">{option.desc}</p>

                  {/* Features List */}
                  <ul className="space-y-4 flex-grow mb-8">
                    {option.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <i className="ri-checkbox-circle-fill text-emerald-500 mt-0.5 text-lg shrink-0"></i>
                        <span className="text-sm text-gray-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Action Button using Dynamic Price */}
                  <button 
                    onClick={() => handleEnroll(option.title)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-sm hover:shadow-md ${option.theme.btnBg}`}
                  >
                    <span className="text-sm tracking-wide">Fee {currentPrice}</span>
                    <span className="text-sm tracking-wide">Enroll Now</span>
                  </button>
                </div>

                {option.isPopular && (
                  <div className="h-2 w-full bg-orange-50 rounded-b-xl"></div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CourseLearningOptions;