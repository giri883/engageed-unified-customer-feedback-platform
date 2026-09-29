/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Persistent Audio Manager for EngageEd
// Plays the uploaded background track: /audio/engageed-background.mp3
// ONLY ONE persistent audio instance created.
// Starts strictly AFTER feedback submission with a 2-second smooth volume fade-in.

class AmbientAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private targetVolume: number = 0.3; // Comfortable background volume (0.25 - 0.35)
  private currentVolume: number = 0.0;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;
  private hasInitialized: boolean = false;

  constructor() {
    const savedVol = localStorage.getItem('engaged_music_volume');
    if (savedVol !== null) {
      const parsed = parseFloat(savedVol);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        this.targetVolume = parsed;
      }
    }
    const savedMute = localStorage.getItem('engaged_music_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
  }

  // Creates the single persistent audio instance
  private getOrCreateAudio(): HTMLAudioElement {
    if (!this.audio) {
      this.audio = new Audio('/audio/engageed-background.mp3');
      this.audio.loop = true;
      this.audio.preload = 'auto';
      this.audio.volume = 0; // Starts at 0 for smooth fade-in
      this.hasInitialized = true;

      // Handle loop robustness
      this.audio.addEventListener('ended', () => {
        if (this.isPlaying && this.audio) {
          this.audio.currentTime = 0;
          this.audio.play().catch(() => {});
        }
      });
    }
    return this.audio;
  }

  // Smoothly starts music with 2-second fade-in (0.0 -> 0.10 -> 0.20 -> 0.30)
  public startBackgroundMusic(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const audio = this.getOrCreateAudio();

        if (this.fadeInterval) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }

        this.currentVolume = 0;
        audio.volume = 0;
        audio.muted = this.isMuted;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isPlaying = true;

              // Smooth fade-in: 0.0 -> targetVolume over ~2000ms (20 steps of 100ms)
              const steps = 20;
              const stepTime = 100;
              const volumeIncrement = this.targetVolume / steps;

              this.fadeInterval = setInterval(() => {
                this.currentVolume = Math.min(this.targetVolume, this.currentVolume + volumeIncrement);
                if (this.audio) {
                  this.audio.volume = this.isMuted ? 0 : this.currentVolume;
                }

                if (this.currentVolume >= this.targetVolume) {
                  if (this.fadeInterval) clearInterval(this.fadeInterval);
                  this.fadeInterval = null;
                }
              }, stepTime);

              resolve(true);
            })
            .catch((err) => {
              console.warn('Playback deferred pending user interaction:', err?.message);
              resolve(false);
            });
        } else {
          resolve(true);
        }
      } catch (e) {
        console.warn('Audio start error:', e);
        resolve(false);
      }
    });
  }

  // Backwards compatibility alias
  public fadeIn(duration = 2.0): boolean {
    this.startBackgroundMusic();
    return true;
  }

  public stop() {
    if (!this.audio) return;
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('engaged_music_muted', this.isMuted ? 'true' : 'false');
    if (this.audio) {
      this.audio.muted = this.isMuted;
      this.audio.volume = this.isMuted ? 0 : this.currentVolume;
    }
    return this.isMuted;
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.targetVolume = clamped;
    this.currentVolume = clamped;
    localStorage.setItem('engaged_music_volume', clamped.toString());

    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : clamped;
      if (this.isMuted && clamped > 0) {
        this.isMuted = false;
        this.audio.muted = false;
        localStorage.setItem('engaged_music_muted', 'false');
      }
    }
  }

  public getVolume(): number {
    return this.targetVolume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Returns subtle music energy for visual sync
  public getAudioReactivity(): { bass: number; mid: number; treble: number } {
    if (!this.isPlaying || this.isMuted) {
      return { bass: 0, mid: 0, treble: 0 };
    }
    const t = Date.now() / 1000;
    return {
      bass: (Math.sin(t * 4.0) + 1) * 0.15,
      mid: (Math.cos(t * 6.0) + 1) * 0.1,
      treble: (Math.sin(t * 8.0) + 1) * 0.08,
    };
  }
}

export const ambientAudioEngine = new AmbientAudioEngine();
