/* ============================================
   ENTER THE RABBIT HOLE — script.js
   Direction 2 + 3: Supabase + Visual Upgrade

   Load order in index.html:
     1. nodes.js
     2. effects.js
     3. stats.js
     4. npcs.js
     5. memory.js
     6. journal.js
     7. audio.js
     8. supabase.js   ← new
     9. cursor.js     ← new
    10. script.js     ← this file
   ============================================ */

'use strict';

/* ============================================
   DOM
   ============================================ */
const $ = id => document.getElementById(id);

const landingPage   = $('landing');
const nodePage      = $('node');
const endingPage    = $('ending');
const layerLabel    = $('layer-label');
const nodeText      = $('node-text');
const nodeChoices   = $('node-choices');
const endingTextEl  = $('ending-text');
const endingTitleEl = $('ending-title');
const endingSubEl   = $('ending-subtext');
const globalStats   = $('global-stats');
const backBtn       = $('back-btn');
const restartBtn    = $('restart-btn');
const shareBtn      = $('share-btn');

/* ============================================
   STATE
   ============================================ */
let nodeHistory   = [];
let currentNodeId = null;
let currentPortal = null;
let visitedNodes  = new Set();
let currentDepth  = 0;

/* ============================================
   LOOP DETECTION
   ============================================ */
const loopPrefixes = [
  'You have been here before.\n\n',
  'This place again.\n\n',
  'The hole brought you back.\n\n',
  'Familiar. Wrong. Continue.\n\n',
  'Again. The same walls. Different you.\n\n'
];
function getLoopPrefix() {
  return loopPrefixes[Math.floor(Math.random() * loopPrefixes.length)];
}

/* ============================================
   ENDING CODE GENERATOR
   ============================================ */
function generateEndingCode(endingType, pathArr) {
  const seed  = endingType + pathArr.join('');
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  let code = 'RH-';
  let h    = Math.abs(hash);
  for (let i = 0; i < 4; i++) {
    code += chars[h % chars.length];
    h = Math.floor(h / chars.length) + (i * 17);
  }
  return code;
}

/* ============================================
   RESULT CARD — polished canvas generation
   ============================================ */
const FLAVOUR = {
  survived:  'The path that resists is the only honest one.',
  consumed:  'Some paths only go one way.',
  supposed:  'The hole chose you before you chose it.',
  alone:     'Every parallel version stopped. Except you.',
  waited:    'The list of those who wait is the longest list in the hole.',
  floor:     'Under every decision was another. All the way down.',
  looping:   'The rabbit hole does not end. It simply restarts.',
  quiet:     'Some people avoid the quiet their whole lives.',
  leaving:   'Not everyone comes back different. You did.',
  observer:  'You did not enter the rabbit hole. It entered you.',
  hollow:    'You were always a moment too late. Or exactly on time.',
  named:     'Something is being written below your name right now.',
  free:      'The exit was always there. You had to go deep enough.',
  npcSecret: 'The hole has a memory. Now it remembers you.',
  secret:    'One in thousands follows the exact path.',
  konami:    'Some doors are not in the walls. They are in the fingers.'
};

