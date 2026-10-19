import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import Badge from "../common/Badge";
import { formatRupiah, formatShortDate } from "../../utils/format";

const STATUS_TONE = { active: "green", suspended: "red" };

export default function CustomerTable({ customers }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block nb-surface-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b-3 border-ink text-left">
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Customer
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Phone
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Joined
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Orders
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Total Spent
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
            {customers.map((c) => (
              <tr
                key={c.id}
                className="border-b-2 border-ink/10 last:border-b-0 hover:bg-cream/60 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <span className="w-9 h-9 rounded-full bg-yellow border-2 border-ink flex items-center justify-center font-display font-bold text-xs shrink-0">
                      {c.name[0]}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{c.name}</p>
                      <p className="text-xs text-muted truncate">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted whitespace-nowrap">
                  {c.phone}
                </td>
                <td className="px-4 py-3 text-muted whitespace-nowrap">
                  {formatShortDate(c.joinedAt)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{c.totalOrders}</td>
                <td className="px-4 py-3 font-semibold whitespace-nowrap">
                  {formatRupiah(c.totalSpent)}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={STATUS_TONE[c.status]}>
                    {c.status === "active" ? "ACTIVE" : "SUSPENDED"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <Link
                      to={`/admin/customers/${c.id}`}
                      aria-label={`Lihat ${c.name}`}
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
        {customers.map((c) => (
          <Link
            key={c.id}
            to={`/admin/customers/${c.id}`}
            className="nb-surface-sm p-4 block"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="w-9 h-9 rounded-full bg-yellow border-2 border-ink flex items-center justify-center font-display font-bold text-xs shrink-0">
                {c.name[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{c.name}</p>
                <p className="text-xs text-muted truncate">{c.email}</p>
              </div>
              <Badge tone={STATUS_TONE[c.status]}>
                {c.status === "active" ? "ACTIVE" : "SUSPENDED"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">{c.totalOrders} orders</span>
              <span className="font-display font-bold">
                {formatRupiah(c.totalSpent)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
