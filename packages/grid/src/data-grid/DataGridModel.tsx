import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Subject,
  switchMap,
} from "rxjs";
import {
  ColumnDefinition,
  createHandler,
  createHook,
  GridModel,
  RowKeyGetter,
} from "../grid";
import React from "react";
import { TextCellValue } from "./TextCellValue";
import { ColumnHeaderValue } from "./ColumnHeaderValue";
import { ColumnMenuModel } from "./column-menu/ColumnMenuModel";
import { GroupCellValue } from "./row-grouping/GroupCellValue";
import {
  DataGridRowGroupLevelSettings,
  DataGridRowGroupSettings,
} from "./DataGrid";

export type ValueGetterFn<TRowData, TCellValue> = (
  rowNode: RowNode<TRowData>
) => TCellValue;
export type RowKeyGetterFn<TRowData> = (rowData: TRowData) => string;
export type HeaderValueGetterFn<TColumnData, THeaderValue = any> = (
  column: ColDefNext<TColumnData>
) => THeaderValue;

export type ColFilterFn<TRowData> = (rowData: TRowData) => boolean;

export interface ColDefNext<
  TRowData = any,
  TColumnData = any,
  THeaderValue = TColumnData,
  TCellValue = any
> {
  key: string;
  field: string;
  type: string;
  width?: number;
  title?: string;
  data?: TColumnData;
  headerValueGetter?: HeaderValueGetterFn<TColumnData, THeaderValue>;
  headerComponent?: React.ComponentType<THeaderValue>;
  pinned?: "left" | "right";
  cellValueGetter?: ValueGetterFn<TRowData, TCellValue>;
  cellComponent?: React.ComponentType<TCellValue>;
}

export type RowNodeType = "group" | "leaf";

export class GroupRowNode<TRowData = any> {
  public readonly rowNodeType = "group";
  public readonly key: string;
  public readonly name: string;
  public readonly isExpanded$: BehaviorSubject<boolean>;
  public readonly level: number;
  public readonly children: Array<RowNode<TRowData> | GroupRowNode<TRowData>>;
  public readonly useIsExpanded: () => boolean;
  public readonly setExpanded: (expanded: boolean) => void;
  public treeLines: string[] = [];

  public get isExpandable() {
    return this.children != undefined;
  }

  public constructor(
    key: string,
    name: string,
    level: number,
    children: Array<RowNode<TRowData> | GroupRowNode<TRowData>>
  ) {
    this.key = key;
    this.name = name;
    this.isExpanded$ = new BehaviorSubject<boolean>(true);
    this.level = level;
    this.children = children;
    this.useIsExpanded = createHook(this.isExpanded$);
    this.setExpanded = createHandler(this.isExpanded$);
  }
}

export class LeafRowNode<TRowData = any> {
  public readonly rowNodeType = "leaf";
  public readonly key: string;
  // TODO extract these into a "tree cell" class?
  public name: string = "";
  public level: number = 0;

  public readonly data$: BehaviorSubject<TRowData>;
  public readonly useData: () => TRowData;
  public treeLines: string[] = [];

  public constructor(key: string, data: TRowData) {
    this.key = key;
    this.data$ = new BehaviorSubject<TRowData>(data);
    this.useData = createHook(this.data$);
  }
}

export type RowNode<TRowData = any> =
  | GroupRowNode<TRowData>
  | LeafRowNode<TRowData>;

export function isGroupNode<TRowData = any>(
  rowNode: RowNode<TRowData>
): rowNode is GroupRowNode<TRowData> {
  return rowNode.rowNodeType === "group";
}

export function isLeafNode<TRowData = any>(
  rowNode: RowNode<TRowData>
): rowNode is LeafRowNode<TRowData> {
  return rowNode.rowNodeType === "leaf";
}

export interface ExpandCollapseEvent<TRowData = any> {
  rowNode: GroupRowNode<TRowData>;
  expand?: boolean;
}

export class DataGridColumn<
  TRowData = any,
  TColumnData = any,
  THeaderValue = TColumnData,
  TCellValue = any
