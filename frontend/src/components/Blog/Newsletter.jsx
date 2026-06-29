import React, { useState } from "react";
import { Mail, Check } from "lucide-react";

const Newsletter = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    program: "",
    experience: "",
    background: ""
  });
  const [status, setStatus] = useState("idle"); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    const scriptUrl = "https://script.google.com/macros/s/AKfycbyQIaAoJEranDg8GvpUnHxubn6Z-1USVN5iSrUcW2ldPYWKuYMyRo6F70Uq6PI2kNCywA/exec";

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("countryCode", formData.countryCode);
    data.append("phone", formData.phone);
    data.append("program", formData.program);
    data.append("experience", formData.experience);
    data.append("background", formData.background);

    try {
      await fetch(scriptUrl, {
        method: "POST",
        body: data,
        mode: "no-cors"
      });
      
      setStatus("success");
      setFormData({ 
        name: "", 
        email: "", 
        countryCode: "+91", 
        phone: "", 
        program: "", 
        experience: "", 
        background: "" 
      });
      
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
  };

  return (
    // max-w aur px-4 ensure karega ki pura section screen ke andar rahe
    <section className="my-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div 
        data-aos="fade-up"
        className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-gray-200 p-5 sm:p-8 md:p-12 shadow-sm hover:shadow-xl transition-shadow duration-500 flex flex-col md:flex-row gap-8 md:gap-12 items-center w-full"
      >
        
        {/* Left Side Content */}
        <div className="flex-1 w-full max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-bold mb-4 sm:mb-6 border border-emerald-100">
            <Mail className="w-3.5 h-3.5" /> Expert guidance
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-5 leading-tight">
            Accelerate your tech career today
          </h2>
          
          <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed">
            Join our curated programs and get the best mentorship, resources, and career support tailored to your background.
          </p>
          
          {/* Checklist */}
          <ul className="flex flex-col gap-3 mb-4 sm:mb-8">
            <li className="flex items-center gap-3 text-gray-700 font-medium text-sm sm:text-base">
              <div className="p-1 rounded-full bg-emerald-50 shrink-0">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
              </div>
              Curated by domain experts
            </li>
            <li className="flex items-center gap-3 text-gray-700 font-medium text-sm sm:text-base">
              <div className="p-1 rounded-full bg-emerald-50 shrink-0">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
              </div>
              Tailored to your experience
            </li>
          </ul>
        </div>

        {/* Right Side Content (The Advanced Form) */}
        <div className="flex-1 w-full bg-gray-50/50 p-4 sm:p-6 md:p-8 rounded-[1.5rem] border border-gray-100">
          <form className="flex flex-col gap-3.5 sm:gap-4 w-full" onSubmit={handleSubmit}>
            
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <input 
                type="text" 
                name="name"
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 sm:px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#5B45FF] focus:border-transparent text-gray-900 placeholder-gray-400 text-sm sm:text-base transition-all"
                required 
              />
              <input 
                type="email" 
                name="email"
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 sm:px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#5B45FF] focus:border-transparent text-gray-900 placeholder-gray-400 text-sm sm:text-base transition-all"
                required 
              />
            </div>

            {/* Row 2: Phone with Country Code (FIXED FOR MOBILE) */}
            <div className="flex gap-2 sm:gap-3 w-full">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="w-[75px] sm:w-24 shrink-0 px-1 sm:px-2 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#5B45FF] focus:border-transparent text-gray-600 text-sm sm:text-base transition-all cursor-pointer text-center"
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+971">+971</option>
              </select>
              {/* min-w-0 zaroori hai flexbox blowout rokne ke liye */}
              <input 
                type="tel" 
                name="phone"
                placeholder="Phone Number" 
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
                className="flex-1 min-w-0 px-3.5 sm:px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#5B45FF] focus:border-transparent text-gray-900 placeholder-gray-400 text-sm sm:text-base transition-all"
                required 
              />
            </div>

            {/* Program Dropdown */}
            <select 
              name="program"
              value={formData.program}
              onChange={handleChange}
              className="w-full px-3.5 sm:px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#5B45FF] focus:border-transparent text-gray-600 text-sm sm:text-base transition-all cursor-pointer text-ellipsis overflow-hidden"
              required
            >
              <option value="" disabled>Select Program of Interest</option>
              <option value="Data Science Bootcamp">Data Science Bootcamp</option>
              <option value="AI & ML Certification">AI & ML Certification</option>
              <option value="Full Stack Web Dev">Full Stack Web Dev</option>
              <option value="Data Analytics">Data Analytics</option>
            </select>

            {/* Row 3: Experience & Background */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <select 
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3.5 sm:px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#5B45FF] focus:border-transparent text-gray-600 text-sm sm:text-base transition-all cursor-pointer text-ellipsis overflow-hidden"
                required
              >
                <option value="" disabled>Years of Experience</option>
                <option value="Student/Fresher">Student / Fresher</option>
                <option value="1-3 Years">1 - 3 Years</option>
                <option value="3-5 Years">3 - 5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>

              <select 
                name="background"
                value={formData.background}
                onChange={handleChange}
                className="w-full px-3.5 sm:px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#5B45FF] focus:border-transparent text-gray-600 text-sm sm:text-base transition-all cursor-pointer text-ellipsis overflow-hidden"
                required
              >
                <option value="" disabled>Current Background</option>
                <option value="IT/Tech">IT / Tech Professional</option>
                <option value="Non-Tech">Non-Tech / Business</option>
                <option value="Undergraduate">Undergraduate Student</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={status === "submitting"}
              className={`w-full mt-2 sm:mt-3 px-5 py-3.5 sm:py-4 rounded-xl text-white font-bold text-sm sm:text-base transition-colors shadow-md ${
                status === "success" 
                  ? "bg-emerald-500 hover:bg-emerald-600" 
                  : "bg-[#2563EB] hover:bg-blue-700"
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {status === "submitting" ? "Submitting Application..." : 
               status === "success" ? "Application Received!" : 
               "SUBMIT APPLICATION"}
            </button>

            {/* Status messages */}
            {status === "error" && (
              <p className="text-center text-xs text-red-500 font-medium">Something went wrong. Please try again.</p>
            )}
            <p className="text-center text-[10px] sm:text-[11px] text-gray-500 mt-1">
              By submitting, you agree to our <a href="#" className="text-[#5B45FF] hover:underline">Terms & Conditions</a>.
            </p>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Newsletter;