interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
}

export default function StatCard({ title, value, trend }: StatCardProps) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-blue-900">{value}</p>
      {trend ? <p className="mt-1 text-xs text-blue-700">{trend} this period</p> : null}
    </div>
  );
}
