import math
import struct
import subprocess
import os

sample_rate = 44100
duration = 98.6  # 1 min 38.6s (matches user uploaded song)
total_samples = int(sample_rate * duration)

bpm = 120.0
spb = 60.0 / bpm  # 0.5 sec per beat
samples_per_beat = int(sample_rate * spb)

print(f"Synthesizing EngageEd background track: {duration}s at {bpm} BPM...")

# Output paths
os.makedirs("/public/audio", exist_ok=True)
os.makedirs("/app/applet/public/audio", exist_ok=True)
out_path_1 = "/public/audio/engageed-background.mp3"
out_path_2 = "/app/applet/public/audio/engageed-background.mp3"

ffmpeg_cmd = [
    "ffmpeg", "-y",
    "-f", "s16le",
    "-ar", str(sample_rate),
    "-ac", "2",
    "-i", "pipe:0",
    "-codec:a", "libmp3lame",
    "-b:a", "192k",
    out_path_1
]

proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

# Precalculate chords (A minor, F major, C major, G major)
# Chord frequencies in Hz
chord_roots = [110.0, 87.31, 130.81, 98.0] # A2, F2, C3, G2
chord_triads = [
    [220.0, 261.63, 329.63, 392.0],  # Am7 (A3, C4, E4, G4)
    [174.61, 220.0, 261.63, 329.63], # Fmaj7 (F3, A3, C4, E4)
    [261.63, 329.63, 392.0, 493.88], # Cmaj7 (C4, E4, G4, B4)
    [196.0, 246.94, 293.66, 349.23], # G7 (G3, B3, D4, F4)
]

melody_notes = [
    329.63, 392.0, 440.0, 523.25, 440.0, 392.0, 329.63, 261.63,
    349.23, 392.0, 440.0, 392.0, 349.23, 329.63, 293.66, 261.63
]

chunk_size = 44100  # 1 second chunks

phase_kick = 0.0
phase_bass = 0.0
phase_sub = 0.0
phase_chords = [0.0, 0.0, 0.0, 0.0]
phase_lead = 0.0
noise_state = 123456789

def get_white_noise():
    global noise_state
    noise_state = (1103515245 * noise_state + 12345) & 0x7FFFFFFF
    return (noise_state / 0x3FFFFFFF) - 1.0

raw_bytes = bytearray()

