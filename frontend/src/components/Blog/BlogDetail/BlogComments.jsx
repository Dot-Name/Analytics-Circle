import React, { useState } from 'react';

const BlogComments = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Sujay Singh",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format",
      date: "May 28, 2026",
      text: "This breakdown is incredibly helpful! The comparison between weak and strong prompts made it instantly clear how to restructure our analytics workflows.",
      likes: 14,
      hasLiked: false,
      replies: [
        {
          id: 101,
          author: "Keshav Bansal",
          avatar: "/images/keshav.jpeg",
          date: "May 29, 2026",
          text: "Glad it helped, Sujay! Separating raw transformations from model logic is the real game-changer in production pipelines.",
          likes: 5
        }
      ]
    }
  ]);

  const [newCommentText, setNewCommentText] = useState('');
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Handle Adding New Main Comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const freshComment = {
      id: Date.now(),
      author: "Anonymous User", // Fallback name
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format", // Default avatar
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      text: newCommentText,
      likes: 0,
      hasLiked: false,
      replies: []
    };

    setComments([...comments, freshComment]);
    setNewCommentText('');
  };

  // Handle Replying to an existing comment
  const handleAddReply = (commentId) => {
    if (!replyText.trim()) return;

    setComments(comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...c.replies,
            {
              id: Date.now(),
              author: "Anonymous User",
              avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format",
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              text: replyText,
              likes: 0
            }
          ]
        };
      }
      return c;
    }));

    setReplyText('');
    setReplyTargetId(null);
  };

  // Handle Like Toggle
  const handleLikeToggle = (commentId) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          likes: c.hasLiked ? c.likes - 1 : c.likes + 1,
          hasLiked: !c.hasLiked
        };
      }
      return c;
    }));
  };

  return (
    <div className="w-full py-8 border-t border-gray-100 mt-10 antialiased">
      <h3 className="text-xl font-bold text-gray-900 font-serif mb-6 flex items-center gap-2">
        <i className="ri-chat-3-line text-blue-600"></i>
        <span>Discussion ({comments.length + comments.reduce((acc, c) => acc + c.replies.length, 0)})</span>
      </h3>

      {/* Comment Form Input Box */}
      <form onSubmit={handleAddComment} className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Join the conversation</label>
        <div className="flex flex-col gap-3">
          <textarea
            rows="3"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Share your thoughts or ask a question about this technique..."
            className="w-full text-sm p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none bg-white transition-all text-gray-800"
          ></textarea>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Post Comment</span>
              <i className="ri-send-plane-fill text-[11px]"></i>
            </button>
          </div>
        </div>
      </form>

      {/* Render Comments Thread Feed */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-3 group border-b border-gray-50 pb-6 last:border-none last:pb-0">
            {/* Top Row: User Avatar & Author Info */}
            <div className="flex items-start gap-3">
              <img src={comment.avatar} alt={comment.author} className="w-9 h-9 rounded-full object-cover border border-gray-100 shadow-sm mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-gray-900">{comment.author}</span>
                  <span className="text-[11px] text-gray-400 font-medium">{comment.date}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-normal mt-1 whitespace-pre-line">{comment.text}</p>
                
                {/* Interaction Actions Bar */}
                <div className="flex items-center gap-4 mt-2.5">
                  <button 
                    onClick={() => handleLikeToggle(comment.id)}
                    className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
                      comment.hasLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <i className={comment.hasLiked ? "ri-heart-3-fill" : "ri-heart-3-line"}></i>
                    <span>{comment.likes} {comment.likes === 1 ? 'Like' : 'Likes'}</span>
                  </button>

                  <button 
                    onClick={() => setReplyTargetId(replyTargetId === comment.id ? null : comment.id)}
                    className="text-xs font-semibold text-gray-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                  >
                    <i className="ri-reply-line"></i>
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Inline Dynamic Reply Form Input Field */}
            {replyTargetId === comment.id && (
              <div className="ml-12 mt-1 flex gap-2 bg-white p-2.5 rounded-lg border border-gray-200 shadow-inner">
                <input
                  type="text"
                  placeholder={`Reply to ${comment.author}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 outline-none border-none bg-transparent font-medium text-gray-700"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddReply(comment.id);
                  }}
                />
                <button
                  onClick={() => handleAddReply(comment.id)}
                  className="bg-gray-900 text-white font-bold px-4 py-1.5 text-xs rounded hover:bg-blue-600 transition-colors uppercase tracking-wider"
                >
                  Submit
                </button>
              </div>
            )}

            {/* Render Child Nested Replies Array loop */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-12 mt-2 space-y-4 border-l-2 border-gray-100 pl-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex items-start gap-3">
                    <img src={reply.avatar} alt={reply.author} className="w-7 h-7 rounded-full object-cover border border-gray-100 shadow-sm mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-gray-900">{reply.author}</span>
                        {reply.author === "Keshav Bansal" && (
                          <span className="text-[9px] bg-blue-600 text-white font-bold px-1 rounded uppercase tracking-wide">Author</span>
                        )}
                        <span className="text-[10px] text-gray-400 font-medium">{reply.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed font-normal mt-1">{reply.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogComments;