import React, { ComponentType, useMemo, useState } from "react";
import { GridBase } from "../grid/components";
import { GridContext } from "../grid/GridContext";
import { DataGridContext } from "./DataGridContext";
import {
  ColDefNext,
  DataGridModelEvents,
  DataGridModel,
  GroupRowNode,
  RowKeyGetterFn,
  RowNode,
  SortFn,
} from "./DataGridModel";

// Sorting
interface SortColumn {
  columnKey: string;
  direction: "ascending" | "descending";
}

// TODO delete (replaced by external sort)
export interface DataGridSortSettings {
  sortColumns: SortColumn[];
}

// Row Grouping
export interface DataGridRowGroupCellComponentProps<
  TRowData,
  TGroupCellValue = any
> {
  rowNode: GroupRowNode<TRowData>;
}

// TODO How are we going to control grouping from the UI?
export interface DataGridRowGroupLevelSettings<TRowData> {
  // columnKey?: string; // Group by value in the given column
  // groupFn?: (rowData: TRowData) => string; // Group by value produced by the given function
  field: keyof TRowData;
  // Tree node component. What about other columns?
  groupCellComponent?: ComponentType<
    DataGridRowGroupCellComponentProps<TRowData>
  >;
}

export interface DataGridLeafNodeProps<TRowData> {
  rowNode: RowNode<TRowData>;
}

export interface DataGridRowGroupSettings<TRowData> {
  groupLevels: DataGridRowGroupLevelSettings<TRowData>[];
  leafCellComponent?: ComponentType<DataGridLeafNodeProps<TRowData>>;
  showTreeLines?: boolean;
  title?: string;
  width?: number;
}

// Filtering

export interface DataGridColumnFilterSettings<TCellValue = any> {
  columnKey: string;
  filterFn: (cellValue: TCellValue) => boolean;
}

export interface DataGridFilterSettings<TRowData> {
  columnFilters?: DataGridColumnFilterSettings[];
  filterFn: (rowData: TRowData) => boolean;
}

export interface DataGridProps<TRowData = any> {
  className?: string;

  rowKeyGetter: RowKeyGetterFn<TRowData>;
  data: TRowData[];
  columnDefinitions: ColDefNext<TRowData>[];
  // TODO make this a component?
  leafNodeGroupNameField?: keyof TRowData; // Which field to show in the group/tree column for leaf nodes
  showTreeLines?: boolean;
  events?: DataGridModelEvents<TRowData>;

  // Sorting
  // TODO remove this
  sortSettings?: DataGridSortSettings;
  defaultSortSettings?: DataGridSortSettings;
  onSortSettingsChanged?: (sortSettings: DataGridSortSettings) => void;
  sortFn?: SortFn<TRowData>;

  // Row Grouping
  rowGrouping?: DataGridRowGroupSettings<TRowData>;
  defaultRowGrouping?: DataGridRowGroupSettings<TRowData>;
  onRowGroupingChanged?: (
    rowGrouping: DataGridRowGroupSettings<TRowData>
  ) => void;

  // Filtering
  filterFn?: (rowData: TRowData) => boolean;
}

export const DataGrid = function <TRowData = any>(
  props: DataGridProps<TRowData>
) {
  const {
    className,
    rowKeyGetter,
    data,
    // rowGroup,
    rowGrouping,
    showTreeLines,
    leafNodeGroupNameField,
    columnDefinitions,
    events,
    filterFn,
    sortFn,
  } = props;

  const [dataGridModel] = useState<DataGridModel<TRowData>>(
    () =>
      new DataGridModel({
        rowKeyGetter,
        data,
        columnDefinitions,
        events,
      })
  );

  const contextValue = useMemo(() => ({ dataGridModel }), []);

  const gridContextValue = useMemo(
    () => ({ model: dataGridModel.gridModel }),
    [dataGridModel.gridModel]
  );

  dataGridModel.setRowData(data);
  dataGridModel.setColumnDefs(columnDefinitions);
  dataGridModel.setRowGrouping(rowGrouping);
  dataGridModel.setShowTreeLines(showTreeLines || false);
  dataGridModel.setLeafNodeGroupNameField(leafNodeGroupNameField);
  dataGridModel.setFilterFn(filterFn);
  dataGridModel.setSortFn(sortFn);

  return (
    <DataGridContext.Provider value={contextValue}>
      <GridContext.Provider value={gridContextValue}>
        <GridBase className={className} />
      </GridContext.Provider>
    </DataGridContext.Provider>
  );
};
