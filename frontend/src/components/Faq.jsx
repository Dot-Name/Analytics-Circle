import { useState } from 'react';

import faqs from "../data/faqs.json"

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="px-6 lg:px-20 py-24 bg-white mt-4">
      {/* Header */}
      <div className="text-center mb-16" data-aos="fade-up">
        <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-3 block">
          COMMON QUESTIONS
        </span>
        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        {/* Description – ab bada */}
        <p className="text-lg lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Get answers to the most common questions about our programs, career support, and learning experience.
        </p>
      </div>

      {/* Accordion Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            data-aos="fade-up"
            data-aos-delay={index * 80}
            className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.1)] transition-all duration-500 group"
          >
            {/* Question button */}
            <button
              onClick={() => toggleFaq(index)}
              className="w-full text-left p-8 pb-4 flex justify-between items-center gap-4"
            >
              {/* Question – size reduced to text-xl (20px) */}
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {faq.q}
              </h3>
              <svg
                className={`w-6 h-6 text-indigo-600 flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Answer (collapsible) */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {/* Answer – ab bada (text-lg) */}
              <div className="px-8 pb-8 text-gray-600 leading-relaxed text-m6 whitespace-pre-line">
                {faq.a}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="text-center mt-12">
        <p className="text-gray-500 text-base mb-10">Still have questions? We're here to help!</p>
        <a
          href="tel:+918383817630"
          className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          Contact Support →
        </a>
      </div>
    </section>
  );
};

export default Faq;