module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body || {};
  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY not set');
    return res.status(500).json({ error: 'Server config error' });
  }

  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const result = await verifyRes.json();

    if (result.success) {
      res.setHeader('Set-Cookie', [
        'nuri_ts_verified=1; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000',
      ]);
      return res.status(200).json({ ok: true });
    } else {
      console.error('Turnstile verification failed:', result);
      return res.status(403).json({ error: 'Verification failed', details: result['error-codes'] });
    }
  } catch (err) {
    console.error('Turnstile verify error:', err);
    return res.status(500).json({ error: 'Verification service unavailable' });
  }
};