async function generateResultCard(endingType, endingTitle, code, depth, loopsHit) {
  const W = 960, H = 504;
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // ---- Background ----
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  // Subtle noise texture
  for (let i = 0; i < 8000; i++) {
    ctx.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.015) + ')';
    ctx.fillRect(
      Math.random() * W, Math.random() * H, 1, 1
    );
  }

  // ---- Borders ----
  ctx.strokeStyle = '#111';
  ctx.lineWidth   = 1;
  ctx.strokeRect(16, 16, W - 32, H - 32);
  ctx.strokeStyle = '#0a0a0a';
  ctx.strokeRect(24, 24, W - 48, H - 48);

  // ---- Top accent bar — gradient ----
  const topGrad = ctx.createLinearGradient(16, 0, W - 16, 0);
  topGrad.addColorStop(0,    '#ff2244');
  topGrad.addColorStop(0.5,  '#00ff99');
  topGrad.addColorStop(1,    '#2244ff');
  ctx.fillStyle = topGrad;
  ctx.fillRect(16, 16, W - 32, 2);

  // ---- Bottom accent ----
  ctx.fillStyle = 'rgba(255,34,68,0.15)';
  ctx.fillRect(16, H - 18, W - 32, 1);

  // ---- Header label ----
  ctx.font      = '11px "Courier New"';
  ctx.fillStyle = 'rgba(0,255,153,0.35)';
  ctx.fillText('[ END TRANSMISSION ]', 44, 58);

  // ---- Ending title ----
  // Glitch shadow layers
  ctx.font      = 'bold 34px "Courier New"';
  ctx.fillStyle = 'rgba(255,34,68,0.3)';
  ctx.fillText(endingTitle, 46, 116);
  ctx.fillStyle = 'rgba(34,68,255,0.3)';
  ctx.fillText(endingTitle, 42, 118);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(endingTitle, 44, 117);

  // ---- Code ----
  ctx.font      = '13px "Courier New"';
  ctx.fillStyle = '#ff2244';
  ctx.fillText(code, 44, 152);

  // ---- Divider ----
  const divGrad = ctx.createLinearGradient(44, 0, W - 44, 0);
  divGrad.addColorStop(0, '#1a1a1a');
  divGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = divGrad;
  ctx.fillRect(44, 170, W - 88, 1);

  // ---- Stats row ----
  ctx.font      = '11px "Courier New"';
  ctx.fillStyle = '#333';
  ctx.fillText(depth    + ' STEPS DEEP',                44,  196);
  ctx.fillText(loopsHit + ' LOOP' + (loopsHit !== 1 ? 'S' : '') + ' HIT', 230, 196);
  ctx.fillText('LAYER 7 REACHED',                       420, 196);

  // ---- Second divider ----
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(44, 208, W - 88, 1);

  // ---- Flavour text ----
  ctx.font      = '12px "Courier New"';
  ctx.fillStyle = '#2a2a2a';
  const flavour = FLAVOUR[endingType] || 'The rabbit hole has no bottom.';
  ctx.fillText(flavour, 44, 238);

  // ---- ASCII rabbit (larger, styled) ----
  ctx.font      = '12px "Courier New"';
  ctx.fillStyle = '#1c1c1c';
  const rabbitLines = ['(\\  /)', '( o.o)', '> ^ <'];
  rabbitLines.forEach((line, i) => ctx.fillText(line, 44, 370 + i * 18));

  // ---- Vertical accent bar ----
  ctx.fillStyle = 'rgba(0,255,153,0.06)';
  ctx.fillRect(W - 120, 44, 1, H - 88);

  // ---- Secret ending special treatment ----
  const isSecret = endingType === 'secret' ||
                   endingType === 'npcSecret' ||
                   endingType === 'konami';
  if (isSecret) {
    // Green glow overlay
    const secretGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W/2);
    secretGrad.addColorStop(0,   'rgba(0,255,153,0.04)');
    secretGrad.addColorStop(1,   'transparent');
    ctx.fillStyle = secretGrad;
    ctx.fillRect(0, 0, W, H);

    // Star badge
    ctx.font      = 'bold 11px "Courier New"';
    ctx.fillStyle = '#00ff99';
    ctx.fillText('★ SECRET ENDING', W - 170, 70);
  }

  // ---- Watermark ----
  ctx.font      = '10px "Courier New"';
  ctx.fillStyle = '#111';
  ctx.textAlign = 'right';
  ctx.fillText('kynaruniverse.github.io/enter-the-rabbit-hole', W - 44, H - 38);
  ctx.textAlign = 'left';

  return canvas;
}

/* ============================================
   IN-PAGE RESULT CARD PREVIEW
   Renders a DOM card below ending text
   so the user sees something beautiful
   before downloading/sharing
   ============================================ */
