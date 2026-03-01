/* ============================================
   ENTER THE RABBIT HOLE — stats.js
   Local tracking + Global stats display

   Local: localStorage (always works)
   Global: supabase.js (works when configured)
   ============================================ */

'use strict';

const STATS_KEY = 'rh_stats';

const defaultStats = {
  totalRuns: 0,
  portals: { red: 0, blue: 0, gap: 0, fourth: 0 },
  endings: {
    survived: 0, consumed: 0, looping: 0, observer: 0,
    mirror: 0, free: 0, secret: 0, supposed: 0, alone: 0,
    waited: 0, floor: 0, quiet: 0, leaving: 0, hollow: 0,
    named: 0, npcSecret: 0, konami: 0
  }
};

/* ============================================
   LOAD / SAVE
   ============================================ */
function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return JSON.parse(JSON.stringify(defaultStats));
    // Merge with defaults to handle new keys from updates
    const saved = JSON.parse(raw);
    return {
      totalRuns: saved.totalRuns || 0,
      portals:   Object.assign({}, defaultStats.portals,  saved.portals  || {}),
      endings:   Object.assign({}, defaultStats.endings,  saved.endings  || {})
    };
  } catch {
    return JSON.parse(JSON.stringify(defaultStats));
  }
}

function saveStats(stats) {
  try { localStorage.setItem(STATS_KEY, JSON.stringify(stats)); }
  catch { /* private mode — fail silently */ }
}

/* ============================================
   PUBLIC WRITE API
   ============================================ */
function recordPortalPick(portalName) {
  const stats = loadStats();
  if (portalName in stats.portals) stats.portals[portalName]++;
  else stats.portals[portalName] = 1;
  saveStats(stats);
}

function recordEndingReached(endingType) {
  const stats = loadStats();
  stats.totalRuns++;
  if (endingType in stats.endings) stats.endings[endingType]++;
  else stats.endings[endingType] = 1;
  saveStats(stats);
}

function getStats() { return loadStats(); }

/* ============================================
   RENDER — Landing page portal history bars
   ============================================ */
function renderLandingStats() {
  const el = document.getElementById('landing-stats');
  if (!el) return;
  const stats = loadStats();
  const { red, blue, gap, fourth } = stats.portals;
  const total = red + blue + gap + fourth;

  if (total === 0) { el.innerHTML = ''; return; }

  const pct = n => total > 0 ? Math.round((n / total) * 100) : 0;
  const bars = [
    { label: '🔴 Red',    count: red,    p: pct(red),    color: '#ff2244' },
    { label: '🔵 Blue',   count: blue,   p: pct(blue),   color: '#4466ff' },
    { label: '⬛ Gap',    count: gap,    p: pct(gap),    color: '#00ff99' },
  ];
  if (fourth > 0) {
    bars.push({ label: '🌀 ???', count: fourth, p: pct(fourth), color: '#9900ff' });
  }

  el.innerHTML =
    '<p class="stats-title">YOUR PORTAL HISTORY</p>' +
    '<div class="stats-bars">' +
    bars.map(b =>
      '<div class="stat-row">' +
        '<span class="stat-label">' + b.label + '</span>' +
        '<div class="stat-track">' +
          '<div class="stat-fill" style="width:' + b.p + '%;background:' + b.color + ';"></div>' +
        '</div>' +
        '<span class="stat-count">' + b.count + '</span>' +
      '</div>'
    ).join('') +
    '</div>' +
    '<p class="stats-note">' + total + ' total run' + (total !== 1 ? 's' : '') + ' on this device</p>';
}

/* ============================================
   RENDER — Ending page 3-stat bar
   ============================================ */
const ENDING_LABELS = {
  survived:  'Survived',    consumed:  'Consumed',
  looping:   'The Loop',    observer:  'Observer',
  mirror:    'Mirror',      free:      'Escape',
  secret:    '★ Secret',    supposed:  'Supposed',
  alone:     'Only One',    waited:    'Waited',
  floor:     'The Floor',   quiet:     'Quiet',
  leaving:   'Leaving',     hollow:    'Hollow',
  named:     'On The List', npcSecret: '★ NPC Secret',
  konami:    '★ Konami'
};

function renderEndingStats(endingType) {
  const stats      = loadStats();
  const total      = stats.totalRuns;
  const endingCount = stats.endings[endingType] || 0;
  const name       = ENDING_LABELS[endingType] || endingType;

  const s1 = document.getElementById('stat-item-1');
  const s2 = document.getElementById('stat-item-2');
  const s3 = document.getElementById('stat-item-3');
  const gs = document.getElementById('global-stats');

  if (s1) s1.textContent = total + ' total run' + (total !== 1 ? 's' : '');
  if (s2) s2.textContent = '"' + name + '" reached ' + endingCount + '\u00d7';

  const topEnding = Object.entries(stats.endings)
    .sort((a, b) => b[1] - a[1])
    .find(([, v]) => v > 0);
  if (s3) s3.textContent = topEnding
    ? 'Fav: ' + (ENDING_LABELS[topEnding[0]] || topEnding[0])
    : 'First run!';

  // Global stats block — populated async by supabase.js
  if (gs) {
    const isSecret = endingType === 'secret' ||
                     endingType === 'npcSecret' ||
                     endingType === 'konami';
    gs.textContent = '';

    // Attempt global stats pull
    if (typeof renderGlobalStatsBlock === 'function') {
      renderGlobalStatsBlock(gs);
    } else {
      // Fallback local hint
      if (!stats.endings.secret && !stats.endings.npcSecret && !stats.endings.konami) {
        gs.textContent = '🐇 Three secret endings exist. Have you found them?';
      } else {
        gs.textContent = '★ You have found ' +
          [stats.endings.secret ? 'the path secret' : '',
           stats.endings.npcSecret ? 'the NPC secret' : '',
           stats.endings.konami ? 'the back door' : '']
          .filter(Boolean).join(', ') + '.';
      }
    }
  }
}

/* ============================================
   INJECT STATS CSS
   ============================================ */
(function injectStatsStyles() {
  const style = document.createElement('style');
  style.textContent = `
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
    .stat-divider { color: #222; }
    .ending-capture { padding: 20px 10px; }
    .ending-title {
      font-size: 0.8rem;
      letter-spacing: 0.2em;
      color: #555;
      margin-top: 8px;
      text-transform: uppercase;
    }
    .ending-watermark {
      font-size: 0.6rem;
      color: #222;
      letter-spacing: 0.15em;
      margin-top: 16px;
    }
    /* Global stats block on ending page */
    #global-stats {
      font-size: 0.62rem;
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
      padding: 0 10px 24px;
      text-align: left;
    }
  `;
  document.head.appendChild(style);
})();
