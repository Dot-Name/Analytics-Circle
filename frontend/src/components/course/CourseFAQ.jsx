import React, { useState } from 'react';

const CourseFAQ = ({ course, faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  // Directly JSON se FAQs extract karega
  const displayFaqs = faqs || course?.faqs || [];
  
  // Dynamic subtitle logic
  const programType = course?.slug === 'genai' ? 'Generative AI & LLMs' : 'data analytics';

  if (!displayFaqs || displayFaqs.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-white text-gray-900 font-sans overflow-hidden">
      <div className="container mx-auto max-w-4xl">
        
        {/* Header Zone */}
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="inline-block bg-purple-50 text-purple-700 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4 border border-purple-100">
            FAQS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Frequently Asked <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            Everything you need to know before joining our <span className="font-semibold text-indigo-600">{programType}</span> program.
          </p>
        </div>

        {/* Dynamic Accordion List */}
        <div className="space-y-4">
          {displayFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
                data-aos="fade-up"
                data-aos-delay={idx * 50}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-6 flex justify-between items-center hover:bg-white transition-colors gap-4 focus:outline-none"
                >
                  <span className="font-bold text-gray-800 text-base sm:text-lg leading-snug">
                    {faq.question}
                  </span>
                  <span className={`w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-indigo-50 border-indigo-200 text-indigo-600' : ''}`}>
                    <i className="ri-arrow-down-s-line text-xl"></i>
                  </span>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-6 pt-0 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100/50 bg-white/50">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CourseFAQ; 