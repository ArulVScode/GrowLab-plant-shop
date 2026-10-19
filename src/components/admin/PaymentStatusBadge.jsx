import Badge from "../common/Badge";
import { paymentStatusLabel } from "../../data/adminOrders";

const TONE = { paid: "green", pending: "yellow", refunded: "gray" };

export default function PaymentStatusBadge({ status }) {
  return (
    <Badge tone={TONE[status] || "gray"}>
      {paymentStatusLabel[status]?.toUpperCase() || status}
    </Badge>
  );
}
