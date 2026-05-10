async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test' + Date.now() + '@example.com',
        password: 'Password123!',
      })
    });
    const data = await res.json();
    console.log('Register response:', JSON.stringify(data, null, 2));

    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.data.user.email,
        password: 'Password123!',
      })
    });
    const loginData = await loginRes.json();
    console.log('Login response:', JSON.stringify(loginData, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
