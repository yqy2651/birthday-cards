/**
 * Audio & tactile SFX engine:
 * - Uploaded audio playback via HTMLAudioElement
 * - Two gentle built-in birthday music-box melodies via Web Audio API
 * - Tactile wax stamp, wax crack, and paper flip sound effects
 */

const MELODIES = {
  'musicbox-birthday': {
    tempoMs: 420,
    // Happy Birthday gentle music box arrangement (frequencies in Hz)
    notes: [
      [392.0, 0.7], [392.0, 0.3], [440.0, 1.0], [392.0, 1.0], [523.25, 1.0], [493.88, 2.0],
      [392.0, 0.7], [392.0, 0.3], [440.0, 1.0], [392.0, 1.0], [587.33, 1.0], [523.25, 2.0],
      [392.0, 0.7], [392.0, 0.3], [783.99, 1.0], [659.25, 1.0], [523.25, 1.0], [493.88, 1.0], [440.0, 2.0],
      [698.46, 0.7], [698.46, 0.3], [659.25, 1.0], [523.25, 1.0], [587.33, 1.0], [523.25, 2.4],
    ],
  },
  'piano-starlight': {
    tempoMs: 520,
    // Gentle celestial waltz arpeggio
    notes: [
      [523.25, 1.0], [659.25, 1.0], [783.99, 1.0], [987.77, 1.5], [783.99, 0.5], [659.25, 1.0],
      [587.33, 1.0], [698.46, 1.0], [880.0, 1.0], [783.99, 2.0],
      [523.25, 1.0], [659.25, 1.0], [880.0, 1.0], [783.99, 1.5], [659.25, 0.5], [587.33, 1.0],
      [523.25, 2.5], [0, 0.5],
    ],
  },
};

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.htmlAudio = null;
    this.playing = false;
    this.currentUrl = null;
    this.currentPreset = null;
    this._timer = null;
    this._noteIdx = 0;
    this._listeners = new Set();
  }

  onChange(cb) {
    this._listeners.add(cb);
    return () => this._listeners.delete(cb);
  }

  _emit() {
    for (const cb of this._listeners) cb(this.playing);
  }

  _ensureCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playCardFlipSfx() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const dur = 0.14;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const env = Math.sin((i / data.length) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * 0.11;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1400;
    filter.Q.value = 0.9;
    src.connect(filter);
    filter.connect(ctx.destination);
    src.start();
  }

  playWaxStampSfx() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(52, now + 0.18);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  playWaxCrackSfx() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const dur = 0.12;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      const env = Math.pow(1 - t, 2.4);
      data[i] = (Math.random() * 2 - 1) * env * 0.28;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1800;
    src.connect(hp);
    hp.connect(ctx.destination);
    src.start();
  }

  playRedPacketChimeSfx() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    const base = ctx.currentTime;
    freqs.forEach((f, idx) => {
      const t0 = base + idx * 0.055;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const g1 = ctx.createGain();
      const g2 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(f, t0);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(f * 2, t0);
      g2.gain.value = 0.16;

      g1.gain.setValueAtTime(0.001, t0);
      g1.gain.linearRampToValueAtTime(0.14, t0 + 0.015);
      g1.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.65);

      osc1.connect(g1);
      osc2.connect(g2);
      g2.connect(g1);
      g1.connect(ctx.destination);
      osc1.start(t0);
      osc2.start(t0);
      osc1.stop(t0 + 0.68);
      osc2.stop(t0 + 0.68);
    });
  }

  _playBellNote(freq, durationSec) {
    if (!freq || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    const g2 = this.ctx.createGain();
    g2.gain.value = 0.12;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + Math.max(0.45, durationSec * 1.15));

    osc1.connect(gain);
    osc2.connect(g2);
    g2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + durationSec * 1.25);
    osc2.stop(now + durationSec * 1.25);
  }

  _scheduleNextNote(presetId) {
    if (!this.playing || this.currentPreset !== presetId) return;
    const melody = MELODIES[presetId];
    if (!melody) return;

    const [freq, beats] = melody.notes[this._noteIdx % melody.notes.length];
    this._noteIdx = (this._noteIdx + 1) % melody.notes.length;
    const waitMs = melody.tempoMs * beats;
    this._playBellNote(freq, waitMs / 1000);

    this._timer = window.setTimeout(() => this._scheduleNextNote(presetId), waitMs);
  }

  async play({ audioUrl = null, presetAudio = null } = {}) {
    this.stop();

    if (audioUrl) {
      this.currentUrl = audioUrl;
      this.htmlAudio = new Audio(audioUrl);
      this.htmlAudio.loop = true;
      this.htmlAudio.onended = () => {
        this.playing = false;
        this._emit();
      };
      try {
        await this.htmlAudio.play();
        this.playing = true;
        this._emit();
      } catch {
        this.playing = false;
        this._emit();
      }
      return;
    }

    if (presetAudio && MELODIES[presetAudio]) {
      this._ensureCtx();
      this.currentPreset = presetAudio;
      this._noteIdx = 0;
      this.playing = true;
      this._emit();
      this._scheduleNextNote(presetAudio);
    }
  }

  stop() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio.src = '';
      this.htmlAudio = null;
    }
    this.currentUrl = null;
    this.currentPreset = null;
    if (this.playing) {
      this.playing = false;
      this._emit();
    }
  }

  toggle(source) {
    if (this.playing) {
      this.stop();
    } else {
      this.play(source);
    }
  }
}

export const audioEngine = new AudioEngine();
