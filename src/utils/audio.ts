// Web Audio API を用いたリアル効果音ジェネレーター
let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuted(muted: boolean) {
  isMuted = muted;
}

export function getMuted(): boolean {
  return isMuted;
}

// 1. 学校のチャイム（キーンコーンカーンコーン）
export function playChime() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // 西敏寺鐘声 (ウェストミンスター・チャイム) 音階: F4, A4, G4, C4 / F4, G4, A4, F4
  const notes = [
    { freq: 349.23, time: 0.0, dur: 0.8 }, // F4
    { freq: 440.00, time: 0.6, dur: 0.8 }, // A4
    { freq: 392.00, time: 1.2, dur: 0.8 }, // G4
    { freq: 261.63, time: 1.8, dur: 1.2 }, // C4
  ];

  notes.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

    gain.gain.setValueAtTime(0, ctx.currentTime + time);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + time + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + time);
    osc.stop(ctx.currentTime + time + dur);
  });
}

// 2. 解答・筆記音（カリカリカリ…）
export function playWritingSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2500, ctx.currentTime);
  filter.Q.setValueAtTime(3.0, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
}

// 3. 合格ファンファーレ
export function playFanfare() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // C4, E4, G4, C5 の華やかな和音展開
  const notes = [
    { freq: 523.25, time: 0.0, dur: 0.25 }, // C5
    { freq: 523.25, time: 0.25, dur: 0.25 }, // C5
    { freq: 523.25, time: 0.5, dur: 0.25 }, // C5
    { freq: 659.25, time: 0.75, dur: 0.8 }, // E5
    { freq: 587.33, time: 1.5, dur: 0.3 }, // D5
    { freq: 659.25, time: 1.8, dur: 0.3 }, // E5
    { freq: 783.99, time: 2.1, dur: 1.5 }, // G5 (大団円)
  ];

  notes.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

    gain.gain.setValueAtTime(0, ctx.currentTime + time);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + time + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + time);
    osc.stop(ctx.currentTime + time + dur);
  });
}

// 4. 合格発表ドラムロール
export function playDrumroll() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const duration = 2.5;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(300, ctx.currentTime);
  filter.frequency.linearRampToValueAtTime(900, ctx.currentTime + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.02, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + duration - 0.2);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
}
