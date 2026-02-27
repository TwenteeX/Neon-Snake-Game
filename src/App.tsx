import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer, { Track } from './components/MusicPlayer';
import { Terminal, Radio } from 'lucide-react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'ERR_0x001',
    artist: 'SYS.CORRUPT',
    url: 'https://actions.google.com/sounds/v1/science_fiction/alien_breath.ogg', // Placeholder
  },
  {
    id: '2',
    title: 'MEM_LEAK',
    artist: 'NULL_PTR',
    url: 'https://actions.google.com/sounds/v1/science_fiction/sci_fi_hover_craft.ogg', // Placeholder
  },
  {
    id: '3',
    title: 'KERNEL_PANIC',
    artist: 'ROOT_ACCESS',
    url: 'https://actions.google.com/sounds/v1/science_fiction/spaceship_engine.ogg', // Placeholder
  }
];

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-[#FF00FF]/50 overflow-hidden relative flex flex-col items-center justify-center p-4 crt-overlay">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="scanline" />
        <div className="absolute inset-0 static-noise" />
      </div>

      <div className="z-10 w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-start justify-center">
        
        {/* Left Column: Game */}
        <div className="flex flex-col items-center space-y-6 w-full lg:w-auto">
          <div className="flex items-center justify-between w-full px-4 border-b-4 border-[#FF00FF] pb-4">
            <div className="flex items-center space-x-4">
              <Terminal className="text-[#00FFFF] animate-pulse" size={32} />
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-[#00FFFF] glitch-text uppercase">
                SYS.SNAKE
              </h1>
            </div>
            <div className="bg-black border-2 border-[#00FFFF] px-4 py-2 flex items-center shadow-[4px_4px_0px_#FF00FF]">
              <span className="text-[#FF00FF] text-xs font-bold uppercase tracking-widest mr-3">MEM</span>
              <span className="text-[#00FFFF] text-xl font-black tracking-widest glitch-text">{score.toString().padStart(4, '0')}</span>
            </div>
          </div>
          
          <div className="border-4 border-[#00FFFF] p-2 bg-black shadow-[8px_8px_0px_#FF00FF] relative">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none border border-[#FF00FF]/30 z-20 mix-blend-screen" />
            <SnakeGame onScoreChange={setScore} />
          </div>
          
          <div className="text-[#00FFFF] text-[10px] md:text-xs flex flex-col items-center space-y-2 uppercase tracking-widest">
            <span>&gt; INPUT: [ARROWS] TO NAVIGATE</span>
            <span>&gt; EXEC: [SPACE] TO HALT/RESUME</span>
          </div>
        </div>

        {/* Right Column: Music Player */}
        <div className="flex flex-col items-center justify-start w-full max-w-md space-y-6 lg:mt-0 mt-8">
          <div className="flex items-center space-x-4 w-full px-4 border-b-4 border-[#00FFFF] pb-4">
            <Radio className="text-[#FF00FF] animate-pulse" size={32} />
            <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-[#FF00FF] glitch-text uppercase">
              AUDIO.FEED
            </h2>
          </div>
          
          <MusicPlayer tracks={DUMMY_TRACKS} />
        </div>

      </div>
    </div>
  );
}
