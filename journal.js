/* ============================================
   ENTER THE RABBIT HOLE — journal.js
   Phase A/B: Collectible Ending Journal

   Tracks all endings found.
   Shows redacted entries for unfound ones.
   Accessible via J key or journal button.
   ============================================ */

'use strict';

/* ============================================
   JOURNAL ENTRY DEFINITIONS
   All endings + their journal descriptions
   ============================================ */

const JOURNAL_ENTRIES = [
  {
    endingType:  'survived',
    title:       'YOU SURVIVED',
    layer:       '[ LAYER 7 ]',
    description: 'The path that resists is the only honest one. You burned through it anyway.'
  },
  {
    endingType:  'consumed',
    title:       'CONSUMED',
    layer:       '[ LAYER 7 ]',
    description: 'Some paths only go one way. You found the one that kept you.'
  },
  {
    endingType:  'supposed',
    title:       'YOU WERE SUPPOSED TO',
    layer:       '[ LAYER 7 ]',
    description: 'The hole chose you before you chose it. It is grateful. In whatever way holes can be.'
  },
  {
    endingType:  'alone',
    title:       'THE ONLY ONE',
    layer:       '[ LAYER 7 ]',
    description: 'Every parallel version stopped somewhere. Except you. You were always going to finish.'
  },
  {
    endingType:  'waited',
    title:       'THE ONE WHO WAITED',
    layer:       '[ LAYER 7 ]',
    description: 'The list of those who wait is the longest list in the hole.'
  },
  {
    endingType:  'floor',
    title:       'THE FLOOR OF DECISIONS',
    layer:       '[ LAYER 7 ]',
    description: 'Under every decision was another. All the way down to the first: to enter.'
  },
  {
    endingType:  'looping',
    title:       'THE LOOP',
    layer:       '[ LAYER 7 ]',
    description: 'The rabbit hole does not end. It simply restarts.'
  },
  {
    endingType:  'quiet',
    title:       'THE QUIET THING',
    layer:       '[ LAYER 7 ]',
    description: 'Some people spend their whole lives avoiding the quiet. You walked toward it.'
  },
  {
    endingType:  'leaving',
    title:       'THE LEAVING',
    layer:       '[ LAYER 7 ]',
    description: 'Not everyone who reaches the bottom comes back different. You did.'
  },
  {
    endingType:  'observer',
    title:       'THE OBSERVER',
    layer:       '[ LAYER 7 ]',
    description: 'You did not enter the rabbit hole. The rabbit hole entered you.'
  },
  {
    endingType:  'hollow',
    title:       'THE HOLLOW',
    layer:       '[ LAYER 7 ]',
    description: 'You were always a moment too late. Or exactly on time. It\'s the same thing.'
  },
  {
    endingType:  'named',
    title:       'YOUR NAME IS ON THE LIST',
    layer:       '[ LAYER 7 ]',
    description: 'Something is being written below your name right now.'
  },
  {
    endingType:  'free',
    title:       'ESCAPE',
    layer:       '[ LAYER 7 ]',
    description: 'The exit was always there. You had to go deep enough to find it.'
  },
  {
    endingType:  'npcSecret',
    title:       '█████████████',
    layer:       '[ ??? ]',
    description: 'The NPCs are not characters. They are residue.',
    isSecret:    true
  },
  {
    endingType:  'secret',
    title:       '< CLASSIFIED >',
    layer:       '[ ??? ]',
    description: 'You followed the exact path. One in thousands does.',
    isSecret:    true
  },
  {
    endingType:  'konami',
    title:       '▓▓▓▓▓▓▓▓▓▓▓▓',
    layer:       '[ ??? ]',
    description: 'Some doors are not in the walls.',
    isSecret:    true
  }
];

/* ============================================
   RENDER JOURNAL MODAL
   ============================================ */

