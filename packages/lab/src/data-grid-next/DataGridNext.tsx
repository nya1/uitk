import React, { useMemo, useState } from "react";
import { GridBase } from "../grid/components";
import { GridContext } from "../grid/GridContext";
import { DataGridNextContext } from "./DataGridNextContext";
import {
  ColDefNext,
  DataGridModelEvents,
  DataGridNextModel,
  RowKeyGetterFn,
} from "./DataGridNextModel";

export interface DataGridNextProps<TRowData = any> {
  rowKeyGetter: RowKeyGetterFn<TRowData>;
  data: TRowData[];
  columnDefinitions: ColDefNext<TRowData>[];
  // TODO allow using functions for grouping?
  rowGroup?: string[]; // Column keys
  // TODO make this a component?
  leafNodeGroupNameField?: keyof TRowData; // Which field to show in the group/tree column for leaf nodes
  showTreeLines?: boolean;
  events?: DataGridModelEvents<TRowData>;
}

export const DataGridNext = function <TRowData = any>(
  props: DataGridNextProps<TRowData>
) {
  const {
    rowKeyGetter,
    data,
    rowGroup,
    showTreeLines,
    leafNodeGroupNameField,
    columnDefinitions,
    events,
  } = props;

  const [dataGridModel] = useState<DataGridNextModel<TRowData>>(
    () =>
      new DataGridNextModel({
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
  dataGridModel.setRowGroup(rowGroup);
  dataGridModel.setShowTreeLines(showTreeLines || false);
  dataGridModel.setLeafNodeGroupNameField(leafNodeGroupNameField);

  return (
    <DataGridNextContext.Provider value={contextValue}>
      <GridContext.Provider value={gridContextValue}>
        <GridBase />
      </GridContext.Provider>
    </DataGridNextContext.Provider>
  );
};
