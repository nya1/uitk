import { HeaderValueProps } from "../grid";
import { DataGridColumn } from "./DataGridModel";
import { makePrefixer } from "@jpmorganchase/uitk-core";
import "./ColumnHeaderValue.css";
import { ColumnMenu } from "./column-menu/ColumnMenu";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  FilterIcon,
} from "@jpmorganchase/uitk-icons";

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
      {sortDirection === "ascending" ? <ArrowUpIcon /> : null}
      {sortDirection === "descending" ? <ArrowDownIcon /> : null}
      {sortPriority != undefined ? <span>{sortPriority}</span> : null}
      {/*{isFilterApplied ? <FilterIcon /> : null}*/}
      {/*<ColumnMenu model={menuModel} />*/}
    </span>
  );
};