function renderCardPreview(endingType, endingTitle, code, depth, loopsHit) {
  const existing = document.getElementById('result-card-preview');
  if (existing) existing.remove();

  const card = document.createElement('div');
  card.id = 'result-card-preview';
  card.className = 'result-card-preview';

  const flavour = FLAVOUR[endingType] || 'The rabbit hole has no bottom.';
  const isSecret = endingType === 'secret' ||
                   endingType === 'npcSecret' ||
                   endingType === 'konami';

  if (isSecret) {
    card.style.borderTopColor = '#00ff99';
    card.style.boxShadow = '0 0 30px rgba(0,255,153,0.08)';
  }

  card.innerHTML =
    '<p class="rcp-label">[ END TRANSMISSION ]</p>' +
    '<p class="rcp-title">' + endingTitle + '</p>' +
    '<p class="rcp-code">' + code + '</p>' +
    '<div class="rcp-divider"></div>' +
    '<div class="rcp-stats">' +
      '<span>' + depth + ' STEPS DEEP</span>' +
      '<span>' + loopsHit + ' LOOP' + (loopsHit !== 1 ? 'S' : '') + '</span>' +
      '<span>LAYER 7</span>' +
    '</div>' +
    '<div class="rcp-divider"></div>' +
    '<p class="rcp-flavour">' + flavour + '</p>' +
    '<p class="rcp-watermark">🐇 kynaruniverse.github.io/enter-the-rabbit-hole</p>';

  // Insert after ending-capture
  const capture = document.getElementById('ending-capture');
  if (capture) capture.after(card);
  else endingPage.prepend(card);
}

/* ============================================
   PAGE SWITCHING
   ============================================ */
function showPage(pageEl) {
  [landingPage, nodePage, endingPage].forEach(p => p.classList.add('hidden'));
  pageEl.classList.remove('hidden');
  soundTransition();
}

function showLanding() {
  resetPath();
  resetNPCState();
  nodeHistory   = [];
  currentNodeId = null;
  currentPortal = null;
  visitedNodes  = new Set();
  currentDepth  = 0;

  applyMemoryToLanding();
  maybePromptName();
  renderLandingStats();
  maybeShowFourthPortal();
  injectJournalButton();
  injectAudioToggle();
  startAmbient();
  showPage(landingPage);
}

function showNode(node) {
  const wasVisited = visitedNodes.has(node.id);
  currentDepth     = nodeHistory.length + 1;
  recordDeepestLayer(node.layer);

  layerLabel.textContent = '[ layer ' + node.layer + ' ]';

  if (wasVisited || node.isDeadEnd) {
    nodeText.textContent = getLoopPrefix() + node.text;
    soundDeadEnd();
  } else {
    nodeText.textContent = node.text;
  }

  visitedNodes.add(node.id);
  nodeChoices.innerHTML = '';

  node.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.textContent = choice.text;
    btn.addEventListener('click', async () => {
      setChoicesDisabled(true);
      soundForEffect(choice.effect);
      await triggerEffect(choice.effect);
      await maybeShowNPC(node.layer);
      navigateTo(choice.next);
    });
    nodeChoices.appendChild(btn);
  });

  nodeChoices.classList.add('choices');
  backBtn.style.display = nodeHistory.length > 0 ? 'block' : 'none';

  // Timer for pressure nodes
  setTimeout(() => maybeStartTimer(node), 100);

  showPage(nodePage);
}

function showEnding(node) {
  // NPC secret ending check
  if (
    node.id !== 98 && node.id !== 99 && node.id !== 100 &&
    getNPCState().count >= 1 && Math.random() < 0.45
  ) {
    const npcNode = nodes.find(n => n.id === 98);
    if (npcNode) { currentNodeId = 98; _renderEnding(npcNode); return; }
  }
  _renderEnding(node);
}

