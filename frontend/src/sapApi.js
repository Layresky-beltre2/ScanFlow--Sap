const API_URL = 'http://localhost:3001/api';

// LOGIN - Envía credenciales a SAP
export async function login(credentials) {
  console.log('========================================');
  console.log('📡 LOGIN DESDE FRONTEND');
  console.log('📍 Credenciales:', { ...credentials, Password: '***' });
  
  const response = await fetch(`${API_URL}/Login`, {
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
  
  console.log('📍 Response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.log('❌ Error response:', errorText);
    throw new Error(`Error ${response.status}: ${errorText}`);
  }
  
  const data = await response.json();
  console.log('✅ Login exitoso:', data);
  console.log('========================================');
  return data;
}

// LOGOUT
export async function logout() {
  const sapUrl = sessionStorage.getItem('sapUrl');
  if (!sapUrl) return;
  
  await fetch(`${API_URL}/Logout`, {
    method: 'POST',
    headers: { 'x-sap-url': sapUrl }
  });
  sessionStorage.clear();
}

// LISTAR ARTÍCULOS
export async function getItems(search = '') {
  const sapUrl = sessionStorage.getItem('sapUrl');
  let filter = `InventoryItem eq 'tYES'`;
  
  if (search) {
    filter += ` and (contains(ItemCode,'${search}') or contains(ItemName,'${search}') or contains(BarCode,'${search}'))`;
  }
  
  const response = await fetch(`${API_URL}/Items?$filter=${filter}&$top=50`, {
    headers: { 'x-sap-url': sapUrl }
  });
  
  if (!response.ok) throw new Error('Error al cargar artículos');
  return response.json();
}

// DETALLE DE ARTÍCULO
export async function getItemByCode(itemCode) {
  const sapUrl = sessionStorage.getItem('sapUrl');
  const response = await fetch(`${API_URL}/Items('${encodeURIComponent(itemCode)}')`, {
    headers: { 'x-sap-url': sapUrl }
  });
  
  if (!response.ok) throw new Error('Error al cargar detalle');
  return response.json();
}

// AGREGAR CÓDIGO DE BARRA
export async function addBarcode(itemCode, existingBarcodes, newBarcode, uomEntry = null) {
  const sapUrl = sessionStorage.getItem('sapUrl');
  
  const updatedBarcodes = [
    ...existingBarcodes,
    { Barcode: newBarcode, ...(uomEntry ? { UoMEntry: parseInt(uomEntry) } : {}) }
  ];
  
  const response = await fetch(`${API_URL}/Items('${encodeURIComponent(itemCode)}')`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-sap-url': sapUrl
    },
    body: JSON.stringify({ ItemBarCodeCollection: updatedBarcodes })
  });
  
  if (!response.ok) throw new Error('Error al guardar');
  return true;
}