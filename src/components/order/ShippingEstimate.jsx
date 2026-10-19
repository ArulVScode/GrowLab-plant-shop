import { PackageCheck, Truck } from "lucide-react";
import { formatDate } from "../../utils/format";

export default function ShippingEstimate({ estimatedDeparture, estimatedArrival, note }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="nb-surface-sm p-4 bg-sky-soft">
        <div className="flex items-center gap-2 mb-2">
          <Truck size={18} />
          <span className="text-xs font-display font-bold uppercase tracking-wide">Estimasi Keberangkatan</span>
        </div>
        <p className="font-display font-extrabold text-lg">{formatDate(estimatedDeparture)}</p>
        <p className="text-xs text-muted mt-1">
          {note || "Pesanan sedang diproses dan diperkirakan diserahkan kepada kurir pada tanggal ini."}
        </p>
      </div>
      <div className="nb-surface-sm p-4 bg-leaf-soft">
        <div className="flex items-center gap-2 mb-2">
          <PackageCheck size={18} />
          <span className="text-xs font-display font-bold uppercase tracking-wide">Estimasi Tiba</span>
        </div>
        <p className="font-display font-extrabold text-lg">{estimatedArrival}</p>
        <p className="text-xs text-muted mt-1">Perkiraan waktu pesanan sampai di alamat tujuan.</p>
      </div>
    </div>
  );
}