function _renderEnding(node) {
  const depth    = nodeHistory.length + 1;
  const loopsHit = nodeHistory.filter(
    id => nodes.find(n => n.id === id && n.isDeadEnd)
  ).length;
  const code = generateEndingCode(node.endingType, nodeHistory);

  // Local record
  recordEndingReached(node.endingType);
  recordEndingFound(node.endingType);
  if (node.endingType === 'konami') recordKonamiFound();

  // Global record (async — fire and forget)
  if (typeof globalRecordEnding === 'function') {
    globalRecordEnding(node.endingType, depth, loopsHit);
  }

  // Render ending text
  endingTextEl.textContent  = node.text;
  endingTitleEl.textContent = node.title   || '';
  endingSubEl.textContent   = node.subtext || '';

  // Ending code
  let codeEl = $('ending-code');
  if (!codeEl) {
    codeEl = document.createElement('p');
    codeEl.id = 'ending-code';
    codeEl.style.cssText = [
      'font-size: 0.75rem',
      'color: #ff2244',
      'letter-spacing: 0.25em',
      'margin-top: 10px',
      'font-family: Courier New, monospace'
    ].join(';');
    endingSubEl.after(codeEl);
  }
  codeEl.textContent = 'YOUR CODE: ' + code;

  // Depth
  let depthEl = $('ending-depth');
  if (!depthEl) {
    depthEl = document.createElement('p');
    depthEl.id = 'ending-depth';
    depthEl.style.cssText = [
      'font-size: 0.6rem',
      'color: #2a2a2a',
      'letter-spacing: 0.12em',
      'margin-top: 6px',
      'font-family: Courier New, monospace'
    ].join(';');
    codeEl.after(depthEl);
  }
  depthEl.textContent = depth + ' steps deep' +
    (loopsHit > 0 ? '  ·  ' + loopsHit + ' loop' + (loopsHit > 1 ? 's' : '') + ' hit' : '');

  // In-page card preview
  renderCardPreview(node.endingType, node.title || '', code, depth, loopsHit);

  // Local stats bar
  renderEndingStats(node.endingType);

  // Audio + cursor
  const isSecret = node.endingType === 'secret' ||
                   node.endingType === 'npcSecret' ||
                   node.endingType === 'konami';

  if (isSecret) {
    globalStats.style.color    = '#00ff99';
    globalStats.style.fontSize = '0.9rem';
    setTimeout(() => {
      triggerEffect('colorShiftFast');
      soundSecretEnding();
      if (typeof cursorReactSecret === 'function') cursorReactSecret();
    }, 300);
  } else {
    globalStats.style.color    = '#444';
    globalStats.style.fontSize = '0.75rem';
    setTimeout(() => {
      soundEnding();
      if (typeof cursorReactEnding === 'function') cursorReactEnding();
    }, 300);
  }

  // Store metadata for share
  endingPage.dataset.code        = code;
  endingPage.dataset.depth       = depth;
  endingPage.dataset.loops       = loopsHit;
  endingPage.dataset.endingType  = node.endingType;
  endingPage.dataset.endingTitle = node.title || '';

  showPage(endingPage);
}

/* ============================================
   NAVIGATION
   ============================================ */
function navigateTo(nodeId) {
  recordPath(nodeId);

  if (checkRareSequence()) {
    const s = nodes.find(n => n.id === 99);
    if (s) { currentNodeId = 99; showEnding(s); return; }
  }

  const node = nodes.find(n => n.id === nodeId);
  if (!node) { console.warn('Node not found:', nodeId); return; }

  if (currentNodeId !== null) nodeHistory.push(currentNodeId);
  currentNodeId = nodeId;

  node.ending ? showEnding(node) : showNode(node);
}

function goBack() {
  if (nodeHistory.length === 0) { showLanding(); return; }
  const prevId  = nodeHistory.pop();
  currentNodeId = prevId;
  const node    = nodes.find(n => n.id === prevId);
  if (node) showNode(node);
}