> {
  public readonly definition: ColDefNext<
    TRowData,
    TColumnData,
    THeaderValue,
    TCellValue
  >;
  // public readonly menu: ColumnMenuModel;

  public constructor(
    definition: ColDefNext<TRowData, TColumnData, THeaderValue, TCellValue>
  ) {
    this.definition = definition;
    // this.menu = new ColumnMenuModel();
  }
}

export interface DataGridModelEvents<TRowData> {
  columnVisible?: () => void;
  columnPinned?: () => void;
  columnResized?: (column: DataGridColumn) => void;
  columnMoved?: (column: DataGridColumn) => void;
  columnsChanged?: (columns: DataGridColumn[]) => void;
  visibleColumnsChanged?: (columns: DataGridColumn[]) => void;
  cellKeyDown?: () => void;
  cellKeyPress?: () => void;
  scroll?: () => void;
  rowDataChanged?: (rowNode: RowNode<TRowData>) => void;
  cellClicked?: () => void;
  cellDoubleClicked?: () => void;
  cellFocused?: () => void;
  cellMouseOver?: () => void;
  cellMouseDown?: () => void;
  rowClicked?: (rowNode: RowNode<TRowData>) => void;
  rowDoubleClicked?: (rowNode: RowNode<TRowData>) => void;
  rowSelected?: (rowNode: RowNode<TRowData>) => void;
  selectionChanged?: () => void;
  rangeSelectionChanged?: () => void;
}

export interface DataGridModelOptions<TRowData> {
  rowKeyGetter: RowKeyGetterFn<TRowData>;
  data?: TRowData[];
  columnDefinitions?: ColDefNext<TRowData>[];
  events?: DataGridModelEvents<TRowData>;
}

export type FilterFn<TRowData> = (rowData: TRowData) => boolean;
export type SortFn<TRowData> = (a: TRowData, b: TRowData) => number;

export function groupRows<TRowData>(
  rows: LeafRowNode<TRowData>[],
  rowGrouping: DataGridRowGroupSettings<TRowData>,
  leafNodeGroupNameField?: keyof TRowData
) {
  let i = 0;
  const groupNodesBy = (
    nodes: LeafRowNode<TRowData>[],
    // fields: Array<keyof TRowData>,
    levels: DataGridRowGroupLevelSettings<TRowData>[],
    level: number
  ): RowNode<TRowData>[] => {
    if (levels.length === 0) {
      if (leafNodeGroupNameField) {
        nodes.forEach((leafNode) => {
          leafNode.name = String(
            leafNode.data$.getValue()[leafNodeGroupNameField]
          );
        });
      }
      return nodes;
    }
    const m = new Map<string, LeafRowNode<TRowData>[]>();
    nodes.forEach((r) => {
      const k = String(r.data$.getValue()[levels[0].field]);
      if (m.has(k)) {
        m.get(k)!.push(r);
      } else {
        m.set(k, [r]);
      }
    });
    return [...m.entries()].map(([k, v]) => {
      return new GroupRowNode<TRowData>(
        String(i++),
        k,
        level,
        groupNodesBy(v, levels.slice(1), level + 1)
      );
    });
  };

  // const fields = rowGrouping.map((field) => field as keyof TRowData);
  const levels = rowGrouping.groupLevels;
  return groupNodesBy(rows, levels, 0);
}

export function flattenVisibleRows<TRowData>(
  topLevelRows: RowNode<TRowData>[]
) {
  const visibleRows: RowNode<TRowData>[] = [];

  const addToVisible = (
    nodes: RowNode<TRowData>[],
    lines: string[],
    level: number
  ) => {
    nodes.forEach((n, i) => {
      const isLastChild = nodes.length - i === 1;
      n.treeLines = [...lines, isLastChild ? "L" : "T"];
      // n.treeLines = lines.length === 0 ? [] : [...lines, isLastChild ? "L" : "T"];
      visibleRows.push(n);
      if (isGroupNode(n)) {
        if (n.isExpanded$.getValue()) {
          addToVisible(
            n.children,
            // nextLines
            [...lines, isLastChild ? " " : "I"],
            level + 1
          );
        }
      } else {
        n.level = level;
      }
    });
  };
  addToVisible(topLevelRows, [], 0);
  return visibleRows;
}

export class DataGridModel<TRowData = any> {
  private readonly rowKeyGetter: RowKeyGetterFn<TRowData>;
  private readonly data$: BehaviorSubject<TRowData[]>;

