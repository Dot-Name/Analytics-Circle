import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

// Global Layout Subcomponents
import Navbar from "../components/Navbar";

// Context Workspace UI Subcomponents
import CourseSidebar from '../components/MyCourse/CourseSidebar';
import VideoPlayer from '../components/MyCourse/VideoPlayer/index';
import QuizPanel from '../components/MyCourse/QuizPanel';

export default function CourseWorkspace() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // 📱 MOBILE RESPONSIVENESS OVERLAY STATE
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  // 📈 TRACKING STATE VARIABLES
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [progressSummary, setProgressSummary] = useState({ completed: 0, total: 0 });
  const [completedLectures, setCompletedLectures] = useState([]); 

  const gatherCompleteWorkspaceData = async () => {
    try {
      setIsLoading(true);

      // Step 1: Fetch Course Core Identity Profile
      const courseRes = await axiosInstance.get(`/courses/${slug}`);
      const coreCourse = courseRes.data?.data;
      if (!coreCourse) throw new Error("Course profile unresolvable");
      setCourse(coreCourse);

      // Step 2: Fetch modules list and progress data concurrently
      const [sectionsRes, telemetryRes] = await Promise.all([
        axiosInstance.get(`/sections/course/${coreCourse._id}`),
        axiosInstance.get(`/progress/dashboard/${coreCourse._id}?_t=${Date.now()}`).catch(err => {
          console.warn("Telemetry endpoint tracking initialized with flat defaults:", err);
          return { data: { dashboard: { overallCompletionPercentage: 0, totalElementsCompleted: 0, totalCourseElements: 0, completedLectures: [] } } };
        })
      ]);

      // 🌟 UNIFIED EXTRACTION MAPPING: Support both direct dashboard blocks and inner courseOverview responses safely
      const dashboardData = telemetryRes.data?.dashboard || telemetryRes.data?.data?.courseOverview || telemetryRes.data?.data;
      
      const pct = dashboardData?.overallCompletionPercentage !== undefined 
        ? dashboardData.overallCompletionPercentage 
        : (dashboardData?.completionPercentage || 0);

      setCompletionPercentage(pct);
      setProgressSummary({
        completed: dashboardData?.totalElementsCompleted || 0,
        total: dashboardData?.totalCourseElements || 0
      });
      
      setCompletedLectures(
        telemetryRes.data?.dashboard?.completedLectures || 
        telemetryRes.data?.data?.completedLectures || 
        dashboardData?.completedLectures || []
      ); 

      const plainSections = sectionsRes.data?.data || [];

      // Step 3: Fetch Lectures and Quizzes simultaneously
      const structuredSyllabusPromises = plainSections.map(async (section) => {
        try {
          const [lecturesRes, quizzesRes] = await Promise.all([
            axiosInstance.get(`/lectures?sectionId=${section._id}`),
            axiosInstance.get(`/quizzes/section/${coreCourse._id}/${section._id}`)
          ]);

          return {
            ...section,
            lectures: lecturesRes.data?.data || [],
            quizzes: quizzesRes.data?.data || []
          };
        } catch (itemErr) {
          console.error(`Error aggregating elements for section ${section._id}:`, itemErr);
          return { ...section, lectures: [], quizzes: [] };
        }
      });

      const compiledSyllabus = await Promise.all(structuredSyllabusPromises);
      setSyllabus(compiledSyllabus);

      // Step 4: Fallback initialization defaults
      const firstSection = compiledSyllabus[0];
      if (firstSection) {
        setExpandedSections({ [firstSection._id]: true });
        if (firstSection.lectures?.length > 0) {
          setActiveItem({ type: 'LECTURE', data: firstSection.lectures[0] });
        } else if (firstSection.quizzes?.length > 0) {
          setActiveItem({ type: 'QUIZ', data: firstSection.quizzes[0] });
        }
      }

    } catch (err) {
      console.error("Workspace aggregation failure:", err);
      toast.error("Could not mount workspace canvas maps layout cleanly.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) gatherCompleteWorkspaceData();
  }, [slug]);

  // ENGINE LAYER: Forces sidebar aggregates to shift instantly and safely handles quiz submissions
  const handleProgressTelemetryRefresh = async (backendPayload) => {
    const payload = backendPayload?.data || backendPayload;
    if (!payload) return;

    // 1. If it's a video progress payload, extract standard telemetry parameters
    const aggregates = payload.courseOverview;
    if (aggregates) {
      setCompletionPercentage(aggregates.overallCompletionPercentage || 0);
      setProgressSummary({
        completed: aggregates.totalElementsCompleted || 0,
        total: aggregates.totalCourseElements || 0
      });
    } 
    // 2. 🌟 FIXED: If it's a quiz submission payload, it won't have courseOverview.
    else if (payload.summary || payload.detailedBreakdown || backendPayload.success) {
      try {
        const telemetryRes = await axiosInstance.get(`/progress/dashboard/${course?._id || courseId}?_t=${Date.now()}`);
        const dashboardData = telemetryRes.data?.dashboard || telemetryRes.data?.data?.courseOverview || telemetryRes.data?.data;
        
        if (dashboardData) {
          const pct = dashboardData.overallCompletionPercentage !== undefined 
            ? dashboardData.overallCompletionPercentage 
            : (dashboardData.completionPercentage || 0);

          setCompletionPercentage(pct);
          setProgressSummary({
            completed: dashboardData.totalElementsCompleted || 0,
            total: dashboardData.totalCourseElements || 0
          });
        }
      } catch (fetchErr) {
        console.error("Failed to hot-reload dashboard metrics following quiz submit:", fetchErr);
      }
    }

    // Handle completed lectures tracking lists
    if (payload.completedLectures) {
      setCompletedLectures(payload.completedLectures);
    } else if (payload.isCompleted && activeItem?.data?._id) {
      setCompletedLectures(prev => {
        const lectureIdStr = activeItem.data._id.toString();
        return prev.includes(lectureIdStr) ? prev : [...prev, lectureIdStr];
      });
    }
  };

  const toggleSectionDrawer = (sectionId) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  // Safe wrapper for mobile item updates that closes drawer views automatically
  const handleMobileItemSelection = (item) => {
    setActiveItem(item);
    setIsSidebarMobileOpen(false); // Snaps workspace map container back to view focus
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Mounting Track Progress Ledgers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white">
      <Navbar />

      {/* 🎬 MIDDLE MAIN WORKSPACE GRID */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full relative h-[calc(100vh-64px)]">
          
          {/* Dynamic Viewport Canvas Content Window */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto relative p-3 sm:p-4 lg:p-6 bg-slate-50/50">
              {activeItem?.type === 'LECTURE' ? (
                  <VideoPlayer 
                    courseId={course?._id} 
                    lecture={activeItem.data} 
                    onProgressUpdate={handleProgressTelemetryRefresh} 
                  />
              ) : activeItem?.type === 'QUIZ' ? (
                  <div className="w-full max-w-4xl mx-auto">
                    <QuizPanel 
                      key={activeItem.data._id} 
                      quiz={activeItem.data} 
                      onProgressRefresh={handleProgressTelemetryRefresh} 
                    />
                  </div>
              ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-xs p-6 text-center">
                    Workspace viewport unselected. Open the course menu and choose a module node to begin.
                  </div>
              )}
          </div>

          {/* 📱 MOBILE FLOATING SIDEBAR TOGGLE ACTION TRIGGER BUTTON */}
          <button
            onClick={() => setIsSidebarMobileOpen(!isSidebarMobileOpen)}
            className="lg:hidden fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-full shadow-2xl active:scale-95 transition-transform"
          >
            {isSidebarMobileOpen ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                <span>Close Menu</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                <span>Course Modules</span>
              </>
            )}
          </button>

          {/* 📱 MOBILE BACKDROP DROPDOWN MASK OVERLAY */}
          {isSidebarMobileOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40"
              onClick={() => setIsSidebarMobileOpen(false)}
            />
          )}

          {/* Structural Track Isolated Sidebar with attached progress meters */}
          <div className={`
            fixed top-[64px] right-0 bottom-0 z-40 bg-white transition-transform duration-300 ease-in-out w-[85vw] sm:w-[400px] border-l border-slate-100 shadow-2xl h-[calc(100vh-64px)]
            lg:static lg:w-[360px] lg:shadow-none lg:translate-x-0
            ${isSidebarMobileOpen ? 'translate-x-0' : 'translate-x-full'}
          `}>
            <CourseSidebar
              courseId={course?._id} 
              title={course?.title || "Master Class Track"}
              syllabus={syllabus}
              expandedSections={expandedSections}
              toggleSection={toggleSectionDrawer}
              activeItem={activeItem}
              setActiveItem={handleMobileItemSelection}
              completionPercentage={completionPercentage}
              progressSummary={progressSummary}
              completedLectures={completedLectures} 
              onProgressRefresh={handleProgressTelemetryRefresh} 
            />
          </div>
      </div>
    </div>
  );
}