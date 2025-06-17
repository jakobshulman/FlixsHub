import React, { useEffect, useRef, useState } from 'react';

interface FeaturedTrailerProps {
  backdropUrl: string;
  youtubeId?: string;
  propsTitle?: string;
  propsDescription?: string;
  year?: string;
  runtime?: string;
  rating?: string;
  imdbRating?: string;
  director?: string;
  genres?: string[];
  icons?: React.ReactNode;
}

const YT_API_SRC = 'https://www.youtube.com/iframe_api';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function FeaturedTrailer({
  backdropUrl,
  youtubeId,
  propsTitle,
  propsDescription,
  year,
  runtime,
  rating,
  imdbRating,
  director,
  genres,
  icons,
}: FeaturedTrailerProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [ytReady, setYtReady] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const ytPlayer = useRef<any>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!youtubeId) return;
    if (window.YT && window.YT.Player) {
      setYtReady(true);
      return;
    }
    const tag = document.createElement('script');
    tag.src = YT_API_SRC;
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => setYtReady(true);
    return () => {
      try {
        if (ytPlayer.current && typeof ytPlayer.current.destroy === 'function') {
          ytPlayer.current.destroy();
        }
      } catch (err) {
        console.warn('YT player cleanup failed', err);
      }
      ytPlayer.current = null;
    };
  }, [youtubeId]);

  useEffect(() => {
    if (!showVideo || !ytReady || !youtubeId) return;
    const container = playerRef.current;
    if (!container) return;
    ytPlayer.current = new window.YT.Player(container, {
      videoId: youtubeId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        rel: 0,
        modestbranding: 1,
        iv_load_policy: 3,
        disablekb: 1,
        fs: 0,
        showinfo: 0,
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => {
          event.target.mute();
          event.target.playVideo();

          const duration = event.target.getDuration?.();
          if (duration && !isNaN(duration)) {
            const timeout = setTimeout(() => {
              window.location.href = window.location.href;
            }, (duration - 2) * 1000);
            return () => clearTimeout(timeout);
          }
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            setShowVideo(false);
          }
        },
      },
    });
    return () => {
      try {
        if (ytPlayer.current && typeof ytPlayer.current.destroy === 'function') {
          ytPlayer.current.destroy();
        }
      } catch (err) {
        console.warn('YT player cleanup failed', err);
      }
      ytPlayer.current = null;
    };
  }, [showVideo, ytReady, youtubeId]);

  useEffect(() => {
    if (!youtubeId || showVideo) return;
    const timer = setTimeout(() => setShowVideo(true), 1000);
    return () => clearTimeout(timer);
  }, [youtubeId, showVideo]);

  const toggleMute = () => {
    if (!ytPlayer.current) return;
    if (isMuted) {
      ytPlayer.current.unMute();
      setIsMuted(false);
    } else {
      ytPlayer.current.mute();
      setIsMuted(true);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden">
      <img
        src={backdropUrl}
        alt="backdrop"
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          showVideo && youtubeId ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ position: 'absolute', inset: 0 }}
      />

      <div className="absolute inset-0 z-10 pointer-events-auto">
        <div className="absolute bottom-0 left-0 w-full z-20 bg-gradient-to-t from-black via-black/60 to-transparent px-4 md:px-10 py-4">
          <div className="flex justify-between items-end gap-4">
            {showVideo && youtubeId && (
              <button
                onClick={toggleMute}
                className="z-30 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full transition"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                    <path d="M3 10v4h4l5 5V5l-5 5H3z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                    <path d="M3 10v4h4l5 5V5l-5 5H3z" />
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z" />
                    <path d="M19.5 12c0 3.04-1.68 5.64-4.19 7.03l1.43 1.43C19.95 18.46 22 15.45 22 12s-2.05-6.46-5.26-8.46l-1.43 1.43C17.82 6.36 19.5 8.96 19.5 12z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {showVideo && youtubeId && (
        <div
          ref={playerRef}
          id="yt-player-embed"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
