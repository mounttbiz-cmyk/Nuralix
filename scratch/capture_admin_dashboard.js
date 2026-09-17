const { execSync } = require('child_process');
const path = require('path');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\dualw\\.gemini\\antigravity-ide\\brain\\76b9049f-81a7-459b-a600-8064b8ad6fea';
const target = path.join(artifactDir, 'superadmin_dashboard.png');

console.log(`Setting session and capturing http://localhost:3000/admin_bridge.html -> ${target}`);
try {
  execSync(
    `"${edge}" --headless --disable-gpu --user-data-dir="C:\\Users\\dualw\\AppData\\Local\\Temp\\edge_tmp_admin" --virtual-time-budget=8000 --window-size=1400,900 "--screenshot=${target}" http://localhost:3000/admin_bridge.html`,
    { stdio: 'inherit' }
  );
  console.log('✓ Captured superadmin dashboard');
} catch (err) {
  console.error('Error:', err.message);
}
