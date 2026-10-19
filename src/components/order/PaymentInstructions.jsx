import { useEffect, useState } from "react";
import { getPaymentSettings } from "../../services/settingsService";
import { formatRupiah } from "../../utils/format";

// Tipe pembayaran dibaca dari label metode yang disimpan di order.
function paymentType(method = "") {
  const m = method.toLowerCase();
  if (m.includes("virtual")) return "va";
  if (m.includes("e-wallet") || m.includes("ewallet")) return "ewallet";
  if (m.includes("transfer")) return "bank";
  return null; // COD tidak butuh instruksi
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-display font-bold text-right break-all">
        {value}
      </span>
    </div>
  );
}

export default function PaymentInstructions({ order }) {
  const [settings, setSettings] = useState(null);
  const type = paymentType(order.paymentMethod);

  useEffect(() => {
    if (!type) return;
    getPaymentSettings()
      .then(setSettings)
      .catch(() => setSettings(null));
  }, [type]);

  if (!type || order.paymentStatus !== "pending" || !settings) return null;

  const s = settings[type];
  const filled = Object.values(s).some(Boolean);

  return (
    <div className="nb-surface-sm p-4 text-left flex flex-col gap-2">
      <p className="font-display font-bold text-sm uppercase">
        Instruksi Pembayaran
      </p>
      <Row label="Total yang harus dibayar" value={formatRupiah(order.total)} />

      {!filled ? (
        <p className="text-sm text-muted">
          Detail pembayaran belum diatur. Silakan hubungi admin toko.
        </p>
      ) : (
        <>
          {type === "bank" && (
            <>
              <Row label="Bank" value={s.name} />
              <Row label="Nomor Rekening" value={s.accountNumber} />
              <Row label="Atas Nama" value={s.accountName} />
            </>
          )}
          {type === "va" && (
            <>
              <Row label="Bank" value={s.bank} />
              <Row label="Nomor VA" value={s.number} />
            </>
          )}
          {type === "ewallet" && (
            <>
              <Row label="E-Wallet" value={s.provider} />
              <Row label="Nomor" value={s.number} />
              <Row label="Atas Nama" value={s.accountName} />
              {s.qrisUrl && (
                <img
                  src={s.qrisUrl}
                  alt="QRIS"
                  className="w-48 h-48 object-contain mx-auto border-2 border-ink mt-2"
                />
              )}
            </>
          )}
        </>
      )}

      <p className="text-xs text-muted mt-1">
        Cantumkan nomor pesanan <b>{order.orderNumber}</b> pada berita transfer.
        Pesanan diproses setelah admin mengonfirmasi pembayaran.
      </p>
    </div>
  );
}
