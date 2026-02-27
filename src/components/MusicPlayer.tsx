import React, { useEffect, useRef, useState } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

interface MusicPlayerProps {
  tracks: Track[];
}

export default function MusicPlayer({ tracks }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * duration;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black border-4 border-[#FF00FF] p-6 shadow-[8px_8px_0px_#00FFFF] w-full max-w-md relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none border border-[#00FFFF]/30 z-20 mix-blend-screen" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      />
      
      <div className="flex flex-col mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-[#FF00FF] font-bold text-sm md:text-base tracking-widest uppercase glitch-text mb-2">
              {currentTrack.title}
            </h3>
            <p className="text-[#00FFFF] text-[10px] md:text-xs uppercase tracking-widest">&gt; {currentTrack.artist}</p>
          </div>
          <div className="flex items-center space-x-1">
            <div className="flex gap-1 h-6 items-end">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={`w-2 bg-[#00FFFF] ${isPlaying ? 'animate-pulse' : ''}`}
                  style={{ 
                    height: isPlaying ? `${Math.max(20, Math.random() * 100)}%` : '20%',
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.2s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <div 
          className="h-4 bg-black border-2 border-[#00FFFF] overflow-hidden cursor-pointer relative"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-[#FF00FF]"
            style={{ width: `${(progress / duration) * 100 || 0}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[#00FFFF] font-mono tracking-widest">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between space-x-4">
        <button 
          onClick={handlePrev}
          className="text-[#00FFFF] hover:text-[#FF00FF] hover:bg-[#00FFFF]/10 border-2 border-transparent hover:border-[#FF00FF] px-2 py-1 transition-none text-xs tracking-widest"
        >
          [PREV]
        </button>
        
        <button 
          onClick={togglePlayPause}
          className="bg-black border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black px-4 py-2 text-sm font-bold tracking-widest transition-none shadow-[4px_4px_0px_#FF00FF] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
        >
          {isPlaying ? '[PAUSE]' : '[PLAY]'}
        </button>
        
        <button 
          onClick={handleNext}
          className="text-[#00FFFF] hover:text-[#FF00FF] hover:bg-[#00FFFF]/10 border-2 border-transparent hover:border-[#FF00FF] px-2 py-1 transition-none text-xs tracking-widest"
        >
          [NEXT]
        </button>
      </div>
      
      <div className="mt-8 pt-4 border-t-2 border-[#FF00FF] flex justify-between items-center text-[10px] text-[#00FFFF]">
        <span>STATUS: {isPlaying ? 'STREAMING' : 'IDLE'}</span>
        <button 
          onClick={toggleMute}
          className="hover:text-[#FF00FF] uppercase tracking-widest"
        >
          {isMuted ? '[UNMUTE]' : '[MUTE]'}
        </button>
      </div>
    </div>
  );
}
