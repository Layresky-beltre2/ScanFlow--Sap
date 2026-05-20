const PROXY = 'http://localhost:3001/api';
const SAP_BASE = 'https://ceo-hq-dev-sld.ceo.do:50000';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-sap-url': SAP_BASE
});

export async function login({ CompanyDB, UserName, Password }) {
  sessionStorage.setItem('userName', UserName);
  sessionStorage.setItem('companyDB', CompanyDB);

  const res = await fetch(`${PROXY}/b1s/v2/Login`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify({ CompanyDB, UserName, Password })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message?.value || 'Credenciales incorrectas');
  }
  return res.json();
}

export async function logout() {
  try {
    await fetch(`${PROXY}/b1s/v2/Logout`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include'
    });
  } finally {
    sessionStorage.clear();
  }
}

export async function getItems({ search = '', page = 0, pageSize = 20 } = {}) {
  const skip = page * pageSize;
  let filter = "InventoryItem%20eq%20'tYES'";

  if (search.trim()) {
    const s = encodeURIComponent(search.trim());
    filter += `%20and%20(contains(ItemCode,'${s}')%20or%20contains(ItemName,'${s}')%20or%20contains(BarCode,'${s}'))`;
  }

  const url = `${PROXY}/b1s/v2/Items`
    + `?$select=ItemCode,ItemName,Valid,BarCode,ItemBarCodeCollection`
    + `&$filter=${filter}`
    + `&$top=${pageSize}`
    + `&$skip=${skip}`
    + `&$inlinecount=allpages`;

  const res = await fetch(url, {
    headers: getHeaders(),
    credentials: 'include'
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('Sesión expirada. Inicia sesión nuevamente.');
    throw new Error('Error al cargar artículos');
  }
  return res.json();
}

export async function getItemByCode(itemCode) {
  const res = await fetch(
    `${PROXY}/b1s/v2/Items('${encodeURIComponent(itemCode)}')`,
    { headers: getHeaders(), credentials: 'include' }
  );
  if (!res.ok) throw new Error('Error al cargar el artículo');
  return res.json();
}

export async function addBarcode(itemCode, existingBarcodes, newBarcode, uomEntry) {
  const newEntry = { Barcode: newBarcode };
  if (uomEntry !== '' && uomEntry != null) {
    newEntry.UoMEntry = parseInt(uomEntry);
  }
  const updatedBarcodes = [...existingBarcodes, newEntry];

  const res = await fetch(
    `${PROXY}/b1s/v2/Items('${encodeURIComponent(itemCode)}')`,
    {
      method: 'PATCH',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ ItemBarCodeCollection: updatedBarcodes })
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message?.value || 'Error al guardar');
  }
  return true;
}