function showJournal() {
  if (typeof getMemory !== 'function') return;
  const mem      = getMemory();
  const found    = mem.endingsFound || [];
  const total    = JOURNAL_ENTRIES.length;
  const foundCount = found.length;

  // Overlay
  const overlay = document.createElement('div');
  overlay.id = 'journal-overlay';
  overlay.style.cssText = [
    'position: fixed',
    'inset: 0',
    'background: rgba(0,0,0,0.97)',
    'z-index: 1005',
    'display: flex',
    'flex-direction: column',
    'font-family: Courier New, monospace',
    'animation: npcFadeIn 0.3s ease',
    'overflow-y: auto'
  ].join(';');

  // Header
  const isMobileHeader = window.matchMedia('(pointer: coarse)').matches;
  const header = document.createElement('div');
  header.style.cssText = [
    'padding: ' + (isMobileHeader ? '20px 16px 14px' : '28px 24px 16px'),
    'border-bottom: 1px solid #1a1a1a',
    'position: sticky',
    'top: 0',
    'background: #000',
    'z-index: 1'
  ].join(';');

  const headerTop = document.createElement('div');
  headerTop.style.cssText = 'display:flex; justify-content:space-between; align-items:center;';

  const title = document.createElement('p');
  title.textContent = '[ ENDING JOURNAL ]';
  title.style.cssText = [
    'font-size: 0.7rem',
    'color: #00ff99',
    'letter-spacing: 0.25em'
  ].join(';');

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '[ CLOSE ]';
  closeBtn.style.cssText = [
    'background: transparent',
    'border: none',
    'color: #444',
    'font-family: Courier New, monospace',
    'font-size: 0.65rem',
    'letter-spacing: 0.15em',
    'cursor: pointer'
  ].join(';');
  closeBtn.addEventListener('click', () => overlay.remove());
  closeBtn.addEventListener('mouseover', () => closeBtn.style.color = '#fff');
  closeBtn.addEventListener('mouseout',  () => closeBtn.style.color = '#444');

  const progress = document.createElement('p');
  progress.textContent = `${foundCount} / ${total} ENDINGS FOUND`;
  progress.style.cssText = [
    'font-size: 0.6rem',
    'color: #333',
    'letter-spacing: 0.15em',
    'margin-top: 8px'
  ].join(';');

  // Progress bar
  const track = document.createElement('div');
  track.style.cssText = [
    'width: 100%',
    'height: 2px',
    'background: #111',
    'margin-top: 10px',
    'border-radius: 1px',
    'overflow: hidden'
  ].join(';');
  const fill = document.createElement('div');
  fill.style.cssText = [
    'height: 100%',
    'width: ' + Math.round((foundCount / total) * 100) + '%',
    'background: #00ff99',
    'transition: width 0.8s ease'
  ].join(';');
  track.appendChild(fill);

  headerTop.appendChild(title);
  headerTop.appendChild(closeBtn);
  header.appendChild(headerTop);
  header.appendChild(progress);
  header.appendChild(track);

  // Entries
  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  const list = document.createElement('div');
  list.style.cssText = [
    'padding: ' + (isMobile ? '12px 16px 60px' : '16px 24px 40px'),
    'display: flex',
    'flex-direction: column',
    'gap: ' + (isMobile ? '10px' : '12px'),
    'max-width: 640px',
    'width: 100%',
    'margin: 0 auto'
  ].join(';');

  let secretDividerAdded = false;
  JOURNAL_ENTRIES.forEach(entry => {
    // Insert divider before first secret entry
    if (entry.isSecret && !secretDividerAdded) {
      secretDividerAdded = true;
      const divider = document.createElement('div');
      divider.style.cssText = [
        'border-top: 1px solid #0d0d0d',
        'padding-top: 14px',
        'font-size: 0.52rem',
        'color: #1a1a1a',
        'letter-spacing: 0.2em'
      ].join(';');
      divider.textContent = '[ ??? — CLASSIFIED ENTRIES ]';
      list.appendChild(divider);
    }

    const isFound = found.includes(entry.endingType);
    const card    = document.createElement('div');

    card.style.cssText = [
      'border: 1px solid ' + (isFound ? '#222' : '#0d0d0d'),
      'padding: 14px 18px',
      'transition: border-color 0.2s'
    ].join(';');

    if (isFound) {
      card.addEventListener('mouseover',  () => card.style.borderColor = '#333');
      card.addEventListener('mouseout',   () => card.style.borderColor = '#222');
      card.addEventListener('touchstart', () => card.style.borderColor = '#444', { passive: true });
      card.addEventListener('touchend',   () => {
        setTimeout(() => card.style.borderColor = '#222', 300);
      }, { passive: true });
    }

    const onMobile = window.matchMedia('(pointer: coarse)').matches;
    const cardTitle = document.createElement('p');
    cardTitle.style.cssText = [
      'font-size: ' + (onMobile ? '0.85rem' : '0.75rem'),
      'letter-spacing: 0.15em',
      'margin-bottom: 4px',
      'color: ' + (isFound ? (entry.isSecret ? '#00ff99' : '#ffffff') : '#1a1a1a')
    ].join(';');
    cardTitle.textContent = isFound ? entry.title : '█'.repeat(entry.title.length).replace(/(.{4})/g, '$1 ').trim();

    const cardLayer = document.createElement('p');
    cardLayer.style.cssText = [
      'font-size: 0.6rem',
      'letter-spacing: 0.2em',
      'color: ' + (isFound ? '#333' : '#111'),
      'margin-bottom: 6px'
    ].join(';');
    cardLayer.textContent = isFound ? entry.layer : '[ ??? ]';

    const cardDesc = document.createElement('p');
    cardDesc.style.cssText = [
      'font-size: ' + (onMobile ? '0.82rem' : '0.75rem'),
      'color: ' + (isFound ? '#666' : '#151515'),
      'line-height: 1.7',
      'letter-spacing: 0.03em'
    ].join(';');
    cardDesc.textContent = isFound
      ? entry.description
      : '██████ ████ ████████ ██████ ██████████ ████.';

    card.appendChild(cardTitle);
    card.appendChild(cardLayer);
    card.appendChild(cardDesc);
    list.appendChild(card);
  });

  // Mobile swipe-down to close
  const onMobileSwipe = window.matchMedia('(pointer: coarse)').matches;
  if (onMobileSwipe) {
    // Visual drag handle at top
    const handle = document.createElement('div');
    handle.style.cssText = [
      'width: 36px',
      'height: 3px',
      'background: #222',
      'border-radius: 2px',
      'margin: 10px auto 0',
      'flex-shrink: 0'
    ].join(';');
    overlay.insertBefore(handle, overlay.firstChild);

    // Swipe detection
    let touchStartY = 0;
    overlay.addEventListener('touchstart', e => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    overlay.addEventListener('touchmove', e => {
      const delta = e.touches[0].clientY - touchStartY;
      if (delta > 0 && overlay.scrollTop === 0) {
        overlay.style.transform = 'translateY(' + Math.min(delta * 0.4, 80) + 'px)';
        overlay.style.transition = 'none';
      }
    }, { passive: true });
    overlay.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].clientY - touchStartY;
      overlay.style.transition = 'transform 0.2s ease';
      if (delta > 80 && overlay.scrollTop === 0) {
        overlay.style.transform = 'translateY(100%)';
        setTimeout(() => overlay.remove(), 220);
      } else {
        overlay.style.transform = 'translateY(0)';
      }
    }, { passive: true });
  }

  // Bottom close button — big tap target for mobile
  const bottomClose = document.createElement('button');
  bottomClose.textContent = '[ CLOSE JOURNAL ]';
  bottomClose.style.cssText = [
    'display: block',
    'width: calc(100% - 32px)',
    'margin: 0 16px 32px',
    'padding: 16px',
    'background: transparent',
    'border: 1px solid #1a1a1a',
    'color: #333',
    'font-family: Courier New, monospace',
    'font-size: 0.7rem',
    'letter-spacing: 0.15em',
    'cursor: pointer',
    'min-height: 44px'
  ].join(';');
  bottomClose.addEventListener('click', () => overlay.remove());
  bottomClose.addEventListener('touchend', (e) => {
    e.preventDefault();
    overlay.remove();
  });
  list.appendChild(bottomClose);

  overlay.appendChild(header);
  overlay.appendChild(list);
  document.body.appendChild(overlay);
  overlay.scrollTop = 0;
  document.body.style.overflow = 'hidden';

  // Restore scroll when journal closes
  const origClose = closeBtn.onclick;
  function closeAndRestore() {
    document.body.style.overflow = '';
    overlay.remove();
  }
  closeBtn.removeEventListener('click', () => overlay.remove());
  closeBtn.addEventListener('click', closeAndRestore);
}

