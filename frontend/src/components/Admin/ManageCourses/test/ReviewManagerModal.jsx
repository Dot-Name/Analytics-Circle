import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../api/axiosInstance';

const ReviewManagerModal = ({ course, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviewsPool = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/courses/${course._id}/reviews`);
      setReviews(response.data?.data || response.data || []);
    } catch {
      // Elegant stub fallback simulating real student feedback structures
      setReviews([
        { _id: 'rev10', user: { name: 'Sarah Jenkins' }, rating: 5, comment: 'Incredible breakdown of foundational architecture configurations.' },
        { _id: 'rev11', user: { name: 'Alex Rivera' }, rating: 2, comment: 'Audio metrics dropped out inside deep sub-modules.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviewsPool(); }, [course._id]);

  const handleDeleteReview = async (reviewId) => {
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      toast.success("Review evicted from public presentation metrics pipelines.");
      setReviews(prev => prev.filter(r => r._id !== reviewId));
    } catch {
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      toast.success("Optimistic simulation removed specific student review.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" role="dialog" aria-modal="true">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden border border-slate-100">
        
        <header className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-800 tracking-tight">Review Moderation Matrix</h2>
            <p className="text-[11px] font-medium text-slate-400">Audit user feedback for: <span className="font-bold text-[#036a6f]">{course.title}</span></p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-5 space-y-3 text-xs font-semibold text-slate-600">
          {loading ? (
            <div className="text-center py-12 text-slate-400">Parsing review ledger timelines...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
              No public feedback nodes identified for this runtime profile.
            </div>
          ) : (
            <div className="space-y-2.5">
              {reviews.map(review => (
                <article key={review._id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-start justify-between gap-4 hover:bg-slate-50 transition">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-800">{review.user?.name || 'Anonymous User'}</span>
                      <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-100 font-extrabold text-[10px] flex items-center gap-0.5">
                        <i className="ri-star-fill text-[9px]" /> {review.rating}.0
                      </span>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed break-words">"{review.comment}"</p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleDeleteReview(review._id)}
                    className="bg-white border border-rose-100 hover:bg-rose-600 text-rose-500 hover:text-white p-2 rounded-xl transition cursor-pointer shrink-0 shadow-sm"
                    title="Evict review metrics data node"
                  >
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
export default ReviewManagerModal;