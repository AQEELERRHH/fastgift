const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
const BASE = 'https://shop.fast.xyz';
const FAST_ADDRESS = 'fast1lgqj4l6esmzyylr4wdfl340zj4lhp2m6naqm5ux20vphdhrx7kjs0fr6jf';
const PRIVATE_KEY = process.env.FAST_PRIVATE_KEY || '';

async function getFetch() { return (await import('node-fetch')).default; }
async function getX402() { return await import('@fastxyz/x402-client'); }

function buildAuth() {
  const ts = Math.floor(Date.now() / 1000).toString();
  const msg = FAST_ADDRESS + ':' + ts;
  return Buffer.from(msg).toString('base64') + '.' + Buffer.from(PRIVATE_KEY, 'hex').toString('base64');
}

app.get('/api/search', async (req, res) => {
  try {
    const fetch = await getFetch();
    const url = BASE + '/search?q=' + encodeURIComponent(req.query.q) + '&retailer=amazon&max_results=5';
    console.log('Searching:', url);
    const r = await fetch(url);
    res.json(await r.json());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/quote', async (req, res) => {
  try {
    const fetch = await getFetch();
    const r = await fetch(BASE + '/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    res.json(await r.json());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/order', async (req, res) => {
  try {
    const fetch = await getFetch();
    const { x402Pay } = await getX402();
    const { quote_id } = req.body;

    console.log('Placing order with quote:', quote_id);

    const wallet = {
      type: 'fast',
      privateKey: PRIVATE_KEY,
      publicKey: '',
      address: FAST_ADDRESS
    };

    const response = await x402Pay(
      () => fetch(BASE + '/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote_id })
      }),
      { wallet }
    );

    const text = await response.text();
    console.log('Order response:', text.slice(0, 200));
    try {
      res.json(JSON.parse(text));
    } catch(e) {
      res.json({ error: 'Unexpected response', raw: text.slice(0, 200) });
    }
  } catch (err) {
    console.error('Order error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/order/:id', async (req, res) => {
  try {
    const fetch = await getFetch();
    const auth = buildAuth();
    const r = await fetch(BASE + '/orders/' + req.params.id, {
      headers: { 'Authorization': 'Bearer ' + auth }
    });
    const text = await r.text();
    try { res.json(JSON.parse(text)); }
    catch(e) { res.status(500).json({ error: 'Invalid response' }); }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(3000, () => console.log('FastGift running at http://localhost:3000'));
