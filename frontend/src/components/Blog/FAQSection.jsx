import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

// FAQ Data - Missing answers fill kar diye gaye hain
const faqData = [
  {
    question: "Is the content suitable for beginners?",
    answer: "Absolutely! We have content tailored for all skill levels. For beginners, we offer introductory guides and tutorials that assume no prior knowledge. Our step-by-step approach ensures you can follow along regardless of your starting point. We also provide clear learning paths that guide you from beginner to advanced topics in a structured way."
  },
  {
    question: "How often is new content published?",
    answer: "We publish new articles, tutorials, and insights every week. Our newsletter subscribers get the latest updates delivered directly to their inbox every Tuesday."
  },
  {
    question: "Do you offer premium content or courses?",
    answer: "Yes, while a vast majority of our blog articles are free, we also offer premium structured courses and bootcamps for deep dives into specific topics. You can explore these in our 'Programs' section."
  },
  {
    question: "Can I request specific topics?",
    answer: "Definitely! We love hearing from our community. You can reach out to us via our contact form or reply to our weekly newsletter with your suggestions. We frequently prioritize content requested by our readers."
  }
];

const FAQSection = () => {
  // activeIndex state se hum track karenge ki kaunsa accordion open hai
  // Default '0' rakha hai taaki pehla question humesha open rahe (image ki tarah)
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    // Agar same click kiya toh band kardo, warna naya open karo
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="mt-16 md:mt-24 mb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-0">
      {/* Section Header */}
      <div className="text-center mb-10 md:mb-12" data-aos="fade-up">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1120] mb-3">
          Common Questions
        </h2>
        <p className="text-gray-500 text-sm md:text-base">
          Everything you need to know about Analytics Circle
        </p>
      </div>

      {/* Accordion List */}
      <div className="flex flex-col gap-4">
        {faqData.map((faq, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 50}
              className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
              >
                <span className={`font-bold text-[15px] md:text-base transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-800'}`}>
                  {faq.question}
                </span>
                
                {/* Chevron Icon - Active hone par 180 degree ghumega */}
                <ChevronDown
                  className={`w-5 h-5 text-blue-600 shrink-0 transition-transform duration-300 ${
                    isActive ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              {/* Answer Content (Smooth Expand/Collapse) */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-5 md:p-6 pt-0 text-gray-600 text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;