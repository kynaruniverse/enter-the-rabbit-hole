/* ============================================
   ENTER THE RABBIT HOLE — nodes.js
   DEEP EXPANSION: 7 Layers

   LAYER MAP:
   Layer 1  — The Three Portals       (nodes 1–3)
   Layer 2  — First Descent           (nodes 4–9)
   Layer 3  — The Unravelling         (nodes 10–17)
   Layer 4  — The Deep Static         (nodes 18–26)
   Layer 5  — The Hollow Corridors    (nodes 27–35)
   Layer 6  — The Threshold           (nodes 36–43)
   Layer 7  — Endings                 (nodes 50–62)
   Dead Ends — Loop-back nodes        (nodes 70–74)
   Secrets   — Node 98, 99

   MINIMUM path length: 6 choices
   AVERAGE path length: 7–8 choices
   MAXIMUM path length: 9+ choices
   Dead ends loop back 1–2 layers
   ============================================ */


/* ==========================================
   LAYER 1 — The Three Portals
   ========================================== */

const nodes = [

  {
    id: 1,
    layer: 1,
    text: `The air tears open.

A red wound in the fabric of space
pulses in front of you.

It breathes.
It knows your name.
It has been waiting.`,
    choices: [
      { text: "Step through",           next: 4,  effect: "glitchShake"   },
      { text: "Reach out and touch it", next: 5,  effect: "colorShift"    },
      { text: "Wait and watch it",      next: 6,  effect: "glitchText"    }
    ]
  },

  {
    id: 2,
    layer: 1,
    text: `The blue door has no handle.
No hinges. No frame.
It simply... exists.

A low hum crawls up through
the soles of your feet
and into your teeth.

You can feel it thinking.`,
    choices: [
      { text: "Listen to the hum",      next: 5,  effect: "glitchText"    },
      { text: "Push the door open",     next: 7,  effect: "colorShiftFast"},
      { text: "Knock three times",      next: 8,  effect: "hiddenMessage" }
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

You feel it watching you back.
You feel yourself wanting to let it.`,
    choices: [
      { text: "Squeeze through",        next: 6,  effect: "screenInvert"  },
      { text: "Whisper into it",        next: 8,  effect: "hiddenMessage" },
      { text: "Press your ear against the dark", next: 9, effect: "glitchShake" }
    ]
  },


  /* ==========================================
     LAYER 2 — First Descent
     (nodes 4–9, wider — 3 choices each)
     ========================================== */

  {
    id: 4,
    layer: 2,
    text: `You are inside the red.

It isn't a colour.
It's a temperature.
It's a memory you don't have yet.

The ground is made of static.
Every step sends ripples outward
like you're walking on a dead signal.

Three paths diverge.
None of them are lit.`,
    choices: [
      { text: "Take the left path",     next: 10, effect: "glitchShake"   },
      { text: "Take the right path",    next: 11, effect: "colorShift"    },
      { text: "Stand still and wait",   next: 70, effect: "screenInvert"  }
    ]
  },

  {
    id: 5,
    layer: 2,
    text: `Something passed through your hand
when you touched it.

Not electricity. Not heat.
Information.

You know something now
that you didn't before
and you cannot name what it is.

A voice — not a sound, a voice —
presents you with a direction.`,
    choices: [
      { text: "Follow the voice",       next: 11, effect: "glitchText"    },
      { text: "Walk away from it",      next: 12, effect: "colorShift"    },
      { text: "Ask it what you know",   next: 71, effect: "hiddenMessage" }
    ]
  },

  {
    id: 6,
    layer: 2,
    text: `The gap swallowed you sideways.

You didn't move — the space around you did.

Now you are somewhere that smells
like the last room you cried in.

The ceiling is too low.
The floor is too soft.
There is writing on the walls
but it reads differently
depending on which eye you use.`,
    choices: [
      { text: "Read with your left eye", next: 12, effect: "glitchShake"  },
      { text: "Read with your right eye",next: 13, effect: "screenInvert" },
      { text: "Close both eyes",         next: 10, effect: "colorShiftFast"}
    ]
  },

  {
    id: 7,
    layer: 2,
    text: `The door opened inward.

You were expecting another room.
Instead: a corridor that curves
in a direction that shouldn't exist.

You follow it anyway.
Gravity adjusts.
Your inner ear files a complaint.
You ignore it.

Something is walking ahead of you.
Keeping your exact pace.`,
    choices: [
      { text: "Walk faster",            next: 13, effect: "colorShiftFast"},
      { text: "Walk slower",            next: 14, effect: "glitchText"    },
      { text: "Stop completely",        next: 72, effect: "glitchShake"   }
    ]
  },

  {
    id: 8,
    layer: 2,
    text: `It answered.

Not with words.
With a feeling — the specific feeling
of being known completely
by something that has no reason
to care about you
and cares anyway.

It showed you three doors
that weren't there before.`,
    choices: [
      { text: "The door made of sound", next: 14, effect: "glitchText"    },
      { text: "The door made of light", next: 15, effect: "colorShift"    },
      { text: "The door made of nothing",next: 16, effect: "screenInvert" }
    ]
  },

  {
    id: 9,
    layer: 2,
    text: `The dark spoke back.

It said: you have been here before.

You haven't.
Or you have, and the version of you
that was here last time
chose differently.

Ahead: two tunnel mouths.
Between them: a third option
that appeared while you were reading this.`,
    choices: [
      { text: "Left tunnel",            next: 15, effect: "glitchShake"   },
      { text: "Right tunnel",           next: 16, effect: "colorShift"    },
      { text: "The third option",       next: 17, effect: "hiddenMessage" }
    ]
  },


  /* ==========================================
     LAYER 3 — The Unravelling
     (nodes 10–17)
     ========================================== */

  {
    id: 10,
    layer: 3,
    text: `The static is thicker here.

You can feel it in your molars.
A frequency that isn't sound
pressing against the inside of your skull.

The path ahead branches.
One branch looks like it goes up.
One looks like it goes further down.
One looks like it goes nowhere
but you can feel air moving through it.`,
    choices: [
      { text: "Go up",                  next: 18, effect: "colorShift"    },
      { text: "Go further down",        next: 19, effect: "glitchShake"   },
      { text: "Follow the air",         next: 20, effect: "glitchText"    }
    ]
  },

  {
    id: 11,
    layer: 3,
    text: `The voice led you to a room.

In the room is a chair.
In the chair is a version of you
that stopped here a long time ago.

It looks comfortable.
It looks finished.
It looks up at you
and says nothing
but its expression says:
I know what's ahead.
I chose not to go.

You have to make a choice.`,
    choices: [
      { text: "Ask it what's ahead",    next: 19, effect: "glitchText"    },
      { text: "Walk past it",           next: 20, effect: "colorShiftFast"},
      { text: "Sit down next to it",    next: 73, effect: "screenInvert"  }
    ]
  },

  {
    id: 12,
    layer: 3,
    text: `Left eye: the walls say your name.
Right eye: the walls say a name you don't recognise.

You read both at once.
The two names are the same name.

The corridor ends in a fork.
The left fork smells like electricity.
The right fork smells like rain
on concrete
in a city you've never been to
but feel homesick for.`,
    choices: [
      { text: "Take the electric fork",  next: 20, effect: "glitchShake"  },
      { text: "Take the rain fork",      next: 21, effect: "colorShift"   },
      { text: "Sit with the homesickness",next: 71, effect: "hiddenMessage"}
    ]
  },

  {
    id: 13,
    layer: 3,
    text: `You caught up to the thing ahead of you.

It turned around.

It was the outline of a person —
your height, your posture,
your specific way of holding tension
in your shoulders.

But its face was a mirror.
And in the mirror
you looked like something
you've been trying not to be.

It stepped aside.
Two paths opened.`,
    choices: [
      { text: "Take the left path",     next: 21, effect: "screenInvert"  },
      { text: "Take the right path",    next: 22, effect: "glitchText"    }
    ]
  },

  {
    id: 14,
    layer: 3,
    text: `The door made of sound opened
into a room made of echoes.

Every step you took
repeated three times.
The third echo
was always slightly wrong.

A slightly wrong version of your footstep.
A slightly wrong version of your breathing.
A slightly wrong version of your name
coming from somewhere behind the wall.

Three ways forward.`,
    choices: [
      { text: "Call out to it",         next: 22, effect: "glitchShake"   },
      { text: "Follow your footsteps",  next: 23, effect: "colorShift"    },
      { text: "Press your hand to the wall", next: 74, effect: "glitchText"}
    ]
  },

  {
    id: 15,
    layer: 3,
    text: `The door made of light
opened into darkness.

Not absence of light — presence of dark.
Dark as a substance.
Dark with weight and texture.

Your eyes adjusted.
They adjusted to something.

You could see shapes —
not objects, shapes.
The shapes of decisions
that were made here
by people who are no longer people.`,
    choices: [
      { text: "Move toward a shape",    next: 23, effect: "screenInvert"  },
      { text: "Stay still and observe", next: 24, effect: "colorShiftFast"},
      { text: "Close your eyes again",  next: 70, effect: "glitchShake"   }
    ]
  },

  {
    id: 16,
    layer: 3,
    text: `The door made of nothing
was exactly that.

You passed through it
and something stayed behind.
Not something you were carrying.
Something you were.

You are lighter now.
You're not sure if that's good.

Two directions: forward and inward.
They look the same
from where you're standing.`,
    choices: [
      { text: "Go forward",             next: 24, effect: "glitchText"    },
      { text: "Go inward",              next: 25, effect: "colorShift"    }
    ]
  },

  {
    id: 17,
    layer: 3,
    text: `The third option was a staircase.

Going down.

Each step had a word carved into it.
The words were in a language
you don't speak
but understand perfectly
in the way you understand things
right before you wake up.

You read three of them.
They were:

BEFORE.    INSTEAD.    ANYWAY.

The staircase went deeper than it should.`,
    choices: [
      { text: "Descend carefully",      next: 25, effect: "glitchShake"   },
      { text: "Descend quickly",        next: 26, effect: "colorShiftFast"},
      { text: "Read more steps",        next: 72, effect: "hiddenMessage" }
    ]
  },


  /* ==========================================
     LAYER 4 — The Deep Static
     (nodes 18–26)
     ========================================== */

  {
    id: 18,
    layer: 4,
    text: `Up was wrong.

You know this because
the ceiling became a floor
and the floor became a decision
you can't take back.

The world here is inside out.
The surfaces face inward.
Everything is the wrong side of itself.

Three openings in the inside-out wall.`,
    choices: [
      { text: "First opening",          next: 27, effect: "screenInvert"  },
      { text: "Second opening",         next: 28, effect: "glitchShake"   },
      { text: "Third opening",          next: 73, effect: "colorShift"    }
    ]
  },

  {
    id: 19,
    layer: 4,
    text: `Deeper.

The air changes composition.
Not dangerous — different.
You breathe it and feel
like you're remembering something
that happened to someone else
but that someone else was you
just in a year you haven't reached yet.

A corridor. Long. Lit by nothing visible.
Branching at the end.`,
    choices: [
      { text: "Walk the corridor",      next: 27, effect: "glitchText"    },
      { text: "Run the corridor",       next: 29, effect: "colorShiftFast"},
      { text: "Crawl the corridor",     next: 28, effect: "glitchShake"   }
    ]
  },

  {
    id: 20,
    layer: 4,
    text: `The air led you here:

A room with no exits
that definitely has exits.

You can feel them —
the exits —
in the way you feel a word
on the tip of your tongue.
Almost. There. Gone.

Three spots on the wall
where the air pressure changes.`,
    choices: [
      { text: "Press the first spot",   next: 28, effect: "glitchShake"   },
      { text: "Press the second spot",  next: 29, effect: "colorShift"    },
      { text: "Press the third spot",   next: 30, effect: "screenInvert"  }
    ]
  },

  {
    id: 21,
    layer: 4,
    text: `The homesickness intensified.

You are in a city you've never been to.
The streets are familiar
the way a word is familiar
when you've heard it
but never seen it written.

Someone is waving at you
from across an intersection
that shouldn't exist at this depth.

They know you.
You almost know them.`,
    choices: [
      { text: "Cross to them",          next: 29, effect: "glitchText"    },
      { text: "Wave back and move on",  next: 30, effect: "colorShift"    },
      { text: "Duck into an alley",     next: 31, effect: "hiddenMessage" }
    ]
  },

  {
    id: 22,
    layer: 4,
    text: `The slightly wrong echo answered.

It said your name the wrong way
in a voice that was yours
before you knew yourself.

Then it said:

You are very close to something.
You have been close to it before.
The difference this time is
you are not going to turn back.

Are you.

Two paths lit up.`,
    choices: [
      { text: "I'm not turning back",   next: 30, effect: "glitchShake"   },
      { text: "Maybe I should",         next: 74, effect: "colorShift"    }
    ]
  },

  {
    id: 23,
    layer: 4,
    text: `The shape was a door.

The door was a memory.
The memory was not yours —
it was the rabbit hole's.

It showed you what it looked like
before the first person entered it.

Empty. Clean. Quiet.
Just a hole.
Just a space between things
that hadn't yet become a place.

It misses that.
Or something in it does.

Three ways forward.`,
    choices: [
      { text: "Continue deeper",        next: 31, effect: "screenInvert"  },
      { text: "Acknowledge the memory", next: 32, effect: "glitchText"    },
      { text: "Ask it what changed",    next: 33, effect: "colorShift"    }
    ]
  },

  {
    id: 24,
    layer: 4,
    text: `The shapes resolved.

They were choices.
Every choice that was made here
had left a residue —
a ghost of the decision,
the shape of a fork in a road
long after the road is gone.

You could see which directions
most people had taken.
The worn paths. The easy routes.
And the ones barely touched.

You faced the barely touched ones.`,
    choices: [
      { text: "Take the first untouched path", next: 32, effect: "glitchShake" },
      { text: "Take the second untouched path",next: 33, effect: "colorShift"  },
      { text: "Take the most worn path",       next: 27, effect: "glitchText"  }
    ]
  },

  {
    id: 25,
    layer: 4,
    text: `You went inward.

There is a version of inward
that is also downward.
You are in it.

The staircase from above
continued inside you somehow.
Each step now —
each choice —
removes something small.
Not pain. Not loss.
Just... reduction.

You are becoming more essential.
Or less complicated.
Or both.

Two openings. Neither looks welcoming.`,
    choices: [
      { text: "The darker opening",     next: 33, effect: "screenInvert"  },
      { text: "The quieter opening",    next: 34, effect: "glitchText"    }
    ]
  },

  {
    id: 26,
    layer: 4,
    text: `Running on the staircase
was a mistake
in the best possible way.

You overshot.

You are somewhere below
where you were supposed to be.
The map — if there was a map —
does not include this room.

There is something in the corner.
It has been here a long time.
It is not hostile.
It is not friendly.
It is simply old.

It points in three directions.`,
    choices: [
      { text: "Follow its first direction",  next: 34, effect: "glitchShake"   },
      { text: "Follow its second direction", next: 35, effect: "colorShiftFast"},
      { text: "Ask it how long it's been here", next: 70, effect: "hiddenMessage"}
    ]
  },


  /* ==========================================
     LAYER 5 — The Hollow Corridors
     (nodes 27–35)
     ========================================== */

  {
    id: 27,
    layer: 5,
    text: `You are in a corridor that knows you're there.

Not surveillance — recognition.
The walls aren't watching, they're
remembering.

Each section of corridor
has been walked before
and recalls the people who walked it.

Their footsteps are still here,
overlaid on yours,
creating a rhythm
you didn't choose
but fall into anyway.

Two doors ahead.`,
    choices: [
      { text: "First door",             next: 36, effect: "glitchText"    },
      { text: "Second door",            next: 37, effect: "colorShift"    }
    ]
  },

  {
    id: 28,
    layer: 5,
    text: `A chamber opens around you.

In it: a single chair.
A single light source — origin unknown.
A single question
written on the wall in a language
that changes every time you look away:

WHY DID YOU COME HERE?

The answers appear below it.
They change too.
But three stay constant.`,
    choices: [
      { text: "Curiosity",              next: 36, effect: "glitchShake"   },
      { text: "I don't know",           next: 38, effect: "colorShiftFast"},
      { text: "I was supposed to",      next: 37, effect: "screenInvert"  }
    ]
  },

  {
    id: 29,
    layer: 5,
    text: `The person across the intersection
was you.

Not a reflection —
a version. A parallel.
One who took the other portal.
Who made the other choice.
Who is standing exactly here
for exactly the same reason
and is just as confused
as you are right now.

You both look at the same fork in the path.
Neither of you moves.
One of you has to go first.`,
    choices: [
      { text: "You go first",           next: 37, effect: "glitchText"    },
      { text: "Let them go first",      next: 38, effect: "colorShift"    },
      { text: "Go together",            next: 39, effect: "glitchShake"   }
    ]
  },

  {
    id: 30,
    layer: 5,
    text: `Not turning back.

The commitment changed the space around you.
The corridor tightened — not smaller,
just more deliberate.
More aware of you choosing to be here.

A reward, maybe.
Or a test.
The rabbit hole doesn't distinguish.

A junction approaches.
Three branches.
The middle one is marked.
You don't know what the mark means.`,
    choices: [
      { text: "Take the marked branch",  next: 38, effect: "hiddenMessage" },
      { text: "Take the left branch",    next: 39, effect: "glitchShake"   },
      { text: "Take the right branch",   next: 40, effect: "screenInvert"  }
    ]
  },

  {
    id: 31,
    layer: 5,
    text: `Deeper means older.

You are now in a section
that predates the rabbit hole.
This was here before it was a hole.
Before it was anything navigable.

You are in the original space —
the emptiness that the hole
was carved from.

It is very quiet.
It has opinions about being disturbed.

You can feel two exits
like pressure changes in your ears.`,
    choices: [
      { text: "Use the first exit",     next: 39, effect: "colorShift"    },
      { text: "Use the second exit",    next: 40, effect: "glitchText"    }
    ]
  },

  {
    id: 32,
    layer: 5,
    text: `You acknowledged the memory.

The rabbit hole noticed.

Something shifted — not physically,
structurally. A recognition.
As if a place can feel seen
and respond to being seen
by opening slightly more.

A passage appeared
that wasn't there for the people
who didn't acknowledge it.

Three options in the new passage.`,
    choices: [
      { text: "The narrow way",         next: 40, effect: "glitchShake"   },
      { text: "The low way",            next: 41, effect: "colorShiftFast"},
      { text: "The lit way",            next: 36, effect: "screenInvert"  }
    ]
  },

  {
    id: 33,
    layer: 5,
    text: `It told you what changed.

The first person came and didn't leave.
Not in the usual sense.
They left physically.
But something of them stayed —
a decision they couldn't finish,
a thought they left half-completed.

That thought attracted another person.
That person left a half-thought too.
And another. And another.

Now the rabbit hole is
a sediment of unfinished things.
And you are walking through all of them.

Two paths through the sediment.`,
    choices: [
      { text: "Walk through carefully",  next: 41, effect: "glitchText"   },
      { text: "Let it wash over you",    next: 42, effect: "colorShift"   }
    ]
  },

  {
    id: 34,
    layer: 5,
    text: `The quiet opening was the right choice.

Or maybe there are no right choices here.
Maybe the rabbit hole produces
an ending regardless
and the choices are just
how you experience the descent.

This room is almost peaceful.
Almost.

There is something in the ceiling
that isn't a light
but illuminates anyway.
And beneath it: two directions
that both feel like forward.`,
    choices: [
      { text: "The left forward",       next: 42, effect: "glitchShake"   },
      { text: "The right forward",      next: 43, effect: "colorShift"    }
    ]
  },

  {
    id: 35,
    layer: 5,
    text: `The old thing's second direction
led here:

A room that is a mirror
of a room you've been in.
Not in the rabbit hole —
in your actual life.

A room you remember.
Possibly one you've tried to forget.
Possibly one you miss.

The rabbit hole found it in you
and built a replica.
Or maybe it found the original
and this is that.

Three exits.
All of them feel like leaving something.`,
    choices: [
      { text: "First exit",             next: 36, effect: "screenInvert"  },
      { text: "Second exit",            next: 43, effect: "glitchText"    },
      { text: "Stay a moment longer",   next: 71, effect: "hiddenMessage" }
    ]
  },


  /* ==========================================
     LAYER 6 — The Threshold
     (nodes 36–43)
     ========================================== */

  {
    id: 36,
    layer: 6,
    text: `You can feel the end from here.

Not see it. Feel it.
The way you feel a room is empty
before you turn the light on.

Whatever waits past Layer 6
is close enough now
to have a gravity.

You are being pulled
whether you walk or not.

Two final directions.
One resists you.
One doesn't.`,
    choices: [
      { text: "Take the one that resists",   next: 50, effect: "glitchShake"   },
      { text: "Take the one that doesn't",   next: 51, effect: "colorShift"    }
    ]
  },

  {
    id: 37,
    layer: 6,
    text: `The threshold is a conversation.

You are one side of it.
The rabbit hole is the other.

It has been listening to every choice.
It has an opinion about you.
It won't share it —
that's not what it does —
but you can feel the weight of it.

Being observed by something ancient
and non-judgmental
is more unsettling than being judged.

It opens two ways forward.`,
    choices: [
      { text: "Move through the first",  next: 51, effect: "screenInvert"  },
      { text: "Move through the second", next: 52, effect: "glitchText"    }
    ]
  },

  {
    id: 38,
    layer: 6,
    text: `I was supposed to.

The rabbit hole heard that.

It responded — not with words,
with atmosphere. The air thinned.
The light shifted. The geometry
became more honest.

You were supposed to be here.
That means something.
Maybe it means the rabbit hole
chose you back.

Final corridor.
One direction.`,
    choices: [
      { text: "Walk the final corridor",  next: 52, effect: "colorShiftFast"},
      { text: "Run the final corridor",   next: 53, effect: "glitchShake"   }
    ]
  },

  {
    id: 39,
    layer: 6,
    text: `Together you walked to the edge.

Then they — the other you —
stopped.

They said: one of us should go back.
They said: it should be me.
They said: you were always the one
who was going to finish this.

Then they weren't there anymore.
Not gone — just finished.
Just complete.

The threshold opened for you alone.`,
    choices: [
      { text: "Step through",           next: 53, effect: "colorShift"    },
      { text: "Wait a moment for them", next: 54, effect: "glitchText"    }
    ]
  },

  {
    id: 40,
    layer: 6,
    text: `The narrow way opened into
the widest space yet.

Paradox is the architecture down here.
The tighter the path,
the larger the destination.

You are in a cavern
that should not fit where it is.
Its ceiling is the sky
of somewhere else.
Its floor is decisions — compressed,
laminated, ancient.

A doorway at the far end.
Just one. Just forward.`,
    choices: [
      { text: "Walk to the doorway",    next: 54, effect: "screenInvert"  },
      { text: "Examine the floor first",next: 55, effect: "glitchShake"   }
    ]
  },

  {
    id: 41,
    layer: 6,
    text: `The sediment of unfinished things
was warm.

It had texture — not physical,
emotional. You could feel
the weight of what people
almost said, almost decided, almost did.

On the other side:
a room at the edge of everything.

Two ways through it.`,
    choices: [
      { text: "Cross the room slowly",  next: 55, effect: "glitchText"    },
      { text: "Cross the room quickly", next: 56, effect: "colorShift"    }
    ]
  },

  {
    id: 42,
    layer: 6,
    text: `The rabbit hole is almost done with you.

Or you are almost done with it.

From here you can see —
in the peripheral way you see things
down here — the shape of what comes next.

It is larger than expected.
It is quieter than expected.
It is exactly what it needed to be.

One final choice.`,
    choices: [
      { text: "Go toward the large thing",  next: 56, effect: "glitchShake"   },
      { text: "Go toward the quiet thing",  next: 57, effect: "colorShiftFast"}
    ]
  },

  {
    id: 43,
    layer: 6,
    text: `The room that was your room
let you go.

The rabbit hole rebuilt it
not to trap you
but to give you a chance
to leave it differently
than you left it the first time.

You left it differently.

Ahead: the final passage.
Behind: everything you brought with you.
You don't need all of it anymore.

Two final thresholds.`,
    choices: [
      { text: "First threshold",        next: 57, effect: "screenInvert"  },
      { text: "Second threshold",       next: 58, effect: "glitchText"    }
    ]
  },


  /* ==========================================
     DEAD ENDS — Loop-back nodes
     (nodes 70–74)
     ========================================== */

  {
    id: 70,
    layer: 2,
    isDeadEnd: true,
    text: `You stood still.

The hole moved around you.

When it stopped
you were back at a place
you recognised — almost.
The same shape.
The same geometry.
Different atmosphere.

Something here has changed
because you were somewhere else first.
Or maybe you changed.
It's the same thing.

The path resumes.`,
    choices: [
      { text: "Continue",               next: 10, effect: "glitchShake"   },
      { text: "Try a different way",    next: 11, effect: "screenInvert"  }
    ]
  },

  {
    id: 71,
    layer: 2,
    isDeadEnd: true,
    text: `It told you what you know.

You sat with the homesickness
and it became something navigable.
A map of feeling
rather than place.

The feeling pointed back
the way feeling always does —
toward the thing you
haven't finished processing.

You process it here.
Then you move.`,
    choices: [
      { text: "Move forward",           next: 12, effect: "colorShift"    },
      { text: "Move deeper",            next: 13, effect: "glitchText"    }
    ]
  },

  {
    id: 72,
    layer: 2,
    isDeadEnd: true,
    text: `You stopped.

The thing ahead also stopped.

You waited.
It waited.
You breathed.
It breathed.
Same rhythm.

This continued for what felt like
too long to measure
and not long enough to mean something.

Then the corridor reset.
You were somewhere earlier.
Somewhere you recognised
from the before.`,
    choices: [
      { text: "Try again",              next: 13, effect: "glitchShake"   },
      { text: "Take a different path",  next: 14, effect: "colorShiftFast"}
    ]
  },

  {
    id: 73,
    layer: 3,
    isDeadEnd: true,
    text: `You sat.

The other you said nothing.
You said nothing.
You sat in the specific silence
of two versions of the same person
who have both seen too much
to explain it to each other.

After a while —
no way to measure how long —
they stood up.

They pointed forward.
Then they weren't there anymore.

You stood up too.`,
    choices: [
      { text: "Go where they pointed",  next: 19, effect: "colorShift"    },
      { text: "Go a different way",     next: 20, effect: "glitchText"    }
    ]
  },

  {
    id: 74,
    layer: 3,
    isDeadEnd: true,
    text: `Maybe you should.

The rabbit hole heard the hesitation.

It folded you back —
not cruelly, not as punishment.
More like a book
marking a page.

You are somewhere earlier.
The same place with the same choices
but you are different now
for having considered going back
and then reconsidered.

That reconsideration matters.
The hole knows.`,
    choices: [
      { text: "Continue forward",       next: 22, effect: "glitchShake"   },
      { text: "Try the other path",     next: 23, effect: "screenInvert"  }
    ]
  },


  /* ==========================================
     LAYER 7 — ENDINGS
     (nodes 50–62)
     ========================================== */

  {
    id: 50,
    layer: 7,
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

  You took the path that resisted.
  Most don't.
    `,
    subtext: "Resistance was the only honest way through."
  },

  {
    id: 51,
    layer: 7,
    ending: true,
    endingType: "consumed",
    title: "CONSUMED",
    text: `
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ░  THE RABBIT HOLE CONSUMED  ░
  ░            YOU             ░
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

  you are still here
  you will always be here
  the path continues
  without you moving
    `,
    subtext: "Some paths only go one way. You found one."
  },

  {
    id: 52,
    layer: 7,
    ending: true,
    endingType: "supposed",
    title: "YOU WERE SUPPOSED TO",
    text: `
  ╔══════════════════════════════════╗
  ║                                  ║
  ║  The rabbit hole chose you       ║
  ║  before you chose it.            ║
  ║                                  ║
  ║  Every path you thought          ║
  ║  you were deciding               ║
  ║  was already decided.            ║
  ║                                  ║
  ║  You were supposed to be here.   ║
  ║                                  ║
  ║  The hole is grateful.           ║
  ║  In whatever way holes           ║
  ║  can be grateful.                ║
  ║                                  ║
  ╚══════════════════════════════════╝
    `,
    subtext: "Gratitude from something ancient is heavier than it sounds."
  },

  {
    id: 53,
    layer: 7,
    ending: true,
    endingType: "alone",
    title: "THE ONLY ONE",
    text: `
  · · · · · · · · · · · · · · · · ·
  ·                               ·
  ·  The other version of you     ·
  ·  was right.                   ·
  ·                               ·
  ·  You were always going        ·
  ·  to be the one who finished.  ·
  ·                               ·
  ·  That's not a reward.         ·
  ·  That's not a punishment.     ·
  ·                               ·
  ·  That's just what you are:    ·
  ·  the version that continues.  ·
  ·                               ·
  · · · · · · · · · · · · · · · · ·
    `,
    subtext: "Every parallel version of you stopped somewhere. Except this one."
  },

  {
    id: 54,
    layer: 7,
    ending: true,
    endingType: "waited",
    title: "THE ONE WHO WAITED",
    text: `
  ════════════════════════════════
  
  You waited for someone
  who was already gone.
  
  The rabbit hole noted this.
  
  It added you to the list
  of people who wait.
  
  The list is longer than
  the list of people who don't.
  
  That tells you something
  about people.
  
  ════════════════════════════════
    `,
    subtext: "The list of those who wait is the longest list in the hole."
  },

  {
    id: 55,
    layer: 7,
    ending: true,
    endingType: "floor",
    title: "THE FLOOR OF DECISIONS",
    text: `
  ┌──────────────────────────────────┐
  │                                  │
  │  You examined the floor.         │
  │                                  │
  │  It examined you back.           │
  │                                  │
  │  Under every compressed          │
  │  decision was another one.       │
  │  And under that, another.        │
  │                                  │
  │  All the way down to the first   │
  │  choice ever made in this place: │
  │                                  │
  │  to enter.                       │
  │                                  │
  │  The same choice you made.       │
  │                                  │
  └──────────────────────────────────┘
    `,
    subtext: "The first person who entered made the same choice as you. They never left."
  },

  {
    id: 56,
    layer: 7,
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
    id: 57,
    layer: 7,
    ending: true,
    endingType: "quiet",
    title: "THE QUIET THING",
    text: `
  .   .   .   .   .   .   .   .

      You chose the quiet thing.

      The quiet thing was
      the bottom.

      Not dramatic.
      Not terrifying.
      Just:

      the bottom.

      You're here now.
      It's quieter than you expected.
      More spacious.

      You can stay as long as you need.

  .   .   .   .   .   .   .   .
    `,
    subtext: "Some people spend their whole lives avoiding the quiet. You walked toward it."
  },

  {
    id: 58,
    layer: 7,
    ending: true,
    endingType: "leaving",
    title: "THE LEAVING",
    text: `
  ════════════════════════════════════

  You left the room differently
  than you entered it.

  The rabbit hole let you.

  More than let — it helped.
  It rebuilt the thing
  you needed to leave behind
  so you could actually leave it.

  You are lighter.
  Not empty — lighter.

  There is a difference.

  ════════════════════════════════════
       you left. that matters.
  ════════════════════════════════════
    `,
    subtext: "Not everyone who reaches the bottom comes back different. You did."
  },

  {
    id: 59,
    layer: 7,
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
    id: 60,
    layer: 7,
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
    id: 61,
    layer: 7,
    ending: true,
    endingType: "named",
    title: "YOUR NAME IS ON THE LIST",
    text: `
  ════════════════════════════════
   THE LIST OF THOSE WHO REACHED
        THE SEVENTH LAYER
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
    id: 62,
    layer: 7,
    ending: true,
    endingType: "free",
    title: "ESCAPE",
    text: `
  ════════════════════════════════════

         YOU FOUND THE EXIT.

  ════════════════════════════════════

  Seven layers.
  Every dead end.
  Every loop.

  And you still got out.

  Most people don't reach
  the seventh layer.
  Most people who reach it
  don't leave.

  ════════════════════════════════════
         TRANSMISSION ENDED
  ════════════════════════════════════
    `,
    subtext: "The exit was always there. You had to go deep enough to find it."
  },


  /* ==========================================
     SECRET ENDINGS
     ========================================== */

  {
    id: 98,
    layer: 7,
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

  {
    id: 99,
    layer: 7,
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
