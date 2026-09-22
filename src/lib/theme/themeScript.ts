// Inlined into <head> before first paint to prevent any flash of the wrong theme
export const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('bizzpal-theme');
    // BizzPal defaults strictly to Dark theme (Midnight Obsidian & 3D Gold)
    var resolved = 'dark';
    if (stored === 'light') {
      resolved = 'light';
    } else {
      resolved = 'dark';
      if (!stored || stored === 'system') {
        localStorage.setItem('bizzpal-theme', 'dark');
      }
    }
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
    
    var meta = document.querySelector('meta[name="color-scheme"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'color-scheme';
      document.head.appendChild(meta);
    }
    meta.content = resolved;
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  }
})();
`;
