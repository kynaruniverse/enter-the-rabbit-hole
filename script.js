/* ============================================
   ENTER THE RABBIT HOLE — script.js
   Phase 4: Main Logic + Stats Wired In

   Load order in index.html:
     1. nodes.js   (data + path tracker)
     2. effects.js (effect engine + helpers)
     3. stats.js   (stats tracking + render)
     4. script.js  (this file — runs last)
   ============================================ */

'use strict';

/* ============================================
   DOM REFERENCES
   ============================================ */
const $ = id => document.getElementById(id);

const landingPage  = $('landing');
const nodePage     = $('node');
const endingPage   = $('ending');

const layerLabel   = $('layer-label');
const nodeText     = $('node-text');
const nodeChoices  = $('node-choices');

const endingTextEl  = $('ending-text');
const endingTitleEl = $('ending-title');
const endingSubEl   = $('ending-subtext');
const globalStats   = $('global-stats');

const backBtn      = $('back-btn');
const restartBtn   = $('restart-btn');
const shareBtn     = $('share-btn');


/* ============================================
   STATE
   ============================================ */
let nodeHistory   = [];
let currentNodeId = null;
let currentPortal = null; // 'red' | 'blue' | 'gap'


/* ============================================
   PAGE SWITCHING
   ============================================ */

function showPage(pageEl) {
  [landingPage, nodePage, endingPage].forEach(p => p.classList.add('hidden'));
  pageEl.classList.remove('hidden');
}

function showLanding() {
  resetPath();
  nodeHistory   = [];
  currentNodeId = null;
  currentPortal = null;
  renderLandingStats();
  showPage(landingPage);
}

function showNode(node) {
  layerLabel.textContent = `[ layer ${node.layer} ]`;
  nodeText.textContent   = node.text;
  nodeChoices.innerHTML  = '';

  node.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.textContent = choice.text;

    btn.addEventListener('click', async () => {
      setChoicesDisabled(true);
      await triggerEffect(choice.effect);
      navigateTo(choice.next);
    });

    nodeChoices.appendChild(btn);
  });

  nodeChoices.classList.add('choices');
  backBtn.style.display = nodeHistory.length > 0 ? 'block' : 'none';
  showPage(nodePage);
}

function showEnding(node) {
  // Record stats before rendering
  recordEndingReached(node.endingType);

  endingTextEl.textContent  = node.text;
  endingTitleEl.textContent = node.title || '';
  endingSubEl.textContent   = node.subtext || '';

  // Render the 3-stat bar
  renderEndingStats(node.endingType);

  // Secret ending extra flair
  if (node.endingType === 'secret') {
    globalStats.style.color    = '#00ff99';
    globalStats.style.fontSize = '0.9rem';
    setTimeout(() => triggerEffect('colorShiftFast'), 300);
  } else {
    globalStats.style.color    = '#444';
    globalStats.style.fontSize = '0.75rem';
  }

  showPage(endingPage);
}


/* ============================================
   NAVIGATION
   ============================================ */

function navigateTo(nodeId) {
  recordPath(nodeId);

  // Check rare sequence first
  if (checkRareSequence()) {
    const secretNode = nodes.find(n => n.id === 99);
    if (secretNode) {
      currentNodeId = 99;
      showEnding(secretNode);
      return;
    }
  }

  const node = nodes.find(n => n.id === nodeId);
  if (!node) {
    console.warn(`Node ${nodeId} not found.`);
    return;
  }

  if (currentNodeId !== null) {
    nodeHistory.push(currentNodeId);
  }

  currentNodeId = nodeId;

  if (node.ending) {
    showEnding(node);
  } else {
    showNode(node);
  }
}

function goBack() {
  if (nodeHistory.length === 0) {
    showLanding();
    return;
  }
  const prevId = nodeHistory.pop();
  currentNodeId = prevId;
  const node = nodes.find(n => n.id === prevId);
  if (node) showNode(node);
}


/* ============================================
   LANDING — portal buttons
   ============================================ */

const portalMap = {
  '1': 'red',
  '2': 'blue',
  '3': 'gap'
};

document.querySelectorAll('#landing .choices button').forEach(btn => {
  btn.addEventListener('click', async () => {
    const effect  = btn.dataset.effect;
    const nextId  = parseInt(btn.dataset.next, 10);

    // Record which portal was picked
    currentPortal = portalMap[btn.dataset.next] || 'red';
    recordPortalPick(currentPortal);

    document.querySelectorAll('#landing .choices button')
      .forEach(b => b.disabled = true);

    await triggerEffect(effect);

    document.querySelectorAll('#landing .choices button')
      .forEach(b => b.disabled = false);

    navigateTo(nextId);
  });
});


/* ============================================
   BACK + RESTART BUTTONS
   ============================================ */

backBtn.addEventListener('click', goBack);
restartBtn.addEventListener('click', showLanding);


/* ============================================
   SHARE BUTTON
   ============================================ */

shareBtn.addEventListener('click', handleShare);

async function handleShare() {
  const captureEl  = $('ending-capture');
  const node       = nodes.find(n => n.id === currentNodeId);
  const endingName = node?.title || 'THE RABBIT HOLE';

  if (typeof html2canvas !== 'undefined') {
    try {
      shareBtn.textContent = '📸 Capturing...';
      shareBtn.disabled    = true;

      const canvas = await html2canvas(captureEl, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
        logging: false
      });

      // Try Web Share API with file (mobile)
      if (navigator.canShare) {
        canvas.toBlob(async blob => {
          const file = new File([blob], 'rabbit-hole.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: 'Enter the Rabbit Hole',
                text: `I reached: "${endingName}" — Can you find the secret ending? 🐇`
              });
              resetShareBtn();
              return;
            } catch { /* fall through to download */ }
          }
          triggerDownload(canvas, endingName);
        });
      } else {
        triggerDownload(canvas, endingName);
      }

    } catch (err) {
      console.error('Screenshot error:', err);
      fallbackShare(endingName);
    }

  } else {
    fallbackShare(endingName);
  }
}

function triggerDownload(canvas, endingName) {
  const slug = endingName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const link = document.createElement('a');
  link.download = `rabbit-hole-${slug}.png`;
  link.href     = canvas.toDataURL('image/png');
  link.click();
  shareBtn.textContent = '✓ Saved! Share it.';
  setTimeout(resetShareBtn, 2500);
}

function fallbackShare(endingName) {
  const text = `I reached "${endingName}" in Enter the Rabbit Hole.\nCan you find the secret ending? 🐇`;
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
    shareBtn.textContent = '✓ Copied to clipboard!';
    setTimeout(resetShareBtn, 2500);
  }).catch(() => {
    shareBtn.textContent = '✗ Copy failed — share manually';
    setTimeout(resetShareBtn, 3000);
  });
}

function resetShareBtn() {
  shareBtn.textContent = '📸 Share Screenshot';
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
   AMBIENT TITLE GLITCH
   ============================================ */

(function ambientTitleGlitch() {
  const title = $('glitch-title');
  if (!title) return;

  function randomGlitch() {
    title.style.opacity = '0.7';
    setTimeout(() => title.style.opacity = '1', 80);
    setTimeout(() => {
      title.style.opacity = '0.85';
      setTimeout(() => title.style.opacity = '1', 50);
    }, 150);
    setTimeout(randomGlitch, 3000 + Math.random() * 7000);
  }

  setTimeout(randomGlitch, 2000);
})();


/* ============================================
   INIT
   ============================================ */
showLanding();
