import React, { useState, useEffect, useRef } from 'react';

export default function QuizActiveEngine({ questions, timerDetails, onSubmit }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // Stores selections: { 0: 2, 1: 0 }
  const [timeLeft, setTimeLeft] = useState("");
  const autoSubmitTriggered = useRef(false);

  // Formatting answers into a sequential array alignment expected by backend API
  const getStructuredAnswers = (currentAnswersState) => {
    return questions.map((_, index) => 
      currentAnswersState[index] !== undefined ? currentAnswersState[index] : null
    );
  };

  // Countdown timer calculations
  useEffect(() => {
    if (!timerDetails?.expiresAt) return;
    const targetTime = new Date(timerDetails.expiresAt).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft("00:00 - EXPIRED");
        
        if (!autoSubmitTriggered.current) {
          autoSubmitTriggered.current = true;
          const structuredAnswers = getStructuredAnswers(answers);
          onSubmit(structuredAnswers, true);
        }
      } else {
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerDetails, answers, questions, onSubmit]);

  const handleSelectOption = (optionIdx) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: optionIdx }));
  };

  const handleClearSelection = () => {
    setAnswers(prev => {
      const updatedAnswers = { ...prev };
      delete updatedAnswers[currentIdx];
      return updatedAnswers;
    });
  };

  const handleSubmit = () => {
    const structuredAnswers = getStructuredAnswers(answers);
    onSubmit(structuredAnswers, false);
  };

  const activeQuestion = questions[currentIdx];
  const totalQuestions = questions.length;
  
  const totalAnsweredCount = Object.keys(answers).length;
  const overallProgressPercentage = Math.round((totalAnsweredCount / totalQuestions) * 100) || 0;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl shadow-slate-100/60 flex flex-col space-y-5 sm:space-y-6 animate-fadeIn text-slate-600 antialiased">
      
      {/* Test Execution Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 pb-4 sm:pb-5">
        <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="text-[9px] sm:text-[10px] font-black font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase tracking-wider">
              Live Evaluation
            </span>
            <span className="text-xs text-slate-400 font-bold">
              {totalAnsweredCount} of {totalQuestions} Answered
            </span>
          </div>
          <h3 className="text-slate-900 font-black text-base sm:text-lg tracking-tight">
            Question {currentIdx + 1} of {totalQuestions}
          </h3>
          
          {/* Progress Bar Component */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-xs transition-all">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300" 
              style={{ width: `${overallProgressPercentage}%` }} 
            />
          </div>
        </div>

        {/* Dynamic Warning Timer Element */}
        <div className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-mono text-xs font-extrabold border flex items-center justify-center shadow-xs self-start sm:self-center w-full sm:w-auto ${
          timeLeft.startsWith("00:") && parseInt(timeLeft.split(":")[1]) < 30
            ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse" 
            : "bg-slate-50 text-slate-700 border-slate-200/80"
        }`}>
          <span className="mr-1.5">⏱️</span> Remaining: {timeLeft || "--:--"}
        </div>
      </div>

      {/* Questions Tracking Index Grid */}
      <div className="space-y-2">
        <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider block px-0.5">
          Navigation Directory
        </span>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {questions.map((_, idx) => {
            const isCurrentIdx = currentIdx === idx;
            const hasBeenAnswered = answers[idx] !== undefined;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl font-bold font-mono text-xs transition duration-200 border-2 flex items-center justify-center cursor-pointer min-h-[34px] min-w-[34px] ${
                  isCurrentIdx 
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10 scale-105" 
                    : hasBeenAnswered
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-black"
                    : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-600"
                }`}
                title={`Jump to Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Structured Canvas Content Box */}
      <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
        <h4 className="text-slate-900 text-sm sm:text-base font-bold leading-relaxed break-words">
          {activeQuestion?.questionText}
        </h4>

        {/* Responsive Image Containers */}
        {activeQuestion?.questionImage && (
          <div className="w-full max-h-48 sm:max-h-60 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50/50 p-1.5 sm:p-2 shadow-inner">
            <img 
              src={activeQuestion.questionImage} 
              alt={`Dynamic assessment asset contextual vector reference index ${currentIdx}`} 
              className="w-full max-h-44 sm:max-h-56 object-contain rounded-lg sm:rounded-xl mix-blend-multiply mx-auto" 
            />
          </div>
        )}
      </div>

      {/* Interactive Options Multi-Choice Stack */}
      <div className="space-y-2.5 sm:space-y-3">
        <div className="flex justify-between items-center px-0.5">
          <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Selectable Response Inputs
          </span>
          {answers[currentIdx] !== undefined && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-[9px] sm:text-[10px] text-rose-500 hover:text-rose-700 font-extrabold uppercase tracking-wider cursor-pointer transition min-h-[32px] flex items-center"
            >
              Clear Choice ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
          {activeQuestion?.options?.map((option, oIdx) => {
            const isSelected = answers[currentIdx] === oIdx;
            return (
              <button
                key={oIdx}
                type="button"
                onClick={() => handleSelectOption(oIdx)}
                className={`w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-left text-xs font-semibold transition duration-200 flex items-center justify-between gap-3 border cursor-pointer min-h-[48px] ${
                  isSelected
                    ? "bg-indigo-50/70 text-indigo-900 border-indigo-400 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200/70 hover:bg-slate-100/60 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <span className={`font-mono text-[11px] font-black shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {String.fromCharCode(65 + oIdx)}.
                  </span>
                  <span className="break-words leading-relaxed">{option}</span>
                </div>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                  isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-300"
                }`}>
                  {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Pipeline Controls Strip */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4 sm:pt-5 mt-1 sm:mt-2 gap-3">
        <button
          type="button"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(prev => prev - 1)}
          className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white border border-slate-200 text-slate-600 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-50 hover:text-slate-800 transition disabled:opacity-30 disabled:hover:bg-white cursor-pointer min-h-[40px] sm:min-h-[44px]"
        >
          Previous
        </button>

        {currentIdx < totalQuestions - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentIdx(prev => prev + 1)}
            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-slate-800 transition cursor-pointer shadow-md shadow-slate-950/5 min-h-[40px] sm:min-h-[44px]"
          >
            Next Question
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wider hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/10 cursor-pointer min-h-[40px] sm:min-h-[44px]"
          >
            Submit
          </button>
        )}
      </div>

    </div>
  );
}