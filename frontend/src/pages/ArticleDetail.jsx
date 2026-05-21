import { useState, useEffect } from 'react';
import { getItemByCode, addBarcode } from '../api/sapApi';
import { QRCodeSVG } from 'qrcode.react';

export default function ArticleDetail({ item, user, onBack, onLogout }) {
  const [detail, setDetail] = useState(null);
  const [barcodes, setBarcodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [newBarcode, setNewBarcode] = useState('');
  const [newUOM, setNewUOM] = useState('');

  const isActive = detail?.Valid === 'tYES';

  const fetchDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getItemByCode(item.ItemCode);
      setDetail(data);
      setBarcodes(data.ItemBarCodeCollection || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetail(); }, [item.ItemCode]);

  const handleSave = async () => {
    if (!newBarcode.trim()) {
      setError('El código de barra no puede estar vacío');
      return;
    }
    if (barcodes.some(b => b.Barcode === newBarcode.trim())) {
      setError('Este código ya existe para este artículo');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await addBarcode(item.ItemCode, barcodes, newBarcode.trim(), newUOM);
      setSuccess('✅ Código guardado exitosamente');
      setNewBarcode('');
      setNewUOM('');
      fetchDetail();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: '220px', background: '#0096D6',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '20px', color: 'white'
      }}>
        <div>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img src="/Nubesb1.png" alt="SAP" style={{ width: '120px' }} />
          </div>
          <button
            onClick={onBack}
            style={{
              width: '100%', padding: '10px', marginBottom: '8px',
              background: 'transparent', color: 'white',
              border: 'none', borderRadius: '20px', cursor: 'pointer',
              fontWeight: 'bold', fontSize: '14px'
            }}
          >Dashboard</button>
          <button
            style={{
              width: '100%', padding: '10px',
              background: 'rgba(255,255,255,0.35)', color: 'white',
              border: 'none', borderRadius: '20px', cursor: 'pointer',
              fontWeight: 'bold', fontSize: '14px'
            }}
          >Items</button>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '15px', padding: '15px', textAlign: 'center'
        }}>
          <div style={{
            width: '45px', height: '45px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 10px', fontSize: '22px'
          }}>👤</div>
          <button
            onClick={onLogout}
            style={{
              background: 'rgba(255,255,255,0.3)', border: 'none',
              borderRadius: '20px', color: 'white',
              padding: '5px 15px', cursor: 'pointer',
              marginBottom: '8px', fontStyle: 'italic', fontSize: '13px'
            }}
          >→ Logout</button>
          <p style={{ fontSize: '11px', margin: 0, opacity: 0.9 }}>
            {user?.name} - {user?.company}
          </p>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div style={{ flex: 1, padding: '30px', background: '#e8f4fd' }}>
        <h1 style={{ color: '#0096D6', marginBottom: '25px' }}>
          Bienvenida {user?.name}!!
        </h1>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

          {/* ── Columna izquierda ── */}
          <div style={{ flex: 1 }}>
            {/* Buscador deshabilitado */}
            <p style={{ fontWeight: 'bold', fontStyle: 'italic', marginBottom: '8px' }}>
              Buscar artículo
            </p>
            <div style={{
              background: 'white', borderRadius: '15px',
              padding: '15px 20px', marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              <input
                type="text"
                placeholder="Buscar artículo..."
                disabled
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontSize: '14px', color: '#aaa', background: 'transparent'
                }}
              />
              <span style={{ fontSize: '18px' }}>🔍</span>
            </div>

            {/* Info del artículo */}
            <p style={{ fontWeight: 'bold', fontStyle: 'italic', marginBottom: '10px' }}>
              Información del Artículo
            </p>
            <div style={{
              background: 'white', borderRadius: '15px',
              padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              {loading ? (
                <p style={{ color: '#666', textAlign: 'center' }}>Cargando...</p>
              ) : detail ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: '#666', fontWeight: 'bold' }}>Código</span>
                    <span>{detail.ItemCode}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: '#666', fontWeight: 'bold' }}>Nombre</span>
                    <span>{detail.ItemName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: '#666', fontWeight: 'bold' }}>Grupo</span>
                    <span>{detail.ItemsGroupCode}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: '#666', fontWeight: 'bold' }}>Status</span>
                    <span style={{
                      padding: '3px 12px', borderRadius: '20px',
                      background: isActive ? '#d4edda' : '#f8d7da',
                      color: isActive ? '#155724' : '#721c24',
                      fontSize: '12px', fontWeight: 'bold'
                    }}>
                      {isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ color: '#666', fontWeight: 'bold' }}>Barcode principal</span>
                    <span>{detail.BarCode || '—'}</span>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#999', textAlign: 'center' }}>No se pudo cargar el artículo</p>
              )}
            </div>
          </div>

          {/* ── Columna derecha ── */}
          <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* QR */}
            <div style={{
              background: 'white', borderRadius: '15px',
              padding: '20px', textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <p style={{ fontWeight: 'bold', fontStyle: 'italic', marginBottom: '15px' }}>
                Scanear QR
              </p>
              {loading ? (
                <p style={{ color: '#999' }}>Cargando...</p>
              ) : detail?.BarCode ? (
                <div>
                  <p style={{ fontWeight: 'bold', wordBreak: 'break-all', marginBottom: '10px', fontSize: '13px' }}>
                    {detail.BarCode}
                  </p>
                  <QRCodeSVG value={detail.BarCode} size={150} />
                </div>
              ) : (
                <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: '13px' }}>
                  Sin código de barra principal
                </p>
              )}

              {/* Otros barcodes */}
              {barcodes.length > 1 && (
                <div style={{ marginTop: '15px', textAlign: 'left' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '8px' }}>
                    Otros códigos:
                  </p>
                  {barcodes.map((b, i) => (
                    <div key={i} style={{
                      padding: '8px', marginBottom: '8px',
                      background: '#f8f9fa', borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '12px', marginBottom: '5px', wordBreak: 'break-all' }}>
                        {b.Barcode}
                      </p>
                      {b.UoMEntry != null && (
                        <p style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>
                          UOM: {b.UoMEntry}
                        </p>
                      )}
                      <QRCodeSVG value={b.Barcode} size={80} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Formulario agregar barcode */}
            <div style={{
              background: 'white', borderRadius: '15px',
              padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <p style={{ fontWeight: 'bold', fontStyle: 'italic', marginBottom: '15px' }}>
                Cambiar barcode y unidad de medida
              </p>

              {!isActive && detail && (
                <p style={{ color: '#e67e22', fontSize: '13px', marginBottom: '10px' }}>
                  ⚠️ Artículo inactivo. No se puede editar.
                </p>
              )}

              {error && (
                <div style={{
                  padding: '8px 12px', background: '#f8d7da',
                  color: '#721c24', borderRadius: '8px',
                  marginBottom: '10px', fontSize: '13px'
                }}>{error}</div>
              )}
              {success && (
                <div style={{
                  padding: '8px 12px', background: '#d4edda',
                  color: '#155724', borderRadius: '8px',
                  marginBottom: '10px', fontSize: '13px'
                }}>{success}</div>
              )}

              {isActive && (
                <>
                  <input
                    type="text"
                    placeholder="Nuevo código de barra"
                    value={newBarcode}
                    onChange={(e) => setNewBarcode(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 15px',
                      border: '1px solid #ddd', borderRadius: '10px',
                      fontSize: '13px', marginBottom: '10px',
                      outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Unidad de medida (UoMEntry)"
                    value={newUOM}
                    onChange={(e) => setNewUOM(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 15px',
                      border: '1px solid #ddd', borderRadius: '10px',
                      fontSize: '13px', marginBottom: '15px',
                      outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      width: '100%', padding: '12px',
                      background: '#0096D6', color: 'white',
                      border: 'none', borderRadius: '10px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontSize: '14px', fontWeight: 'bold',
                      opacity: saving ? 0.7 : 1
                    }}
                  >
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}