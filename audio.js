/* ============================================
   ENTER THE RABBIT HOLE — audio.js
   Phase D: Sound Design (Web Audio API)

   Zero external files.
   All sounds generated programmatically.
   User must interact first (browser policy).
   ============================================ */

'use strict';

let audioCtx = null;
let ambientNode = null;
let ambientGain = null;
let audioEnabled = false;
let audioUnlocked = false;
let ambientSuppressed = false;

/* ============================================
   INIT — called on first user interaction
   ============================================ */

function initAudio() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioEnabled = true;
    audioUnlocked = true;
  } catch {
    audioEnabled = false;
  }
}

function unlockAudio() {
  if (audioUnlocked) return;
  initAudio();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

/* Auto-unlock on any interaction */
['click', 'touchstart', 'keydown'].forEach(evt => {
  document.addEventListener(evt, () => {
    unlockAudio();
    if (!ambientNode && audioEnabled && !ambientSuppressed) {
      setTimeout(startAmbient, 800);
    }
  }, { once: false, passive: true });
});

/* ============================================
   AMBIENT DRONE
   Low rumble that plays continuously.
   Fades in slowly so it's felt not heard.
   ============================================ */

function startAmbient() {
  if (!audioCtx || !audioEnabled || ambientNode) return;

  ambientGain = audioCtx.createGain();
  ambientGain.gain.setValueAtTime(0, audioCtx.currentTime);
  ambientGain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 4);
  ambientGain.connect(audioCtx.destination);

  // Layer 1: sub bass drone
  const osc1 = audioCtx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(38, audioCtx.currentTime);
  osc1.frequency.linearRampToValueAtTime(42, audioCtx.currentTime + 8);

  // Layer 2: mid hum
  const osc2 = audioCtx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(60, audioCtx.currentTime);

  // Layer 3: high shimmer
  const osc3 = audioCtx.createOscillator();
  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(180, audioCtx.currentTime);

  // Subtle LFO on the hum
  const lfo = audioCtx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.08;
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 3;
  lfo.connect(lfoGain);
  lfoGain.connect(osc2.frequency);

  // Noise for static texture
  const bufferSize = audioCtx.sampleRate * 2;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.015;
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  // Filter noise to low rumble
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 200;

  noise.connect(filter);
  filter.connect(ambientGain);
  osc1.connect(ambientGain);
  osc2.connect(ambientGain);
  osc3.connect(ambientGain);

  osc1.start();
  osc2.start();
  osc3.start();
  lfo.start();
  noise.start();

  ambientNode = { osc1, osc2, osc3, lfo, noise };
}

function stopAmbient(suppress) {
  if (!ambientNode || !ambientGain) return;
  if (suppress) ambientSuppressed = true;
  ambientGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
  setTimeout(() => {
    try {
      ambientNode.osc1.stop();
      ambientNode.osc2.stop();
      ambientNode.osc3.stop();
      ambientNode.lfo.stop();
      ambientNode.noise.stop();
    } catch { /* already stopped */ }
    ambientNode = null;
  }, 1600);
}

function fadeAmbientTo(volume, duration) {
  if (!ambientGain || !audioCtx) return;
  ambientGain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + duration);
}

/* ============================================
   SOUND EFFECTS
   ============================================ */

/* Glitch hit — sharp noise burst */
let _lastGlitch = 0;
function soundGlitch() {
  if (!audioCtx || !audioEnabled) return;
  const now = Date.now();
  if (now - _lastGlitch < 80) return;
  _lastGlitch = now;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.3, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
  g.connect(audioCtx.destination);

  const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.18, audioCtx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = audioCtx.createBufferSource();
  src.buffer = buf;

  const f = audioCtx.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = 1800 + Math.random() * 800;
  f.Q.value = 0.5;

  src.connect(f);
  f.connect(g);
  src.start();
}

/* Button click — subtle low tick */
function soundClick() {
  if (!audioCtx || !audioEnabled) return;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.18, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
  g.connect(audioCtx.destination);

  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.06);
  osc.connect(g);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.06);
}

/* Typewriter tick — for NPC dialogue */
function soundTypewriter() {
  if (!audioCtx || !audioEnabled) return;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.06, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
  g.connect(audioCtx.destination);

  const osc = audioCtx.createOscillator();
  osc.type = 'square';
  osc.frequency.value = 600 + Math.random() * 200;
  osc.connect(g);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.03);
}

/* NPC appear — low unsettling sweep */
function soundNPCAppear() {
  if (!audioCtx || !audioEnabled) return;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0, audioCtx.currentTime);
  g.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.3);
  g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.2);
  g.connect(audioCtx.destination);

  const osc = audioCtx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(55, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(30, audioCtx.currentTime + 1.2);

  const f = audioCtx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 400;

  osc.connect(f);
  f.connect(g);
  osc.start();
  osc.stop(audioCtx.currentTime + 1.2);

  fadeAmbientTo(0.02, 0.3);
  setTimeout(() => fadeAmbientTo(0.06, 0.8), 1200);
}

