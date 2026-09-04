// Inlined into <head> before first paint to prevent any flash of the wrong theme
export const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('nuralix-theme');
    var theme = 'system';
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      theme = stored;
    }
    var resolved = theme;
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
  }
})();
`;