/* ============================================
   FOURTH PORTAL
   ============================================ */
function maybeShowFourthPortal() {
  const mem        = getMemory();
  const shouldShow = Math.random() < 0.10 ||
    (mem.visits >= 3 && !mem.fourthPortalSeen && Math.random() < 0.3);

  if (!shouldShow) return;
  recordFourthPortalSeen();

  const choices = document.querySelector('#landing .choices');
  if (!choices || $('fourth-portal')) return;

  const btn = document.createElement('button');
  btn.id = 'fourth-portal';
  btn.className = 'portal-btn fourth-portal';
  btn.dataset.next   = '9';
  btn.dataset.effect = 'screenInvert';

  const icon = document.createElement('span');
  icon.className = 'portal-icon'; icon.textContent = '🌀';
  const label = document.createElement('span');
  label.className = 'portal-label'; label.textContent = '??? ??? ???';

  btn.appendChild(icon);
  btn.appendChild(label);
  choices.appendChild(btn);

  btn.style.opacity = '0';
  let flickers = 0;
  const flicker = setInterval(() => {
    btn.style.opacity = btn.style.opacity === '0' ? '1' : '0';
    if (++flickers > 6) { clearInterval(flicker); btn.style.opacity = '1'; }
  }, 120);

  btn.addEventListener('click', async () => {
    currentPortal = 'fourth';
    recordPortalPick('fourth');
    if (typeof globalRecordRun === 'function') globalRecordRun('fourth');
    document.querySelectorAll('#landing .choices button').forEach(b => b.disabled = true);
    soundGlitch();
    await triggerEffect('screenInvert');
    document.querySelectorAll('#landing .choices button').forEach(b => b.disabled = false);
    navigateTo(9);
  });
}

/* ============================================
   LANDING PORTAL BUTTONS
   ============================================ */
const portalMap = { '1': 'red', '2': 'blue', '3': 'gap' };

document.querySelectorAll('#landing .choices button:not(#fourth-portal)').forEach(btn => {
  btn.addEventListener('click', async () => {
    currentPortal = portalMap[btn.dataset.next] || 'red';
    recordPortalPick(currentPortal);

    // Global stat — record run
    if (typeof globalRecordRun === 'function') {
      globalRecordRun(currentPortal);
    }

    document.querySelectorAll('#landing .choices button').forEach(b => b.disabled = true);
    soundForEffect(btn.dataset.effect);
    await triggerEffect(btn.dataset.effect);
    document.querySelectorAll('#landing .choices button').forEach(b => b.disabled = false);
    navigateTo(parseInt(btn.dataset.next, 10));
  });
});

/* ============================================
   NPC ENCOUNTER HOOK — cursor reaction
   Patch maybeShowNPC to react cursor
   ============================================ */
const _origMaybeShowNPC = maybeShowNPC;
window.maybeShowNPC = async function(layerNumber) {
  const result = await _origMaybeShowNPC(layerNumber);
  if (getNPCState().count > 0 && typeof cursorReactNPC === 'function') {
    cursorReactNPC();
  }
  return result;
};

/* ============================================
   KONAMI CODE
   ============================================ */
const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a'
];
let konamiProgress = 0;

document.addEventListener('keydown', e => {
  if (e.key === KONAMI[konamiProgress]) {
    konamiProgress++;
    soundClick();
    if (konamiProgress === KONAMI.length) {
      konamiProgress = 0;
      soundKonami();
      setTimeout(() => {
        const kNode = nodes.find(n => n.id === 100);
        if (kNode) { currentNodeId = 100; _renderEnding(kNode); }
      }, 600);
    }
  } else {
    konamiProgress = 0;
  }
});

/* ============================================
   BACK + RESTART
   ============================================ */
backBtn.addEventListener('click', goBack);
restartBtn.addEventListener('click', showLanding);

/* ============================================
   SHARE — polished result card
   ============================================ */
shareBtn.addEventListener('click', handleShare);

