import { makePrefixer } from "@jpmorganchase/uitk-core";
import { CellValueProps } from "../../grid";
import { DataGridColumn, isGroupNode, RowNode } from "../DataGridNextModel";
import "./GroupCellValue.css";
import { useDataGridNextContext } from "../DataGridNextContext";
import { ChevronDownIcon, ChevronRightIcon } from "../../../../icons";
import { TreeLines } from "./TreeLines";
import { CSSProperties, useMemo } from "react";

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
  if (!rowNode) {
    return null;
  }
  const model = useDataGridNextContext();
  const showTreeLines = model.dataGridModel.useShowTreeLines();

  if (isGroupNode(rowNode)) {
    const level = rowNode.level;
    const name = rowNode.name;
    // const isExpandable = rowNode.isExpandable;
    const isExpanded = rowNode.useIsExpanded();

    const style: CSSProperties = useMemo(() => {
      if (showTreeLines) {
        return {};
      }
      return {
        marginLeft: `${level * 16}px`,
      };
    }, [level, showTreeLines]);

    const onClick = () => {
      model.dataGridModel.expandCollapseNode({
        rowNode,
        expand: !rowNode.isExpanded$.getValue(),
      });
    };

    return (
      <div className={withBaseName()} style={style} onClick={onClick}>
        {showTreeLines ? <TreeLines lines={rowNode.treeLines} /> : null}
        <div className={withBaseName("icon")}>
          {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </div>
        {name}
      </div>
    );
  }

  return (
    <div className={withBaseName()}>
      {showTreeLines ? <TreeLines lines={rowNode.treeLines} /> : null}
    </div>
  );
};
