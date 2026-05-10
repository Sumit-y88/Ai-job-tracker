// Test script

async function testBackend() {
  const API = 'http://localhost:5000/api';
  let token = '';
  let jobId = '';
  let coverLetterId = '';
  
  const log = (msg) => console.log(`[TEST] ${msg}`);
  const pass = (msg) => console.log(`✅ PASS: ${msg}`);
  const fail = (msg, err) => {
    console.error(`❌ FAIL: ${msg}`);
    if (err) console.error(err);
  };

  const req = async (method, path, body = null) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    };
    if (body) options.body = JSON.stringify(body);
    
    const res = await fetch(`${API}${path}`, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  };

  log('Starting full backend test...');
  
  // 1. Auth: Register
  const testEmail = `test_${Date.now()}@example.com`;
  try {
    const res = await req('POST', '/auth/register', {
      name: 'Test Runner',
      email: testEmail,
      password: 'Password123!'
    });
    token = res.data.token;
    pass('POST /auth/register');
  } catch (err) {
    fail('POST /auth/register', err);
    return; // Stop if we can't auth
  }

  // 2. Auth: Login
  try {
    const res = await req('POST', '/auth/login', {
      email: testEmail,
      password: 'Password123!'
    });
    token = res.data.token; // Refresh token
    pass('POST /auth/login');
  } catch (err) {
    fail('POST /auth/login', err);
  }

  // 3. Auth: Get Me
  try {
    await req('GET', '/auth/me');
    pass('GET /auth/me');
  } catch (err) {
    fail('GET /auth/me', err);
  }

  // 4. Auth: Update Resume
  try {
    await req('PATCH', '/auth/resume', { resumeText: 'Test resume content' });
    pass('PATCH /auth/resume');
  } catch (err) {
    fail('PATCH /auth/resume', err);
  }

  // 5. Jobs: Create
  try {
    const res = await req('POST', '/jobs', {
      company: 'Test Company',
      role: 'Test Role',
      jobDescription: 'Software engineer position',
      applicationUrl: 'https://example.com',
      status: 'saved',
      appliedAt: '2026-05-10'
    });
    jobId = res.data._id;
    pass('POST /jobs');
  } catch (err) {
    fail('POST /jobs', err);
  }

  // 6. Jobs: Get All
  try {
    const res = await req('GET', '/jobs');
    if (!Array.isArray(res.data)) throw new Error('Expected array of jobs');
    pass('GET /jobs');
  } catch (err) {
    fail('GET /jobs', err);
  }

  // 7. Jobs: Get By ID
  if (jobId) {
    try {
      await req('GET', `/jobs/${jobId}`);
      pass('GET /jobs/:id');
    } catch (err) {
      fail('GET /jobs/:id', err);
    }

    // 8. Jobs: Update
    try {
      await req('PATCH', `/jobs/${jobId}`, { status: 'applied' });
      pass('PATCH /jobs/:id');
    } catch (err) {
      fail('PATCH /jobs/:id', err);
    }

    // 9. Cover Letters: Generate
    try {
      const res = await req('POST', '/cover-letters/generate', { jobId, tone: 'formal' });
      coverLetterId = res.data._id;
      pass('POST /cover-letters/generate');
    } catch (err) {
      fail('POST /cover-letters/generate', err);
    }

    // 10. Cover Letters: Get By Job
    try {
      await req('GET', `/cover-letters/job/${jobId}`);
      pass('GET /cover-letters/job/:jobId');
    } catch (err) {
      fail('GET /cover-letters/job/:jobId', err);
    }

    // 11. Cover Letters: Finalize
    if (coverLetterId) {
      try {
        await req('PATCH', `/cover-letters/${coverLetterId}/finalize`);
        pass('PATCH /cover-letters/:id/finalize');
      } catch (err) {
        fail('PATCH /cover-letters/:id/finalize', err);
      }

      // 12. Cover Letters: Delete
      try {
        await req('DELETE', `/cover-letters/${coverLetterId}`);
        pass('DELETE /cover-letters/:id');
      } catch (err) {
        fail('DELETE /cover-letters/:id', err);
      }
    }

    // 13. Jobs: Delete
    try {
      await req('DELETE', `/jobs/${jobId}`);
      pass('DELETE /jobs/:id');
    } catch (err) {
      fail('DELETE /jobs/:id', err);
    }
  }

  log('Test run complete.');
}

testBackend();
