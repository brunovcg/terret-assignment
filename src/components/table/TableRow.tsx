import type { TableRowProps } from "./Table.types";

export function TableRow<TableRowData>({
  row,
  column,
  rows,
}: Readonly<TableRowProps<TableRowData>>) {
  if (column.cell) {
    return <>{column.cell({ row, column, rows })}</>;
  }

  if (column.accessorKey) {
    return <>{String(row[column.accessorKey])}</>;
  }

  return null;
}
