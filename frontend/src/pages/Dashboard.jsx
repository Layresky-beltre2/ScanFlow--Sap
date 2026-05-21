import { useState } from 'react';
import { getItems } from '../api/sapApi';
import { QRCodeSVG } from 'qrcode.react';

export default function Dashboard({
  user,
  onLogout,
  onSelectItem,
  darkMode,
  toggleDark
}) {
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

  /* ───────── COLORES ───────── */
  const sidebarBg = darkMode ? '#00327D' : '#0096D6';
  const mainBg = darkMode ? '#111827' : '#e8f4fd';
  const cardBg = darkMode ? '#1f2937' : 'white';
  const textColor = darkMode ? '#f3f4f6' : '#333';
  const secondaryText = darkMode ? '#9ca3af' : '#666';
  const borderColor = darkMode ? '#374151' : '#f0f0f0';
  const inputBg = darkMode ? '#111827' : 'white';
  const inputColor = darkMode ? '#f3f4f6' : '#666';
  const tableHeaderBg = darkMode ? '#1e3a8a' : '#0096D6';
  const selectedRow = darkMode ? '#1e40af33' : '#e3f2fd';
  const buttonBg = darkMode ? '#2563eb' : '#0096D6';

  const loadItems = async (searchTerm = '', currentPage = 0) => {
    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const data = await getItems({
        search: searchTerm,
        page: currentPage,
        pageSize
      });

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

    setRecentItems((prev) => {
      const filtered = prev.filter(
        (i) => i.ItemCode !== item.ItemCode
      );

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
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
        background: mainBg,
        position: 'relative'
      }}
    >

      {/* ───────── BOTÓN DARK MODE ───────── */}
      <button
        onClick={toggleDark}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: darkMode ? '#1f2937' : 'white',
          border: darkMode
            ? '1px solid #374151'
            : '1px solid #ddd',
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 100,
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          transition: 'all 0.3s'
        }}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      {/* ───────── SIDEBAR ───────── */}
      <div
        style={{
          width: '220px',
          background: sidebarBg,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px',
          color: 'white'
        }}
      >
        <div>
          <div
            style={{
              textAlign: 'center',
              marginBottom: '30px'
            }}
          >
            <img
              src="/Nubesb1.png"
              alt="SAP"
              style={{ width: '200px' }}
            />
          </div>

          <button
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '8px',
              background: 'rgba(255,255,255,0.25)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              selectedItem ? handleGoToDetail(selectedItem) : null
            }
            style={{
              width: '100%',
              padding: '10px',
              background: 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              opacity: selectedItem ? 1 : 0.5
            }}
          >
            Items
          </button>
        </div>

        {/* USER CARD */}
        <div
          style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px',
              fontSize: '22px'
            }}
          >
            👤
          </div>

          <button
            onClick={onLogout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '20px',
              color: 'white',
              padding: '5px 15px',
              cursor: 'pointer',
              marginBottom: '8px',
              fontStyle: 'italic',
              fontSize: '13px'
            }}
          >
            → Logout
          </button>

          <p
            style={{
              fontSize: '11px',
              margin: 0,
              opacity: 0.9
            }}
          >
            {user?.name} - {user?.company}
          </p>
        </div>
      </div>

      {/* ───────── CONTENIDO ───────── */}
      <div
        style={{
          flex: 1,
          padding: '30px',
          background: mainBg
        }}
      >
        <h1
          style={{
            color: darkMode ? '#60a5fa' : '#0096D6',
            marginBottom: '25px',
            fontSize: '28px'
          }}
        >
          Bienvenida {user?.name}!!
        </h1>

        <div
          style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'flex-start'
          }}
        >

          {/* ───────── PANEL IZQUIERDO ───────── */}
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontWeight: 'bold',
                fontStyle: 'italic',
                marginBottom: '8px',
                color: textColor
              }}
            >
              Buscar artículo
            </p>

            {/* SEARCH */}
            <div
              style={{
                background: cardBg,
                borderRadius: '15px',
                padding: '15px 20px',
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <input
                type="text"
                placeholder="Buscar por código, nombre o barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && loadItems(search, 0)
                }
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  color: inputColor,
                  background: inputBg
                }}
              />

              <span
                onClick={() => loadItems(search, 0)}
                style={{
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                🔍
              </span>

              {search && (
                <span
                  onClick={handleClear}
                  style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: secondaryText
                  }}
                >
                  ✕
                </span>
              )}
            </div>

            {/* ERROR */}
            {error && (
              <div
                style={{
                  padding: '10px 15px',
                  background: '#7f1d1d',
                  color: '#fecaca',
                  borderRadius: '10px',
                  marginBottom: '15px'
                }}
              >
                {error}
              </div>
            )}

            <p
              style={{
                fontWeight: 'bold',
                fontStyle: 'italic',
                marginBottom: '10px',
                color: textColor
              }}
            >
              {hasSearched ? 'Resultados' : 'Artículos recientes'}
            </p>

            {!hasSearched ? (
              <div
                style={{
                  background: cardBg,
                  borderRadius: '15px',
                  padding: '40px',
                  textAlign: 'center',
                  color: secondaryText,
                  fontStyle: 'italic',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                Busca un artículo para comenzar
              </div>
            ) : loading ? (
              <p
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: secondaryText
                }}
              >
                Cargando artículos...
              </p>
            ) : displayItems.length === 0 ? (
              <p
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: secondaryText
                }}
              >
                No se encontraron artículos.
              </p>
            ) : (
              <>
                {/* TABLA */}
                <div
                  style={{
                    background: cardBg,
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                >
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse'
                    }}
                  >
                    <thead>
                      <tr>
                        {[
                          'Código',
                          'Artículo',
                          'Barcode',
                          'Status',
                          'UOM'
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: '12px 15px',
                              background: tableHeaderBg,
                              color: 'white',
                              textAlign: 'left',
                              fontStyle: 'italic',
                              fontWeight: 'bold'
                            }}
                          >
                            {h}
                          </th>
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
                            borderBottom: `1px solid ${borderColor}`,
                            cursor: 'pointer',
                            background:
                              selectedItem?.ItemCode === item.ItemCode
                                ? selectedRow
                                : cardBg
                          }}
                        >
                          <td
                            style={{
                              padding: '10px 15px',
                              fontSize: '14px',
                              color: textColor
                            }}
                          >
                            {item.ItemCode}
                          </td>

                          <td
                            style={{
                              padding: '10px 15px',
                              fontSize: '14px',
                              color: textColor
                            }}
                          >
                            {item.ItemName}
                          </td>

                          <td
                            style={{
                              padding: '10px 15px',
                              fontSize: '14px',
                              color: textColor
                            }}
                          >
                            {item.BarCode || '—'}
                          </td>

                          <td style={{ padding: '10px 15px' }}>
                            <span
                              style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                background:
                                  item.Valid === 'tYES'
                                    ? '#14532d'
                                    : '#7f1d1d',
                                color:
                                  item.Valid === 'tYES'
                                    ? '#bbf7d0'
                                    : '#fecaca',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}
                            >
                              {item.Valid === 'tYES'
                                ? 'Activo'
                                : 'Inactivo'}
                            </span>
                          </td>

                          <td
                            style={{
                              padding: '10px 15px',
                              fontSize: '14px',
                              color: textColor
                            }}
                          >
                            {item.ItemBarCodeCollection?.[0]?.UoMEntry ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* PAGINACIÓN */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '10px',
                      marginTop: '15px',
                      alignItems: 'center'
                    }}
                  >
                    <button
                      onClick={() => loadItems(search, page - 1)}
                      disabled={page === 0}
                      style={{
                        padding: '8px 20px',
                        borderRadius: '20px',
                        border: `1px solid ${buttonBg}`,
                        background: cardBg,
                        color:
                          darkMode ? '#60a5fa' : '#0096D6',
                        cursor:
                          page === 0
                            ? 'not-allowed'
                            : 'pointer',
                        opacity: page === 0 ? 0.5 : 1
                      }}
                    >
                      ← Anterior
                    </button>

                    <span
                      style={{
                        color: secondaryText
                      }}
                    >
                      Página {page + 1} de {totalPages}
                    </span>

                    <button
                      onClick={() => loadItems(search, page + 1)}
                      disabled={page + 1 >= totalPages}
                      style={{
                        padding: '8px 20px',
                        borderRadius: '20px',
                        border: `1px solid ${buttonBg}`,
                        background: cardBg,
                        color:
                          darkMode ? '#60a5fa' : '#0096D6',
                        cursor:
                          page + 1 >= totalPages
                            ? 'not-allowed'
                            : 'pointer',
                        opacity:
                          page + 1 >= totalPages
                            ? 0.5
                            : 1
                      }}
                    >
                      Siguiente →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ───────── PANEL QR ───────── */}
          <div
            style={{
              width: '260px',
              background: cardBg,
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            <p
              style={{
                fontWeight: 'bold',
                fontStyle: 'italic',
                marginBottom: '15px',
                color: textColor
              }}
            >
              Código de barra o QR
            </p>

            {selectedItem?.BarCode ? (
              <div>
                <p
                  style={{
                    fontWeight: 'bold',
                    wordBreak: 'break-all',
                    marginBottom: '15px',
                    color: textColor,
                    fontSize: '14px'
                  }}
                >
                  {selectedItem.BarCode}
                </p>

                <QRCodeSVG
                  value={selectedItem.BarCode}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />

                <br />

                <button
                  onClick={() =>
                    handleGoToDetail(selectedItem)
                  }
                  style={{
                    marginTop: '15px',
                    padding: '10px 20px',
                    background: buttonBg,
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Ver detalle →
                </button>
              </div>
            ) : (
              <p
                style={{
                  color: secondaryText,
                  fontStyle: 'italic',
                  fontSize: '14px'
                }}
              >
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