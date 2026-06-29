import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <div>
        <Navbar />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-24 relative overflow-hidden select-none antialiased">
        
        {/* Premium Decorative Architectural Blur Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-125 h-125 rounded-full bg-indigo-200/40 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-150 h-150 rounded-full bg-teal-100/30 blur-[130px] pointer-events-none" />

        {/* Main Structural Visual Grid Container */}
        <div className="relative max-w-xl w-full text-center bg-white/70 backdrop-blur-md border border-white/80 px-8 py-14 sm:p-16 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center">
            
            {/* Core Vector Element Layer */}
            <div className="relative mb-6">
            <h1 className="text-9xl font-black tracking-tighter select-none font-sans bg-linear-to-r from-[#036a6f] via-indigo-600 to-[#4F46E5] bg-clip-text text-transparent opacity-85">
                404
            </h1>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-[#fdb405] rounded-full" />
            </div>

            {/* Messaging Layout Stack */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-4">
            Route Out of Bounds
            </h2>
            
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed mt-3 max-w-sm font-medium">
            The requested engineering matrix block or system blueprint configuration link does not exist.
            </p>

            {/* Action Button Navigation Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full sm:w-auto">
            <Link
                to="/"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#036a6f] hover:bg-[#025357] text-white text-sm font-semibold tracking-wide shadow-lg shadow-[#036a6f]/20 hover:shadow-xl hover:shadow-[#036a6f]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center"
            >
                <i className="ri-home-5-line mr-2 align-middle text-base"></i>
                Return Home
            </Link>

            <button
                onClick={() => window.history.back()}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold tracking-wide shadow-sm hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center cursor-pointer"
            >
                <i className="ri-arrow-left-line mr-2 align-middle text-base"></i>
                Go Back
            </button>
            </div>
        </div>
        </div>
        <Footer />
    </div>
  );
};

export default NotFound;