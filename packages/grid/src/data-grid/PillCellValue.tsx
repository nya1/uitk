import { CellValueProps } from "../grid";
import { DataGridColumn, isLeafNode, RowNode } from "./DataGridModel";
import { PillBase } from "../../../lab/src/pill/internal/PillBase";
import { makePrefixer } from "@jpmorganchase/uitk-core";
import "./PillCellValue.css";

const withBaseName = makePrefixer("uitkDataGridPillCellValue");

export const PillCellValue = function BreadcrumbsCellValue<
  TRowData,
  TColumnData
>(
  props: CellValueProps<
    RowNode<TRowData>,
    any,
    DataGridColumn<TRowData, TColumnData>
  >
) {
  const { row, column } = props;
  const rowNode: RowNode<TRowData> = row.useData();
  if (rowNode && isLeafNode(rowNode)) {
    const rowData: TRowData = rowNode.useData();
    const dataGridColumn = column.useData();
    if (!dataGridColumn) {
      return <>{`ERROR: Column "${column.key}" has no data`}</>;
    }
    const field = dataGridColumn.definition.field;
    const value = rowData[field as keyof TRowData] as any as string[];
    return (
      <>
        {value.map((x) => (
          <PillBase key={x} label={x} className={withBaseName("pill")} />
        ))}
      </>
    );
  }
  return null;
};
