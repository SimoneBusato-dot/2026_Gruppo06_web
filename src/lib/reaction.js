const colors = {
  heart: '#ff2d55', // Instagram vibrant red
  like: '#1877f2'   // Facebook vibrant blue
};

// Helper to compile self-contained SVG with flat colors for each reaction
export function getReactionSVG(type) {
  const color = colors[type];
  
  if (type === 'heart') {
    return `
      <svg viewBox="0 0 24 24" style="width: 100%; height: 100%; fill: ${color}; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05));">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    `;
  } else {
    return `
      <svg viewBox="0 0 24 24" style="width: 100%; height: 100%; fill: ${color}; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05));">
        <path d="M2 21h4V9H2v12zM20 8h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 1 7.58 6.59C7.22 6.95 7 7.45 7 8v11c0 1.1.9 2 2 2h7c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2z"/>
      </svg>
    `;
  }
}

// Create and animate a single floating reaction (rendered on top of all layers)
// Can be spawned relative to screen baseline or at custom coordinates (e.g. click/tap)
export function createReaction(numberWidth, isBurst = false, spawnX = null, spawnY = null) {
  if (typeof document === 'undefined') return;

  // 50% chance heart, 50% chance like thumb
  const reactionType = Math.random() < 0.5 ? 'heart' : 'like';

  // Scale: sizing variation (background vs foreground)
  const scale = isBurst 
    ? (0.55 + Math.random() * 0.65)
    : (0.7 + Math.random() * 0.4);

  // Rotation: initial tilt
  const rotation = (Math.random() - 0.5) * (isBurst ? 45 : 30);
  
  // Duration: rise speed
  const duration = isBurst 
    ? (0.7 + Math.random() * 0.5) 
    : (1.4 + Math.random() * 0.6);

  // Sway parameters: horizontal oscillation width and frequency
  const swayWidth = 12 + Math.random() * 20; // 12px to 32px
  const swayDuration = 0.6 + Math.random() * 0.6; // 0.6s to 1.2s

  // Drift: how far the reaction drifts horizontally as it rises
  const drift = (Math.random() - 0.5) * (isBurst ? 100 : 60);

  const containerEl = document.createElement('div');
  containerEl.className = 'reaction-container';
  
  // Position: use custom coordinate if provided (from click/tap), otherwise calculate scroll baseline spawn
  if (spawnX !== null && spawnY !== null) {
    containerEl.style.left = `${spawnX}px`;
    containerEl.style.top = `${spawnY}px`;
  } else {
    const randomX = (Math.random() - 0.5) * (numberWidth * 0.95);
    const randomY = (Math.random() - 0.5) * (isBurst ? 30 : 20);
    containerEl.style.left = `calc(50% + ${randomX}px)`;
    containerEl.style.top = `calc(50% + ${randomY}px)`;
  }

  containerEl.style.setProperty('--drift', `${drift}px`);
  containerEl.style.setProperty('--scale', scale);
  containerEl.style.setProperty('--rotation', `${rotation}deg`);
  containerEl.style.animationDuration = `${duration}s`;

  const swayEl = document.createElement('div');
  swayEl.className = 'reaction-sway';
  swayEl.style.setProperty('--sway-width', `${swayWidth}px`);
  swayEl.style.animationDuration = `${swayDuration}s`;

  // Fill with the flat color SVG content
  swayEl.innerHTML = getReactionSVG(reactionType);

  containerEl.appendChild(swayEl);
  // Append to insulated container to avoid layout thrashing the entire page
  const isClick = (spawnX !== null && spawnY !== null);
  const containerId = isClick ? 'click-reactions-container' : 'reactions-container';

  let reactionsContainer = document.getElementById(containerId);
  if (!reactionsContainer) {
    reactionsContainer = document.createElement('div');
    reactionsContainer.id = containerId;
    document.body.appendChild(reactionsContainer);
  }
  reactionsContainer.appendChild(containerEl);

  // DOM Cleanup after completion
  setTimeout(() => {
    containerEl.remove();
  }, duration * 1000);
}
