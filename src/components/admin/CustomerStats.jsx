import { Users, UserCheck, UserPlus, UserX } from "lucide-react";
import StatCard from "./StatCard";

export default function CustomerStats({ customers }) {
  const total = customers.length;
  const active = customers.filter((c) => c.status === "active").length;
  const suspended = customers.filter((c) => c.status === "suspended").length;
  const newThisMonth = customers.filter((c) => {
    const joined = new Date(c.joinedAt);
    const now = new Date("2026-09-23T09:00:00+07:00");
    return (
      joined.getMonth() === now.getMonth() &&
      joined.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <StatCard label="Total Customers" value={total} icon={Users} />
      <StatCard label="Active" value={active} icon={UserCheck} tone="green" />
      <StatCard
        label="New This Month"
        value={newThisMonth}
        icon={UserPlus}
        tone="blue"
      />
      <StatCard
        label="Suspended"
        value={suspended}
        icon={UserX}
        tone="orange"
      />
    </div>
  );
}
