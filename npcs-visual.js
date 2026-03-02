/* ============================================
   NPC VISUAL SYSTEM
   Renders ASCII art characters
   ============================================ */

const NPC_VISUALS = {
  echo: {
    name: '[ THE ECHO ]',
    art: `
    ░░░░░░░░░
    ░▓███▓░░░
    ░███████░░
    ░▓████▓░░░
    ░░░░▓░░░░░`,
    color: '#00ff99'
  },
  watcher: {
    name: '[ THE WATCHER ]',
    art: `
    ░░░██░░░░░
    ░░█████░░░
    ░█░░░░█░░░
    █░ ◯ ◯ █░░
    █░░███░░█░░
    ░█░░░░█░░░
    ░░█████░░░`,
    color: '#ff2244'
  },
  void: {
    name: '[ THE VOID ]',
    art: `
    ░░░░░░░░░░
    ░░░▓▓▓▓░░░
    ░░▓▓▓▓▓▓░░
    ░▓▓░░░░▓▓░
    ░▓░░░░░░▓░
    ░▓▓░░░░▓▓░
    ░░▓▓▓▓▓▓░░
    ░░░▓▓▓▓░░░`,
    color: '#2244ff'
  }
};

function showNPCVisual(npcType) {
  const visual = NPC_VISUALS[npcType] || NPC_VISUALS.echo;
  const container = document.createElement('div');
  container.style.cssText = `
    text-align: center;
    color: ${visual.color};
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    line-height: 1;
    margin: 20px 0;
    opacity: 0;
    animation: fadeIn 0.8s ease forwards;
    text-shadow: 0 0 10px ${visual.color};
  `;
  container.innerHTML = `
    <div style="margin-bottom: 10px; letter-spacing: 0.2em; font-size: 0.65rem;">
      ${visual.name}
    </div>
    <pre style="margin: 0; display: inline-block;">${visual.art}</pre>
  `;
  
  const nodeText = document.getElementById('node-text');
  nodeText.parentElement.insertBefore(container, nodeText);
  
  return container;
}