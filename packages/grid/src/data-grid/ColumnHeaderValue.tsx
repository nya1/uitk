import { HeaderValueProps } from "../grid";
import { DataGridColumn } from "./DataGridModel";
import { makePrefixer } from "@jpmorganchase/uitk-core";
import "./ColumnHeaderValue.css";
import { ArrowDownIcon, ArrowUpIcon } from "@jpmorganchase/uitk-icons";
import { Badge } from "@jpmorganchase/uitk-lab";

const withBasename = makePrefixer("uitkColumnHeaderValueNext");

export const ColumnHeaderValue = function ColumHeaderValue<TRowData>(
  props: HeaderValueProps<TRowData, any, DataGridColumn<TRowData>>
) {
  const { column } = props;
  const title = column.useTitle();
  // TODO data-grid column headers could receive data-grid columns directly. Do we need grid columns here?
  const dataGridColumn = column.useData();
  if (!dataGridColumn) {
    throw new Error(`DataGrid column not found.`);
  }
  const sortDirection = dataGridColumn.useSortDirection();
  const sortPriority = dataGridColumn.useSortPriority();
  // const menuModel = dataGridColumn.menu;
  // const isFilterApplied = menuModel.filter.useIsFilterApplied();
  // const title = dataGridColumn?.definition.title || "";
  return (
    <span className={withBasename()}>
      {title}
      {sortPriority != undefined ? (
        <Badge badgeContent={sortPriority + 1}>
          {sortDirection === "ascending" ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </Badge>
      ) : null}
      {/*{isFilterApplied ? <FilterIcon /> : null}*/}
      {/*<ColumnMenu model={menuModel} />*/}
    </span>
  );
};
