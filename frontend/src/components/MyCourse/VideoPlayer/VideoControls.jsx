import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Subtitles, ChevronLeft } from 'lucide-react';

export default function VideoControls({
  isPlaying, togglePlay,
  isMuted, toggleMute,
  volume, setVolume, setIsMuted,
  formatTime, playedSeconds, duration,
  showSettings, setShowSettings,
  playbackSpeed, changeSpeed,
  playbackQuality, changeQuality,       
  availableQualities = [],              
  toggleFullscreen
}) {
  // Local state to navigate between Main menu, Speed menu, and Quality menu
  const [currentMenu, setCurrentMenu] = useState('main'); 

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
    setCurrentMenu('main'); 
  };

  const formatQualityLabel = (q) => {
    if (!q || q === 'default') return 'Auto';
    return q.replace('hd', '') + (q.startsWith('hd') || !isNaN(q) ? 'p' : '');
  };

  return (
    <div className="flex items-center justify-between text-slate-300 text-xs select-none w-full px-1 sm:px-2 gap-2">
      
      {/* LEFT SIDE: PLAYBACK & SOUND CONTROLS */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button 
          type="button" 
          onClick={togglePlay} 
          className="p-1 hover:text-indigo-400 transition transform active:scale-90 cursor-pointer shrink-0 min-w-[32px] min-h-[32px] flex items-center justify-center"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
        </button>

        {/* VOLUME UNIT - RESPONSIVELY HUDDLED */}
        <div className="flex items-center gap-1.5 group/volume shrink-0">
          <button 
            type="button" 
            onClick={toggleMute} 
            className="p-1 hover:text-indigo-400 transition cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          {/* Slider hidden on absolute mobile breakpoints to save real estate */}
          <input
            type="range"
            min={0}
            max={1}
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-14 sm:w-16 h-1 accent-indigo-500 rounded-lg cursor-pointer bg-slate-800 transition-all duration-200 appearance-none outline-none hidden sm:block"
          />
        </div>

        {/* TIMING RECORD TRACKER */}
        <div className="font-mono text-[10px] sm:text-[11px] text-slate-400 font-bold truncate">
          {formatTime(playedSeconds)} <span className="text-slate-700">/</span> {formatTime(duration)}
        </div>
      </div>

      {/* RIGHT SIDE: UTILITIES & DROPDOWN MATRIX */}
      <div className="flex items-center gap-2 sm:gap-4 relative shrink-0">
        <button 
          type="button" 
          className="p-1 hover:text-indigo-400 transition cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
        >
          <Subtitles className="w-4 h-4" />
        </button>

        {/* SETTINGS ENGINE SYSTEM */}
        <div className="relative">
          <button 
            type="button" 
            onClick={handleSettingsToggle} 
            className={`p-1 hover:text-indigo-400 transition cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center ${
              showSettings ? "text-indigo-400 rotate-45" : ""
            } transition-transform duration-200`}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* VIEWPORT SAFE SETTINGS POPUP OVERLAY */}
          {showSettings && (
            <div className="absolute bottom-10 right-0 origin-bottom-right bg-slate-950/95 border border-slate-800/90 rounded-xl p-1.5 w-40 sm:w-44 shadow-2xl flex flex-col gap-0.5 backdrop-blur-md z-40 transition-all animate-fadeIn">
              
              {/* MAIN INDEX SETTINGS LAYER */}
              {currentMenu === 'main' && (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentMenu('speed')}
                    className="w-full px-2.5 py-2 text-left rounded-lg hover:bg-slate-800/80 text-slate-300 flex justify-between items-center cursor-pointer min-h-[36px]"
                  >
                    <span className="text-[11px] font-medium">Speed</span>
                    <span className="text-[10px] text-indigo-400 font-mono">{playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}x`}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentMenu('quality')}
                    className="w-full px-2.5 py-2 text-left rounded-lg hover:bg-slate-800/80 text-slate-300 flex justify-between items-center cursor-pointer min-h-[36px]"
                  >
                    <span className="text-[11px] font-medium">Quality</span>
                    <span className="text-[10px] text-indigo-400 font-mono">{formatQualityLabel(playbackQuality)}</span>
                  </button>
                </>
              )}

              {/* SPEED SELECTION MENU */}
              {currentMenu === 'speed' && (
                <>
                  <button 
                    type="button" 
                    onClick={() => setCurrentMenu('main')}
                    className="flex items-center gap-1 text-[9px] font-black text-slate-500 font-mono uppercase px-2 py-1.5 tracking-widest hover:text-slate-300 transition w-full text-left cursor-pointer border-b border-slate-900 mb-1"
                  >
                    <ChevronLeft className="w-3 h-3" /> Back
                  </button>
                  {[0.5, 1, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => {
                        changeSpeed(speed);
                        setShowSettings(false);
                      }}
                      className={`w-full px-2.5 py-1.5 text-left rounded-md transition font-mono text-[11px] cursor-pointer min-h-[32px] ${
                        playbackSpeed === speed ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {speed === 1 ? "Normal" : `${speed}x`}
                    </button>
                  ))}
                </>
              )}

              {/* QUALITY SELECTION MENU */}
              {currentMenu === 'quality' && (
                <>
                  <button 
                    type="button" 
                    onClick={() => setCurrentMenu('main')}
                    className="flex items-center gap-1 text-[9px] font-black text-slate-500 font-mono uppercase px-2 py-1.5 tracking-widest hover:text-slate-300 transition w-full text-left cursor-pointer border-b border-slate-900 mb-1"
                  >
                    <ChevronLeft className="w-3 h-3" /> Back
                  </button>
                  {availableQualities.length === 0 ? (
                    <p className="text-[10px] sm:text-[11px] text-slate-500 px-2.5 py-2 italic">Detecting variables...</p>
                  ) : (
                    availableQualities.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => {
                          changeQuality(q);
                          setShowSettings(false);
                        }}
                        className={`w-full px-2.5 py-1.5 text-left rounded-md transition font-mono text-[11px] cursor-pointer min-h-[32px] ${
                          playbackQuality === q ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-400'
                      }`}
                      >
                        {formatQualityLabel(q)}
                      </button>
                    ))
                  )}
                </>
              )}

            </div>
          )}
        </div>

        <button 
          type="button" 
          onClick={toggleFullscreen} 
          className="p-1 hover:text-indigo-400 transition transform active:scale-90 cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}