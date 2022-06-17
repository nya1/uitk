import "./CellMeasure.css";
import { useEffect, useRef } from "react";
import { useGridContext } from "../GridContext";
import { makePrefixer, useDensity } from "@jpmorganchase/uitk-core";

const withBaseName = makePrefixer("uitkGridCellMeasure");

export interface CellMeasureProps<T> {}

// Dummy cell rendered to measure rowHeight
// Invisible for the user
export function CellMeasure<T>(props: CellMeasureProps<T>) {
  const cellRef = useRef<HTMLTableCellElement>(null);
  const rowRef = useRef<HTMLTableRowElement>(null);

  const { model } = useGridContext();
  const density = useDensity();

  useEffect(() => {
    if (rowRef.current) {
      // const height = cellRef.current.getBoundingClientRect().height;
      const height = rowRef.current.getBoundingClientRect().height;
      // console.log(`CellMeasure sets rowHeight to ${height}`);
      model.setRowHeight(height);
    }
  }, [cellRef.current, density]);

  return (
    <div className={withBaseName()}>
      <table>
        <thead>
          <tr ref={rowRef}>
            <th ref={cellRef}>Invisible Cell</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}
