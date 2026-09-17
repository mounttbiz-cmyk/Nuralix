// Verification script for account-status endpoint and registration ledger
const http = require('http');

async function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log("--- Testing /api/auth/account-status ---");

  // 1. Check unregistered email
  const testEmail = `test_founder_${Date.now()}@example.com`;
  const check1 = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/auth/account-status?email=${encodeURIComponent(testEmail)}`,
    method: 'GET'
  });
  console.log("1. Check new email exists:", check1.body);
  if (check1.body.exists !== false) throw new Error("Expected exists === false for new email");

  // 2. Register email via POST with business profile
  const testBiz = {
    name: "Cyberdyne Systems Corp",
    industry: "saas",
    industryLabel: "B2B SaaS",
    revenue: 950000,
    annualRevenue: 11400000,
    burn: 220000,
    cash: 4500000,
    teamSize: 42,
    completedAt: new Date().toISOString()
  };

  const regRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/auth/account-status`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: testEmail,
    name: "Miles Dyson",
    provider: "password",
    uid: "usr_test_dyson_123",
    businessProfile: testBiz
  });
  console.log("2. Register email result:", regRes.body);
  if (!regRes.body.success) throw new Error("Expected success === true for registration");

  // 3. Re-check registered email exists and returns businessProfile
  const check2 = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/auth/account-status?email=${encodeURIComponent(testEmail)}`,
    method: 'GET'
  });
  console.log("3. Re-check registered email with businessProfile:", check2.body);
  if (check2.body.exists !== true) throw new Error("Expected exists === true for registered email");
  if (!check2.body.businessProfile || check2.body.businessProfile.name !== "Cyberdyne Systems Corp") {
    throw new Error("Expected businessProfile.name === Cyberdyne Systems Corp");
  }
  // 4. Test DELETE account endpoint
  const delRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/auth/account-status?email=${encodeURIComponent(testEmail)}`,
    method: 'DELETE'
  });
  console.log("4. Delete account result:", delRes.body);
  if (!delRes.body.success) throw new Error("Expected success === true for account deletion");

  // 5. Verify deleted account no longer exists
  const check3 = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/auth/account-status?email=${encodeURIComponent(testEmail)}`,
    method: 'GET'
  });
  console.log("5. Re-check deleted account exists:", check3.body);
  if (check3.body.exists !== false) throw new Error("Expected exists === false after account deletion");

  console.log("\n✅ ALL TESTS (INCLUDING BUSINESS PROFILE RETENTION & ACCOUNT DELETION) PASSED SUCCESSFULLY!");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
