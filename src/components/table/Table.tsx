import "./Table.css";
import type { TableProps } from "./Table.types";
import { TableRow } from "./TableRow";

export function Table<TableRowData>({
  columns,
  rows,
  primaryKey,
  onRowClick,
}: Readonly<TableProps<TableRowData>>) {
  return (
    <div className="table-component">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[primaryKey] as string}>
              {columns.map((column) => (
                <td
                  key={`${column.id}-${row[primaryKey]}`}
                  onClick={() => onRowClick?.(row)}
                >
                  <TableRow column={column} row={row} rows={rows} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
