const http = require('http');

const routes = [
  '/',
  '/login',
  '/login?signup=true',
  '/onboarding',
  '/dashboard',
  '/chat',
  '/gaps',
  '/analytics',
  '/reports',
  '/workflows',
  '/automations',
  '/simulator',
  '/strategy',
  '/tasks',
  '/playbooks',
  '/team',
  '/tools',
  '/knowledge',
  '/integrations',
  '/settings/appearance',
  '/settings/tools',
  '/help',
  '/admin',
  '/admin/login',
  '/api/admin/config',
  '/api/business/intake',
  '/api/tasks'
];

async function testRoute(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ path, statusCode: res.statusCode, length: data.length });
      });
    }).on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

async function run() {
  console.log("Starting test across all platform routes...");
  for (const r of routes) {
    const res = await testRoute(r);
    console.log(`${res.statusCode === 200 ? '✓ PASS' : '! STATUS ' + res.statusCode} [${res.statusCode || 'ERR'}] ${res.path} (${res.length || 0} bytes)`);
  }
}

run();
