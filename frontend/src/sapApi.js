const API_URL = 'http://localhost:3001/api';

// LOGIN
export async function login(credentials) {
  const response = await fetch(`${API_URL}/b1s/v2/Login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-sap-url': credentials.sapUrl
    },
    body: JSON.stringify({
      CompanyDB: credentials.CompanyDB,
      UserName: credentials.UserName,
      Password: credentials.Password
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message?.value || 'Credenciales incorrectas');
  }

  const data = await response.json();
  sessionStorage.setItem('sapUrl', credentials.sapUrl);
  sessionStorage.setItem('userName', credentials.UserName);
  sessionStorage.setItem('companyDB', credentials.CompanyDB);
  return data;
}

// LOGOUT
export async function logout() {
  const sapUrl = sessionStorage.getItem('sapUrl');
  if (!sapUrl) return;
  await fetch(`${API_URL}/b1s/v2/Logout`, {
    method: 'POST',
    headers: { 'x-sap-url': sapUrl }
  });
  sessionStorage.clear();
}

// LISTAR ARTÍCULOS
export async function getItems({ search = '', page = 0, pageSize = 20 } = {}) {
  const sapUrl = sessionStorage.getItem('sapUrl');
  const skip = page * pageSize;
  let filter = "InventoryItem%20eq%20'tYES'";

  if (search.trim()) {
    const s = encodeURIComponent(search.trim());
    filter += `%20and%20(contains(ItemCode,'${s}')%20or%20contains(ItemName,'${s}')%20or%20contains(BarCode,'${s}'))`;
  }

  const url = `${API_URL}/b1s/v2/Items`
    + `?$select=ItemCode,ItemName,Valid,BarCode,ItemBarCodeCollection`
    + `&$filter=${filter}`
    + `&$top=${pageSize}`
    + `&$skip=${skip}`
    + `&$inlinecount=allpages`;

  const res = await fetch(url, {
    headers: { 'x-sap-url': sapUrl }
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('Sesión expirada. Inicia sesión nuevamente.');
    throw new Error('Error al cargar artículos');
  }
  return res.json();
}

// DETALLE DE ARTÍCULO
export async function getItemByCode(itemCode) {
  const sapUrl = sessionStorage.getItem('sapUrl');
  const res = await fetch(
    `${API_URL}/b1s/v2/Items('${encodeURIComponent(itemCode)}')`,
    { headers: { 'x-sap-url': sapUrl } }
  );
  if (!res.ok) throw new Error('Error al cargar detalle');
  return res.json();
}

// AGREGAR CÓDIGO DE BARRA
export async function addBarcode(itemCode, existingBarcodes, newBarcode, uomEntry = null) {
  const sapUrl = sessionStorage.getItem('sapUrl');

  const updatedBarcodes = [
    ...existingBarcodes,
    { Barcode: newBarcode, ...(uomEntry ? { UoMEntry: parseInt(uomEntry) } : {}) }
  ];

  const res = await fetch(
    `${API_URL}/b1s/v2/Items('${encodeURIComponent(itemCode)}')`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-sap-url': sapUrl
      },
      body: JSON.stringify({ ItemBarCodeCollection: updatedBarcodes })
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message?.value || '';
    if (msg.includes('UoM') || msg.includes('unit')) {
      throw new Error('Unidad de medida inexistente o inválida');
    }
    if (msg.includes('duplicate') || msg.includes('exist')) {
      throw new Error('Este código de barra ya existe');
    }
    throw new Error(msg || 'Error al guardar el código de barra');
  }
  return true;
}

// UNIDADES DE MEDIDA
export async function getUoMs() {
  const sapUrl = sessionStorage.getItem('sapUrl');
  const res = await fetch(
    `${API_URL}/b1s/v2/UnitOfMeasurements`,
    { headers: { 'x-sap-url': sapUrl } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.value || [];
}