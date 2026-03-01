/* ============================================
   ENTER THE RABBIT HOLE — supabase.js
   Direction 2: Global Stats — Real Players

   Setup: follow SUPABASE.md step by step.
   Then replace the two config lines below.

   Load order: add BEFORE script.js in index.html
   ============================================ */

'use strict';

/* ============================================
   ⚙️  CONFIG — fill these in after Supabase setup
   ============================================ */
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

/* ============================================
   STATE
   ============================================ */
let _sbReady     = false;
let _sessionId   = null;

/* ============================================
   INIT
   ============================================ */
(function _init() {
  if (
    SUPABASE_URL === 'YOUR_SUPABASE_URL' ||
    SUPABASE_KEY === 'YOUR_SUPABASE_ANON_KEY'
  ) {
    console.info(
      '[RH:Supabase] Not configured. ' +
      'Open SUPABASE.md and follow the setup guide.'
    );
    return;
  }
  _sessionId = _makeSessionId();
  _sbReady   = true;
  console.info('[RH:Supabase] Ready — session', _sessionId);
})();

/* ============================================
   SESSION ID
   ============================================ */
function _makeSessionId() {
  return Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8);
}

/* ============================================
   CORE — HTTP helpers
   ============================================ */
const _headers = () => ({
  'Content-Type':  'application/json',
  'apikey':        SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY
});

async function _insert(table, data) {
  if (!_sbReady) return false;
  try {
    const res = await fetch(SUPABASE_URL + '/rest/v1/' + table, {
      method:  'POST',
      headers: Object.assign({ 'Prefer': 'return=minimal' }, _headers()),
      body:    JSON.stringify(data)
    });
    if (!res.ok) console.warn('[RH:Supabase] insert error', await res.text());
    return res.ok;
  } catch (e) {
    console.warn('[RH:Supabase] network error', e.message);
    return false;
  }
}

async function _select(table, qs) {
  if (!_sbReady) return null;
  try {
    const url = SUPABASE_URL + '/rest/v1/' + table +
      (qs ? '?' + new URLSearchParams(qs) : '');
    const res = await fetch(url, { headers: _headers() });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn('[RH:Supabase] fetch error', e.message);
    return null;
  }
}

/* ============================================
   PUBLIC WRITE API
   Called by script.js
   ============================================ */

/** Call when a portal is chosen (a run starts) */
async function globalRecordRun(portal) {
  return _insert('runs', {
    portal:     portal,
    session_id: _sessionId
  });
}

/** Call when an ending is reached */
async function globalRecordEnding(endingType, depth, loopsHit) {
  return _insert('endings', {
    ending_type: endingType,
    depth:       depth    || 0,
    loops_hit:   loopsHit || 0,
    session_id:  _sessionId
  });
}

/* ============================================
   PUBLIC READ API
   ============================================ */

/** Returns the global_stats row or null */
async function getGlobalStats() {
  const rows = await _select('global_stats', { id: 'eq.1', select: '*' });
  if (!rows || rows.length === 0) return null;
  return rows[0];
}

/* ============================================
   RENDER — Global stats block
   Used by both the ending page and about.html

   Pass a container element — it populates it
   with a live stat table.
   ============================================ */
