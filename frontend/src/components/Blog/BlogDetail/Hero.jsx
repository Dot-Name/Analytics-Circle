import React from 'react';
import { Link } from 'react-router-dom';

const BlogHero = ({ post }) => {
  if (!post) return null;

  const {
    title,
    desc,
    author,
    date,
    tag,
    readTime,
    views,
    likes,
    hashtags = []
  } = post;

  return (
    <div className="w-full bg-gray-50/50 border-b border-gray-100/80 py-10 antialiased">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back button with proper touch-target action layout padding */}
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition mb-6 group font-medium"
        >
          <i className="ri-arrow-left-line text-base group-hover:-translate-x-1 transition-transform"></i>
          <span>Back to Blogs</span>
        </Link>

        {/* Meta row with standard row gap padding */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-gray-100">
            <i className="ri-calendar-line text-gray-400"></i> {date}
          </span>
          <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-gray-100">
            <i className="ri-user-line text-gray-400"></i> {author}
          </span>
          <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-gray-100 text-blue-600">
            <i className="ri-folder-chart-line"></i> {tag}
          </span>
          <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-gray-100">
            <i className="ri-time-line text-gray-400"></i> {readTime}
          </span>
        </div>

        {/* Title: Enforced responsive margins matching premium typography spacing scales */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight font-serif max-w-4xl">
          {title}
        </h1>

        {/* Description: Comfort text leading alignment boundaries */}
        <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed max-w-3xl font-normal">
          {desc}
        </p>

        {/* Hashtags layout flow */}
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, i) => (
              <span key={i} className="text-xs bg-blue-50/50 text-blue-700 font-semibold px-3 py-1 rounded-md border border-blue-100/40">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogHero;