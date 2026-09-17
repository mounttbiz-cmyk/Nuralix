const http = require('http');

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    }, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(responseBody) });
        } catch(e) {
          resolve({ status: res.statusCode, text: responseBody });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function testAdmin() {
  console.log("Testing GET /api/admin/config...");
  const getRes = await request('GET', '/api/admin/config');
  console.log(`GET status: ${getRes.status}, success: ${getRes.json?.success}, version: ${getRes.json?.data?.version}`);
  console.log(`Website config exists: ${Boolean(getRes.json?.data?.website)}`);
  console.log(`Nav items count: ${getRes.json?.data?.nav?.length}`);
  console.log(`Widgets count: ${getRes.json?.data?.widgets?.length}`);
  console.log(`Tools count: ${getRes.json?.data?.tools?.length}`);

  console.log("\nTesting POST /api/admin/config (nav update test)...");
  const currentNav = getRes.json?.data?.nav || [];
  const postRes = await request('POST', '/api/admin/config', {
    section: 'nav',
    payload: currentNav,
    note: 'Superadmin test save',
    actor: 'TestRunner'
  });
  console.log(`POST status: ${postRes.status}, success: ${postRes.json?.success}, new version: ${postRes.json?.version}`);
}

testAdmin();
