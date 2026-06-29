import React, { useEffect, useRef } from 'react';

export default function VideoStream({ 
  playerRef, 
  youtubeId, 
  isPlaying, 
  volume, 
  isMuted, 
  playbackSpeed, 
  handleProgress, 
  setDuration,
  setIsPlaying,
  playbackQuality,      
  setPlaybackQuality,   
  setAvailableQualities 
}) {
  const divFrameRef = useRef(null);
  const trackLoopRef = useRef(null);
  const isReadyRef = useRef(false);

  useEffect(() => {
    isReadyRef.current = false;
    
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    let nativeInstance = null;

    const startTrackingLoop = (targetPlayer) => {
      clearInterval(trackLoopRef.current);
      trackLoopRef.current = setInterval(() => {
        if (isReadyRef.current && targetPlayer && typeof targetPlayer.getCurrentTime === 'function') {
          try {
            const currentTime = targetPlayer.getCurrentTime() || 0;
            const totalDuration = targetPlayer.getDuration() || 0;
            
            // 🌟 FIXED: Dynamically update parent duration state if it was initially missed or 0
            if (totalDuration > 0) {
              setDuration(totalDuration);
            }

            const loadedFraction = typeof targetPlayer.getVideoLoadedFraction === 'function' 
              ? targetPlayer.getVideoLoadedFraction() 
              : 0;
            
            handleProgress({
              playedSeconds: currentTime,
              loadedSeconds: loadedFraction * totalDuration
            });
          } catch (err) {
            console.warn("YouTube tracker loop safety intercept:", err);
          }
        }
      }, 300);
    };

    const initNativePlayer = () => {
      clearInterval(trackLoopRef.current);
      
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try { playerRef.current.destroy(); } catch (e) {}
        playerRef.current = null;
      }

      if (!divFrameRef.current || !window.YT || !window.YT.Player) return;

      try {
        nativeInstance = new window.YT.Player(divFrameRef.current, {
          videoId: youtubeId,
          playerVars: {
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            fs: 0,
            playsinline: 1,
          },
          events: {
            onReady: (event) => {
              if (!event.target) return;
              playerRef.current = event.target;
              isReadyRef.current = true;
              
              try {
                const initialDuration = event.target.getDuration() || 0;
                setDuration(initialDuration);
                
                event.target.setVolume(isMuted ? 0 : volume * 100);
                event.target.setPlaybackRate(playbackSpeed);
                
                try {
                  if (typeof event.target.getAvailableQualityLevels === 'function') {
                    setAvailableQualities(event.target.getAvailableQualityLevels() || []);
                    setPlaybackQuality(event.target.getPlaybackQuality() || 'default');
                  }
                } catch (qErr) {
                  console.warn("Quality configuration omitted safely:", qErr);
                }

                if (isPlaying) {
                  event.target.playVideo();
                } else {
                  event.target.pauseVideo();
                }
              } catch (readyError) {
                console.error("Error setting up player properties onReady:", readyError);
              }
            },
            onStateChange: (event) => {
              if (!isReadyRef.current || !event.target) return;
              
              try {
                if (event.data === window.YT.PlayerState.PLAYING) {
                  setIsPlaying(true);
                  
                  const activeDuration = event.target.getDuration() || 0;
                  setDuration(activeDuration);
                  
                  startTrackingLoop(event.target);

                  try {
                    if (typeof event.target.getAvailableQualityLevels === 'function') {
                      setAvailableQualities(event.target.getAvailableQualityLevels() || []);
                      setPlaybackQuality(event.target.getPlaybackQuality() || 'default');
                    }
                  } catch (qErr) {
                    console.warn("Quality update state changes bypassed:", qErr);
                  }
                } else if (event.data === window.YT.PlayerState.PAUSED) {
                  setIsPlaying(false);
                  clearInterval(trackLoopRef.current);
                } else if (event.data === window.YT.PlayerState.ENDED) {
                  setIsPlaying(false);
                  clearInterval(trackLoopRef.current);
                  
                  // 🌟 EDGE CASE SAFEGUARD: Force a final progress dispatch at exact runtime completion
                  const finalDuration = event.target.getDuration() || 0;
                  handleProgress({
                    playedSeconds: finalDuration,
                    loadedSeconds: finalDuration
                  });
                }
              } catch (stateError) {
                console.error("Error during YouTube Player state transformation:", stateError);
              }
            }
          }
        });
      } catch (initError) {
        console.error("Critical failure building native YT instance mount:", initError);
      }
    };

    if (window.YT && window.YT.Player) {
      initNativePlayer();
    } else {
      window.onYouTubeIframeAPIReady = initNativePlayer;
    }

    return () => {
      isReadyRef.current = false;
      clearInterval(trackLoopRef.current);
      if (nativeInstance && typeof nativeInstance.destroy === 'function') {
        try { nativeInstance.destroy(); } catch (e) {}
      }
      playerRef.current = null;
    };
  }, [youtubeId]);

  useEffect(() => {
    if (!isReadyRef.current || !playerRef.current || typeof playerRef.current.getPlayerState !== 'function') return;
    try {
      const currentState = playerRef.current.getPlayerState();
      if (isPlaying && currentState !== window.YT.PlayerState.PLAYING) {
        playerRef.current.playVideo();
      } else if (!isPlaying && currentState === window.YT.PlayerState.PLAYING) {
        playerRef.current.pauseVideo();
      }
    } catch (e) {}
  }, [isPlaying]);

  useEffect(() => {
    if (!isReadyRef.current || !playerRef.current || typeof playerRef.current.setVolume !== 'function') return;
    try {
      playerRef.current.setVolume(isMuted ? 0 : volume * 100);
    } catch (e) {}
  }, [volume, isMuted]);

  useEffect(() => {
    if (!isReadyRef.current || !playerRef.current || typeof playerRef.current.setPlaybackRate !== 'function') return;
    try {
      playerRef.current.setPlaybackRate(playbackSpeed);
    } catch (e) {}
  }, [playbackSpeed]);

  useEffect(() => {
    if (!isReadyRef.current || !playerRef.current || typeof playerRef.current.setPlaybackQuality !== 'function') return;
    try {
      playerRef.current.setPlaybackQuality(playbackQuality);
    } catch (e) {}
  }, [playbackQuality]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black flex items-center justify-center">
      <div className="w-full h-[135%] absolute origin-center pointer-events-none ">
        <div ref={divFrameRef} className="w-full h-full" />
      </div>
    </div>
  );
}