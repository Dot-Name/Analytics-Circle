import React from 'react';

const CourseGuarantee = () => {

    // Updated Reliable Logos (Deloitte fixed & EXL added)
    const hiringPartners = [
        { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
        { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
        { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
        { name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
        { name: 'Deloitte', logo: 'https://i.pinimg.com/1200x/71/2c/66/712c660619fcfe31b2154a1cb041d8cb.jpg' },
        { name: 'EXL', logo: 'data:image/png;base64,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' },
        { name: 'Accenture', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg' },
        { name: 'Dell', logo: 'data:image/png;base64,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' },

        { name: 'TCS', logo: 'data:image/jpeg;base64,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' },

    ];

    return (
        <section className="py-20 px-4 bg-white text-gray-900 overflow-hidden font-sans">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* ════ LEFT COLUMN: Text Content & Guarantees ════ */}
                    <div className="w-full lg:w-1/2" data-aos="fade-right">

                        {/* Top Badge */}
                        <span className="inline-block bg-purple-50 text-purple-700 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-5 border border-purple-100">
                            OUR PROMISE TO YOU
                        </span>

                        {/* Heading */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                            Our <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Career Success</span> Guarantee
                        </h2>

                        {/* Description */}
                        <p className="text-base text-gray-600 mb-10 leading-relaxed">
                            Our commitment doesn't stop at the classroom. You'll get unlimited mock interviews, resume workshops, and 1:1 mentorship sessions until you land a role you're proud of.
                        </p>

                        {/* Guarantee Points */}
                        <div className="space-y-6 mb-10">

                            {/* Point 1 */}
                            <div className="flex items-start gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <i className="ri-shield-check-fill text-emerald-500 text-lg"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-base mb-1">Job Placement Assistance</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Direct connections to hiring partners and personalized job search support
                                    </p>
                                </div>
                            </div>

                            {/* Point 2 */}
                            <div className="flex items-start gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <i className="ri-history-line text-emerald-500 text-lg font-bold"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-base mb-1">Extended Internship/Live Project</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        We'll ensure you gain real-world experience through extended internships, live projects, and freelance opportunities with our industry partners
                                    </p>
                                </div>
                            </div>

                            {/* Point 3 */}
                            <div className="flex items-start gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <i className="ri-loop-left-line text-emerald-500 text-lg font-bold"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-base mb-1">Lifetime Access to Materials</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Continuous learning with lifetime access to course content and updates
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0 text-sm">
                                Enroll Risk-Free Today
                            </button>
                            <button className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-bold px-8 py-3.5 rounded-xl transition-all duration-300 text-sm">
                                View Guarantee Terms
                            </button>
                        </div>
                    </div>

                    {/* ════ RIGHT COLUMN: Image & Floating Card ════ */}
                    <div className="w-full lg:w-1/2 relative mt-10 lg:mt-0" data-aos="fade-left">

                        {/* Main Image */}
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"
                                alt="Students collaborating"
                                className="w-full h-[400px] object-cover"
                            />
                        </div>

                        {/* Overlapping Stats Card with REAL LOGOS */}
                        <div className="absolute -bottom-8 -left-4 sm:left-auto sm:-right-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-[92%] sm:w-[360px] transition-transform duration-300 hover:-translate-y-2">
                            <div className="flex items-start gap-4 mb-5">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                                    <i className="ri-briefcase-4-fill text-emerald-600 text-2xl"></i>
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900 text-xl">500+</h4>
                                    <p className="text-xs text-gray-500 font-medium leading-snug mt-0.5">
                                        Hiring partners actively recruiting our graduates
                                    </p>
                                </div>
                            </div>

                            {/* Company Real Logos Grid */}
                            <div className="flex flex-wrap gap-2.5">
                                {hiringPartners.map((partner, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:border-gray-300 hover:shadow-sm"
                                        title={partner.name}
                                    >
                                        <img
                                            src={partner.logo}
                                            alt={`${partner.name} logo`}
                                            className="h-3.5 sm:h-4 object-contain filter  transition-all duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default CourseGuarantee;