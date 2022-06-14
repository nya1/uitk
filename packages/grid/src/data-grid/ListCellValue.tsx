import { CellValueProps } from "../grid";
import { DataGridColumn, isLeafNode, RowNode } from "./DataGridModel";

export const ListCellValue = function ListCellValue<TRowData, TColumnData>(
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
      return null;
    }
    const field = dataGridColumn.definition.field;
    const value = rowData[field as keyof TRowData] as any as string[];
    return <>{value.join(", ")}</>;
  }
  return null;
};
