import { useEffect, useState } from "react";
import "./Table.css";
import type { TableProps } from "./Table.types";
import { TableRow } from "./TableRow";
import { Button } from "../button/Button";
import { getLocale } from "../../locales/locales";
import { mergeClass } from "../../utils/class-name/className.utils";
import { Typography } from "../typography/Typography";

const strings = getLocale().tableComponent;

export function Table<TableRowData>({
  columns,
  rows,
  primaryKey,
  pageLimit,
  onRowClick,
  hideNoData,
}: Readonly<TableProps<TableRowData>>) {
  const pages = !pageLimit
    ? [rows]
    : rows.reduce((acc, current, index) => {
        if (index % pageLimit === 0) {
          acc.push([]);
        }
        acc[acc.length - 1].push(current);
        return acc;
      }, [] as TableRowData[][]);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const isFirstPage = currentPageIndex === 0;
  const isLastPage = pages.length - 1 <= currentPageIndex;
  const handlePageChange = (direction: "next" | "previous") => {
    setCurrentPageIndex((state) => state + (direction === "next" ? +1 : -1));
  };

  useEffect(() => {
    setCurrentPageIndex(0);
  }, [rows]);

  return (
    <div className={mergeClass("table-component", { clickable: !!onRowClick })}>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <Typography key={column.id} as="th" variant="secondary">
                {column.header}
              </Typography>
            ))}
          </tr>
        </thead>
        <tbody>
          {(pages[currentPageIndex] ?? []).map((row) => (
            <tr key={String(row[primaryKey])}>
              {columns.map((column) => (
                <td
                  key={`${column.id}-${String(row[primaryKey])}`}
                  onClick={() => onRowClick?.(row)}
                >
                  <TableRow column={column} row={row} rows={rows} />
                </td>
              ))}
            </tr>
          ))}
          {!rows.length && !hideNoData ? (
            <tr>
              <td colSpan={columns.length} className="no-data-row">
                <Typography bold align="center" variant="error">
                  {strings.noData}
                </Typography>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
      {pageLimit && !!rows.length ? (
        <div className="table-pagination">
          <div className="table-pagination-info">
            <Typography as="span" variant="secondary">
              {strings.page}
            </Typography>
            <Typography as="span">{currentPageIndex + 1}</Typography>
            <Typography as="span" variant="secondary">
              {strings.of}
            </Typography>
            <Typography as="span">{pages.length}</Typography>
          </div>
          <div className="table-pagination-buttons">
            <Button
              disabled={isFirstPage}
              onClick={() => handlePageChange("previous")}
            >
              {strings.previous}
            </Button>
            <Button
              disabled={isLastPage}
              onClick={() => handlePageChange("next")}
            >
              {strings.next}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
