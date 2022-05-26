import { makePrefixer } from "@jpmorganchase/uitk-core";
import { CellValueProps } from "../../grid";
import { DataGridColumn, isGroupNode, RowNode } from "../DataGridNextModel";
import { CSSProperties, useMemo } from "react";
import "./GroupCellValue.css";
import { useDataGridNextContext } from "../DataGridNextContext";
import { ChevronDownIcon, ChevronRightIcon } from "../../../../icons";

const withBaseName = makePrefixer("uitkDataGridGroupCellValue");

export const GroupCellValue = function GroupCellValue<TRowData, TColumnData>(
  props: CellValueProps<
    RowNode<TRowData>,
    any,
    DataGridColumn<TRowData, TColumnData>
  >
) {
  const { row } = props;
  const rowNode: RowNode<TRowData> = row.useData();
  if (isGroupNode(rowNode)) {
    const model = useDataGridNextContext();
    const level = rowNode.level;
    const name = rowNode.name;
    const isExpandable = rowNode.isExpandable;
    const isExpanded = rowNode.useIsExpanded();

    const style: CSSProperties = useMemo(() => {
      return {
        marginLeft: `${level * 16}px`,
      };
    }, [level, isExpandable, isExpanded]);

    const onClick = () => {
      model.dataGridModel.expandCollapseNode({
        rowNode,
        expand: !rowNode.isExpanded$.getValue(),
      });
    };

    return (
      <div className={withBaseName()} style={style} onClick={onClick}>
        {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        {name}
      </div>
    );
  }
  return <></>;
};
