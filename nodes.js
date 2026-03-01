/* ============================================
   ENTER THE RABBIT HOLE — nodes.js
   Expansion: More Endings & Story Layers

   STRUCTURE:
   Nodes 1–3   → Layer 1 (Portal entry)
   Nodes 4–8   → Layer 2 (Exploration)
   Nodes 9–13  → Layer 3 (The Deep)       ← NEW
   Nodes 14–21 → Layer 4 (Endings)        ← NEW
   Node  98    → NPC Secret Ending        ← NEW
   Node  99    → Choice Sequence Secret   (existing)
   ============================================ */

const nodes = [

  /* ==========================================
     LAYER 1 — The Three Portals
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
      { text: "Step through",         next: 4, effect: "glitchShake" },
      { text: "Reach out and touch",  next: 5, effect: "colorShift"  }
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
      { text: "Listen carefully",  next: 5, effect: "glitchText"     },
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
      { text: "Squeeze through",  next: 6, effect: "screenInvert" },
      { text: "Whisper into it",  next: 7, effect: "hiddenMessage" }
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
      { text: "Follow the red glow",   next: 9,  effect: "glitchShake"  },
      { text: "Walk into the dark",    next: 10, effect: "screenInvert" }
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
      { text: "Answer the voice",         next: 10, effect: "glitchText"  },
      { text: "Cover your ears and run",  next: 11, effect: "colorShift"  }
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
      { text: "Embrace it",        next: 11, effect: "colorShiftFast" },
      { text: "Try to flip back",  next: 12, effect: "asciiPuzzle"    }
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
      { text: "Take the left tunnel",   next: 12, effect: "glitchShake"  },
      { text: "Take the right tunnel",  next: 13, effect: "hiddenMessage" }
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
      { text: "Read the walls and proceed",  next: 13, effect: "glitchText"   },
      { text: "Close your eyes and run",     next: 9,  effect: "screenInvert" }
    ]
  },

  /* ==========================================
     LAYER 3 — The Deep         ← NEW
     ========================================== */

  {
    id: 9,
    layer: 3,
    text: `You've gone further than most.

The air is thinner here.
Not because there's less of it —
because it's been used before.

By others who stood exactly where you stand.

They left something behind.
You can feel it pressing against your ribs.

Two faint lights ahead.
One flickers. One is perfectly still.`,
    choices: [
      { text: "Move toward the flickering light",  next: 14, effect: "glitchShake"  },
      { text: "Move toward the still light",       next: 15, effect: "colorShift"   }
    ]
  },

  {
    id: 10,
    layer: 3,
    text: `The voice is gone.

But it left a door.

Not a physical door —
a door in your thinking.
A gap in the logic of things.

On one side: what you know.
On the other: what you've been
pretending not to know.

Which do you step through?`,
    choices: [
      { text: "Step through what you know",          next: 15, effect: "colorShiftFast" },
      { text: "Step through what you've ignored",    next: 16, effect: "screenInvert"   }
    ]
  },

  {
    id: 11,
    layer: 3,
    text: `It embraced you back.

The upside-down world
recognized you
like an old friend.

It showed you something
carved into the floor:

A list of names.
Yours is third from the bottom.
Below it — two more.
The last one is unreadable.

It's still being written.`,
    choices: [
      { text: "Read the names above yours",  next: 16, effect: "glitchText"   },
      { text: "Look at the unreadable name", next: 17, effect: "hiddenMessage" }
    ]
  },

  {
    id: 12,
    layer: 3,
    text: `You flipped back.

But the world didn't.

Now you're right-side up
in an upside-down place
and everything looks
almost normal.

Almost.

The exits are where entrances should be.
The sky is where the floor was.
And somewhere behind you,
something is following
your logic.`,
    choices: [
      { text: "Use an exit",           next: 17, effect: "asciiPuzzle"    },
      { text: "Confront what follows", next: 18, effect: "glitchShake"    }
    ]
  },

  {
    id: 13,
    layer: 3,
    text: `The right tunnel opened into a room.

In the room: a mirror.

In the mirror: you.

But the reflection
isn't copying your movements.

It's doing what you
were going to do next.

Before you decided.

It raises one hand —
points left.
Then points right.

As if giving you a choice
you haven't made yet.`,
    choices: [
      { text: "Go left (as the mirror showed)",   next: 18, effect: "colorShift"   },
      { text: "Go right (defy the mirror)",       next: 14, effect: "screenInvert" }
    ]
  },

  /* ==========================================
     LAYER 4 — Endings            ← EXPANDED
     Nodes 14–21 + 98 + 99
     ========================================== */

  /* --- Original endings restructured as Layer 4 --- */

  {
    id: 14,
    layer: 4,
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
    id: 15,
    layer: 4,
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
    id: 16,
    layer: 4,
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
    id: 17,
    layer: 4,
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
    id: 18,
    layer: 4,
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

  /* --- NEW ENDINGS --- */

  {
    id: 19,
    layer: 4,
    ending: true,
    endingType: "hollow",
    title: "THE HOLLOW",
    text: `
  · · · · · · · · · · · · · · · · ·
  ·                               ·
  ·   You reached the center.     ·
  ·                               ·
  ·   The center is empty.        ·
  ·                               ·
  ·   Not the emptiness of        ·
  ·   nothing —                   ·
  ·                               ·
  ·   the emptiness of something  ·
  ·   that used to be here        ·
  ·   and left                    ·
  ·   right before you arrived.   ·
  ·                               ·
  · · · · · · · · · · · · · · · · ·
    `,
    subtext: "You were always a moment too late. Or exactly on time. It's the same thing."
  },

  {
    id: 20,
    layer: 4,
    ending: true,
    endingType: "named",
    title: "YOUR NAME IS ON THE LIST",
    text: `
  ════════════════════════════════
   THE LIST OF THOSE WHO REACHED
        THE FOURTH LAYER
  ════════════════════════════════

   ··· ·······
   ··· ·····
   ··· ········
   YOU
   ··· ··
  
  ════════════════════════════════
   The ones above you didn't know
   what came after their name.
   Neither do you.
  ════════════════════════════════
    `,
    subtext: "Something is being written below your name right now."
  },

  {
    id: 21,
    layer: 4,
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
     NODE 98 — NPC SECRET ENDING    ← NEW
     Triggered when a specific NPC appeared
     AND the player reaches a Layer 4 ending.
     Checked in script.js before showEnding().
     ========================================== */

  {
    id: 98,
    layer: 4,
    ending: true,
    endingType: "npcSecret",
    title: "THEY KNEW YOU WERE COMING",
    text: `
  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
  ▒                                  ▒
  ▒   One of them spoke to you.      ▒
  ▒   That was not an accident.      ▒
  ▒                                  ▒
  ▒   The NPCs are not characters.   ▒
  ▒   They are residue.              ▒
  ▒                                  ▒
  ▒   Echoes of explorers who        ▒
  ▒   went so deep they became       ▒
  ▒   part of the hole itself.       ▒
  ▒                                  ▒
  ▒   You spoke to one of them.      ▒
  ▒   Now they know your path.       ▒
  ▒                                  ▒
  ▒   They will remember you         ▒
  ▒   next time you enter.           ▒
  ▒                                  ▒
  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
    `,
    subtext: "🐇 The hole has a memory. And now it remembers you."
  },

  /* ==========================================
     NODE 99 — CHOICE SEQUENCE SECRET (existing)
     Triggered by: Red Portal → Touch → Answer
     ========================================== */

  {
    id: 99,
    layer: 4,
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
   Tracks node sequence for secret ending
   Rare sequence: node 1 → 5 → 10
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
