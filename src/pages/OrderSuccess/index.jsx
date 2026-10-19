import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { CheckCircle2, Truck, PackageCheck } from "lucide-react";
import { getOrderByNumber } from "../../services/customerOrderService";
import { formatDate } from "../../utils/format";
import PaymentInstructions from "../../components/order/PaymentInstructions";

export default function OrderSuccess() {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderNumber));

  useEffect(() => {
    if (!orderNumber) return;
    getOrderByNumber(orderNumber)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (!orderNumber) return <Navigate to="/" replace />;
  if (loading) return null;
  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="container-max section-pad py-12 md:py-20">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-leaf border-3 border-ink shadow-hard rounded-full">
          <CheckCircle2 size={36} strokeWidth={2} />
        </div>
        <h1 className="text-3xl md:text-4xl mb-2">Checkout Berhasil!</h1>
        <p className="text-muted mb-6">Pesananmu telah berhasil dibuat.</p>

        <div className="mb-8">
          <PaymentInstructions order={order} />
        </div>

        <div className="nb-surface-sm inline-block px-5 py-2.5 mb-8">
          <span className="text-xs text-muted block">Nomor Pesanan</span>
          <span className="font-display font-bold">{order.orderNumber}</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-10 text-left">
          <div className="nb-surface-sm p-4 bg-sky-soft">
            <div className="flex items-center gap-2 mb-1.5">
              <Truck size={16} />
              <span className="text-xs font-display font-bold uppercase">
                Estimasi Keberangkatan
              </span>
            </div>
            <p className="font-display font-bold">
              {formatDate(order.estimatedDeparture)}
            </p>
          </div>
          <div className="nb-surface-sm p-4 bg-leaf-soft">
            <div className="flex items-center gap-2 mb-1.5">
              <PackageCheck size={16} />
              <span className="text-xs font-display font-bold uppercase">
                Estimasi Tiba
              </span>
            </div>
            <p className="font-display font-bold">{order.estimatedArrival}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={`/track-order?order=${order.orderNumber}`}
            className="nb-btn-primary"
          >
            Lacak Pesanan
          </Link>
          <Link to="/products" className="nb-btn-outline">
            Kembali Belanja
          </Link>
        </div>
      </div>
    </div>
  );
}