/* Ending reached — long resonant tone */
function soundEnding() {
  if (!audioCtx || !audioEnabled) return;

  fadeAmbientTo(0, 2);

  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0, audioCtx.currentTime + 0.5);
  g.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 1.5);
  g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 5);
  g.connect(audioCtx.destination);

  const reverb = createReverb(3);
  reverb.connect(g);

  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(110, audioCtx.currentTime);
  osc.connect(reverb);
  osc.start(audioCtx.currentTime + 0.5);
  osc.stop(audioCtx.currentTime + 5);

  const osc2 = audioCtx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = 165;
  osc2.connect(reverb);
  osc2.start(audioCtx.currentTime + 0.8);
  osc2.stop(audioCtx.currentTime + 5);
}

/* Secret ending — unsettling high tone */
function soundSecretEnding() {
  if (!audioCtx || !audioEnabled) return;

  fadeAmbientTo(0, 1);

  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0, audioCtx.currentTime);
  g.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.5);
  g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 4);
  g.connect(audioCtx.destination);

  // Tritone + minor second intervals — unsettling, not triumphant
  const secretFreqs = [220, 311, 370, 233];
  secretFreqs.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(g);
    osc.start(audioCtx.currentTime + i * 0.2);
    osc.stop(audioCtx.currentTime + 4);
  });
}

/* Color shift — quick frequency sweep */
function soundColorShift() {
  if (!audioCtx || !audioEnabled) return;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.08, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
  g.connect(audioCtx.destination);

  const osc = audioCtx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.4);

  const f = audioCtx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 600;
  osc.connect(f);
  f.connect(g);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.4);
}

/* Page transition whoosh */
function soundTransition() {
  if (!audioCtx || !audioEnabled) return;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.07, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
  g.connect(audioCtx.destination);

  const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.5, audioCtx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) {
    d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  }
  const src = audioCtx.createBufferSource();
  src.buffer = buf;

  const f = audioCtx.createBiquadFilter();
  f.type = 'highpass';
  f.frequency.value = 400;
  src.connect(f);
  f.connect(g);
  src.start();
}

/* Konami code sound — ascending chime */
function soundKonami() {
  if (!audioCtx || !audioEnabled) return;
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.12);
    g.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + i * 0.12 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.12 + 0.4);
    g.connect(audioCtx.destination);

    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(g);
    osc.start(audioCtx.currentTime + i * 0.12);
    osc.stop(audioCtx.currentTime + i * 0.12 + 0.4);
  });
}

/* Dead end / loop — descending warble */
function soundDeadEnd() {
  if (!audioCtx || !audioEnabled) return;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.1, audioCtx.currentTime);
  g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
  g.connect(audioCtx.destination);

  const osc = audioCtx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 1.5);
  osc.connect(g);
  osc.start();
  osc.stop(audioCtx.currentTime + 1.5);
}

/* ============================================
   REVERB HELPER
   Convolution reverb using impulse response
   ============================================ */

function createReverb(duration) {
  const len    = audioCtx.sampleRate * duration;
  const buf    = audioCtx.createBuffer(2, len, audioCtx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    }
  }
  const conv = audioCtx.createConvolver();
  conv.buffer = buf;
  return conv;
}

/* ============================================
   AUDIO TOGGLE BUTTON
   Small mute/unmute in corner
   ============================================ */

function injectAudioToggle() {
  if (document.getElementById('audio-toggle')) return;

  const btn = document.createElement('button');
  btn.id = 'audio-toggle';
  btn.textContent = '🔊';
  btn.title = 'Toggle sound';
  btn.style.cssText = [
    'position: fixed',
    'bottom: 20px',
    'left: 20px',
    'background: transparent',
    'border: 1px solid #1a1a1a',
    'color: #333',
    'font-size: 0.8rem',
    'padding: 7px 12px',
    'cursor: pointer',
    'z-index: 500',
    'font-family: Courier New, monospace',
    'transition: border-color 0.2s, color 0.2s',
    'letter-spacing: 0.1em'
  ].join(';');

  let muted = true;

  btn.addEventListener('click', () => {
    initAudio();
    muted = !muted;
    if (muted) {
      if (ambientGain) ambientGain.gain.setValueAtTime(0, audioCtx.currentTime);
      audioEnabled = false;
      btn.textContent = '🔇';
      btn.style.color = '#222';
      btn.style.borderColor = '#1a1a1a';
    } else {
      audioEnabled = true;
      if (ambientGain) ambientGain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      else startAmbient();
      btn.textContent = '🔊';
      btn.style.color = '#00ff99';
      btn.style.borderColor = '#00ff99';
      setTimeout(() => {
        btn.style.color = '#333';
        btn.style.borderColor = '#1a1a1a';
      }, 1500);
    }
  });

  document.body.appendChild(btn);
}

/* ============================================
   MAP EFFECTS TO SOUNDS
   Called by script.js alongside triggerEffect()
   ============================================ */

function soundForEffect(effectName) {
  switch (effectName) {
    case 'glitchShake':    soundGlitch();      break;
    case 'colorShift':     soundColorShift();  break;
    case 'colorShiftFast': soundGlitch();      break;
    case 'glitchText':     soundGlitch();      break;
    case 'screenInvert':   soundColorShift();  break;
    case 'hiddenMessage':  soundColorShift();  break;
    case 'asciiPuzzle':    soundClick();       break;
  }
}
