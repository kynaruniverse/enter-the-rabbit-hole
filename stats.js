/* ============================================
   ENTER THE RABBIT HOLE — stats.js
   Phase 4: Stats Tracking

   Tracks portal picks + endings reached
   using localStorage (no backend needed).
   Shows real numbers to each user based
   on their own session history.

   In Phase 5 (optional) this can be swapped
   for a Supabase call to show GLOBAL stats.
   ============================================ */

'use strict';

const STATS_KEY = 'rh_stats';

/* ============================================
   DEFAULT STATS SHAPE
   ============================================ */
const defaultStats = {
  totalRuns:     0,
  portals: {
    red:  0,
    blue: 0,
    gap:  0
  },
  endings: {
    survived: 0,
    consumed: 0,
    looping:  0,
    observer: 0,
    mirror:   0,
    free:     0,
    secret:   0
  }
};


/* ============================================
   LOAD / SAVE
   ============================================ */

function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return structuredClone(defaultStats);
    return JSON.parse(raw);
  } catch {
    return structuredClone(defaultStats);
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // localStorage blocked (private mode etc) — fail silently
  }
}


/* ============================================
   PUBLIC API — called by script.js
   ============================================ */

function recordPortalPick(portalName) {
  const stats = loadStats();
  if (portalName in stats.portals) {
    stats.portals[portalName]++;
  }
  saveStats(stats);
}

function recordEndingReached(endingType) {
  const stats = loadStats();
  stats.totalRuns++;
  if (endingType in stats.endings) {
    stats.endings[endingType]++;
  }
  saveStats(stats);
}

function getStats() {
  return loadStats();
}


/* ============================================
   RENDER — Landing page portal stats
   "Red Portal chosen X times by you"
   ============================================ */

function renderLandingStats() {
  const el = document.getElementById('landing-stats');
  if (!el) return;

  const stats = loadStats();
  const total = stats.portals.red + stats.portals.blue + stats.portals.gap;

  if (total === 0) {
    el.innerHTML = '';
    return;
  }

  function pct(n) {
    return total > 0 ? Math.round((n / total) * 100) : 0;
  }

  el.innerHTML = `
    <p class="stats-title">YOUR PORTAL HISTORY</p>
    <div class="stats-bars">
      ${statBar('🔴 Red',    stats.portals.red,  pct(stats.portals.red),  '#ff2244')}
      ${statBar('🔵 Blue',   stats.portals.blue, pct(stats.portals.blue), '#2244ff')}
      ${statBar('⬛ Gap',    stats.portals.gap,  pct(stats.portals.gap),  '#00ff99')}
    </div>
    <p class="stats-note">${total} total run${total !== 1 ? 's' : ''} on this device</p>
  `;
}

function statBar(label, count, percent, color) {
  return `
    <div class="stat-row">
      <span class="stat-label">${label}</span>
      <div class="stat-track">
        <div class="stat-fill" style="width:${percent}%; background:${color};"></div>
      </div>
      <span class="stat-count">${count}</span>
    </div>
  `;
}


/* ============================================
   RENDER — Ending page stats bar
   Shows 3 quick stats about current run
   ============================================ */

function renderEndingStats(endingType) {
  const stats  = loadStats();
  const total  = stats.totalRuns;

  const endingNames = {
    survived: 'Survived',
    consumed:  'Consumed',
    looping:   'The Loop',
    observer:  'Observer',
    mirror:    'Mirror',
    free:      'Escape',
    secret:    '★ Secret'
  };

  const endingCount = stats.endings[endingType] || 0;
  const name        = endingNames[endingType]    || endingType;

  document.getElementById('stat-item-1').textContent =
    `${total} total run${total !== 1 ? 's' : ''}`;

  document.getElementById('stat-item-2').textContent =
    `"${name}" reached ${endingCount}×`;

  // Find their most common ending
  const topEnding = Object.entries(stats.endings)
    .sort((a, b) => b[1] - a[1])
    .find(([, v]) => v > 0);

  document.getElementById('stat-item-3').textContent = topEnding
    ? `Fav ending: ${endingNames[topEnding[0]]}`
    : 'First run!';

  // Show secret ending hint if never found
  if (!stats.endings.secret) {
    document.getElementById('global-stats').textContent =
      '🐇 A secret ending exists. Have you found it?';
  } else {
    document.getElementById('global-stats').textContent =
      '★ You have found the secret ending.';
  }
}


/* ============================================
   INJECT STATS CSS
   Keeps all styles self-contained in this file
   ============================================ */

(function injectStatsStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* --- Landing stats --- */
    .landing-stats {
      margin-top: 28px;
      width: 100%;
      max-width: 320px;
      margin-left: auto;
      margin-right: auto;
    }

    .stats-title {
      font-size: 0.65rem;
      color: #444;
      letter-spacing: 0.2em;
      margin-bottom: 10px;
    }

    .stats-bars {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 8px;
    }

    .stat-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.7rem;
    }

    .stat-label {
      width: 70px;
      color: #666;
      text-align: left;
      flex-shrink: 0;
    }

    .stat-track {
      flex: 1;
      height: 3px;
      background: #1a1a1a;
      border-radius: 2px;
      overflow: hidden;
    }

    .stat-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.6s ease;
      min-width: 2px;
    }

    .stat-count {
      width: 24px;
      text-align: right;
      color: #444;
      font-size: 0.65rem;
    }

    .stats-note {
      font-size: 0.6rem;
      color: #333;
      letter-spacing: 0.1em;
      margin-top: 4px;
    }

    /* --- Ending stats bar --- */
    .ending-stats-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      margin: 16px auto 20px;
      font-size: 0.65rem;
      color: #444;
      letter-spacing: 0.08em;
      max-width: 500px;
      flex-wrap: wrap;
    }

    .stat-divider {
      color: #222;
    }

    /* --- Ending capture zone --- */
    .ending-capture {
      padding: 20px 10px;
    }

    /* Ending title displayed inside capture */
    .ending-title {
      font-size: 0.8rem;
      letter-spacing: 0.2em;
      color: #555;
      margin-top: 8px;
      text-transform: uppercase;
    }

    /* Watermark inside screenshot */
    .ending-watermark {
      font-size: 0.6rem;
      color: #222;
      letter-spacing: 0.15em;
      margin-top: 16px;
    }
  `;
  document.head.appendChild(style);
})();
