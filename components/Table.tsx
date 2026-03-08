import { ReactNode } from "react";

interface TableProps {
  columns: string[];
  rows: ReactNode[][];
}

export default function Table({ columns, rows }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm" style={{ borderColor: "var(--color-border)" }}>
      <table className="min-w-full text-left text-sm">
        <thead className="text-slate-700" style={{ backgroundColor: "var(--color-primary-soft)" }}>
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`} className="border-t" style={{ borderColor: "var(--color-border)" }}>
              {row.map((cell, cellIndex) => (
                <td key={`cell-${rowIndex}-${cellIndex}`} className="px-4 py-3 text-slate-600">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
