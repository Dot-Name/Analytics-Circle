import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';
import QuizActiveEngine from './QuizActiveEngine';

// Enhanced Clean-Light Theme Interface SVGs
const AcademicIcon = () => (
  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircle = () => (
  <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const CrossCircle = () => (
  <svg className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
  </svg>
);

export default function QuizPanel({ quiz, onProgressRefresh }) {
  const [phase, setPhase] = useState('START_SCREEN');
  const [sessionData, setSessionData] = useState({ questions: [], timerDetails: null });
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartQuiz = async () => {
    try {
      setIsProcessing(true);
      const res = await axiosInstance.post('/quizzes/start', {
        quizId: quiz._id,
        courseId: quiz.courseId
      });

      if (res.data?.success) {
        setSessionData({
          questions: res.data.questions || [],
          timerDetails: res.data.timerDetails || null
        });
        setPhase('ACTIVE_TEST');
        toast.success("Timing sequence active. Good luck!");
      }
    } catch (err) {
      console.error("Quiz activation failure:", err);
      toast.error(err.response?.data?.message || "Failed to initialize active verification frameworks.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCalculateGrades = async (studentAnswers, isForced = false) => {
    try {
      setIsProcessing(true);
      if (isForced) toast.error("Session limit reached! Compiling incomplete logs...");

      const res = await axiosInstance.post(`/quizzes/submit/${quiz.courseId}/${quiz._id}`, {
        studentAnswers
      });

      if (res.data?.success) {
        setEvaluationResult(res.data);
        setPhase('REPORT_SCREEN');
        toast.success("Metrics evaluated safely!");

        if (typeof onProgressRefresh === 'function') {
          onProgressRefresh(res.data);
        }
      }
    } catch (err) {
      console.error("Grading verification server crash:", err);
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!quiz) return null;

  return (
    <div className="flex-1 bg-slate-50/50 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start w-full font-sans antialiased text-slate-600">
      
      {/* PHASE 1: START SCREEN */}
      {phase === 'START_SCREEN' && (
        <div className="max-w-xl w-full bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-100/50 my-auto animate-fadeIn space-y-5 sm:space-y-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-xs">
              <AcademicIcon />
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-amber-600 uppercase font-mono block mb-0.5">
                Knowledge Assessment
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate">
                {quiz.title}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            This module contains systematic validation nodes mapped to track your syllabus core competencies. 
            Ensure your connection is completely stable before initializing.
          </p>

          <div className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200/60 rounded-xl sm:rounded-2xl flex items-center justify-between text-xs font-semibold gap-2">
            <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
              <ClockIcon /> Allocated Window:
            </span>
            <span className="text-slate-800 font-extrabold bg-white px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl border border-slate-200/70 shadow-xs text-right">
              {quiz.durationInMinutes || 15} Minutes
            </span>
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleStartQuiz}
            className="w-full py-3.5 sm:py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-xs rounded-xl sm:rounded-2xl uppercase tracking-wider transition duration-200 shadow-md shadow-emerald-600/10 active:scale-[0.98] cursor-pointer min-h-[44px]"
          >
            {isProcessing ? "Deploying Core Elements..." : "Begin Evaluation Attempt"}
          </button>
        </div>
      )}

      {/* PHASE 2: LIVE RUNNING QUIZ TESTING FRAME */}
      {phase === 'ACTIVE_TEST' && (
        <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl shadow-slate-100/40 my-2 sm:my-4">
          <QuizActiveEngine
            questions={sessionData.questions}
            timerDetails={sessionData.timerDetails}
            onSubmit={handleCalculateGrades}
          />
        </div>
      )}

      {/* PHASE 3: GRADED EVALUATION REPORT */}
      {phase === 'REPORT_SCREEN' && evaluationResult && (
        <div className="w-full max-w-2xl bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl shadow-slate-200/40 space-y-5 sm:space-y-6 my-2 sm:my-4 animate-fadeIn">
          
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Performance Analytics</h2>
            <p className="text-xs text-slate-400 font-medium">{evaluationResult.message}</p>
          </div>

          {/* Performance Data Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200/60 rounded-xl sm:rounded-2xl text-center shadow-xs">
              <p className="text-[9px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest">Points</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{evaluationResult.summary?.scoreAchieved}</p>
            </div>
            <div className="p-3.5 sm:p-4 bg-indigo-50/40 border border-indigo-100/70 rounded-xl sm:rounded-2xl text-center shadow-xs">
              <p className="text-[9px] sm:text-[10px] uppercase font-black text-indigo-500 tracking-widest">Grade</p>
              <p className="text-xl sm:text-2xl font-black text-indigo-600 mt-1">{evaluationResult.summary?.attemptPercentage}</p>
            </div>
            <div className="p-3.5 sm:p-4 bg-amber-50/40 border border-amber-100/70 rounded-xl sm:rounded-2xl text-center shadow-xs">
              <p className="text-[9px] sm:text-[10px] uppercase font-black text-amber-600 tracking-widest">Attempts Left</p>
              <p className="text-xl sm:text-2xl font-black text-amber-700 mt-1">{evaluationResult.summary?.attemptsRemaining}</p>
            </div>
          </div>

          {/* Certificate Progress Bar Frame */}
          <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-xs font-medium">
            <div className="space-y-0.5">
              <p className="font-extrabold text-slate-800">Certificate Release Criteria</p>
              <p className="text-slate-400 text-[11px] font-semibold leading-relaxed max-w-sm">
                {evaluationResult.certificateStatus?.requirementsHint}
              </p>
            </div>
            <span className={`px-2.5 py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black tracking-widest uppercase shrink-0 border self-start sm:self-center ${
              evaluationResult.certificateStatus?.unlockedCertificate 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" 
                : "bg-slate-200/60 text-slate-500 border-slate-300/40"
            }`}>
              {evaluationResult.certificateStatus?.unlockedCertificate ? "UNLOCKED" : "LOCKED"}
            </span>
          </div>

          {/* Detailed Question Review Matrix */}
          <div className="space-y-3 sm:space-y-3.5">
            <h4 className="text-slate-900 font-black text-sm tracking-tight px-1">Review Framework Log</h4>
            <div className="space-y-3">
              {evaluationResult.detailedBreakdown?.map((report, rIdx) => {
                const isCorrect = report.isCorrect;
                return (
                  <div 
                    key={rIdx} 
                    className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-200 bg-white ${
                      isCorrect ? 'border-emerald-200/70 shadow-xs shadow-emerald-50/20' : 'border-rose-200/70 shadow-xs shadow-rose-50/20'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      {isCorrect ? <CheckCircle /> : <CrossCircle />}
                      
                      <div className="space-y-3 min-w-0 flex-1 text-xs font-semibold text-slate-700">
                        {/* QUESTION TEXT */}
                        <p className="leading-relaxed text-slate-900 font-bold break-words">
                          <span className="font-mono text-slate-400 font-medium mr-1.5">Q{report.questionNumber}.</span> 
                          {report.questionText}
                        </p>

                        {/* QUESTION IMAGE CONTAINER */}
                        {report.questionImage && (
                          <div className="mt-2 rounded-xl overflow-hidden border border-slate-100 max-w-full sm:max-w-xs bg-slate-50 p-1">
                            <img 
                              src={report.questionImage} 
                              alt={`Context Vector UI Node Q${report.questionNumber}`}
                              className="max-h-40 sm:max-h-48 w-auto max-w-full object-contain rounded-lg mx-auto sm:mx-0"
                            />
                          </div>
                        )}

                        {/* ANSWERS COMPARISON STATUS GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-medium pt-1">
                          <div className={`p-2 rounded-lg sm:rounded-xl border break-words ${isCorrect ? 'bg-emerald-50/40 border-emerald-100 text-emerald-800' : 'bg-rose-50/40 border-rose-100 text-rose-800'}`}>
                            Your Pick: <span className="font-bold">{report.yourSelection || 'None'}</span>
                          </div>
                          {!isCorrect && (
                            <div className="p-2 rounded-lg sm:rounded-xl border bg-emerald-50/40 border-emerald-100 text-emerald-800 break-words">
                              Correction: <span className="font-bold">{report.correctSelection}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEvaluationResult(null);             
              setSessionData({ questions: [], timerDetails: null }); 
              setPhase('START_SCREEN');             
            }}
            className="w-full py-3 sm:py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl sm:rounded-2xl border border-slate-200/80 transition uppercase tracking-wider cursor-pointer min-h-[44px]"
          >
            Return to Dashboard Module
          </button>
        </div>
      )}

    </div>
  );
}