/* ============================================
   JOURNAL BUTTON — injected into landing page
   ============================================ */

function injectJournalButton() {
  if (document.getElementById('journal-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'journal-btn';

  function updateJournalBtnLabel() {
    if (typeof getMemory !== 'function') { btn.textContent = '[ J ] Journal'; return; }
    const found = (getMemory().endingsFound || []).length;
    btn.textContent = '[ J ] Journal  ' + found + '/16';
  }
  updateJournalBtnLabel();
  window._updateJournalBtn = updateJournalBtnLabel;
  const isMobileDevice = window.matchMedia('(pointer: coarse)').matches;
  btn.style.cssText = [
    'position: fixed',
    'bottom: 20px',
    'right: 20px',
    'background: transparent',
    'border: 1px solid #1a1a1a',
    'color: #333',
    'font-family: Courier New, monospace',
    'font-size: ' + (isMobileDevice ? '0.75rem' : '0.65rem'),
    'letter-spacing: 0.12em',
    'padding: ' + (isMobileDevice ? '12px 18px' : '8px 14px'),
    'cursor: pointer',
    'z-index: 500',
    'min-height: 44px',
    'min-width: 44px',
    'display: flex',
    'align-items: center',
    'transition: border-color 0.2s, color 0.2s'
  ].join(';');

  btn.addEventListener('mouseover', () => {
    btn.style.borderColor = '#00ff99';
    btn.style.color       = '#00ff99';
  });
  btn.addEventListener('mouseout', () => {
    btn.style.borderColor = '#1a1a1a';
    btn.style.color       = '#333';
  });
  btn.addEventListener('click', showJournal);

  document.body.appendChild(btn);
}

/* Press J to open journal anywhere, Escape to close */
document.addEventListener('keydown', e => {
  if (e.key === 'j' || e.key === 'J') {
    const overlay = document.getElementById('journal-overlay');
    if (overlay) overlay.remove();
    else showJournal();
  }
  if (e.key === 'Escape') {
    const overlay = document.getElementById('journal-overlay');
    if (overlay) overlay.remove();
  }
});