async function handleShare() {
  const code   = endingPage.dataset.code        || 'RH-????';
  const depth  = parseInt(endingPage.dataset.depth)  || 0;
  const loops  = parseInt(endingPage.dataset.loops)  || 0;
  const eType  = endingPage.dataset.endingType  || '';
  const eTitle = endingPage.dataset.endingTitle || 'THE RABBIT HOLE';

  shareBtn.textContent = '📸 Generating...';
  shareBtn.disabled    = true;

  try {
    const canvas = await generateResultCard(eType, eTitle, code, depth, loops);

    if (navigator.canShare) {
      canvas.toBlob(async blob => {
        const file = new File([blob], 'rabbit-hole.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Enter the Rabbit Hole',
              text:  'I reached "' + eTitle + '" — code: ' + code +
                     ' — ' + depth + ' steps deep. Can you beat it? 🐇'
            });
            resetShareBtn(); return;
          } catch { /* fall through */ }
        }
        triggerDownload(canvas, eTitle);
      });
    } else {
      triggerDownload(canvas, eTitle);
    }
  } catch (err) {
    console.error('Card error:', err);
    fallbackShare(eTitle, code, depth);
  }
}

function triggerDownload(canvas, eTitle) {
  const slug = eTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const link = document.createElement('a');
  link.download = 'rabbit-hole-' + slug + '.png';
  link.href     = canvas.toDataURL('image/png');
  link.click();
  shareBtn.textContent = '✓ Saved! Share it.';
  setTimeout(resetShareBtn, 2500);
}

function fallbackShare(eTitle, code, depth) {
  const text = [
    'I reached "' + eTitle + '" in Enter the Rabbit Hole.',
    'Code: ' + code + '  ·  ' + depth + ' steps deep.',
    'Can you find all 16 endings? 🐇',
    'kynaruniverse.github.io/enter-the-rabbit-hole/about.html'
  ].join('\n');
  if (navigator.share) {
    navigator.share({ title: 'Enter the Rabbit Hole', text })
      .then(resetShareBtn)
      .catch(() => copyToClipboard(text));
  } else {
    copyToClipboard(text);
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    shareBtn.textContent = '✓ Copied!';
    setTimeout(resetShareBtn, 2500);
  }).catch(() => {
    shareBtn.textContent = '✗ Share manually';
    setTimeout(resetShareBtn, 3000);
  });
}

function resetShareBtn() {
  shareBtn.textContent = '📸 Share Card';
  shareBtn.disabled    = false;
}

/* ============================================
   UTILITY
   ============================================ */
function setChoicesDisabled(disabled) {
  document.querySelectorAll('#node-choices button')
    .forEach(btn => btn.disabled = disabled);
}

/* ============================================
   PRESSURE TIMER
   ============================================ */
const TIMED_NODE_IDS = new Set([7, 13, 22, 36, 42]);
let activeTimer = null;

function maybeStartTimer(node) {
  clearActiveTimer();
  if (!TIMED_NODE_IDS.has(node.id)) return;

  const timerEl = $('pressure-timer') || createTimerEl();
  let remaining = 15;
  timerEl.textContent   = '[ ' + remaining + 's ]';
  timerEl.style.color   = '#444';
  timerEl.style.display = 'block';

  activeTimer = setInterval(() => {
    remaining--;
    timerEl.textContent = '[ ' + remaining + 's ]';
    if (remaining <= 5) { timerEl.style.color = '#ff2244'; soundGlitch(); }
    if (remaining <= 0) {
      clearActiveTimer();
      const btns = document.querySelectorAll('#node-choices button:not([disabled])');
      if (btns.length > 0) {
        const forced = btns[Math.floor(Math.random() * btns.length)];
        timerEl.textContent = '[ THE HOLE CHOSE ]';
        setTimeout(() => forced.click(), 600);
      }
    }
  }, 1000);
}