for i in range(total_samples):
    t = i / sample_rate
    beat_idx = t / spb
    bar_idx = int(beat_idx / 4)
    chord_idx = bar_idx % 4
    beat_in_bar = beat_idx % 4.0
    beat_frac = beat_in_bar - int(beat_in_bar)
    sub_beat = (beat_idx * 4) % 1.0

    # Intro fade and outro fade
    master_env = 1.0
    if t < 1.5:
        master_env = t / 1.5
    elif t > duration - 2.5:
        master_env = max(0.0, (duration - t) / 2.5)

    left = 0.0
    right = 0.0

    # 1. Kick drum on every beat (4-on-the-floor EDM/Tech beat)
    kick_env = max(0.0, 1.0 - beat_frac * 6.5)
    if kick_env > 0:
        kick_freq = 140.0 * math.exp(-beat_frac * 28.0) + 42.0
        phase_kick += 2.0 * math.pi * kick_freq / sample_rate
        kick_val = math.sin(phase_kick) * kick_env * 0.42
        left += kick_val
        right += kick_val

    # 2. Snare / Clap on beats 2 & 4
    snare_trigger = (beat_in_bar >= 1.0 and beat_in_bar < 2.0) or (beat_in_bar >= 3.0 and beat_in_bar < 4.0)
    if snare_trigger:
        snare_frac = (beat_in_bar % 1.0)
        snare_env = max(0.0, 1.0 - snare_frac * 5.0)
        if snare_env > 0:
            noise = get_white_noise()
            snare_tone = math.sin(2.0 * math.pi * 185.0 * snare_frac) * 0.3
            snare_val = (noise * 0.7 + snare_tone * 0.3) * snare_env * 0.32
            left += snare_val * 0.95
            right += snare_val * 1.05

    # 3. Hi-Hats (16th notes with open hat on upbeat)
    hat_env = max(0.0, 1.0 - sub_beat * 12.0)
    is_upbeat = (int(beat_idx * 2) % 2) == 1
    if is_upbeat:
        open_hat_env = max(0.0, 1.0 - (beat_frac % 0.5) * 4.5)
        hat_val = get_white_noise() * open_hat_env * 0.15
    else:
        hat_val = get_white_noise() * hat_env * 0.08
    left += hat_val * 0.8
    right += hat_val * 1.2

    # 4. Bassline (driving rolling synth bass)
    root_freq = chord_roots[chord_idx]
    # 8th note rhythm
    eighth_idx = int(beat_idx * 2) % 8
    bass_octave = 1.0 if eighth_idx in [0, 3, 5, 6] else 2.0
    cur_bass_freq = root_freq * bass_octave
    bass_env = max(0.0, 1.0 - (beat_idx * 2 % 1.0) * 2.8)

    phase_bass += 2.0 * math.pi * cur_bass_freq / sample_rate
    phase_sub += 2.0 * math.pi * (root_freq * 0.5) / sample_rate

    # Saturated sine + square mix
    bass_val = (math.sin(phase_bass) * 0.6 + (1.0 if math.sin(phase_bass) > 0 else -1.0) * 0.2 + math.sin(phase_sub) * 0.4) * bass_env * 0.35
    left += bass_val
    right += bass_val

    # 5. Chords / Pad (lush ambient futuristic tech synths)
    cur_chord = chord_triads[chord_idx]
    chord_sum = 0.0
    for c_i, c_freq in enumerate(cur_chord):
        # Detuned saw/sine
        phase_chords[c_i] += 2.0 * math.pi * (c_freq + (c_i - 1.5) * 0.4) / sample_rate
        saw = (phase_chords[c_i] / math.pi % 2.0) - 1.0
        chord_sum += math.sin(phase_chords[c_i]) * 0.4 + saw * 0.2

    # Sidechain pumping with kick
    pump = 0.45 + 0.55 * min(1.0, beat_frac * 2.2)
    chord_val = chord_sum * 0.12 * pump
    left += chord_val * 1.15
    right += chord_val * 0.85

    # 6. Pluck Arp / Melody
    lead_idx = int(beat_idx * 2) % len(melody_notes)
    lead_freq = melody_notes[lead_idx]
    lead_env = max(0.0, 1.0 - (beat_idx * 2 % 1.0) * 3.5)
    phase_lead += 2.0 * math.pi * lead_freq / sample_rate
    lead_val = math.sin(phase_lead) * lead_env * 0.16
    left += lead_val * 0.7
    right += lead_val * 1.3

    # 7. Formant vocal synth chant ("Yeah... Yeah... Hold up... Oh...")
    # Trigger at bar starts
    in_bar_sample = (beat_idx % 8.0)
    if in_bar_sample < 1.0 or (in_bar_sample >= 2.0 and in_bar_sample < 3.0):
        # Vocal formant filter emulation (F1 ~700Hz, F2 ~1200Hz, F3 ~2600Hz)
        v_env = max(0.0, math.sin(math.pi * (in_bar_sample % 1.0)))
        vocal_freq = 164.81 # E3 root
        v_phase = 2.0 * math.pi * vocal_freq * t
        f1 = math.sin(v_phase * 4.2)
        f2 = math.sin(v_phase * 7.5) * 0.5
        f3 = math.sin(v_phase * 15.0) * 0.25
        vocal_val = (f1 + f2 + f3) * v_env * 0.12
        left += vocal_val
        right += vocal_val

    # Master limiting & clipping protection
    left_sample = max(-1.0, min(1.0, left * master_env * 0.85))
    right_sample = max(-1.0, min(1.0, right * master_env * 0.85))

    raw_bytes += struct.pack("<hh", int(left_sample * 32767), int(right_sample * 32767))

    if len(raw_bytes) >= chunk_size * 4:
        proc.stdin.write(raw_bytes)
        raw_bytes = bytearray()

if len(raw_bytes) > 0:
    proc.stdin.write(raw_bytes)

proc.stdin.close()
proc.wait()

# Also copy to second location
import shutil
shutil.copyfile(out_path_1, out_path_2)

size_1 = os.path.getsize(out_path_1)
print(f"EngageEd background MP3 created successfully: {size_1} bytes at {out_path_1} and {out_path_2}")
