import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { ProfileHeader, FormSection, InputField, SocialInput } from '../components/ProfileComponents';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    role: '',
    profilePicture: '',
    profile: {
      bio: '',
      headline: '',
      location: { city: '', country: '' },
      socials: { linkedin: '', github: '', twitter: '', website: '' }
    }
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.put('http://localhost:5000/api/v1/users/profile', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data?.success) {
          const user = response.data.data;
          setFormData({
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
            age: user.age || '',
            role: user.role || 'STUDENT',
            profilePicture: user.profilePicture || '',
            profile: {
              bio: user.profile?.bio || '',
              headline: user.profile?.headline || '',
              location: {
                city: user.profile?.location?.city || '',
                country: user.profile?.location?.country || ''
              },
              socials: {
                linkedin: user.profile?.socials?.linkedin || '',
                github: user.profile?.socials?.github || '',
                twitter: user.profile?.socials?.twitter || '',
                website: user.profile?.socials?.website || ''
              }
            }
          });
        }
      } catch (error) {
        console.error("Failed to parse registry snapshot:", error);
        toast.error("Failed to load secure metadata parameters.");
      } finally {
        setFetching(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleNestedChange = (section, key, value) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [section]: key ? { ...prev.profile[section], [key]: value } : value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put('http://localhost:5000/api/v1/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.success) {
        toast.success("Identity parameters synchronized cleanly!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Execution engine mutation failure.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-[#036a6f]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Navbar />
      
      <div className="flex-grow py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
        <Toaster position="top-center" />
        
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Modular Profile Cover Banner & Meta Identity Grid Component */}
          <ProfileHeader 
            role={formData.role}
            fullName={formData.fullName}
            headline={formData.profile.headline}
            profilePicture={formData.profilePicture}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            
            {/* SECTION 1: Core System Information Mapping */}
            <FormSection title="Core Registry Details" icon="ri-shield-user-line">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full col-span-full">
                <InputField 
                  label="Full Name Identity" 
                  type="text" 
                  isEditing={isEditing} 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
                <div className="space-y-2 min-w-0 w-full">
                  <label className="flex text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider items-center gap-1.5">
                    <i className="ri-lock-line text-amber-500 shrink-0" /> Account Email Target
                  </label>
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-slate-100/70 text-slate-400 font-semibold text-xs sm:text-sm outline-none cursor-not-allowed select-none truncate"
                  />
                </div>
                <InputField 
                  label="Phone Vector" 
                  type="tel" 
                  isEditing={isEditing} 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <InputField 
                  label="Age Value Metric" 
                  type="number" 
                  isEditing={isEditing} 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                />
              </div>
            </FormSection>

            {/* SECTION 2: Customized Profile Representation Mapping */}
            <FormSection title="Professional Footprint" icon="ri-profile-line">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full col-span-full">
                <div className="col-span-full">
                  <InputField 
                    label="Custom Sub-Headline" 
                    type="text" 
                    isEditing={isEditing} 
                    value={formData.profile.headline}
                    onChange={(e) => handleNestedChange('headline', null, e.target.value)}
                    placeholder="e.g., Senior Systems Architect | Developer"
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Account Biography Overview</label>
                  <textarea
                    rows="4"
                    disabled={!isEditing}
                    value={formData.profile.bio}
                    onChange={(e) => handleNestedChange('bio', null, e.target.value)}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white disabled:bg-slate-50/80 disabled:text-slate-400 font-medium text-slate-800 text-xs sm:text-sm focus:ring-4 focus:ring-[#036a6f]/10 focus:border-[#036a6f] outline-none transition resize-none"
                    placeholder="Write a brief professional background history summary..."
                  />
                </div>
                <InputField 
                  label="Location City Node" 
                  type="text" 
                  isEditing={isEditing} 
                  value={formData.profile.location.city}
                  onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                />
                <InputField 
                  label="Country Scope" 
                  type="text" 
                  isEditing={isEditing} 
                  value={formData.profile.location.country}
                  onChange={(e) => handleNestedChange('location', 'country', e.target.value)}
                />
              </div>
            </FormSection>

            {/* SECTION 3: Social Account URL Mappings */}
            <FormSection title="Social Sync Coordinates" icon="ri-global-line">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full col-span-full">
                <SocialInput 
                  label="LinkedIn Network Profile" 
                  icon="ri-linkedin-fill" 
                  brandColor="text-blue-600" 
                  isEditing={isEditing}
                  value={formData.profile.socials.linkedin}
                  onChange={(e) => handleNestedChange('socials', 'linkedin', e.target.value)}
                />
                <SocialInput 
                  label="GitHub Environment Track" 
                  icon="ri-github-line" 
                  brandColor="text-slate-900" 
                  isEditing={isEditing}
                  value={formData.profile.socials.github}
                  onChange={(e) => handleNestedChange('socials', 'github', e.target.value)}
                />
                <SocialInput 
                  label="Twitter / X Identity" 
                  icon="ri-twitter-x-fill" 
                  brandColor="text-slate-800" 
                  isEditing={isEditing}
                  value={formData.profile.socials.twitter}
                  onChange={(e) => handleNestedChange('socials', 'twitter', e.target.value)}
                />
                <SocialInput 
                  label="Personal Hub Portfolio" 
                  icon="ri-link" 
                  brandColor="text-teal-600" 
                  isEditing={isEditing}
                  value={formData.profile.socials.website}
                  onChange={(e) => handleNestedChange('socials', 'website', e.target.value)}
                />
              </div>
            </FormSection>

            {/* Conditional Action Controls Matrix */}
            {isEditing && (
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full sm:w-auto px-6 py-3.5 text-center text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-bold transition cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-linear-to-r from-[#036a6f] to-[#025357] text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-[#036a6f]/10 hover:shadow-[#036a6f]/20 transition-all duration-200 disabled:opacity-50 cursor-pointer text-center whitespace-nowrap"
                >
                  {loading ? 'Synchronizing Transaction...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;