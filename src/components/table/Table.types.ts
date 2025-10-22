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

export type TableColumn<TableRowData> = CustomTableColumn<TableRowData> & {
  id: string | number;
  header: ReactNode;
  tdClassName?: string;
};

export type TableColumns<TableRowData> = TableColumn<TableRowData>[];

export type TableProps<TableRowData> = {
  columns: TableColumn<TableRowData>[];
  rows: TableRowData[];
  primaryKey: keyof TableRowData;
  onRowClick?: (row: TableRowData) => void;
  pageLimit?: number;
  hideNoData?: boolean;
};

export type TableRowProps<TableRowData> = {
  row: TableRowData;
  rows: TableRowData[];
  column: TableColumn<TableRowData>;
};
