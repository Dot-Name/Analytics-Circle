import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance'; 
import VideoStream from './VideoStream';
import VideoTimeline from './VideoTimeline';
import VideoControls from './VideoControls';

export default function VideoPlayer({ lecture, courseId, onProgressUpdate }) {
  if (!lecture) return null;

  const playerRef = useRef(null);
  const containerRef = useRef(null);
  
  const lastSavedSecondRef = useRef(0);
  const controlsTimeoutRef = useRef(null);
  const isSyncingRef = useRef(false); 
  const isCompletionSentRef = useRef(false); // 🌟 GUARD: Avoid duplicate completion hits

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadedSeconds, setLoadedSeconds] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [playbackQuality, setPlaybackQuality] = useState('default');
  const [availableQualities, setAvailableQualities] = useState([]);
  const [showControls, setShowControls] = useState(true);

  const stateRef = useRef({ playedSeconds, duration, isPlaying });
  useEffect(() => {
    stateRef.current = { playedSeconds, duration, isPlaying };
  }, [playedSeconds, duration, isPlaying]);

  useEffect(() => {
    setIsPlaying(false);
    setPlayedSeconds(0);
    setLoadedSeconds(0);
    setPlaybackQuality('default');
    setAvailableQualities([]);
    setIsInitialLoading(true); 
    setShowControls(true); 
    lastSavedSecondRef.current = 0; 
    isSyncingRef.current = false;
    isCompletionSentRef.current = false; // Reset on lecture change
  }, [lecture._id]);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    } else {
      triggerUserActivityCountdown();
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTagName = document.activeElement?.tagName.toLowerCase();
      if (activeTagName === 'input' || activeTagName === 'textarea') return;

      const { playedSeconds: currentSecs, duration: totalDur } = stateRef.current;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlaybackWithShroud();
          break;
        case 'ArrowLeft':
        case 'j':
          e.preventDefault();
          seekDelta(-5, currentSecs, totalDur);
          break;
        case 'ArrowRight':
        case 'l':
          e.preventDefault();
          seekDelta(5, currentSecs, totalDur);
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreenAction();
          break;
        case 'm':
          e.preventDefault();
          setIsMuted((prev) => !prev);
          triggerUserActivityCountdown();
          break;
        default:
          return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      const currentSecs = stateRef.current.playedSeconds;
      if (currentSecs > 2 && !isCompletionSentRef.current) {
        const currentTotal = stateRef.current.duration;
        const completeStatus = currentTotal > 0 && (currentSecs / currentTotal >= 0.90);
        
        navigator.sendBeacon || axiosInstance.post(`/progress/sync-video/${courseId}`, {
          lectureId: lecture._id,
          lastPosition: Math.floor(currentSecs),
          isComplete: completeStatus
        }).catch(() => {});
      }
    };
  }, [lecture._id, courseId]);

  const seekDelta = (deltaSeconds, currentSecs, totalDur) => {
    if (!playerRef.current || typeof playerRef.current.seekTo !== 'function' || totalDur === 0) return;
    const calculatedTarget = Math.min(totalDur, Math.max(0, currentSecs + deltaSeconds));
    
    setPlayedSeconds(calculatedTarget);
    setIsInitialLoading(false);
    lastSavedSecondRef.current = Math.floor(calculatedTarget);
    
    playerRef.current.seekTo(calculatedTarget, true);
    
    const completeStatus = calculatedTarget / totalDur >= 0.90;
    if (completeStatus) isCompletionSentRef.current = true;
    
    syncPlaybackProgressToDatabase(calculatedTarget, completeStatus);
    triggerUserActivityCountdown();
  };

  const toggleFullscreenAction = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    triggerUserActivityCountdown();
  };

  const triggerUserActivityCountdown = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500); 
    }
  };

  const syncPlaybackProgressToDatabase = async (currentPositionSeconds, isComplete = false) => {
    if (!courseId) return;
    
    try {
      isSyncingRef.current = true;
      console.log(`📡 Telemetry Sent: ${Math.floor(currentPositionSeconds)}s | Complete: ${isComplete}`);
      
      const response = await axiosInstance.post(`/progress/sync-video/${courseId}`, {
        lectureId: lecture._id,
        lastPosition: Math.floor(currentPositionSeconds),
        isComplete: isComplete 
      });

      if (response.data?.success && typeof onProgressUpdate === 'function') {
        onProgressUpdate(response.data.data);
      }
    } catch (error) {
      console.error("Telemetry pipeline sync failure:", error);
    } finally {
      isSyncingRef.current = false;
    }
  };

  const handleProgress = (state) => {
    setPlayedSeconds(state.playedSeconds);
    setLoadedSeconds(state.loadedSeconds);

    const roundedCurrentSecond = Math.floor(state.playedSeconds);
    
    // 🌟 MUTEX PROTECTION LAYER: Abort immediately if we already evaluated this exact second
    if (roundedCurrentSecond === lastSavedSecondRef.current) return;

    const hasMovedTwentySecondsForward = roundedCurrentSecond - lastSavedSecondRef.current >= 20;
    const isPlayedToCompletion = duration > 0 && (state.playedSeconds / duration >= 0.90);
    const isNearEnd = duration > 0 && (duration - state.playedSeconds <= 2.0);

    // Filter structural parameters inside a single secure condition pass
    if ((hasMovedTwentySecondsForward || isNearEnd || isPlayedToCompletion) && !isSyncingRef.current) {
      
      // Check if completion was dispatched to avoid repeating network requests
      if (isPlayedToCompletion && isCompletionSentRef.current) return;
      
      // Update our persistent reference value instantly before firing async tasks
      lastSavedSecondRef.current = roundedCurrentSecond; 
      
      if (isPlayedToCompletion) {
        isCompletionSentRef.current = true;
      }

      syncPlaybackProgressToDatabase(state.playedSeconds, isPlayedToCompletion);
    }
  };

  const handleSeekChange = (e) => {
    const seekToPercentage = parseFloat(e.target.value);
    const targetSeconds = seekToPercentage * duration;
    
    setPlayedSeconds(targetSeconds);
    setIsInitialLoading(false);
    lastSavedSecondRef.current = Math.floor(targetSeconds);
    
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(targetSeconds, true);
    }
    
    const completeStatus = targetSeconds / duration >= 0.90;
    if (completeStatus) isCompletionSentRef.current = true;

    syncPlaybackProgressToDatabase(targetSeconds, completeStatus);
    triggerUserActivityCountdown(); 
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlaybackWithShroud = () => {
    setIsPlaying(prev => !prev);
    setIsInitialLoading(false);
    triggerUserActivityCountdown();
  };

  return (
    <div className="flex flex-col flex-1 h-full overflow-y-auto font-sans text-slate-100">
      <div 
        ref={containerRef} 
        onMouseMove={triggerUserActivityCountdown}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="w-full aspect-video shrink-0 relative group flex items-center justify-center overflow-hidden border-b border-slate-900 shadow-2xl rounded-2xl transition-all duration-300"
        style={{ cursor: showControls ? 'default' : 'none' }} 
      >
        <div 
          className={`absolute inset-0 z-20 bg-transparent transition-all ${isPlaying ? "pointer-events-none" : "cursor-pointer"}`} 
          onClick={togglePlaybackWithShroud} 
        />

        <VideoStream
          playerRef={playerRef}
          youtubeId={lecture.youtubeId}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          volume={volume}
          isMuted={isMuted}
          playbackSpeed={playbackSpeed}
          handleProgress={handleProgress}
          setDuration={setDuration}
          playbackQuality={playbackQuality}
          setPlaybackQuality={setPlaybackQuality}
          setAvailableQualities={setAvailableQualities}
        />

        <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/50 transition-all duration-500 flex flex-col justify-between p-4 z-30 ${
          isInitialLoading || showControls 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-600 px-2.5 py-1 text-white rounded-md max-w-max shadow-sm select-none">
            Premium Stream
          </span>

          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); togglePlaybackWithShroud(); }}
            className="w-22 h-22 rounded-full bg-indigo-600 hover:bg-indigo-500 backdrop-blur-md flex items-center justify-center transition-all duration-200 self-center border border-white/20 shadow-xl transform hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto"
          >
            {isPlaying ? <Pause className="w-10 h-10 fill-white" /> : <Play className="w-10 h-10 fill-white ml-1" />}
          </button>

          <div className="space-y-3 w-full pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            <VideoTimeline duration={duration} playedSeconds={playedSeconds} loadedSeconds={loadedSeconds} handleSeekChange={handleSeekChange} />
            <VideoControls
              isPlaying={isPlaying} togglePlay={togglePlaybackWithShroud}
              isMuted={isMuted} toggleMute={() => setIsMuted(!isMuted)}
              volume={volume} setVolume={setVolume} setIsMuted={setIsMuted}
              formatTime={formatTime} playedSeconds={playedSeconds} duration={duration}
              showSettings={showSettings} setShowSettings={setShowSettings}
              playbackSpeed={playbackSpeed} changeSpeed={(s) => { setPlaybackSpeed(s); setShowSettings(false); }}
              playbackQuality={playbackQuality} availableQualities={availableQualities} changeQuality={(q) => setPlaybackQuality(q)}
              toggleFullscreen={toggleFullscreenAction}
            />
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-50 space-y-4 flex-1 border-t border-slate-200 mt-4 rounded-2xl">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold tracking-widest text-indigo-600 uppercase font-mono block">
            Module Track: {lecture.moduleName || "General Track"}
          </span>
          <h1 className="text-xl font-extrabold text-black tracking-tight leading-snug">
            {lecture.title}
          </h1>
        </div>
        {lecture.description && (
          <div className="space-y-2">
            <h4 className="text-slate-900 font-bold text-xs tracking-wide uppercase">Lesson Curriculum Description</h4>
            <p className="text-xs text-slate-800 leading-relaxed max-w-5xl bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              {lecture.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}