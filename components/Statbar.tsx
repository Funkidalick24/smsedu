interface StatbarProps {
  label: string;
  value: number;
}

export default function Statbar({ label, value }: StatbarProps) {
  const bounded = Math.max(0, Math.min(100, value));

  return (
    <div className="rounded-lg border border-blue-100 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-blue-900">{bounded}%</span>
      </div>
      <div className="h-2 rounded bg-blue-100">
        <div className="h-2 rounded bg-blue-700" style={{ width: `${bounded}%` }} />
      </div>
    </div>
  );
}
