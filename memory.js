/* ============================================
   ENTER THE RABBIT HOLE — memory.js
   Phase A: The Hole Remembers You

   Tracks visits, name, and behaviour
   across sessions using localStorage.
   Modifies the landing page on return visits.
   ============================================ */

'use strict';

const MEMORY_KEY = 'rh_memory';

const defaultMemory = {
  visits:        0,
  name:          null,       // if user ever gives their name
  endingsFound:  [],         // array of endingType strings
  firstVisit:    null,       // ISO date string
  lastVisit:     null,
  deepestLayer:  0,
  konamiFound:   false,
  fourthPortalSeen: false
};

/* ============================================
   LOAD / SAVE
   ============================================ */

function loadMemory() {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (!raw) return Object.assign({}, defaultMemory);
    return Object.assign({}, defaultMemory, JSON.parse(raw));
  } catch {
    return Object.assign({}, defaultMemory);
  }
}

function saveMemory(mem) {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(mem));
  } catch { /* private mode — fail silently */ }
}

/* ============================================
   PUBLIC API
   ============================================ */

function recordVisit() {
  const mem = loadMemory();
  mem.visits++;
  if (!mem.firstVisit) mem.firstVisit = new Date().toISOString();
  mem.lastVisit = new Date().toISOString();
  saveMemory(mem);
  return mem;
}

function recordEndingFound(endingType) {
  const mem = loadMemory();
  if (!mem.endingsFound.includes(endingType)) {
    mem.endingsFound.push(endingType);
  }
  saveMemory(mem);
}

function recordDeepestLayer(layer) {
  const mem = loadMemory();
  if (layer > mem.deepestLayer) {
    mem.deepestLayer = layer;
    saveMemory(mem);
  }
}

function recordKonamiFound() {
  const mem = loadMemory();
  mem.konamiFound = true;
  saveMemory(mem);
}

function recordFourthPortalSeen() {
  const mem = loadMemory();
  mem.fourthPortalSeen = true;
  saveMemory(mem);
}

function setName(name) {
  const mem = loadMemory();
  mem.name = name.trim().toUpperCase();
  saveMemory(mem);
}

function getMemory() {
  return loadMemory();
}

/* ============================================
   LANDING PAGE MEMORY TEXT
   Different message based on visit count
   ============================================ */

function getMemoryMessage(mem) {
  const v = mem.visits;

  if (v === 1) return null; // first visit — no message

  if (v === 2) return '[ you came back ]';

  if (v === 3) return '[ it noticed ]';

  if (v === 4) {
    return mem.name
      ? `[ hello again, ${mem.name} ]`
      : '[ the hole knows your pattern ]';
  }

  if (v === 5) return '[ you have been here ' + v + ' times ]';

  if (v >= 6 && v <= 9) {
    const msgs = [
      '[ stop coming back ]',
      '[ or don\'t. it prefers you here ]',
      '[ your path is being remembered ]',
      '[ the hole is learning you ]'
    ];
    return msgs[v % msgs.length];
  }

  if (v === 10) return '[ 10 visits. the hole considers you a resident. ]';

  if (v > 10 && v <= 20) {
    return mem.name
      ? `[ ${mem.name}. again. ]`
      : '[ you again ]';
  }

  if (v > 20) return '[ you live here now ]';

  return null;
}

/* ============================================
   APPLY MEMORY TO LANDING PAGE
   Called by script.js on showLanding()
   ============================================ */

function applyMemoryToLanding() {
  const mem = recordVisit();
  const msg = getMemoryMessage(mem);

  // Inject memory message above the title if applicable
  const existing = document.getElementById('memory-msg');
  if (existing) existing.remove();

  if (msg) {
    const el = document.createElement('p');
    el.id = 'memory-msg';
    el.textContent = msg;
    el.style.cssText = [
      'font-size: 0.65rem',
      'color: #ff2244',
      'letter-spacing: 0.2em',
      'margin-bottom: 10px',
      'opacity: 0',
      'transition: opacity 1.5s ease',
      'font-family: Courier New, monospace'
    ].join(';');

    const eyebrow = document.querySelector('#landing .eyebrow');
    if (eyebrow) eyebrow.after(el);

    // Fade in after short delay for effect
    setTimeout(() => { el.style.opacity = '1'; }, 400);
  }

  // If user has a name, subtly personalise the subtitle
  if (mem.name && mem.visits > 3) {
    const subtitle = document.querySelector('#landing .subtitle');
    if (subtitle) {
      subtitle.textContent = `Choose a portal to begin, ${mem.name}...`;
    }
  }

  // Show endings found count if > 2
  if (mem.endingsFound.length >= 2) {
    const warningEl = document.querySelector('#landing .warning-text');
    if (warningEl) {
      warningEl.textContent =
        `⚠ There is no going back.  ·  ${mem.endingsFound.length} ending${mem.endingsFound.length > 1 ? 's' : ''} found.`;
    }
  }

  return mem;
}

