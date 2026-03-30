import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [levels, setLevels] = useState<any[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  // Spinner shown only when video actually stalls (buffering)
  const [isBuffering, setIsBuffering] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const tryAutoPlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
    } catch {
      video.muted = true;
      setIsMuted(true);
      try {
        await video.play();
      } catch {
        // User can manually play.
      }
    }
  };

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoSrc = src.startsWith("http")
      ? src
      : `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}${src}`;

    if (Hls.isSupported()) {
      const hls = new Hls({
        autoStartLoad: true,
        startLevel: -1,
        // Keep more back-buffer so switching doesn't re-download already-seen segments
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        // Allow instant level switching using already-buffered data
        // This is the key setting for smooth quality switches
        abrBandWidthFactor: 0.95,
        abrBandWidthUpFactor: 0.7,
      });
      hlsRef.current = hls;

      hls.loadSource(videoSrc);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const availableLevels = hls.levels.map((level, index) => ({
          index,
          height: level.height,
          bitrate: Math.round(level.bitrate / 1000),
          name: `${level.height}p`,
        }));
        setLevels(availableLevels);
        setSelectedQuality(-1);
        void tryAutoPlay();
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setSelectedQuality(data.level);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.error("Fatal HLS error:", data);
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
      const onLoadedMetadata = () => void tryAutoPlay();
      video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
      return () => video.removeEventListener("loadedmetadata", onLoadedMetadata);
    }
  }, [src]);

  /**
   * Smooth quality switch:
   * - Never pause the video; HLS will seamlessly swap segments.
   * - The spinner appears only if the browser genuinely stalls (waiting event).
   */
  const handleQualityChange = (levelIndex: number) => {
    const hls = hlsRef.current;
    if (!hls) return;

    if (levelIndex === -1) {
      hls.currentLevel = -1; // back to ABR auto
    } else {
      // nextLevel schedules the switch at the next segment boundary
      // so playback continues uninterrupted with the current buffer.
      hls.nextLevel = levelIndex;
    }

    setSelectedQuality(levelIndex);
    setShowQualityMenu(false);
  };

  const getQualityLabel = () => {
    if (selectedQuality === -1) return "AUTO";
    const level = levels.find((l) => l.index === selectedQuality);
    return level ? level.name : "AUTO";
  };

  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const videoCurrentTime = video.currentTime;
    const videoDuration = video.duration;

    if (Number.isFinite(videoCurrentTime) && videoCurrentTime >= 0) {
      setCurrentTime(videoCurrentTime);
    }
    if (Number.isFinite(videoDuration) && videoDuration > 0) {
      setDuration(videoDuration);
    }

    const safeCurrent = Number.isFinite(videoCurrentTime) ? videoCurrentTime : currentTime;
    const safeDuration =
      Number.isFinite(videoDuration) && videoDuration > 0 ? videoDuration : duration;
    setProgress(safeDuration > 0 ? (safeCurrent / safeDuration) * 100 : 0);
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
    const totalSeconds = Math.floor(seconds);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = (Number(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(Number(e.target.value));
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("input")) return;
    togglePlay();
  };

  // Close quality menu when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        !containerRef.current
          ?.querySelector(".relative.group\\/quality")
          ?.contains(e.target as Node)
      ) {
        setShowQualityMenu(false);
      }
    };
    if (showQualityMenu) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [showQualityMenu]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full aspect-video bg-black rounded-xl overflow-hidden group cursor-pointer select-none z-[0]",
        isFullscreen ? "h-screen w-screen rounded-none" : ""
      )}
      onClick={handleContainerClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onDurationChange={handleTimeUpdate}
        onPlay={() => {
          setIsPlaying(true);
          setIsBuffering(false);
        }}
        onPause={() => setIsPlaying(false)}
        // Show spinner only when the browser is genuinely waiting for data
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
      />

      {/* Buffering spinner — shown only on real stalls, not forced pauses */}
      {isBuffering && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/70 border border-white/20 text-white text-xs font-semibold tracking-wide">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            Buffering…
          </div>
        </div>
      )}

      {/* Overlay controls */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end transition-opacity duration-300 px-4 py-2",
          showControls ? "opacity-100" : "opacity-0 invisible"
        )}
      >
        {/* Progress bar */}
        <div className="relative group/progress">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-primary group-hover/progress:h-1.5 transition-all outline-none"
          />
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-primary transition-colors"
            >
              {isPlaying ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" />
              )}
            </button>
            <button
              onClick={toggleMute}
              className="text-white hover:text-primary transition-colors"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              className="w-16 h-1 bg-white/30 accent-white hidden md:block"
              onChange={(e) => {
                if (videoRef.current) videoRef.current.volume = Number(e.target.value);
              }}
            />
            <span className="text-xs text-white/90 font-semibold tabular-nums min-w-[96px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group/quality">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="text-white hover:text-primary transition-colors flex items-center gap-1"
              >
                <Settings size={20} />
                <span className="text-xs uppercase font-medium">{getQualityLabel()}</span>
              </button>

              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 border border-white/20 rounded-lg overflow-hidden z-50">
                  <button
                    onClick={() => handleQualityChange(-1)}
                    className={cn(
                      "w-full px-4 py-2 text-left text-xs uppercase font-medium transition-colors whitespace-nowrap",
                      selectedQuality === -1
                        ? "bg-primary text-black"
                        : "text-white hover:bg-white/10"
                    )}
                  >
                    Auto (Recommended)
                  </button>
                  {levels.map((level) => (
                    <button
                      key={level.index}
                      onClick={() => handleQualityChange(level.index)}
                      className={cn(
                        "w-full px-4 py-2 text-left text-xs uppercase font-medium transition-colors whitespace-nowrap",
                        selectedQuality === level.index
                          ? "bg-primary text-black"
                          : "text-white hover:bg-white/10"
                      )}
                    >
                      {level.name} ({level.bitrate}kbps)
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-primary transition-colors"
            >
              {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;