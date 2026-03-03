/* ============================================
   ENTER THE RABBIT HOLE — npcs.js
   Expansion: Mini NPC Characters

   NPCs appear randomly during navigation.
   Each has a name, ASCII portrait, and
   a pool of dialogue lines.

   Called by script.js via maybeShowNPC().
   ============================================ */

'use strict';

/* ============================================
   NPC ROSTER
   
   PORTRAIT RULES (to avoid JS string bugs):
   - All portraits use regular string arrays
     joined with \n — NO template literals
   - No backslashes inside portrait lines
   - Characters tested: ( ) . ~ / | _ [ ] ▓ ░ ▒ █
   ============================================ */

const NPC_ROSTER = [

  {
    id: 'rabbit',
    name: 'THE RABBIT',
    chance: 0.22,
    // FIX: portrait as array joined with newline — avoids backtick/backslash issues
    portrait: [
      '   (\\ (\\ ',
      '   ( -.-)  ',
      '   o_(")(") '
    ].join('\n'),
    color: '#ffffff',
    dialogue: [
      "I didn't lead you here. You led yourself.",
      "The hole has no bottom. Only the illusion of one.",
      "You've been falling for longer than you think.",
      "Every path circles back. You'll see.",
      "I'm not a symbol. I'm a warning.",
      "You chose this before you clicked anything.",
      "The others turned back. You didn't. Interesting.",
      "The first one who entered never came back. Not because they couldn't. Because they didn't want to.",
      "GL1TCH is wrong about me. I don't lead people here. I just watch them choose to come.",
    ]
  },

  {
    id: 'glitch',
    name: 'GL1TCH',
    chance: 0.18,
    portrait: [
      '  [ERR: face not found]',
      '  ||||||||||||||||||||',
      '  [ D A T A   L O S T ]'
    ].join('\n'),
    color: '#ff2244',
    dialogue: [
      "I am what happens when the story forgets itself.",
      "Y0U SH0ULD N0T BE ABLE T0 SEE ME.",
      "The script skipped a line. I fell through.",
      "Everything you've read so far was generated. Including this.",
      "I've been here since before the first portal.",
      "D0 N0T TR U S T  T H E  R A B B I T.",
      "You are not the first. You will not be the last. But you might be the only.",
      "The Cartographer mapped me once. Said I was in a room between rooms. Burned that page specifically.",
      "The first explorer left something behind. A half-finished thought. I am what grew from it.",
    ]
  },

  {
    id: 'cartographer',
    name: 'THE CARTOGRAPHER',
    chance: 0.15,
    portrait: [
      '   .-----.',
      '  | o   o |',
      '  |  ___  |',
      '   .-----.'
    ].join('\n'),
    color: '#00ff99',
    dialogue: [
      "I've mapped every path. None of them end where they say they do.",
      "Layer 4 doesn't exist on any of my maps. And yet.",
      "You took the red path. Most don't survive it philosophically.",
      "There is a room between the rooms. You almost entered it.",
      "The gap between the walls is not empty. I drew what's inside once. I burned the map.",
      "Every explorer who reached the bottom came back... different.",
      "You're on path 7 of 7. The others are watching.",
      "The first explorer left a half-thought in Layer 3. It's still there. I mapped around it. I don't go near it.",
      "GL1TCH is what the hole made from the unfinished things people left behind. Don't tell it I said that.",
    ]
  },

  {
    id: 'echo',
    name: 'ECHO',
    chance: 0.20,
    portrait: [
      '   ~   .   ~',
      '  .  ( _ )  .',
      '   ~   .   ~'
    ].join('\n'),
    color: '#aaaaff',
    dialogue: [
      "I'm the version of you that chose differently.",
      "We share the same hands. You just can't feel mine.",
      "In my version, you turned back at the blue door.",
      "I've reached every ending. None of them satisfied me.",
      "Don't look for meaning in the hole. The hole is the meaning.",
      "You feel like you're reading this. You're not. You're remembering it.",
      "I tried to warn you at the start. You clicked too fast.",
      "In my version, the rabbit warned me before I reached Layer 4. I didn't listen either.",
      "There's a version of you that found the secret ending on the first try. I've met them. They're quieter than you.",
    ]
  },

  {
    id: 'static',
    name: '_ _ _ _ _',
    chance: 0.12,
    portrait: [
      '  ░░▒▒▓▓██▓▓▒▒░░',
      '  ░░▒▒▓▓██▓▓▒▒░░',
      '  ░░▒▒▓▓██▓▓▒▒░░'
    ].join('\n'),
    color: '#555555',
    dialogue: [
      "...",
      ". . . . . .",
      "it sees you",
      "don't finish the path",
      "there is something past the last ending",
      "████████████",
      "you weren't supposed to find this one",
      "the first one is still here",
      "████ left something in layer 3. don't touch it.",
    ]
  },

  {
    id: 'first',
    name: 'THE FIRST',
    chance: 0.07,
    portrait: [
      '  . . . . .',
      '  .       .',
      '  . . . . .'
    ].join('\n'),
    color: '#444444',
    dialogue: [
      "I found the bottom. I stayed.",
      "You will not remember this encounter. You never do.",
      "I have watched everyone who came after me. None of them stayed as long.",
      "The hole didn't exist before I entered it. I made it by falling.",
      "There is no secret ending. There is only the one I haven't left yet.",
      "You look like the ones who almost find it. Most of you stop one choice short.",
      "I tried to leave once. The hole showed me what was outside. I came back.",
    ]
  }

];


