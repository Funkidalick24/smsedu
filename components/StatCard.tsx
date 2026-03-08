interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
}

export default function StatCard({ title, value, trend }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm" style={{ borderColor: "var(--color-border)" }}>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold" style={{ color: "var(--color-primary-strong)" }}>
        {value}
      </p>
      {trend ? (
        <p className="mt-1 text-xs" style={{ color: "var(--color-primary)" }}>
          {trend} this period
        </p>
      ) : null}
    </div>
  );
}
