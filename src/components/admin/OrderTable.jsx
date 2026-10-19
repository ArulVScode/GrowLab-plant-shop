import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import OrderStatusBadge from "../order/OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";
import { formatRupiah, formatShortDate } from "../../utils/format";

export default function OrderTable({ orders }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block nb-surface-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b-3 border-ink text-left">
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Order
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Customer
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Date
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Total
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Payment
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Status
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.orderNumber}
                className="border-b-2 border-ink/10 last:border-b-0 hover:bg-cream/60 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="font-semibold whitespace-nowrap">
                    {o.orderNumber}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {o.itemCount} item{o.itemCount > 1 ? "s" : ""}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold whitespace-nowrap">
                    {o.customerName}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{o.customerPhone}</p>
                </td>
                <td className="px-4 py-3 text-muted whitespace-nowrap">
                  {formatShortDate(o.createdAt)}
                </td>
                <td className="px-4 py-3 font-semibold whitespace-nowrap">
                  {formatRupiah(o.total)}
                </td>
                <td className="px-4 py-3">
                  <PaymentStatusBadge status={o.paymentStatus} />
                </td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <Link
                      to={`/admin/orders/${o.orderNumber}`}
                      aria-label={`Lihat pesanan ${o.orderNumber}`}
                      className="w-8 h-8 flex items-center justify-center border-2 border-ink hover:bg-sky-soft transition-colors"
                    >
                      <Eye size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden flex flex-col gap-3">
        {orders.map((o) => (
          <Link
            key={o.orderNumber}
            to={`/admin/orders/${o.orderNumber}`}
            className="nb-surface-sm p-4 block"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="font-semibold text-sm">{o.orderNumber}</p>
                <p className="text-xs text-muted mt-0.5">
                  {o.itemCount} item{o.itemCount > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-muted mt-0.5">{o.customerName}</p>
              </div>
              <OrderStatusBadge status={o.status} />
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-display font-bold">
                {formatRupiah(o.total)}
              </span>
              <span className="text-muted">{formatShortDate(o.createdAt)}</span>
            </div>
            <PaymentStatusBadge status={o.paymentStatus} />
          </Link>
        ))}
      </div>
    </>
  );
}
