import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, AlertTriangle, ArrowUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Blog/BlogDetail/Hero';
import BlogInfo from '../components/Blog/BlogDetail/BlogInfo';
import ExploreAICourses from '../components/Blog/BlogDetail/ExploreAICourses';
import ExploreMoreCourses from '../components/Blog/BlogDetail/ExploreMoreCourses';
import BlogComments from '../components/Blog/BlogDetail/BlogComments';
import BlogCTAWidget from '../components/Blog/BlogDetail/BlogCTAWidget'; 
import LeadPopup from '../components/LeadPopup'; 
import axiosInstance from '../api/axiosInstance'; 

const NewBlogDetail = () => {
  const { slug } = useParams();
  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await axiosInstance.get(`/blogs/${slug}`);
        
        if (response.data) {
          setCurrentPost(response.data.article || response.data.blog || response.data);
        } else {
          setError("Failed to resolve server data structure logs.");
        }
      } catch (err) {
        console.error("API Fetch Error Detail Log:", err);
        setError("Unable to discover the active publication log entry matching this route.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticleDetail();
    }
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const handleScrollVisibility = () => {
      if (window.scrollY > 400) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };

    window.addEventListener('scroll', handleScrollVisibility);
    return () => window.removeEventListener('scroll', handleScrollVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const renderParagraphText = (text) => {
    if (!text) return '';
    const stringText = text.toString();
    if (!stringText.includes('**')) return stringText;
    return stringText.split('**').map((part, i) => 
      i % 2 === 1 ? <strong key={i} className="font-bold text-gray-900">{part}</strong> : part
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#5B45FF]" />
          <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
            Compiling Core Publication Matrix...
          </span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto">
          <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-800">Log Entry Offline</h3>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            {error || "This document blueprint is missing or hasn't verified distribution access flags yet."}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen flex flex-col antialiased relative">
      <Navbar />
      <Hero post={currentPost} />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start py-12 pb-16">
        
        {/* Left Content Stream */}
        <div className="lg:col-span-2 space-y-10">
          {Array.isArray(currentPost.contentSections) && currentPost.contentSections.map((section, idx) => {
            const sectionId = `section-${idx}`;

            return (
              <section key={idx} id={sectionId} className="scroll-mt-28 block w-full">
                
                {/* 1. SECTION HEADINGS */}
                {section.heading && section.heading.toString().trim() !== "" && (
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-5 font-serif tracking-tight border-b border-gray-100 pb-3">
                    {section.heading}
                  </h2>
                )}

                {/* 2. CORE BODY TEXT BLOCKS */}
                {section.body && section.body.toString().trim() !== "" && (
                  <div className="space-y-4 mb-4">
                    {section.body.toString().split('\n\n').map((para, pIdx) => (
                      para.trim() !== "" && (
                        <p key={pIdx} className="text-[16px] sm:text-[17px] text-gray-700 leading-relaxed font-normal">
                          {renderParagraphText(para)}
                        </p>
                      )
                    ))}
                  </div>
                )}

                {/* 3. PARAGRAPHS MATRIX COMPLEMENT */}
                {Array.isArray(section.paragraphs) && section.paragraphs.length > 0 && (
                  <div className="mb-4">
                    {section.paragraphs.map((para, pIdx) => (
                      para && para.toString().trim() !== "" && (
                        <p key={pIdx} className="text-[16px] sm:text-[17px] text-gray-700 leading-relaxed mb-4 font-normal">
                          {renderParagraphText(para)}
                        </p>
                      )
                    ))}
                  </div>
                )}

                {/* 4. CALLOUT BOX FEATURE (Only displays if text content exists) */}
                {section.calloutBox && (section.calloutBox.title || section.calloutBox.text) && (
                  <div className="my-6 p-5 sm:p-6 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-4 shadow-sm">
                    <div className="text-blue-500 mt-0.5">
                      <i className="ri-information-line text-2xl sm:text-3xl"></i>
                    </div>
                    <div>
                      {section.calloutBox.title && <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-1">{section.calloutBox.title}</h4>}
                      {section.calloutBox.text && <p className="text-sm text-gray-700 leading-relaxed">{section.calloutBox.text}</p>}
                    </div>
                  </div>
                )}

                {/* 5. BLOCKQUOTES ENGINE (Guards against empty quotes & hides empty authors) */}
                {section.blockquote && section.blockquote.quote && section.blockquote.quote.toString().trim() !== "" && (
                  <div className="my-6 pl-5 border-l-4 border-[#5B45FF] bg-gray-50/80 p-5 rounded-r-xl shadow-inner">
                    <p className="italic text-base text-gray-800 font-medium leading-relaxed mb-2 font-serif">
                      {section.blockquote.quote}
                    </p>
                    {section.blockquote.author && section.blockquote.author.toString().trim() !== "" && (
                      <p className="text-xs sm:text-sm font-semibold text-gray-500 text-right mr-2">
                        — {section.blockquote.author}
                      </p>
                    )}
                  </div>
                )}

                {/* 6. GRID CARDS DISPLAY */}
                {section.type === "grid_cards" && Array.isArray(section.cards) && section.cards.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
                    {section.cards.map((card, cIdx) => (
                      (card.title || card.desc) && (
                        <div key={cIdx} className="p-5 sm:p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                          {card.title && <h4 className="font-bold text-[#5B45FF] text-base sm:text-lg mb-2 font-serif tracking-tight">{card.title}</h4>}
                          {card.desc && <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>}
                        </div>
                      )
                    ))}
                  </div>
                )}

                {/* 7. COMPARISON CODE MATRIX BLOCKS */}
                {section.type === "comparison_blocks" && Array.isArray(section.comparisons) && section.comparisons.length > 0 && (
                  <div className="flex flex-col gap-5 my-5">
                    {section.introText && <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{section.introText}</p>}
                    {section.subHeading && <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight mt-1">{section.subHeading}</h3>}
                    
                    {section.comparisons.map((comp, compIdx) => (
                      (comp.blockTitle || comp.description || comp.weak || comp.strong) && (
                        <div key={compIdx} className="p-6 border border-gray-100 bg-white rounded-xl shadow-sm flex flex-col gap-3">
                          {comp.blockTitle && <h4 className="font-bold text-[#5B45FF] text-[17px] font-serif">{comp.blockTitle}</h4>}
                          {comp.description && <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{comp.description}</p>}
                          
                          {(comp.weak || comp.strong) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                              {comp.weak && (
                                <div className="p-4 bg-rose-50/40 border border-rose-100 rounded-lg">
                                  <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block mb-2">✕ Weak Prompt:</span>
                                  <code className="text-xs font-mono text-gray-800 block leading-relaxed bg-white/60 p-2 rounded border border-rose-100/50 whitespace-pre-wrap">"{comp.weak}"</code>
                                </div>
                              )}
                              {comp.strong && (
                                <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-lg">
                                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block mb-2">✓ Strong Prompt:</span>
                                  <code className="text-xs font-mono text-gray-800 block leading-relaxed bg-white/60 p-2 rounded border border-emerald-100/50 whitespace-pre-wrap">"{comp.strong}"</code>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </section>
            );
          })}

          <BlogComments />
          <ExploreMoreCourses />
          <ExploreAICourses />
          <BlogCTAWidget />
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 lg:sticky lg:top-24">
          <BlogInfo post={currentPost} />
        </div>

      </div>

      <Footer />
      <LeadPopup />

      {/* Floating Scroll To Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 bg-[#5B45FF] hover:bg-[#4834e4] text-white w-11 h-11 rounded-full shadow-xl hover:shadow-[#5B45FF]/20 flex items-center justify-center transition-all duration-300 cursor-pointer ${
          showScrollBtn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
        }`}
        title="Scroll to Top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default NewBlogDetail;