/* ============================================
   STATE
   Track which NPC appeared this run
   (used by script.js for NPC secret ending)
   ============================================ */

let npcAppearedThisRun = null;
let npcAppearanceCount = 0;
let npcSeenThisRun     = new Set();

function getNPCState() {
  return {
    npc:      npcAppearedThisRun,
    count:    npcAppearanceCount,
    uniqueSeen: npcSeenThisRun.size,
    seenIds:  Array.from(npcSeenThisRun)
  };
}

function resetNPCState() {
  npcAppearedThisRun = null;
  npcAppearanceCount = 0;
  npcSeenThisRun     = new Set();
}


/* ============================================
   CORE — maybeShowNPC()
   Called after each choice in script.js.
   Returns a Promise that resolves when the
   NPC dismisses (or immediately if no NPC).
   ============================================ */

function maybeShowNPC(layerNumber) {
  // Don't show on Layer 1 — too early, kills pacing
  if (layerNumber <= 1) return Promise.resolve();

  // Weighted independent selection — shuffle first so order doesn't bias results
  const shuffled = NPC_ROSTER.slice().sort(() => Math.random() - 0.5);
  const candidate = shuffled.find(npc => Math.random() < npc.chance);
  if (!candidate) return Promise.resolve();

  // Don't show the same NPC twice in a row
  if (candidate.id === npcAppearedThisRun && Math.random() < 0.8) return Promise.resolve();

  // Track state for secret ending detection
  npcAppearedThisRun = candidate.id;
  npcAppearanceCount++;
  npcSeenThisRun.add(candidate.id);

  // Pick a random dialogue line
  const line = candidate.dialogue[
    Math.floor(Math.random() * candidate.dialogue.length)
  ];

  return showNPCModal(candidate, line);
}


/* ============================================
   DISPLAY — showNPCModal()
   Full-screen encounter popup with
   typewriter dialogue and tap-to-dismiss.
   ============================================ */

