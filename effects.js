/* ============================================
   ENTER THE RABBIT HOLE — effects.js
   Phase 3: Effects Engine
   
   All visual effects are self-contained here.
   script.js calls triggerEffect(name) only.
   ============================================ */


/* ============================================
   EFFECT REGISTRY
   Add new effects here — script.js auto-finds them
   ============================================ */

const Effects = {

  /* ---------- 1. GLITCH SHAKE ----------
     Screen shakes violently for ~400ms        */
  glitchShake() {
    const app = document.getElementById('app');
    app.classList.add('glitch-shake');
    setTimeout(() => app.classList.remove('glitch-shake'), 450);

    // Also briefly corrupt the node text
    const nodeText = document.getElementById('node-text');
    if (nodeText && nodeText.textContent) {
      const original = nodeText.textContent;
      nodeText.textContent = corruptText(original, 0.3);
      setTimeout(() => nodeText.textContent = original, 400);
    }
  },

  /* ---------- 2. COLOR SHIFT ----------
     Background flashes a random dark hue      */
  colorShift() {
    const body = document.body;
    const colors = ['#0d0005', '#00050d', '#05000d', '#000d05', '#0d0500'];
    const pick = colors[Math.floor(Math.random() * colors.length)];
    const original = body.style.backgroundColor;
    body.style.backgroundColor = pick;
    body.style.transition = 'background-color 0.1s';

    setTimeout(() => {
      body.style.backgroundColor = original || '#000';
    }, 600);

    // Flash a brief color overlay
    flashOverlay(pick, 0.4, 500);
  },

  /* ---------- 3. COLOR SHIFT FAST ----------
     Rapid multi-flash of color                */
  colorShiftFast() {
    const body = document.body;
    const flashes = ['#ff000010', '#0000ff10', '#00ff0010', '#ff00ff10'];
    let i = 0;
    const interval = setInterval(() => {
      flashOverlay(flashes[i % flashes.length], 0.6, 120);
      i++;
      if (i >= 6) clearInterval(interval);
    }, 120);
  },

  /* ---------- 4. GLITCH TEXT ----------
     Scrambles the node text then restores it  */
  glitchText() {
    const nodeText = document.getElementById('node-text');
    if (!nodeText) return;

    const original = nodeText.textContent;
    let count = 0;
    const maxFlips = 8;

    const interval = setInterval(() => {
      nodeText.textContent = corruptText(original, 0.5);
      count++;
      if (count >= maxFlips) {
        clearInterval(interval);
        nodeText.textContent = original;
      }
    }, 60);
  },

  /* ---------- 5. SCREEN INVERT ----------
     Full screen color inversion flash         */
  screenInvert() {
    const app = document.getElementById('app');
    app.classList.add('invert-flash');
    setTimeout(() => app.classList.remove('invert-flash'), 550);

    // Briefly invert scanlines too
    const scanlines = document.getElementById('scanlines');
    if (scanlines) {
      scanlines.style.opacity = '0';
      setTimeout(() => scanlines.style.opacity = '1', 550);
    }
  },

  /* ---------- 6. HIDDEN MESSAGE ----------
     A secret message fades in over the screen */
  hiddenMessage() {
    const messages = [
      "IT KNOWS YOU'RE HERE",
      "YOU WERE ALWAYS GOING TO CLICK THAT",
      "THE OTHER PATHS LEAD TO THE SAME PLACE",
      "DON'T LOOK BEHIND YOU",
      "YOU HAVE BEEN HERE BEFORE",
      "THIS IS NOT A GAME"
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    showFloatingMessage(msg, 2000);
  },

  /* ---------- 7. ASCII PUZZLE ----------
     User must type a word to proceed         
     Returns a Promise — script.js awaits it  */
  asciiPuzzle() {
    return new Promise((resolve) => {
      const puzzles = [
        { prompt: "TYPE THE WORD THAT IS MISSING:\nR _ B B I T", answer: "RABBIT" },
        { prompt: "DECODE THIS:\n82 65 84 32 72 79 76 69 → TYPE IT", answer: "RAT HOLE" },
        { prompt: "WHAT AM I?\nI have layers but no onion.\nI have depth but no water.\nI have no end.", answer: "RABBIT HOLE" }
      ];
      const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
      showPuzzleModal(puzzle.prompt, puzzle.answer, resolve);
    });
  }

};


/* ============================================
   MAIN TRIGGER — called by script.js
   ============================================ */

async function triggerEffect(effectName) {
  if (Effects[effectName]) {
    await Effects[effectName]();
  }
}


/* ============================================
   HELPER FUNCTIONS
   ============================================ */

/* Randomly corrupt characters in a string */
function corruptText(str, intensity = 0.3) {
  const glitchChars = '█▓▒░╬╫╪┼╳▪▫◘◙■□▬▲▼◄►↕↔¶§';
  return str.split('').map(char => {
    if (char === '\n' || char === ' ') return char;
    return Math.random() < intensity
      ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
      : char;
  }).join('');
}

/* Flash a full-screen color overlay */
function flashOverlay(color, opacity, duration) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: ${color};
    opacity: ${opacity};
    pointer-events: none;
    z-index: 998;
    transition: opacity ${duration}ms ease;
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.style.opacity = '0';
  });
  setTimeout(() => overlay.remove(), duration + 50);
}

