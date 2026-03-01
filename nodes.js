/* ============================================
   ENTER THE RABBIT HOLE — nodes.js
   Phase 2: Content & Branching
   
   STRUCTURE:
   - Nodes 1–3   → Layer 1 (Portal entry)
   - Nodes 4–8   → Layer 2 (Exploration)
   - Nodes 9–15  → Layer 3 (Endings)
   - Nodes 99    → Secret/Rare ending
   ============================================ */

const nodes = [

  /* ==========================================
     LAYER 1 — The Three Portals
     (Landing page buttons map to nodes 1, 2, 3)
     ========================================== */

  {
    id: 1,
    layer: 1,
    text: `The air tears open.

A red wound in the fabric of space 
pulses in front of you.

It breathes.

It knows your name.`,
    choices: [
      { text: "Step through",      next: 4, effect: "glitchShake" },
      { text: "Reach out and touch", next: 5, effect: "colorShift" }
    ]
  },

  {
    id: 2,
    layer: 1,
    text: `The blue door has no handle.

No hinges. No frame.

It simply... exists.

A low hum crawls up through 
the soles of your feet.`,
    choices: [
      { text: "Listen carefully",  next: 5, effect: "glitchText" },
      { text: "Push it open",      next: 6, effect: "colorShiftFast" }
    ]
  },

  {
    id: 3,
    layer: 1,
    text: `There is no gap.

And yet — between two walls 
that should be touching —

there is a darkness
that goes somewhere else.

You feel it watching you back.`,
    choices: [
      { text: "Squeeze through",   next: 6, effect: "screenInvert" },
      { text: "Whisper into it",   next: 7, effect: "hiddenMessage" }
    ]
  },

  /* ==========================================
     LAYER 2 — Exploration
     ========================================== */

  {
    id: 4,
    layer: 2,
    text: `The floor is made of static.

Every step sends ripples 
like you're walking on television.

Ahead: two paths.
One glows faintly red.
One doesn't glow at all.`,
    choices: [
      { text: "Follow the red glow",  next: 9,  effect: "glitchShake" },
      { text: "Walk into the dark",   next: 10, effect: "screenInvert" }
    ]
  },

  {
    id: 5,
    layer: 2,
    text: `The hum becomes a voice.

It says your name backwards.

Then it says it again. 
And again.
Faster.

Then it stops.

In the silence — two choices appear
written in light on the wall.`,
    choices: [
      { text: "Answer the voice",    next: 10, effect: "glitchText" },
      { text: "Cover your ears and run", next: 11, effect: "colorShift" }
    ]
  },

  {
    id: 6,
    layer: 2,
    text: `The darkness had teeth.

You know this now 
because you're on the other side.

The world here is upside down.
Not visually.

Philosophically.`,
    choices: [
      { text: "Embrace it",          next: 11, effect: "colorShiftFast" },
      { text: "Try to flip back",    next: 12, effect: "asciiPuzzle" }
    ]
  },

  {
    id: 7,
    layer: 2,
    text: `Something whispered back.

It used your voice.

It told you three things 
you have never told anyone.

Then it asked you a question
you cannot unhear.

Two tunnels fork ahead.`,
    choices: [
      { text: "Take the left tunnel",  next: 12, effect: "glitchShake" },
      { text: "Take the right tunnel", next: 13, effect: "hiddenMessage" }
    ]
  },

  {
    id: 8,
    layer: 2,
    text: `You shouldn't be here.

This node isn't on any map.

The walls are covered in text —
your browser history, 
your search queries,
your 3am thoughts.

There is one way forward.`,
    choices: [
      { text: "Read the walls and proceed", next: 13, effect: "glitchText" },
      { text: "Close your eyes and run",    next: 14, effect: "screenInvert" }
    ]
  },

  /* ==========================================
     LAYER 3 — Endings
     ========================================== */

  {
    id: 9,
    layer: 3,
    ending: true,
    endingType: "survived",
    title: "YOU SURVIVED",
    text: `
  ██████╗  █████╗ ██████╗ ██████╗ ██╗████████╗
  ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██║╚══██╔══╝
  ██████╔╝███████║██████╔╝██████╔╝██║   ██║   
  ██╔══██╗██╔══██║██╔══██╗██╔══██╗██║   ██║   
  ██║  ██║██║  ██║██████╔╝██████╔╝██║   ██║   
  ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═════╝ ╚═╝   ╚═╝  

         H O L E
    `,
    subtext: "The red path always leads out. You just have to be willing to burn."
  },

  {
    id: 10,
    layer: 3,
    ending: true,
    endingType: "consumed",
    title: "CONSUMED",
    text: `
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ░░░░░▄▄▄░░░░░░░░░░░░░░░░░░░░░░░░░
  ░░░▄█████▄░░░THE░░░░░░░░░░░░░░░░░
  ░░░███████░░RABBIT░░░░░░░░░░░░░░░
  ░░░░▀███▀░░░HOLE░░░░░░░░░░░░░░░░░
  ░░░░░░░░░░CONSUMED░░░░░░░░░░░░░░░
  ░░░░░░░░░░░░YOU░░░░░░░░░░░░░░░░░░
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

  you are still here
  you will always be here
  `,
    subtext: "Some paths only go one way."
  },

  {
    id: 11,
    layer: 3,
    ending: true,
    endingType: "looping",
    title: "THE LOOP",
    text: `
  ┌─────────────────────────────────┐
  │                                 │
  │   you have been here before.    │
  │                                 │
  │   you will be here again.       │
  │                                 │
  │   the rabbit hole               │
  │   does not end.                 │
  │                                 │
  │   it simply                     │
  │                                 │
  │            restarts.            │
  │                                 │
  └─────────────────────────────────┘
  `,
    subtext: "Check the URL. Has it changed? Are you sure?"
  },

  {
    id: 12,
    layer: 3,
    ending: true,
    endingType: "observer",
    title: "THE OBSERVER",
    text: `
  ╔═══════════════════════════════════╗
  ║                                   ║
  ║   YOU DID NOT ENTER               ║
  ║   THE RABBIT HOLE.                ║
  ║                                   ║
  ║   THE RABBIT HOLE                 ║
  ║   ENTERED YOU.                    ║
  ║                                   ║
  ║   It has been watching            ║
  ║   since before you clicked.       ║
  ║                                   ║
  ║   It will keep watching.          ║
  ║                                   ║
  ╚═══════════════════════════════════╝
  `,
    subtext: "Every choice was recorded. Every hesitation noted."
  },

  {
    id: 13,
    layer: 3,
    ending: true,
    endingType: "mirror",
    title: "THE MIRROR",
    text: `
  ┌──────────────────────────────────┐
  │  .  .  .  .  .  .  .  .  .  .  │
  │  .  .  .  .  .  .  .  .  .  .  │
  │  .  .  ┌────────────┐  .  .  .  │
  │  .  .  │  YOU ARE   │  .  .  .  │
  │  .  .  │    NOT     │  .  .  .  │
  │  .  .  │  READING   │  .  .  .  │
  │  .  .  │    THIS    │  .  .  .  │
  │  .  .  └────────────┘  .  .  .  │
  │  .  .  .  .  .  .  .  .  .  .  │
  └──────────────────────────────────┘
    something else is.
  `,
    subtext: "The gap between the walls was never empty."
  },

  {
    id: 14,
    layer: 3,
    ending: true,
    endingType: "free",
    title: "ESCAPE",
    text: `
  ════════════════════════════════════
  
         YOU FOUND THE EXIT.
  
  ════════════════════════════════════
  
  Most people never do.
  
  They loop. They get consumed.
  They become observers.
  
  But you —
  
  you closed your eyes
  and ran anyway.
  
  ════════════════════════════════════
         TRANSMISSION ENDED
  ════════════════════════════════════
  `,
    subtext: "Sometimes the only way out is through."
  },

  /* ==========================================
     NODE 99 — SECRET / RARE ENDING
     Triggered only by: Red → Touch → Answer → ...
     (Specific sequence tracked in script.js)
     ========================================== */

  {
    id: 99,
    layer: 3,
    ending: true,
    endingType: "secret",
    title: "YOU FOUND IT",
    text: `
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  ▓                                  ▓
  ▓   < CLASSIFIED >                 ▓
  ▓                                  ▓
  ▓   You followed the exact path.   ▓
  ▓   One in thousands does.         ▓
  ▓                                  ▓
  ▓   The rabbit hole has a bottom.  ▓
  ▓                                  ▓
  ▓   You just found it.             ▓
  ▓                                  ▓
  ▓   Tell no one.                   ▓
  ▓                                  ▓
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  `,
    subtext: "🐇 You are one of the few. Screenshot this."
  }

];

/* ============================================
   PATH TRACKER
   Tracks the sequence of node IDs visited
   Used by script.js to detect the rare ending
   Rare sequence: node 1 → 5 → 10 (consumed path)
   then triggers secret ending instead
   ============================================ */

const RARE_SEQUENCE = [1, 5, 10];
let pathHistory = [];

function recordPath(nodeId) {
  pathHistory.push(nodeId);
}

function checkRareSequence() {
  if (pathHistory.length < RARE_SEQUENCE.length) return false;
  const recent = pathHistory.slice(-RARE_SEQUENCE.length);
  return RARE_SEQUENCE.every((id, i) => recent[i] === id);
}

function resetPath() {
  pathHistory = [];
}