function clearActiveTimer() {
  if (activeTimer) { clearInterval(activeTimer); activeTimer = null; }
  const timerEl = $('pressure-timer');
  if (timerEl) timerEl.style.display = 'none';
}

function createTimerEl() {
  const el = document.createElement('p');
  el.id = 'pressure-timer';
  el.style.cssText = [
    'font-size: 0.7rem',
    'letter-spacing: 0.2em',
    'margin-top: 16px',
    'display: none',
    'transition: color 0.3s',
    'font-family: Courier New, monospace'
  ].join(';');
  const ni = document.querySelector('.node-inner');
  if (ni) ni.appendChild(el);
  return el;
}

/* ============================================
   AMBIENT ASCII BACKGROUND
   ============================================ */
(function ambientBackground() {
  const chars  = '░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀';
  const cvs    = document.createElement('canvas');
  cvs.style.cssText = [
    'position: fixed', 'inset: 0',
    'pointer-events: none', 'z-index: 0', 'opacity: 0.025'
  ].join(';');
  document.body.insertBefore(cvs, document.body.firstChild);

  const particles = [];
  function resize() { cvs.width = window.innerWidth; cvs.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 35; i++) {
    particles.push({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      speed: 0.15 + Math.random() * 0.4,
      char:  chars[Math.floor(Math.random() * chars.length)],
      size:  10 + Math.floor(Math.random() * 8),
      timer: Math.floor(Math.random() * 120)
    });
  }

  const ctx2 = cvs.getContext('2d');
  function draw() {
    ctx2.clearRect(0, 0, cvs.width, cvs.height);
    ctx2.fillStyle = '#ffffff';
    particles.forEach(p => {
      p.y += p.speed;
      if (--p.timer <= 0) {
        p.char  = chars[Math.floor(Math.random() * chars.length)];
        p.timer = 60 + Math.floor(Math.random() * 180);
      }
      if (p.y > cvs.height + 20) { p.y = -20; p.x = Math.random() * cvs.width; }
      ctx2.font = p.size + 'px "Courier New"';
      ctx2.fillText(p.char, p.x, p.y);
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============================================
   AMBIENT TITLE GLITCH
   ============================================ */
(function ambientTitleGlitch() {
  const title = $('glitch-title');
  if (!title) return;
  function randomGlitch() {
    title.style.opacity = '0.7';
    setTimeout(() => title.style.opacity = '1', 80);
    setTimeout(() => { title.style.opacity = '0.85'; setTimeout(() => title.style.opacity = '1', 50); }, 150);
    setTimeout(randomGlitch, 3000 + Math.random() * 7000);
  }
  setTimeout(randomGlitch, 2000);
})();

/* ============================================
   DAILY SEED
   ============================================ */
(function applySeed() {
  const now  = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const rng  = n => ((seed * 9301 + n * 49297) % 233280) / 233280;

  if (typeof NPC_ROSTER !== 'undefined') {
    NPC_ROSTER.forEach((npc, i) => {
      npc.chance = Math.min(0.45, Math.max(0.05, npc.chance + (rng(i) - 0.5) * 0.1));
    });
  }

  const msgs = [
    '[ new paths available today ]',
    '[ the hole is different today ]',
    '[ something shifted overnight ]',
    '[ today\'s seed: ' + seed + ' ]',
    '[ come back tomorrow ]',
    '[ patterns change with the date ]',
    '[ the hole remembers yesterday ]'
  ];

  window.addEventListener('DOMContentLoaded', () => {
    const warn = document.querySelector('#landing .warning-text');
    if (!warn) return;
    const el = document.createElement('p');
    el.style.cssText = [
      'font-size: 0.6rem', 'color: #1a1a1a',
      'letter-spacing: 0.15em', 'margin-top: 6px',
      'font-family: Courier New, monospace'
    ].join(';');
    el.textContent = msgs[seed % msgs.length];
    warn.after(el);
  });
})();

/* ============================================
   INIT
   ============================================ */
showLanding();
