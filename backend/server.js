const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  credentials: true
}));

app.use(express.json());

let sessionData = {
  cookie: '',
  sapUrl: ''
};

function sapRequest(method, url, body, cookie) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 50000,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie || ''
      },
      rejectUnauthorized: false
    };

    const req = https.request(options, (res) => {
      let data = '';
      const setCookie = res.headers['set-cookie'];
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data,
          cookies: setCookie
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.post('/api/b1s/v2/Login', async (req, res) => {
  const sapUrl = req.headers['x-sap-url'];
  if (!sapUrl) return res.status(400).json({ error: 'Falta x-sap-url' });

  try {
    const result = await sapRequest('POST', `${sapUrl}/b1s/v2/Login`, req.body, '');

    console.log('🔐 Login status:', result.status);
    console.log('🍪 Cookies recibidas:', result.cookies);

    if (result.cookies) {
      sessionData.cookie = result.cookies.map(c => c.split(';')[0]).join('; ');
      sessionData.sapUrl = sapUrl;
      console.log('✅ Sesión guardada:', sessionData.cookie.substring(0, 80));
    }

    res.status(result.status).json(JSON.parse(result.data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/b1s/v2/Logout', async (req, res) => {
  const sapUrl = req.headers['x-sap-url'] || sessionData.sapUrl;
  try {
    await sapRequest('POST', `${sapUrl}/b1s/v2/Logout`, {}, sessionData.cookie);
    sessionData = { cookie: '', sapUrl: '' };
    res.status(200).json({ message: 'Sesión cerrada' });
  } catch (err) {
    sessionData = { cookie: '', sapUrl: '' };
    res.status(200).json({ message: 'Sesión cerrada' });
  }
});

app.use('/api', async (req, res) => {
  const sapUrl = req.headers['x-sap-url'] || sessionData.sapUrl;

  if (!sessionData.cookie) {
    return res.status(401).json({ error: 'No hay sesión activa' });
  }

  const endpoint = req.url;
  const fullUrl = `${sapUrl}${endpoint}`;
  console.log('🔄 Llamando a:', fullUrl);

  try {
    const result = await sapRequest(
      req.method,
      fullUrl,
      req.method !== 'GET' ? req.body : null,
      sessionData.cookie
    );

    console.log('✅ Status:', result.status);

    try {
      res.status(result.status).json(JSON.parse(result.data));
    } catch {
      res.status(result.status).send(result.data);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor proxy corriendo en http://localhost:${PORT}`);
});