/* Show floating glitch message on screen */
function showFloatingMessage(text, duration = 2000) {
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #00ff99;
    font-family: 'Courier New', monospace;
    font-size: clamp(0.9rem, 3vw, 1.4rem);
    font-weight: bold;
    letter-spacing: 0.15em;
    text-align: center;
    pointer-events: none;
    z-index: 1000;
    text-shadow: 0 0 10px #00ff99, 0 0 20px #00ff99;
    animation: floatMsgAnim ${duration}ms ease forwards;
    white-space: nowrap;
  `;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), duration);
}

/* Show ASCII puzzle modal */
function showPuzzleModal(promptText, correctAnswer, onSuccess) {
  // Overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.92);
    z-index: 1001;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    font-family: 'Courier New', monospace;
  `;

  // Puzzle box
  const box = document.createElement('div');
  box.style.cssText = `
    border: 1px solid #00ff99;
    padding: 30px;
    max-width: 400px;
    width: 100%;
    text-align: center;
    box-shadow: 0 0 20px rgba(0,255,153,0.2);
  `;

  // Prompt
  const pre = document.createElement('pre');
  pre.textContent = promptText;
  pre.style.cssText = `
    color: #00ff99;
    margin-bottom: 24px;
    font-size: 0.9rem;
    line-height: 1.6;
    white-space: pre-wrap;
    text-align: left;
  `;

  // Input
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'TYPE YOUR ANSWER...';
  input.style.cssText = `
    width: 100%;
    padding: 12px;
    background: #000;
    border: 1px solid #333;
    color: #fff;
    font-family: 'Courier New', monospace;
    font-size: 1rem;
    letter-spacing: 0.1em;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 16px;
    outline: none;
  `;
  input.addEventListener('focus', () => input.style.borderColor = '#00ff99');
  input.addEventListener('blur',  () => input.style.borderColor = '#333');

  // Feedback
  const feedback = document.createElement('p');
  feedback.style.cssText = `
    color: #ff2244;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    min-height: 20px;
    margin-bottom: 12px;
  `;

  // Submit button
  const btn = document.createElement('button');
  btn.textContent = '[ SUBMIT ]';
  btn.style.cssText = `
    padding: 12px 24px;
    background: transparent;
    border: 1px solid #00ff99;
    color: #00ff99;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    letter-spacing: 0.15em;
    cursor: pointer;
    transition: background 0.2s;
  `;
  btn.addEventListener('mouseover', () => btn.style.background = 'rgba(0,255,153,0.1)');
  btn.addEventListener('mouseout',  () => btn.style.background = 'transparent');

  // Skip button (so user never gets stuck)
  const skip = document.createElement('button');
  skip.textContent = '[ SKIP — I CANNOT SOLVE IT ]';
  skip.style.cssText = `
    margin-top: 14px;
    background: transparent;
    border: none;
    color: #333;
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: color 0.2s;
  `;
  skip.addEventListener('mouseover', () => skip.style.color = '#666');
  skip.addEventListener('mouseout',  () => skip.style.color = '#333');

  // Submit logic
  function attempt() {
    const val = input.value.trim().toUpperCase();
    if (val === correctAnswer.toUpperCase()) {
      feedback.style.color = '#00ff99';
      feedback.textContent = '✓ CORRECT. PROCEEDING...';
      setTimeout(() => {
        overlay.remove();
        onSuccess();
      }, 800);
    } else {
      feedback.textContent = '✗ INCORRECT. THE HOLE GROWS DEEPER.';
      input.value = '';
      input.style.borderColor = '#ff2244';
      setTimeout(() => input.style.borderColor = '#333', 800);
    }
  }

  btn.addEventListener('click', attempt);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });
  skip.addEventListener('click', () => { overlay.remove(); onSuccess(); });

  box.appendChild(pre);
  box.appendChild(input);
  box.appendChild(feedback);
  box.appendChild(btn);
  box.appendChild(skip);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  setTimeout(() => input.focus(), 100);
}

/* Inject float animation into page once */
(function injectFloatAnim() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatMsgAnim {
      0%   { opacity: 0; transform: translate(-50%, -48%); }
      15%  { opacity: 1; transform: translate(-50%, -50%); }
      75%  { opacity: 1; transform: translate(-50%, -50%); }
      100% { opacity: 0; transform: translate(-50%, -53%); }
    }
  `;
  document.head.appendChild(style);
})();
