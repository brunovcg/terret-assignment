import type { ReactNode } from "react";

type CustomTableColumn<TableRowData> =
  | {
      accessorKey: keyof TableRowData;
      cell?: ({
        row,
        rows,
        column,
      }: {
        row: TableRowData;
        rows: TableRowData[];
        column: CustomTableColumn<TableRowData> & {
          header: ReactNode;
        };
      }) => ReactNode;
    }
  | {
      accessorKey?: keyof TableRowData;
      cell: ({
        row,
        rows,
        column,
      }: {
        row: TableRowData;
        rows: TableRowData[];
        column: CustomTableColumn<TableRowData> & {
          header: ReactNode;
        };
      }) => ReactNode;
    };

type TableColumn<TableRowData> = CustomTableColumn<TableRowData> & {
  id: string | number;
  header: ReactNode;
  hideColumn?: boolean;
};

export type TableColumns<TableRowData> = TableColumn<TableRowData>[];

export type TableProps<TableRowData> = {
  columns: TableColumn<TableRowData>[];
  rows: TableRowData[];
  primaryKey: keyof TableRowData;
  onRowClick?: (row: TableRowData) => void;
};

export type TableRowProps<TableRowData> = {
  row: TableRowData;
  rows: TableRowData[];
  column: TableColumn<TableRowData>;
};
