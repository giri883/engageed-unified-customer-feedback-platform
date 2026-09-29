/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ambientAudioEngine } from '../utils/ambientAudioEngine';
import { Volume2, VolumeX } from 'lucide-react';

export const AmbientMusic: React.FC = () => {
  const { musicActive } = useApp();
  const [isMuted, setIsMuted] = useState<boolean>(() => ambientAudioEngine.getIsMuted());
  const [volume, setVolume] = useState<number>(() => ambientAudioEngine.getVolume());
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);

  useEffect(() => {
    if (musicActive) {
      // Smooth 2-second fade-in post-feedback submission
      ambientAudioEngine.startBackgroundMusic();
      setIsMuted(ambientAudioEngine.getIsMuted());
    }
  }, [musicActive]);

  // Strict requirement: The song must NOT start when the website opens.
  // The song should start ONLY after the customer successfully submits feedback.
  if (!musicActive) {
    return null;
  }

  const handleToggleMute = () => {
    const muted = ambientAudioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    ambientAudioEngine.setVolume(val);
    if (isMuted && val > 0) {
      ambientAudioEngine.toggleMute();
      setIsMuted(false);
    }
  };

  return (
    <div
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-500 pointer-events-auto select-none"
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => setShowVolumeSlider(false)}
    >
      <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#030712]/85 hover:bg-[#030712]/95 border border-cyan-500/30 backdrop-blur-xl shadow-xl shadow-cyan-950/50 text-slate-200 transition-all">
        {/* Play indicator */}
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={handleToggleMute}>
          <span className="text-cyan-400 text-xs">🎵</span>
          <span className="text-3xs font-semibold text-slate-300 tracking-wider">Music</span>

          {!isMuted ? (
            <div className="flex items-end gap-0.5 h-3 px-0.5">
              <span className="w-0.5 bg-cyan-400 rounded-full animate-[pulse_1.2s_infinite]" style={{ height: '70%' }} />
              <span className="w-0.5 bg-purple-400 rounded-full animate-[pulse_0.9s_infinite_0.2s]" style={{ height: '100%' }} />
              <span className="w-0.5 bg-emerald-400 rounded-full animate-[pulse_1.4s_infinite_0.4s]" style={{ height: '50%' }} />
            </div>
          ) : (
            <span className="text-3xs text-slate-500 font-medium">(Muted)</span>
          )}
        </div>

        {/* Mute/Unmute Button */}
        <button
          onClick={handleToggleMute}
          className="p-1 rounded-full text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors cursor-pointer"
          title={isMuted ? 'Unmute Background Music' : 'Mute Background Music'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
        </button>

        {/* Expandable Volume Slider */}
        {showVolumeSlider && (
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/10 animate-in fade-in duration-200">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 accent-cyan-400 bg-white/20 rounded-full cursor-pointer"
              title={`Volume: ${Math.round(volume * 100)}%`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
