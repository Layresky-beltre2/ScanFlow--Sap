const https = require('https');

console.log('🚀 Iniciando prueba directa a SAP...');

// PASO 1: Login
const loginBody = JSON.stringify({
  CompanyDB: 'CCO_DEMO',      // ← cambia si es diferente
  UserName: 'diana',     // ← pon tu usuario real
  Password: 'Ceo1234$'     // ← pon tu password real
});

const loginOptions = {
  hostname: 'ceo-hq-dev-sld.ceo.do',
  port: 50000,
  path: '/b1s/v2/Login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginBody)
  },
  rejectUnauthorized: false
};

const loginReq = https.request(loginOptions, (loginRes) => {
  let loginData = '';
  const cookies = loginRes.headers['set-cookie'];

  loginRes.on('data', chunk => loginData += chunk);
  loginRes.on('end', () => {
    console.log('✅ Login status:', loginRes.statusCode);
    console.log('🍪 Cookies recibidas:', cookies ? 'SÍ' : 'NO');

    if (loginRes.statusCode !== 200) {
      console.log('❌ Error login:', loginData);
      return;
    }

    // PASO 2: Buscar Items
    const cookieStr = cookies ? cookies.join('; ') : '';
    const itemsPath = "/b1s/v2/Items?$select=ItemCode,ItemName,BarCode&$filter=InventoryItem%20eq%20'tYES'&$top=3";

    const itemsOptions = {
      hostname: 'ceo-hq-dev-sld.ceo.do',
      port: 50000,
      path: itemsPath,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieStr
      },
      rejectUnauthorized: false
    };

    console.log('🔍 Buscando artículos...');

    const itemsReq = https.request(itemsOptions, (itemsRes) => {
      let itemsData = '';
      itemsRes.on('data', chunk => itemsData += chunk);
      itemsRes.on('end', () => {
        console.log('📦 Items status:', itemsRes.statusCode);
        console.log('📦 Items data:', itemsData.substring(0, 800));
      });
    });

    itemsReq.on('error', (e) => console.error('❌ Error items:', e.message));
    itemsReq.end();
  });
});

loginReq.on('error', (e) => console.error('❌ Error login:', e.message));
loginReq.write(loginBody);
loginReq.end();