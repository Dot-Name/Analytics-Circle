import React from 'react';

export default function QuizSection({ sIdx, field, register, updateSection }) {
  const addQuizQuestionMCQ = () => {
    const currentQuiz = field.quiz || { title: 'Section Core Evaluation', durationInMinutes: 15, questions: [] };
    const updatedQuestions = [...(currentQuiz.questions || []), { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }];
    updateSection(sIdx, { ...field, quiz: { ...currentQuiz, questions: updatedQuestions } });
  };

  const removeQuestion = (qIdx) => {
    const filteredQ = field.quiz.questions.filter((_, idx) => idx !== qIdx);
    updateSection(sIdx, { ...field, quiz: { ...field.quiz, questions: filteredQ } });
  };

  return (
    <div className="p-4 bg-slate-50/60 border border-slate-200 rounded-2xl space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Section Milestone Evaluation (Quiz)</span>
        <button type="button" onClick={addQuizQuestionMCQ} className="text-[11px] font-black text-[#036a6f] hover:underline">+ Append Evaluation MCQ</button>
      </div>

      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
        {field.quiz?.questions?.map((q, qIdx) => (
          <div key={qIdx} className="bg-white p-3 border border-slate-200 rounded-xl space-y-3 relative group/question shadow-3xs">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-black uppercase">
              <span>Question Block {qIdx + 1} of {field.quiz.questions.length}</span>
              <button type="button" onClick={() => removeQuestion(qIdx)} className="text-rose-500 hover:underline opacity-0 group-hover/question:opacity-100 transition-opacity">Delete</button>
            </div>
            <input type="text" {...register(`sections.${sIdx}.quiz.questions.${qIdx}.questionText`)} placeholder="State evaluation formulation context..." className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none" />
            
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((opt) => (
                <input key={opt} type="text" {...register(`sections.${sIdx}.quiz.questions.${qIdx}.options.${opt}`)} placeholder={`Choice Option ${String.fromCharCode(65 + opt)}`} className="text-[11px] p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none" />
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-100">
              <span>Correct Target Vector:</span>
              <select {...register(`sections.${sIdx}.quiz.questions.${qIdx}.correctAnswerIndex`)} className="bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-[11px] p-1 focus:outline-none">
                <option value={0}>Option A</option>
                <option value={1}>Option B</option>
                <option value={2}>Option C</option>
                <option value={3}>Option D</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}