interface TableProps {
  columns: string[];
  rows: string[][];
}

export default function Table({ columns, rows }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-blue-50 text-slate-700">
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
            <tr key={`${row.join("-")}-${rowIndex}`} className="border-t border-blue-50">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="px-4 py-3 text-slate-600">
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