function showNPCModal(npc, line) {
  return new Promise(resolve => {

    // --- Overlay ---
    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position: fixed',
      'inset: 0',
      'background: rgba(0,0,0,0.96)',
      'z-index: 1002',
      'display: flex',
      'flex-direction: column',
      'justify-content: center',
      'align-items: center',
      'padding: 30px 20px',
      'font-family: Courier New, Courier, monospace',
      'animation: npcFadeIn 0.3s ease',
      'cursor: pointer'
    ].join(';');

    // --- Encounter label ---
    const label = document.createElement('p');
    label.textContent = '[ ENCOUNTER ]';
    label.style.cssText = [
      'font-size: 0.65rem',
      'letter-spacing: 0.25em',
      'color: ' + npc.color,
      'opacity: 0.6',
      'margin-bottom: 20px'
    ].join(';');

    // --- Portrait ---
    const portrait = document.createElement('pre');
    portrait.textContent = npc.portrait;
    portrait.style.cssText = [
      'color: ' + npc.color,
      'font-size: clamp(0.75rem, 2.5vw, 1rem)',
      'line-height: 1.5',
      'margin-bottom: 14px',
      'text-shadow: 0 0 8px ' + npc.color,
      'animation: npcFlicker 2.5s infinite',
      'text-align: center'
    ].join(';');

    // --- NPC name ---
    const name = document.createElement('p');
    name.textContent = npc.name;
    name.style.cssText = [
      'font-size: 0.7rem',
      'letter-spacing: 0.3em',
      'color: ' + npc.color,
      'margin-bottom: 24px',
      'opacity: 0.8'
    ].join(';');

    // --- Dialogue box ---
    const box = document.createElement('div');
    box.style.cssText = [
      'border: 1px solid ' + npc.color + '44',
      'padding: 20px 24px',
      'max-width: 380px',
      'width: 100%',
      'margin-bottom: 24px',
      'box-shadow: 0 0 20px ' + npc.color + '22'
    ].join(';');

    // --- Dialogue text (typewriter fills this) ---
    const dialogue = document.createElement('p');
    dialogue.style.cssText = [
      'color: #cccccc',
      'font-size: 0.95rem',
      'line-height: 1.75',
      'letter-spacing: 0.04em',
      'min-height: 60px'
    ].join(';');
    box.appendChild(dialogue);

    // --- Dismiss hint ---
    const hint = document.createElement('p');
    hint.textContent = '[ tap anywhere to continue ]';
    hint.style.cssText = [
      'font-size: 0.6rem',
      'letter-spacing: 0.2em',
      'color: #333',
      'opacity: 0',
      'transition: opacity 0.6s'
    ].join(';');

    // --- Assemble ---
    overlay.appendChild(label);
    overlay.appendChild(portrait);
    overlay.appendChild(name);
    overlay.appendChild(box);
    overlay.appendChild(hint);
    document.body.appendChild(overlay);

    // --- Typewriter ---
    // Short lines: show hint immediately after typing; long lines: normal flow
    const speed = npc.id === 'static' ? 80 : 36;
    typewriterEffect(dialogue, line, speed, () => {
      hint.style.opacity = '1';
    });
    // For very short STATIC lines, show hint almost immediately
    if (npc.id === 'static' && line.length < 20) {
      setTimeout(() => { hint.style.opacity = '1'; }, 1200);
    }

    // --- Dismiss logic ---
    // Short delay before dismissable so no accidental instant-skip
    let dismissable = false;
    setTimeout(() => { dismissable = true; }, 900);

    function dismiss() {
      if (!dismissable) return;
      overlay.style.animation = 'npcFadeOut 0.25s ease forwards';
      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 270);
    }

    overlay.addEventListener('click', dismiss);
    overlay.addEventListener('touchend', (e) => { e.preventDefault(); dismiss(); });

    // Safety auto-dismiss — never blocks the game
    setTimeout(dismiss, 12000);
  });
}


/* ============================================
   TYPEWRITER HELPER
   ============================================ */

function typewriterEffect(el, text, speed, onComplete) {
  speed = speed || 40;
  let i = 0;
  el.textContent = '';

  function tick() {
    if (i < text.length) {
      el.textContent += text[i];
      // Tick sound every 4th character
      if (i % 4 === 0 && typeof soundTypewriter === 'function') {
        soundTypewriter();
      }
      i++;
      setTimeout(tick, speed);
    } else if (onComplete) {
      onComplete();
    }
  }

  tick();
}


/* ============================================
   INJECT NPC KEYFRAME ANIMATIONS
   (runs once when the file loads)
   ============================================ */

(function injectNPCStyles() {
  const style = document.createElement('style');
  style.textContent = '\n' +
    '@keyframes npcFadeIn {\n' +
    '  from { opacity: 0; }\n' +
    '  to   { opacity: 1; }\n' +
    '}\n' +
    '@keyframes npcFadeOut {\n' +
    '  from { opacity: 1; }\n' +
    '  to   { opacity: 0; }\n' +
    '}\n' +
    '@keyframes npcFlicker {\n' +
    '  0%   { opacity: 1; }\n' +
    '  91%  { opacity: 1; }\n' +
    '  92%  { opacity: 0.3; }\n' +
    '  93%  { opacity: 1; }\n' +
    '  96%  { opacity: 0.6; }\n' +
    '  97%  { opacity: 1; }\n' +
    '  100% { opacity: 1; }\n' +
    '}\n';
  document.head.appendChild(style);
})();