async function renderGlobalStatsBlock(containerEl) {
  if (!containerEl) return;
  if (!_sbReady) {
    containerEl.style.display = 'none';
    return;
  }

  const stats = await getGlobalStats();
  if (!stats) {
    containerEl.style.display = 'none';
    return;
  }

  containerEl.style.display = 'block';

  const totalRuns  = stats.total_runs     || 0;
  const secretFound = stats.secret_endings_found || 0;
  const konamiFound = stats.konami_found  || 0;
  const lastType   = stats.last_ending_type;

  const portalTotal = (stats.portal_red    || 0) +
                      (stats.portal_blue   || 0) +
                      (stats.portal_gap    || 0) +
                      (stats.portal_fourth || 0);

  function pct(n) {
    return portalTotal > 0 ? Math.round((n / portalTotal) * 100) : 0;
  }

  const secretPct = totalRuns > 0
    ? ((secretFound / totalRuns) * 100).toFixed(2)
    : '0.00';

  const endingLabel = {
    survived:  'YOU SURVIVED',
    consumed:  'CONSUMED',
    supposed:  'YOU WERE SUPPOSED TO',
    alone:     'THE ONLY ONE',
    waited:    'THE ONE WHO WAITED',
    floor:     'THE FLOOR OF DECISIONS',
    looping:   'THE LOOP',
    quiet:     'THE QUIET THING',
    leaving:   'THE LEAVING',
    observer:  'THE OBSERVER',
    hollow:    'THE HOLLOW',
    named:     'YOUR NAME IS ON THE LIST',
    free:      'ESCAPE',
    npcSecret: '[ CLASSIFIED ]',
    secret:    '< CLASSIFIED >',
    konami:    'THE BACK DOOR'
  };

  const rows = [
    [ 'TOTAL PLAYERS ENTERED',   totalRuns.toLocaleString()                          ],
    [ 'RED PORTAL',              pct(stats.portal_red   || 0) + '% of players'      ],
    [ 'BLUE DOOR',               pct(stats.portal_blue  || 0) + '% of players'      ],
    [ 'MYSTERIOUS GAP',          pct(stats.portal_gap   || 0) + '% of players'      ],
    [ 'SECRET ENDING FOUND',     secretFound.toLocaleString() + ' (' + secretPct + '%)' ],
    [ 'KONAMI CODE USED',        konamiFound.toLocaleString() + ' players'           ],
    [ 'LAST ENDING REACHED',     lastType ? (endingLabel[lastType] || lastType) : '—' ],
  ];

  if ((stats.portal_fourth || 0) > 0) {
    rows.splice(4, 0, [
      '??? PORTAL', pct(stats.portal_fourth) + '% of players'
    ]);
  }

  containerEl.innerHTML = '';

  const table = document.createElement('div');
  table.style.cssText = [
    'width: 100%',
    'font-family: Courier New, monospace',
    'font-size: 0.62rem',
    'letter-spacing: 0.1em'
  ].join(';');

  rows.forEach(([label, value], i) => {
    const row = document.createElement('div');
    row.style.cssText = [
      'display: flex',
      'justify-content: space-between',
      'align-items: baseline',
      'padding: 5px 0',
      'border-bottom: 1px solid #0a0a0a',
      'gap: 10px'
    ].join(';');

    const lbl = document.createElement('span');
    lbl.textContent = label;
    lbl.style.color = '#2a2a2a';

    const val = document.createElement('span');
    val.textContent = value;
    val.style.cssText = [
      'color: #00ff99',
      'text-align: right',
      'flex-shrink: 0'
    ].join(';');

    // Last ending gets special colour if it's secret
    if (label === 'LAST ENDING REACHED' && lastType &&
        (lastType === 'secret' || lastType === 'konami' || lastType === 'npcSecret')) {
      val.style.color = '#ff2244';
    }

    row.appendChild(lbl);
    row.appendChild(val);
    table.appendChild(row);
  });

  // Timestamp
  if (stats.updated_at) {
    const ts = document.createElement('p');
    ts.style.cssText = [
      'font-size: 0.52rem',
      'color: #111',
      'margin-top: 8px',
      'letter-spacing: 0.1em',
      'font-family: Courier New, monospace'
    ].join(';');
    const d = new Date(stats.updated_at);
    ts.textContent = 'updated ' + d.toLocaleTimeString();
    table.appendChild(ts);
  }

  containerEl.appendChild(table);
}

/* ============================================
   ABOUT PAGE STATS — larger display
   Called from about.html inline script
   ============================================ */
async function populateAboutStats() {
  const stats = await getGlobalStats();

  function set(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  if (!stats) {
    // Supabase not configured — show local fallback
    const localStats = (() => {
      try { return JSON.parse(localStorage.getItem('rh_stats')) || {}; } catch { return {}; }
    })();
    set('gs-total',  (localStats.totalRuns || 0).toLocaleString());
    set('gs-secret', '???');
    set('gs-konami', '???');
    set('gs-last',   '—');
    return;
  }

  const totalRuns  = stats.total_runs || 0;
  const pTotal     = (stats.portal_red    || 0) +
                     (stats.portal_blue   || 0) +
                     (stats.portal_gap    || 0) +
                     (stats.portal_fourth || 0);
  const pct = n => pTotal > 0 ? Math.round((n / pTotal) * 100) : 0;

  set('gs-total',   totalRuns.toLocaleString());
  set('gs-secret',  (stats.secret_endings_found || 0).toLocaleString());
  set('gs-konami',  (stats.konami_found || 0).toLocaleString());

  const endingLabel = {
    survived:'YOU SURVIVED', consumed:'CONSUMED', supposed:'WERE SUPPOSED TO',
    alone:'THE ONLY ONE', waited:'THE WAITER', floor:'FLOOR OF DECISIONS',
    looping:'THE LOOP', quiet:'THE QUIET THING', leaving:'THE LEAVING',
    observer:'THE OBSERVER', hollow:'THE HOLLOW', named:'ON THE LIST',
    free:'ESCAPE', npcSecret:'[ CLASSIFIED ]', secret:'< CLASSIFIED >',
    konami:'THE BACK DOOR'
  };
  set('gs-last', stats.last_ending_type
    ? (endingLabel[stats.last_ending_type] || stats.last_ending_type)
    : '—');

  set('gs-red',    pct(stats.portal_red   || 0) + '%');
  set('gs-blue',   pct(stats.portal_blue  || 0) + '%');
  set('gs-gap',    pct(stats.portal_gap   || 0) + '%');
  set('gs-fourth', pct(stats.portal_fourth || 0) + '%');

  // Show fourth portal stat only if it's been seen
  const fourthRow = document.getElementById('gs-fourth-row');
  if (fourthRow) {
    fourthRow.style.display = (stats.portal_fourth || 0) > 0 ? '' : 'none';
  }
}
