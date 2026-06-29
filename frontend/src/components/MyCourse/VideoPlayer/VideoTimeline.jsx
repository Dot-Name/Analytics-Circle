import React from 'react';

export default function VideoTimeline({ duration, playedSeconds, loadedSeconds, handleSeekChange }) {
  const playedPercentage = duration ? (playedSeconds / duration) * 100 : 0;
  const loadedPercentage = duration ? (loadedSeconds / duration) * 100 : 0;

  return (
    <div className="relative w-full h-1.5 flex items-center group/timeline">
      <div className="absolute inset-0 w-full h-full bg-slate-800 rounded-full" />
      
      <div 
        className="absolute top-0 bottom-0 bg-slate-700/60 rounded-full transition-all duration-150"
        style={{ width: `${loadedPercentage}%` }}
      />

      <div 
        className="absolute top-0 bottom-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
        style={{ width: `${playedPercentage}%` }}
      />

      <input
        type="range"
        min={0}
        max={1}
        step="any"
        value={duration ? playedSeconds / duration : 0}
        onChange={handleSeekChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      <div 
        className="absolute w-3.5 h-3.5 rounded-full bg-white border-2 border-indigo-500 opacity-0 group-hover/timeline:opacity-100 transition-opacity shadow-md transform -translate-y-1/2 top-1/2"
        style={{ left: `calc(${playedPercentage}% - 7px)` }}
      />
    </div>
  );
}