/* ============================================
   NAME PROMPT
   Only shown once, on 3rd visit
   Subtle — not intrusive
   ============================================ */

function maybePromptName() {
  const mem = loadMemory();
  if (mem.visits !== 3 || mem.name) return;

  // Wait until user is on the landing page a moment
  setTimeout(() => {
    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position: fixed',
      'inset: 0',
      'background: rgba(0,0,0,0.92)',
      'z-index: 1003',
      'display: flex',
      'flex-direction: column',
      'justify-content: center',
      'align-items: center',
      'padding: 30px 20px',
      'font-family: Courier New, monospace',
      'animation: npcFadeIn 0.4s ease'
    ].join(';');

    const box = document.createElement('div');
    box.style.cssText = [
      'border: 1px solid #ff2244',
      'padding: 28px 24px',
      'max-width: 360px',
      'width: 100%',
      'text-align: center',
      'box-shadow: 0 0 20px rgba(255,34,68,0.15)'
    ].join(';');

    const msg = document.createElement('p');
    msg.textContent = 'THE HOLE HAS NOTICED YOU.';
    msg.style.cssText = [
      'font-size: 0.75rem',
      'color: #ff2244',
      'letter-spacing: 0.2em',
      'margin-bottom: 6px'
    ].join(';');

    const sub = document.createElement('p');
    sub.textContent = 'It would like to know what to call you.';
    sub.style.cssText = [
      'font-size: 0.8rem',
      'color: #666',
      'letter-spacing: 0.08em',
      'margin-bottom: 20px',
      'line-height: 1.6'
    ].join(';');

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'YOUR NAME...';
    input.maxLength = 20;
    input.style.cssText = [
      'width: 100%',
      'padding: 12px',
      'background: #000',
      'border: 1px solid #333',
      'color: #fff',
      'font-family: Courier New, monospace',
      'font-size: 1rem',
      'letter-spacing: 0.1em',
      'text-align: center',
      'text-transform: uppercase',
      'margin-bottom: 14px',
      'outline: none'
    ].join(';');
    input.addEventListener('focus', () => input.style.borderColor = '#ff2244');
    input.addEventListener('blur',  () => input.style.borderColor = '#333');

    const btn = document.createElement('button');
    btn.textContent = '[ TELL IT ]';
    btn.style.cssText = [
      'padding: 11px 22px',
      'background: transparent',
      'border: 1px solid #ff2244',
      'color: #ff2244',
      'font-family: Courier New, monospace',
      'font-size: 0.85rem',
      'letter-spacing: 0.15em',
      'cursor: pointer',
      'margin-bottom: 12px',
      'width: 100%'
    ].join(';');

    const skip = document.createElement('button');
    skip.textContent = '[ REMAIN ANONYMOUS ]';
    skip.style.cssText = [
      'background: transparent',
      'border: none',
      'color: #333',
      'font-family: Courier New, monospace',
      'font-size: 0.65rem',
      'letter-spacing: 0.12em',
      'cursor: pointer'
    ].join(';');

    function submit() {
      const val = input.value.trim();
      if (val) setName(val);
      overlay.remove();
      // Refresh landing memory display
      applyMemoryToLanding();
    }

    btn.addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    skip.addEventListener('click', () => overlay.remove());

    box.appendChild(msg);
    box.appendChild(sub);
    box.appendChild(input);
    box.appendChild(btn);
    box.appendChild(skip);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    setTimeout(() => input.focus(), 200);

  }, 1500);
}