  private readonly columnDefinitions$: BehaviorSubject<ColDefNext<TRowData>[]>;
  private readonly leafRows$: BehaviorSubject<LeafRowNode<TRowData>[]>;
  private readonly filteredLeafRows$: BehaviorSubject<LeafRowNode<TRowData>[]>; // Filtered but not sorted
  private readonly sortedLeafRows$: BehaviorSubject<LeafRowNode<TRowData>[]>; // Filtered and sorted

  private readonly columns$: BehaviorSubject<DataGridColumn[]>;
  private readonly topLevelRows$: BehaviorSubject<RowNode<TRowData>[]>;
  private readonly visibleRows$: BehaviorSubject<RowNode<TRowData>[]>;

  private readonly rowsByKey$: BehaviorSubject<Map<string, RowNode<TRowData>>>;
  private readonly expandEvents$: Subject<ExpandCollapseEvent>;

  private readonly filterFn$: BehaviorSubject<FilterFn<TRowData> | undefined>;
  private readonly sortFn$: BehaviorSubject<SortFn<TRowData> | undefined>;
  private readonly leafNodeSortFn$: BehaviorSubject<
    SortFn<LeafRowNode<TRowData>> | undefined
  >;
  // private readonly rowGroup$: BehaviorSubject<string[] | undefined>;
  private readonly rowGrouping$: BehaviorSubject<
    DataGridRowGroupSettings<TRowData> | undefined
  >;
  private readonly showTreeLines$: BehaviorSubject<boolean>;
  private readonly leafNodeGroupNameField$: BehaviorSubject<
    undefined | keyof TRowData
  >;

  public readonly gridModel: GridModel<RowNode<TRowData>>;
  public readonly setRowData: (data: TRowData[]) => void;
  public readonly setColumnDefs: (columnDefs: ColDefNext<TRowData>[]) => void;
  // public readonly setRowGroup: (rowGroup: string[] | undefined) => void;
  public readonly setRowGrouping: (
    rowGrouping: DataGridRowGroupSettings<TRowData> | undefined
  ) => void;
  public readonly useRowGrouping: () =>
    | DataGridRowGroupSettings<TRowData>
    | undefined;
  public readonly setShowTreeLines: (showTreeLines: boolean) => void;
  public readonly useShowTreeLines: () => boolean;
  public readonly setLeafNodeGroupNameField: (
    field: undefined | keyof TRowData
  ) => void;
  public readonly setFilterFn: (
    filterFn: FilterFn<TRowData> | undefined
  ) => void;
  public readonly setSortFn: (sortFn: SortFn<TRowData> | undefined) => void;

  public readonly expandCollapseNode: (event: ExpandCollapseEvent) => void;

