import { useState } from 'react';
import { getItems, logout } from '../api/sapApi';
import { QRCodeSVG } from 'qrcode.react';

export default function Dashboard({ user, onLogout, onSelectItem }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [recentItems, setRecentItems] = useState([]);
  const pageSize = 20;

  const loadItems = async (searchTerm = '', currentPage = 0) => {
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const data = await getItems({ search: searchTerm, page: currentPage, pageSize });
      setItems(data.value || []);
      setTotalCount(data['@odata.count'] || 0);
      setPage(currentPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setRecentItems(prev => {
      const filtered = prev.filter(i => i.ItemCode !== item.ItemCode);
      return [item, ...filtered].slice(0, 10);
    });
  };

  const handleGoToDetail = (item) => {
    onSelectItem(item);
  };

  const handleClear = () => {
    setSearch('');
    setItems([]);
    setHasSearched(false);
    setError('');
    setSelectedItem(null);
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const displayItems = hasSearched ? items : recentItems;

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
            <img src="/Nubesb1.svg" alt="SAP" style={{ width: '120px' }} />
          </div>
          <button style={{
            width: '100%', padding: '10px', marginBottom: '8px',
            background: 'rgba(255,255,255,0.35)', color: 'white',
            border: 'none', borderRadius: '20px', cursor: 'pointer',
            fontWeight: 'bold', fontSize: '14px'
          }}>
            Dashboard
          </button>
          <button
            onClick={() => selectedItem ? handleGoToDetail(selectedItem) : null}
            style={{
              width: '100%', padding: '10px',
              background: 'transparent', color: 'white',
              border: 'none', borderRadius: '20px', cursor: 'pointer',
              fontWeight: 'bold', fontSize: '14px',
              opacity: selectedItem ? 1 : 0.5
            }}
          >
            Items
          </button>
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

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div style={{ flex: 1, padding: '30px', background: '#e8f4fd' }}>
        <h1 style={{ color: '#0096D6', marginBottom: '25px', fontSize: '28px' }}>
          Bienvenida {user?.name}!!
        </h1>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

          {/* Panel izquierdo */}
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 'bold', fontStyle: 'italic', marginBottom: '8px', color: '#333' }}>
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
                placeholder="Buscar por código, nombre o barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadItems(search, 0)}
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontSize: '14px', color: '#666'
                }}
              />
              <span
                onClick={() => loadItems(search, 0)}
                style={{ cursor: 'pointer', fontSize: '18px' }}
              >🔍</span>
              {search && (
                <span
                  onClick={handleClear}
                  style={{ cursor: 'pointer', fontSize: '16px', color: '#999' }}
                >✕</span>
              )}
            </div>

            {error && (
              <div style={{
                padding: '10px 15px', background: '#f8d7da',
                color: '#721c24', borderRadius: '10px', marginBottom: '15px'
              }}>{error}</div>
            )}

            <p style={{ fontWeight: 'bold', fontStyle: 'italic', marginBottom: '10px', color: '#333' }}>
              {hasSearched ? 'Resultados' : 'Artículos recientes'}
            </p>

            {!hasSearched ? (
              <div style={{
                background: 'white', borderRadius: '15px', padding: '40px',
                textAlign: 'center', color: '#aaa', fontStyle: 'italic',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                Busca un artículo para comenzar
              </div>
            ) : loading ? (
              <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Cargando artículos...
              </p>
            ) : displayItems.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                No se encontraron artículos.
              </p>
            ) : (
              <>
                <div style={{
                  background: 'white', borderRadius: '15px',
                  overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Código', 'Artículo', 'Barcode', 'Status', 'UOM'].map(h => (
                          <th key={h} style={{
                            padding: '12px 15px', background: '#0096D6',
                            color: 'white', textAlign: 'left',
                            fontStyle: 'italic', fontWeight: 'bold'
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displayItems.map((item) => (
                        <tr
                          key={item.ItemCode}
                          onClick={() => handleSelectItem(item)}
                          onDoubleClick={() => handleGoToDetail(item)}
                          style={{
                            borderBottom: '1px solid #f0f0f0', cursor: 'pointer',
                            background: selectedItem?.ItemCode === item.ItemCode
                              ? '#e3f2fd' : 'white'
                          }}
                        >
                          <td style={{ padding: '10px 15px', fontSize: '14px' }}>{item.ItemCode}</td>
                          <td style={{ padding: '10px 15px', fontSize: '14px' }}>{item.ItemName}</td>
                          <td style={{ padding: '10px 15px', fontSize: '14px' }}>{item.BarCode || '—'}</td>
                          <td style={{ padding: '10px 15px' }}>
                            <span style={{
                              padding: '4px 12px', borderRadius: '20px',
                              background: item.Valid === 'tYES' ? '#d4edda' : '#f8d7da',
                              color: item.Valid === 'tYES' ? '#155724' : '#721c24',
                              fontSize: '12px', fontWeight: 'bold'
                            }}>
                              {item.Valid === 'tYES' ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td style={{ padding: '10px 15px', fontSize: '14px' }}>
                            {item.ItemBarCodeCollection?.[0]?.UoMEntry ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div style={{
                    display: 'flex', justifyContent: 'center',
                    gap: '10px', marginTop: '15px', alignItems: 'center'
                  }}>
                    <button
                      onClick={() => loadItems(search, page - 1)}
                      disabled={page === 0}
                      style={{
                        padding: '8px 20px', borderRadius: '20px',
                        border: '1px solid #0096D6', background: 'white',
                        color: '#0096D6', cursor: page === 0 ? 'not-allowed' : 'pointer',
                        opacity: page === 0 ? 0.5 : 1
                      }}
                    >← Anterior</button>
                    <span style={{ color: '#666' }}>Página {page + 1} de {totalPages}</span>
                    <button
                      onClick={() => loadItems(search, page + 1)}
                      disabled={page + 1 >= totalPages}
                      style={{
                        padding: '8px 20px', borderRadius: '20px',
                        border: '1px solid #0096D6', background: 'white',
                        color: '#0096D6', cursor: page + 1 >= totalPages ? 'not-allowed' : 'pointer',
                        opacity: page + 1 >= totalPages ? 0.5 : 1
                      }}
                    >Siguiente →</button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Panel derecho QR */}
          <div style={{
            width: '260px', background: 'white', borderRadius: '15px',
            padding: '20px', textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <p style={{
              fontWeight: 'bold', fontStyle: 'italic',
              marginBottom: '15px', color: '#333'
            }}>
              Código de barra o QR
            </p>
            {selectedItem?.BarCode ? (
              <div>
                <p style={{
                  fontWeight: 'bold', wordBreak: 'break-all',
                  marginBottom: '15px', color: '#333', fontSize: '14px'
                }}>
                  {selectedItem.BarCode}
                </p>
                <QRCodeSVG value={selectedItem.BarCode} size={160} />
                <br />
                <button
                  onClick={() => handleGoToDetail(selectedItem)}
                  style={{
                    marginTop: '15px', padding: '10px 20px',
                    background: '#0096D6', color: 'white',
                    border: 'none', borderRadius: '20px',
                    cursor: 'pointer', fontSize: '13px'
                  }}
                >Ver detalle →</button>
              </div>
            ) : (
              <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: '14px' }}>
                {selectedItem
                  ? 'Este artículo no tiene código de barra'
                  : 'Mostrará gráficamente el QR'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}