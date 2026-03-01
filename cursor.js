/* ============================================
   ENTER THE RABBIT HOLE — cursor.js
   Direction 3: Custom Glitching Cursor

   Replaces the default cursor with a small
   animated rabbit that glitches on click,
   leaves trail particles, and reacts to
   game events (NPC appear, ending reached).

   Mobile: disabled (touch has no cursor)
   Reduced motion: disabled
   ============================================ */

'use strict';

/* ============================================
   SKIP on touch-only devices + reduced motion
   ============================================ */
const isTouchOnly = window.matchMedia('(pointer: coarse)').matches;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (isTouchOnly || prefersReduced) {
  // Don't run cursor on mobile / reduced motion
  // Export no-op stubs so script.js calls don't error
  window.cursorReactNPC    = () => {};
  window.cursorReactEnding = () => {};
  window.cursorReactSecret = () => {};
} else {
  initCursor();
}

function initCursor() {

  /* ============================================
     HIDE NATIVE CURSOR
     ============================================ */
  const styleEl = document.createElement('style');
  styleEl.textContent = '* { cursor: none !important; }';
  document.head.appendChild(styleEl);

  /* ============================================
     CURSOR ELEMENT — the rabbit
     ============================================ */
  const cursor = document.createElement('div');
  cursor.id = 'rh-cursor';
  cursor.style.cssText = [
    'position: fixed',
    'top: 0',
    'left: 0',
    'pointer-events: none',
    'z-index: 99999',
    'transform: translate(-50%, -50%)',
    'transition: opacity 0.3s',
    'user-select: none',
    'will-change: transform'
  ].join(';');

  const inner = document.createElement('div');
  inner.style.cssText = [
    'font-family: Courier New, monospace',
    'font-size: 14px',
    'line-height: 1',
    'color: #ffffff',
    'white-space: pre',
    'text-shadow: 0 0 6px rgba(255,255,255,0.4)',
    'transition: color 0.2s, text-shadow 0.2s'
  ].join(';');

  // Default rabbit face
  inner.textContent = '>.<';
  cursor.appendChild(inner);
  document.body.appendChild(cursor);

  /* ============================================
     TRAIL PARTICLES
     ============================================ */
  const trailPool = [];
  const TRAIL_COUNT = 8;

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = [
      'position: fixed',
      'top: 0',
      'left: 0',
      'width: 3px',
      'height: 3px',
      'background: #00ff99',
      'pointer-events: none',
      'z-index: 99998',
      'border-radius: 50%',
      'opacity: 0',
      'transition: opacity 0.1s',
      'will-change: transform'
    ].join(';');
    document.body.appendChild(dot);
    trailPool.push({ el: dot, x: 0, y: 0, opacity: 0 });
  }

  /* ============================================
     POSITION TRACKING
     ============================================ */
  let mouseX = -200;
  let mouseY = -200;
  let trailIndex = 0;
  let frameId;
  let lastTrailTime = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });

  /* ============================================
     ANIMATION LOOP
     ============================================ */
  function animate(ts) {
    // Move main cursor
    cursor.style.transform = `translate(${mouseX - 8}px, ${mouseY - 10}px)`;

    // Drop a trail particle every ~60ms
    if (ts - lastTrailTime > 55) {
      const p = trailPool[trailIndex % TRAIL_COUNT];
      p.x = mouseX;
      p.y = mouseY;
      p.el.style.transform = `translate(${p.x - 1}px, ${p.y - 1}px)`;
      p.el.style.opacity   = '0.4';
      setTimeout(() => { p.el.style.opacity = '0'; }, 300);
      trailIndex++;
      lastTrailTime = ts;
    }

    frameId = requestAnimationFrame(animate);
  }
  frameId = requestAnimationFrame(animate);

  /* ============================================
     CLICK REACTION — glitch burst
     ============================================ */
  document.addEventListener('mousedown', () => {
    inner.textContent  = 'x.x';
    inner.style.color  = '#ff2244';
    inner.style.textShadow = '0 0 10px rgba(255,34,68,0.8)';

    // Spawn 4 glitch particles
    spawnBurst(mouseX, mouseY, '#ff2244', 4);

    setTimeout(() => {
      inner.textContent  = '>.<';
      inner.style.color  = '#ffffff';
      inner.style.textShadow = '0 0 6px rgba(255,255,255,0.4)';
    }, 180);
  });

  /* ============================================
     HOVER REACTION — buttons get a highlight
     ============================================ */
  document.addEventListener('mouseover', e => {
    const isBtn = e.target.tagName === 'BUTTON' ||
                  e.target.tagName === 'A'       ||
                  e.target.tagName === 'INPUT';
    if (isBtn) {
      inner.textContent  = '>^<';
      inner.style.color  = '#00ff99';
      inner.style.textShadow = '0 0 8px rgba(0,255,153,0.6)';
    } else {
      inner.textContent  = '>.<';
      inner.style.color  = '#ffffff';
      inner.style.textShadow = '0 0 6px rgba(255,255,255,0.4)';
    }
  });

  /* ============================================
     BURST PARTICLE SPAWNER
     ============================================ */
  function spawnBurst(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const p   = document.createElement('div');
      const ang = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const dist = 20 + Math.random() * 30;
      const tx  = Math.cos(ang) * dist;
      const ty  = Math.sin(ang) * dist;

      p.style.cssText = [
        'position: fixed',
        'top: 0',
        'left: 0',
        'width: 2px',
        'height: 2px',
        'background: ' + color,
        'pointer-events: none',
        'z-index: 99997',
        'border-radius: 50%',
        'transform: translate(' + (x - 1) + 'px, ' + (y - 1) + 'px)',
        'transition: transform 0.4s ease-out, opacity 0.4s ease-out',
        'opacity: 1'
      ].join(';');

      document.body.appendChild(p);

      requestAnimationFrame(() => {
        p.style.transform = 'translate(' + (x + tx - 1) + 'px, ' + (y + ty - 1) + 'px)';
        p.style.opacity   = '0';
      });

      setTimeout(() => p.remove(), 450);
    }
  }

  /* ============================================
     GAME EVENT REACTIONS
     Called by script.js at key moments
     ============================================ */

  // NPC appears — cursor goes eerie
  window.cursorReactNPC = function() {
    inner.textContent  = 'O.O';
    inner.style.color  = '#aaaaff';
    inner.style.textShadow = '0 0 12px rgba(170,170,255,0.8)';
    spawnBurst(mouseX, mouseY, '#aaaaff', 6);
    setTimeout(() => {
      inner.textContent  = '>.<';
      inner.style.color  = '#ffffff';
      inner.style.textShadow = '0 0 6px rgba(255,255,255,0.4)';
    }, 1200);
  };

  // Normal ending reached — cursor dims
  window.cursorReactEnding = function() {
    inner.textContent  = '-.-';
    inner.style.color  = '#444';
    inner.style.textShadow = 'none';
    setTimeout(() => {
      inner.textContent  = '>.<';
      inner.style.color  = '#ffffff';
      inner.style.textShadow = '0 0 6px rgba(255,255,255,0.4)';
    }, 2000);
  };

  // Secret ending — cursor explodes green
  window.cursorReactSecret = function() {
    inner.textContent  = '*.*';
    inner.style.color  = '#00ff99';
    inner.style.textShadow = '0 0 20px rgba(0,255,153,1)';
    spawnBurst(mouseX, mouseY, '#00ff99', 12);
    setTimeout(() => {
      inner.textContent  = '>.<';
      inner.style.color  = '#ffffff';
      inner.style.textShadow = '0 0 6px rgba(255,255,255,0.4)';
    }, 2500);
  };

} // end initCursor