  public constructor(options: DataGridModelOptions<TRowData>) {
    this.rowKeyGetter = options.rowKeyGetter;
    this.data$ = new BehaviorSubject<TRowData[]>(options.data || []);
    this.setRowData = createHandler(this.data$);
    this.columnDefinitions$ = new BehaviorSubject<ColDefNext<TRowData>[]>(
      options.columnDefinitions || []
    );
    this.setColumnDefs = createHandler(this.columnDefinitions$);
    // this.rowGroup$ = new BehaviorSubject<string[] | undefined>(undefined);
    this.rowGrouping$ = new BehaviorSubject<
      DataGridRowGroupSettings<TRowData> | undefined
    >(undefined);
    // this.setRowGroup = createHandler(this.rowGroup$);
    this.setRowGrouping = createHandler(this.rowGrouping$);
    this.useRowGrouping = createHook(this.rowGrouping$);

    this.leafRows$ = new BehaviorSubject<LeafRowNode<TRowData>[]>([]); // TODO init
    this.filteredLeafRows$ = new BehaviorSubject<LeafRowNode<TRowData>[]>([]);
    this.sortedLeafRows$ = new BehaviorSubject<LeafRowNode<TRowData>[]>([]);
    this.columns$ = new BehaviorSubject<DataGridColumn[]>([]); // TODO
    this.showTreeLines$ = new BehaviorSubject<boolean>(false);
    this.useShowTreeLines = createHook(this.showTreeLines$);
    this.setShowTreeLines = createHandler(this.showTreeLines$);
    this.leafNodeGroupNameField$ = new BehaviorSubject<
      keyof TRowData | undefined
    >(undefined);
    this.setLeafNodeGroupNameField = createHandler(
      this.leafNodeGroupNameField$
    );

    this.rowsByKey$ = new BehaviorSubject<Map<string, RowNode<TRowData>>>(
      new Map()
    );
    this.expandEvents$ = new Subject<ExpandCollapseEvent>();
    this.expandCollapseNode = createHandler(this.expandEvents$);

    const getRowKey: RowKeyGetter<RowNode<TRowData>> = (row, index) => {
      return row ? row.key : `row_${index}`;
    };

    this.gridModel = new GridModel<RowNode<TRowData>>(getRowKey);

    combineLatest([this.columnDefinitions$, this.rowGrouping$]).subscribe(
      ([columnDefinitions, rowGrouping]) => {
        const columns = columnDefinitions.map((colDef, index) => {
          return new DataGridColumn(colDef);
        });
        // TODO
        if (rowGrouping && rowGrouping.groupLevels.length > 0) {
          const groupColumn: DataGridColumn = new DataGridColumn({
            key: "group",
            field: "",
            type: "",
            title: rowGrouping.title,
            width: rowGrouping.width,
            cellComponent: GroupCellValue,
          });
          columns.unshift(groupColumn);
        }
        this.columns$.next(columns);
      }
    );

    this.columns$
      // .pipe(
      //   map((columns) => {
      //     const pinStreams = columns.map((column) =>
      //       column.menu.settings.pinned$.pipe(map((pin) => ({ pin, column })))
      //     );
      //     return combineLatest(pinStreams);
      //   }),
      //   switchMap((pins) => pins)
      // )
      .subscribe((columns) => {
        const gridColumnDefinitions = columns.map((column) => {
          const columnDefinition: ColumnDefinition<RowNode<TRowData>> = {
            key: column.definition.key,
            title: column.definition.title || column.definition.field,
            cellValueComponent:
              column.definition.cellComponent || TextCellValue,
            data: column,
            headerValueComponent:
              column.definition.headerComponent || ColumnHeaderValue,
            pinned: column.definition.pinned,
            width: column.definition.width,
          };
          return columnDefinition;
        });
        this.gridModel.setColumnDefinitions(gridColumnDefinitions);
      });

    this.filterFn$ = new BehaviorSubject<FilterFn<TRowData> | undefined>(
      undefined
    );
    this.setFilterFn = createHandler(this.filterFn$);

    this.sortFn$ = new BehaviorSubject<SortFn<TRowData> | undefined>(undefined);
    this.setSortFn = createHandler(this.sortFn$);

    this.leafNodeSortFn$ = new BehaviorSubject<
      SortFn<LeafRowNode<TRowData>> | undefined
    >(undefined);
    this.sortFn$
      .pipe(
        map((fn) => {
          if (!fn) {
            return undefined;
          }
          return function (a: LeafRowNode<TRowData>, b: LeafRowNode<TRowData>) {
            return fn(a.data$.getValue(), b.data$.getValue());
          };
        })
      )
      .subscribe((fn) => this.leafNodeSortFn$.next(fn));

    // TODO replaced by external filter
    // this.columns$
    //   .pipe(
    //     map((columns) => {
    //       const filterStreams = columns.map((column) =>
    //         column.menu.filter.filterFn$.pipe(
    //           map((fn) => {
    //             if (fn === undefined) {
    //               return undefined;
    //             }
    //             return (rowData: TRowData) => {
    //               const cellValue = String(
    //                 rowData[column.definition.field as keyof TRowData]
    //               );
    //               return fn(cellValue);
    //             };
    //           })
    //         )
    //       );
    //       return combineLatest(filterStreams);
    //     }),
    //     switchMap((filters) => filters),
    //     map((filters) => {
    //       const columnFilters: FilterFn<TRowData>[] = filters.filter(
    //         (x) => x != undefined
    //       ) as FilterFn<TRowData>[];
    //
    //       if (columnFilters.length < 1) {
    //         return undefined;
    //       }
    //
    //       return (rowData: TRowData) => {
    //         return columnFilters.every((f) => f!(rowData));
    //       };
    //     })
    //   )
    //   .subscribe(this.filterFn$);

    this.topLevelRows$ = new BehaviorSubject<RowNode<TRowData>[]>([]);
    this.visibleRows$ = new BehaviorSubject<RowNode<TRowData>[]>([]);

    this.data$.subscribe((data) => {
      const rows = data.map((rowData, index) => {
        const key = this.rowKeyGetter(rowData);
        return new LeafRowNode(key, rowData);
      });
      // const filterFn = this.filterFn$.getValue();
      // const filteredRows =
      //   filterFn != undefined
      //     ? rows.filter((rowNode) => {
      //         return filterFn(rowNode.data$.getValue());
      //       })
      //     : rows;
      // const sortFn = this.leafNodeSortFn$.getValue();
      // const sortedRows =
      //   sortFn != undefined ? filteredRows.sort(sortFn) : filteredRows;

      this.leafRows$.next(rows);
      // this.filteredLeafRows$.next(filteredRows);
      // this.sortedLeafRows$.next(sortedRows);
    });

    combineLatest([this.leafRows$, this.filterFn$])
      .pipe(
        map(([leafNodes, filterFn]) => {
          const filteredRows =
            filterFn != undefined
              ? leafNodes.filter((rowNode) => {
                  return filterFn(rowNode.data$.getValue());
                })
              : leafNodes;
          return filteredRows;
        })
      )
      .subscribe((filteredNodes) => {
        this.filteredLeafRows$.next(filteredNodes);
      });

    combineLatest([this.filteredLeafRows$, this.leafNodeSortFn$])
      .pipe(
        map(([filteredLeafNodes, leafNodeSortFn]) => {
          const sortedNodes = [...filteredLeafNodes];
          if (leafNodeSortFn != undefined) {
            sortedNodes.sort(leafNodeSortFn);
          }
          return sortedNodes;
        })
      )
      .subscribe((sortedNodes) => {
        // console.log(`Updating sorted nodes`);
        this.sortedLeafRows$.next(sortedNodes);
      });

    // this.filterFn$.subscribe((filterFn) => {
    //   const rows = this.leafRows$.getValue();
    //   const filteredRows =
    //     filterFn != undefined
    //       ? rows.filter((rowNode) => {
    //           return filterFn(rowNode.data$.getValue());
    //         })
    //       : rows;
    //   this.filteredLeafRows$.next(filteredRows);
    // });

    combineLatest([
      this.sortedLeafRows$,
      this.rowGrouping$,
      this.leafNodeGroupNameField$,
    ])
      .pipe(
        map(([sortedLeafNodes, rowGrouping, leafNodeGroupNameField]) => {
          if (rowGrouping == undefined || rowGrouping.groupLevels.length < 1) {
            return sortedLeafNodes;
          }
          return groupRows(
            sortedLeafNodes,
            rowGrouping,
            leafNodeGroupNameField
          );
        }),
        distinctUntilChanged()
      )
      .subscribe((topLevelRows) => {
        // console.log(`Updating topLevelRows`);
        this.topLevelRows$.next(topLevelRows);
      });

    this.topLevelRows$.subscribe((topLevelRows) => {
      const newVisibleRows: RowNode<TRowData>[] =
        flattenVisibleRows(topLevelRows);
      // console.log(`Updating visibleRows`);
      this.visibleRows$.next(newVisibleRows);
    });

    this.expandEvents$.subscribe((event) => {
      const { rowNode, expand = true } = event;
      rowNode.setExpanded(expand);
      const newVisibleRows = flattenVisibleRows(this.topLevelRows$.getValue());
      // console.log(
      //   `expandEvents$ -> visibleRows$: ${newVisibleRows.length} rows`
      // );
      this.visibleRows$.next(newVisibleRows);
    });

    this.visibleRows$.subscribe((visibleRows) => {
      // console.log(
      //   `Calling setData on the grid model:\n${visibleRows
      //     .map((r) => {
      //       if (isLeafNode(r)) {
      //         // return JSON.stringify(r.data$.getValue());
      //         return (r.data$.getValue() as any).location;
      //       }
      //       return r.name;
      //     })
      //     .join("\n")}`
      // );
      this.gridModel.setData(visibleRows);
    });
  }
}
