const { execSync } = require('child_process');
const path = require('path');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\dualw\\.gemini\\antigravity-ide\\brain\\76b9049f-81a7-459b-a600-8064b8ad6fea';

const pages = [
  { url: 'http://localhost:3000/admin/login', file: 'admin_login.png' }
];

for (const p of pages) {
  const target = path.join(artifactDir, p.file);
  console.log(`Capturing ${p.url} -> ${target}`);
  try {
    execSync(
      `"${edge}" --headless --disable-gpu --user-data-dir="C:\\Users\\dualw\\AppData\\Local\\Temp\\edge_tmp_admin" --virtual-time-budget=6000 --window-size=1280,850 "--screenshot=${target}" ${p.url}`,
      { stdio: 'inherit' }
    );
    console.log(`✓ Saved ${p.file}`);
  } catch (err) {
    console.error(`Error capturing ${p.url}:`, err.message);
  }
}
