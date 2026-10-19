import Badge from "../common/Badge";

const STATUS_TONE = { active: "green", inactive: "gray" };
const STATUS_LABEL = { active: "ACTIVE", inactive: "INACTIVE" };

const STOCK_TONE = {
  in_stock: "green",
  low_stock: "orange",
  out_of_stock: "red",
};
const STOCK_LABEL = {
  in_stock: "IN STOCK",
  low_stock: "LOW STOCK",
  out_of_stock: "OUT OF STOCK",
};

export function ProductStatusBadge({ status }) {
  return (
    <Badge tone={STATUS_TONE[status] || "gray"}>
      {STATUS_LABEL[status] || status}
    </Badge>
  );
}

export function StockStatusBadge({ stockStatus }) {
  return (
    <Badge tone={STOCK_TONE[stockStatus]}>{STOCK_LABEL[stockStatus]}</Badge>
  );
}
