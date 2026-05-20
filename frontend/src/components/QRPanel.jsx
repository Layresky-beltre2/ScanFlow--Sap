import { QRCodeSVG } from 'qrcode.react';

export default function QRPanel({ item }) {
  if (!item) {
    return (
      <div className="qr-panel empty">
        <p>Selecciona un artículo para ver su QR</p>
      </div>
    );
  }

  const mainBarcode = item.BarCode;

  return (
    <div className="qr-panel">
      {mainBarcode ? (
        <div className="qr-main">
          {/* Código escrito como texto */}
          <p className="barcode-text">{mainBarcode}</p>
          {/* Representación visual como QR */}
          <QRCodeSVG value={mainBarcode} size={180} />
        </div>
      ) : (
        <p className="empty-msg">Sin código de barra principal</p>
      )}
    </div>
  );
}