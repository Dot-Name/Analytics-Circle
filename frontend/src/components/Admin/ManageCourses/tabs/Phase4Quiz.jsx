// tabs/Phase4Quiz.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../../../api/axiosInstance';

// High-End Minimalist SVG Action & Interface Icons
const ClipboardIcon = () => <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const GearIcon = () => <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SparklesIcon = () => <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.187.904zM18.75 5.25h.008v.008h-.008V5.25zM21.45 8.25h.008v.008h-.008V8.25z" /></svg>;
const ImageIcon = () => <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
const ClockIcon = () => <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ArrowLeftIcon = () => <svg className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>;
const ArrowRightIcon = () => <svg className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;
const SyncIcon = () => <svg className="w-4 h-4 animate-spin text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const EmptyFolderIcon = () => <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 1.5V7.5A2.25 2.25 0 014.5 5.25h15A2.25 2.25 0 0121 7.5v9.502a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 16.5v-1.5z" /></svg>;

export default function Phase4Quiz({ currentCourseId, activeSection, sections, prevStep }) {
  const targetSection = sections[activeSection];
  
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuizId, setEditingQuizId] = useState(null);

  const [quizTitle, setQuizTitle] = useState('');
  const [duration, setDuration] = useState(15);
  const [questions, setQuestions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [deletingQuizId, setDeletingQuizId] = useState(null);

  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null); 
  const [qText, setQText] = useState('');
  const [opts, setOpts] = useState(['', '', '', '']);
  const [correctIdx, setCorrectIdx] = useState(0);
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (targetSection?._id) {
      fetchAllSectionQuizzes();
    }
  }, [targetSection]);

  const fetchAllSectionQuizzes = async () => {
    setFetching(true);
    try {
      const response = await axiosInstance.get(`/quizzes/admin/section/${targetSection._id}`);
      const data = response.data?.data || [];
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed syncing section quiz matrix:", err);
      toast.error("Could not load section quizzes.");
    } finally {
      setFetching(false);
    }
  };

  const handleDeleteQuizPermanently = async (quizId, title) => {
    if (!window.confirm(`Are you absolutely sure you want to permanently erase "${title}"? This will delete all attached media files from cloud storage and cannot be undone.`)) {
      return;
    }

    setDeletingQuizId(quizId);
    try {
      const response = await axiosInstance.delete(`/quizzes/${quizId}`);
      toast.success(response.data?.message || "Quiz ecosystem deleted successfully.");
      
      if (editingQuizId === quizId) {
        resetFullQuizForm();
      }
      
      fetchAllSectionQuizzes();
    } catch (err) {
      console.error("Failed executing target quiz removal cascade:", err);
      toast.error(err.response?.data?.message || "Internal network failure removing quiz components.");
    } finally {
      setDeletingQuizId(null);
    }
  };

  const handleEditQuizClick = (quiz) => {
    setEditingQuizId(quiz._id);
    setQuizTitle(quiz.title || '');
    setDuration(quiz.durationInMinutes || 15);
    setQuestions(quiz.questions || []);
    resetQuestionBuilder();
    toast.success(`Loaded "${quiz.title}" into workspace.`);
  };

  const resetFullQuizForm = () => {
    setEditingQuizId(null);
    setQuizTitle('');
    setDuration(15);
    setQuestions([]);
    resetQuestionBuilder();
  };

  const resetQuestionBuilder = () => {
    setEditingQuestionIndex(null);
    setQText('');
    setOpts(['', '', '', '']);
    setCorrectIdx(0);
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveQuestionToDraftList = () => {
    if (!qText.trim()) return toast.error("Provide text parameters for the question.");
    if (opts.some(o => !o.trim())) return toast.error("All four option fields must be populated.");

    const preparedQuestion = {
      questionText: qText.trim(),
      options: [...opts],
      correctAnswerIndex: Number(correctIdx),
      questionImage: imagePreview,
      fileBuffer: imageFile 
    };

    if (editingQuestionIndex !== null) {
      const updatedQuestions = [...questions];
      if (!imageFile && questions[editingQuestionIndex].fileBuffer) {
        preparedQuestion.fileBuffer = questions[editingQuestionIndex].fileBuffer;
      }
      if (!imageFile && !imagePreview) {
        preparedQuestion.questionImage = null;
      }
      updatedQuestions[editingQuestionIndex] = preparedQuestion;
      setQuestions(updatedQuestions);
      toast.success("Question updated in your temporary draft.");
    } else {
      setQuestions([...questions, preparedQuestion]);
      toast.success("Question added to staging list.");
    }
    resetQuestionBuilder();
  };

  const handleEditQuestionInline = (index) => {
    const target = questions[index];
    setEditingQuestionIndex(index);
    setQText(target.questionText);
    setOpts([...target.options]);
    setCorrectIdx(target.correctAnswerIndex);
    setImagePreview(target.questionImage || '');
    setImageFile(target.fileBuffer || null);
  };

  const handleDeleteQuestionFromDraft = (index) => {
    setQuestions(questions.filter((_, idx) => idx !== index));
    toast.success("Question removed from draft.");
    if (editingQuestionIndex === index) resetQuestionBuilder();
  };

  const handlePublishQuizContainer = async (e) => {
    e.preventDefault();
    if (!quizTitle.trim()) return toast.error("Provide a tracking title for this quiz.");
    if (questions.length === 0) return toast.error("Include at least one question block.");

    setLoading(true);
    try {
      const fd = new FormData();
      
      if (editingQuizId) {
        fd.append("quizId", editingQuizId);
      }
      
      fd.append("courseId", currentCourseId);
      fd.append("sectionId", targetSection._id);
      fd.append("title", quizTitle.trim());
      fd.append("durationInMinutes", Number(duration));

      const serializedQuestionsData = questions.map(q => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        questionImage: q.fileBuffer ? null : q.questionImage
      }));
      fd.append("questionsData", JSON.stringify(serializedQuestionsData));

      questions.forEach((q, index) => {
        if (q.fileBuffer) {
          fd.append(`question_image_${index}`, q.fileBuffer);
        }
      });

      await axiosInstance.post('/quizzes', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(editingQuizId ? "Quiz properties modified successfully." : "New independent quiz created.");
      resetFullQuizForm();
      fetchAllSectionQuizzes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed finalizing quiz properties.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn text-sm text-slate-600 px-1 sm:px-0">
      
      {/* 🚀 Context Banner Header Component */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center p-4 sm:p-5 bg-amber-50 border border-amber-200/70 rounded-2xl gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-amber-600 text-white rounded-xl shadow-xs shrink-0">
            <ClipboardIcon />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase font-black tracking-wider text-amber-800/60">Managing Section Quiz</p>
            <h4 className="font-black text-slate-900 text-sm sm:text-base tracking-tight truncate">{targetSection?.title}</h4>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {editingQuizId && (
            <button 
              type="button" 
              onClick={resetFullQuizForm} 
              className="text-center font-bold text-xs uppercase tracking-wider bg-amber-100 hover:bg-amber-200 text-amber-900 px-4 py-2.5 rounded-xl border border-amber-200/60 transition cursor-pointer w-full sm:w-auto"
            >
              Cancel Edit Mode
            </button>
          )}
          <button 
            type="button" 
            onClick={prevStep} 
            className="group inline-flex items-center justify-center font-extrabold text-xs text-slate-500 hover:text-slate-800 transition py-2 sm:py-0 cursor-pointer"
          >
            <ArrowLeftIcon /> Back to Map
          </button>
        </div>
      </div>

      {/* 🛠️ Dynamic Multi-Column Workspace Grid Layout Mapping */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:grid-cols-1 sm:gap-8 items-start">
        
        {/* Left Panel Layer Block: Core Container Config parameters */}
        <div className="lg:col-span-5 space-y-5 border border-slate-200/90 p-4 sm:p-6 rounded-2xl bg-white shadow-xs order-1">
          <h4 className="font-black text-slate-900 text-base tracking-tight pb-3 border-b border-slate-100 flex items-center gap-2">
            {editingQuizId ? <GearIcon /> : <SparklesIcon />}
            {editingQuizId ? "Modify Quiz Structure" : "Setup Fresh Quiz Module"}
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-1.5 text-xs font-black uppercase tracking-wider text-slate-500">Quiz Frame Title *</label>
              <input 
                type="text" 
                value={quizTitle} 
                onChange={(e) => setQuizTitle(e.target.value)} 
                className="w-full bg-slate-50 font-semibold border border-slate-200 p-3 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-600 transition text-base sm:text-sm" 
                placeholder="e.g., Chapter 1 Comprehensive Assessment" 
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-black uppercase tracking-wider text-slate-500">Countdown Timer (Minutes)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <ClockIcon />
                </span>
                <input 
                  type="number" 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)} 
                  className="w-full bg-slate-50 font-bold border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-600 transition text-slate-800 text-base sm:text-sm" 
                />
              </div>
            </div>
          </div>

          {/* Staged Draft Timeline Flow Monitor List */}
          <div className="pt-1">
            <h5 className="font-black text-xs uppercase tracking-wider text-slate-400 mb-2.5">
              Staged Questions Queue ({questions.length})
            </h5>
            <div className="max-h-52 overflow-y-auto space-y-2 border border-slate-100 p-3 rounded-xl bg-slate-50">
              {questions.length === 0 ? (
                <span className="text-slate-400 italic block text-xs p-1 font-medium">
                  No blocks matched. Compile elements using the interface form on the right.
                </span>
              ) : (
                questions.map((q, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-slate-300 transition">
                    <div className="truncate font-semibold text-slate-700 text-xs w-full sm:max-w-[70%]">
                      <span className="font-mono font-black text-slate-400 mr-1">Q{i+1}:</span> 
                      {q.questionText}
                      {q.questionImage && (
                        <span className="inline-flex items-center text-[9px] text-teal-700 bg-teal-50 border border-teal-100 font-black uppercase tracking-wider px-1.5 py-0.5 mt-1 rounded block w-max">
                          Image Vector Attached
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1.5 shrink-0 justify-end">
                      <button 
                        type="button" 
                        onClick={() => handleEditQuestionInline(i)} 
                        className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteQuestionFromDraft(i)} 
                        className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider border border-rose-200 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                      >
                        Del
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              type="button" 
              onClick={handlePublishQuizContainer} 
              disabled={loading} 
              className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-xs active:scale-95 cursor-pointer text-center"
            >
              {loading ? "Publishing Updates..." : editingQuizId ? "Save Quiz Modifications" : "Deploy Quiz Block"}
            </button>
            <button 
              type="button" 
              onClick={prevStep} 
              className="w-full sm:w-auto bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 font-black px-5 py-3.5 rounded-xl text-xs uppercase tracking-wider transition text-center cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Right Panel Layer Block: Dedicated Blueprint Question Element Builder */}
        <div className="lg:col-span-7 space-y-5 border border-slate-200/90 p-4 sm:p-6 rounded-2xl bg-white shadow-xs order-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <h4 className="font-black text-slate-900 text-base tracking-tight truncate">
              {editingQuestionIndex !== null ? `Modify Question Block #${editingQuestionIndex + 1}` : "Compile Question Element"}
            </h4>
            {editingQuestionIndex !== null && (
              <button 
                type="button" 
                onClick={resetQuestionBuilder} 
                className="text-amber-700 hover:text-amber-800 font-black text-xs uppercase tracking-wider bg-amber-50 px-2 py-1 rounded shrink-0 cursor-pointer"
              >
                Clear Setup
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1.5 text-xs font-black uppercase tracking-wider text-slate-500">Question Blueprint Anchor Text *</label>
              <input 
                type="text" 
                value={qText} 
                onChange={(e) => setQText(e.target.value)} 
                className="w-full bg-slate-50 font-semibold border border-slate-200 p-3 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-600 transition text-slate-800 text-base sm:text-sm" 
                placeholder="Type core text query context here..." 
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-black uppercase tracking-wider text-slate-500">Visual Graphic Attachment (Optional)</label>
              <div className="border border-slate-200 bg-slate-50 rounded-xl p-2.5 flex items-center gap-2">
                <ImageIcon />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-slate-900 file:text-white hover:file:bg-slate-800 file:cursor-pointer cursor-pointer flex-1 font-medium min-w-0 truncate" 
                />
              </div>
              {imagePreview && (
                <div className="mt-3 relative inline-block border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-1.5 shadow-inner">
                  <img src={imagePreview} alt="Target canvas thumbnail preview" className="max-h-24 max-w-full rounded-lg object-contain" />
                  <button 
                    type="button" 
                    onClick={() => { setImageFile(null); setImagePreview(''); }} 
                    className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-1">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                Configure Answer Options Matrix
              </label>
              
              <div className="space-y-2">
                {opts.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-3 sm:px-4 py-2 focus-within:border-indigo-600 focus-within:bg-white transition">
                    <span className="font-mono font-black text-slate-400 text-xs shrink-0">
                      {String.fromCharCode(65 + oIdx)}.
                    </span>
                    <input 
                      type="text" 
                      value={opt} 
                      onChange={(e) => { 
                        const updated = [...opts]; 
                        updated[oIdx] = e.target.value; 
                        setOpts(updated); 
                      }} 
                      className="flex-1 bg-transparent font-medium text-sm text-slate-800 focus:outline-hidden min-w-0" 
                      placeholder={`Choice Option Label ${oIdx + 1}`} 
                      required 
                    />
                    <input 
                      type="radio" 
                      name="correctAnswer" 
                      checked={correctIdx === oIdx} 
                      onChange={() => setCorrectIdx(oIdx)} 
                      className="w-5 h-5 sm:w-4 sm:h-4 text-teal-600 border-slate-300 focus:ring-teal-500 cursor-pointer accent-teal-600 shrink-0" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleSaveQuestionToDraftList} 
            className={`w-full flex items-center justify-center font-black text-xs uppercase tracking-wider py-3.5 rounded-xl text-white transition active:scale-95 cursor-pointer ${
              editingQuestionIndex !== null ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {editingQuestionIndex !== null ? "Apply Question Changes" : "Push to Local Draft Staging Queue"}
          </button>
        </div>
      </div>

      {/* 📚 Bottom Shelf Registry Container Map */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <h4 className="font-black text-slate-900 text-base tracking-tight px-1">
          Deployed Quizzes under this Section Module ({quizzes.length})
        </h4>
        
        {fetching ? (
          <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs italic py-4 px-1">
            <SyncIcon /> Syncing active quiz configurations from database tracks...
          </div>
        ) : quizzes.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-2xl p-6 sm:p-10 bg-white text-center flex flex-col items-center justify-center">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl mb-3">
              <EmptyFolderIcon />
            </div>
            <p className="text-slate-400 font-medium text-xs italic">
              No independent quizzes exist in this section yet. Use fields above to configure one.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz, idx) => (
              <div 
                key={quiz._id || idx} 
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition gap-4 group shadow-xs"
              >
                <div className="space-y-1 min-w-0 w-full sm:max-w-[60%]">
                  <span className="font-mono font-black text-slate-400 text-[10px] bg-slate-100 px-2 py-0.5 rounded tracking-wider uppercase inline-block">
                    UNIT #{idx + 1}
                  </span>
                  <h5 className="font-bold text-slate-900 text-sm sm:text-base truncate block pt-1 w-full">
                    {quiz.title}
                  </h5>
                  <p className="text-slate-400 font-semibold block text-xs pl-0.5 w-full truncate">
                    {quiz.questions?.length || 0} MCQ Elements • {quiz.durationInMinutes || 15} Minutes
                  </p>
                </div>
                
                {/* 🛠️ ACTION BUTTON GROUP CONTAINER CONTAINER */}
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end border-t sm:border-t-0 border-slate-50 pt-3 sm:pt-0">
                  <button 
                    type="button" 
                    onClick={() => handleEditQuizClick(quiz)} 
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-black px-3 py-2.5 rounded-xl text-xs uppercase tracking-wider transition group-hover:border-slate-300 active:scale-95 cursor-pointer"
                  >
                    Configure <GearIcon />
                  </button>
                  
                  {/* 🌟 NEW DEPLOYED DELETION SWEAPER ICON ACCESS NODE BUTTON */}
                  <button 
                    type="button" 
                    disabled={deletingQuizId === quiz._id}
                    onClick={() => handleDeleteQuizPermanently(quiz._id, quiz.title)} 
                    className="p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 rounded-xl transition text-rose-600 disabled:opacity-40 active:scale-95 flex items-center justify-center shadow-xs cursor-pointer shrink-0"
                    title="Permanently Purge This Quiz Container"
                  >
                    {deletingQuizId === quiz._id ? (
                      <svg className="w-4 h-4 animate-spin text-rose-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    ) : (
                      <TrashIcon />
                    )}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            type="button" 
            onClick={prevStep} 
            className="group w-full sm:w-auto bg-slate-950 hover:bg-slate-900 text-white font-black px-6 py-3.5 rounded-xl transition flex items-center justify-center text-xs uppercase tracking-wider shadow-md active:scale-95 cursor-pointer text-center"
          >
            Finish & Exit to Course Map <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}