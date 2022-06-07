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
import { TextCellValueNext } from "./TextCellValueNext";
import { ColumnHeaderValueNext } from "./ColumnHeaderValueNext";
import { ColumnMenuModel } from "./column-menu/ColumnMenuModel";
import { GroupCellValue } from "./row-grouping/GroupCellValue";

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
  public readonly menu: ColumnMenuModel;

  public constructor(
    definition: ColDefNext<TRowData, TColumnData, THeaderValue, TCellValue>
  ) {
    this.definition = definition;
    this.menu = new ColumnMenuModel();
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

export function groupRows<TRowData>(
  rows: LeafRowNode<TRowData>[],
  rowGroup: string[],
  leafNodeGroupNameField?: keyof TRowData
) {
  let i = 0;
  const groupNodesBy = (
    nodes: LeafRowNode<TRowData>[],
    fields: Array<keyof TRowData>,
    level: number
  ): RowNode<TRowData>[] => {
    if (fields.length === 0) {
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
      const k = String(r.data$.getValue()[fields[0]]);
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
        groupNodesBy(v, fields.slice(1), level + 1)
      );
    });
  };

  const fields = rowGroup.map((field) => field as keyof TRowData);
  return groupNodesBy(rows, fields, 0);
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

export class DataGridNextModel<TRowData = any> {
  private readonly rowKeyGetter: RowKeyGetterFn<TRowData>;
  private readonly data$: BehaviorSubject<TRowData[]>;

  private readonly columnDefinitions$: BehaviorSubject<ColDefNext<TRowData>[]>;
  private readonly leafRows$: BehaviorSubject<LeafRowNode<TRowData>[]>;
  private readonly filteredLeafRows$: BehaviorSubject<LeafRowNode<TRowData>[]>;

  private readonly columns$: BehaviorSubject<DataGridColumn[]>;
  private readonly topLevelRows$: BehaviorSubject<RowNode<TRowData>[]>;
  private readonly visibleRows$: BehaviorSubject<RowNode<TRowData>[]>;

  private readonly rowsByKey$: BehaviorSubject<Map<string, RowNode<TRowData>>>;
  private readonly expandEvents$: Subject<ExpandCollapseEvent>;

  private readonly filterFn$: BehaviorSubject<FilterFn<TRowData> | undefined>;
  private readonly rowGroup$: BehaviorSubject<string[] | undefined>;
  private readonly showTreeLines$: BehaviorSubject<boolean>;
  private readonly leafNodeGroupNameField$: BehaviorSubject<
    undefined | keyof TRowData
  >;

  public readonly gridModel: GridModel<RowNode<TRowData>>;
  public readonly setRowData: (data: TRowData[]) => void;
  public readonly setColumnDefs: (columnDefs: ColDefNext<TRowData>[]) => void;
  public readonly setRowGroup: (rowGroup: string[] | undefined) => void;
  public readonly setShowTreeLines: (showTreeLines: boolean) => void;
  public readonly useShowTreeLines: () => boolean;
  public readonly setLeafNodeGroupNameField: (
    field: undefined | keyof TRowData
  ) => void;

  public readonly expandCollapseNode: (event: ExpandCollapseEvent) => void;

  public constructor(options: DataGridModelOptions<TRowData>) {
    this.rowKeyGetter = options.rowKeyGetter;
    this.data$ = new BehaviorSubject<TRowData[]>(options.data || []);
    this.setRowData = createHandler(this.data$);
    this.columnDefinitions$ = new BehaviorSubject<ColDefNext<TRowData>[]>(
      options.columnDefinitions || []
    );
    this.setColumnDefs = createHandler(this.columnDefinitions$);
    this.rowGroup$ = new BehaviorSubject<string[] | undefined>(undefined);
    this.setRowGroup = createHandler(this.rowGroup$);
    this.leafRows$ = new BehaviorSubject<LeafRowNode<TRowData>[]>([]); // TODO init
    this.filteredLeafRows$ = new BehaviorSubject<LeafRowNode<TRowData>[]>([]);
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

    // this.columnDefinitions$.subscribe((columnDefinitions) => {
    //   const columns = columnDefinitions.map((colDef, index) => {
    //     return new DataGridColumn(colDef);
    //   });
    //   this.columns$.next(columns);
    // });

    combineLatest([this.columnDefinitions$, this.rowGroup$]).subscribe(
      ([columnDefinitions, rowGroup]) => {
        const columns = columnDefinitions.map((colDef, index) => {
          return new DataGridColumn(colDef);
        });
        // TODO
        if (rowGroup && rowGroup.length > 0) {
          const groupColumn: DataGridColumn = new DataGridColumn({
            key: "group",
            field: "",
            type: "",
            title: rowGroup[0],
            cellComponent: GroupCellValue,
          });
          columns.unshift(groupColumn);
        }
        this.columns$.next(columns);
      }
    );

    this.columns$
      .pipe(
        map((columns) => {
          const pinStreams = columns.map((column) =>
            column.menu.settings.pinned$.pipe(map((pin) => ({ pin, column })))
          );
          return combineLatest(pinStreams);
        }),
        switchMap((pins) => pins)
      )
      .subscribe((pins) => {
        const gridColumnDefinitions = pins.map(({ column, pin }) => {
          const columnDefinition: ColumnDefinition<RowNode<TRowData>> = {
            key: column.definition.key,
            title: column.definition.field,
            cellValueComponent:
              column.definition.cellComponent || TextCellValueNext,
            data: column,
            headerValueComponent:
              column.definition.headerComponent || ColumnHeaderValueNext,
            pinned: pin,
          };
          // console.log(
          //   `Created column definition. key: ${column.definition.key}; pinned: ${pin}`
          // );
          return columnDefinition;
        });
        this.gridModel.setColumnDefinitions(gridColumnDefinitions);
      });

    this.filterFn$ = new BehaviorSubject<FilterFn<TRowData> | undefined>(
      undefined
    );

    this.columns$
      .pipe(
        map((columns) => {
          const filterStreams = columns.map((column) =>
            column.menu.filter.filterFn$.pipe(
              map((fn) => {
                if (fn === undefined) {
                  return undefined;
                }
                return (rowData: TRowData) => {
                  const cellValue = String(
                    rowData[column.definition.field as keyof TRowData]
                  );
                  return fn(cellValue);
                };
              })
            )
          );
          return combineLatest(filterStreams);
        }),
        switchMap((filters) => filters),
        map((filters) => {
          const columnFilters: FilterFn<TRowData>[] = filters.filter(
            (x) => x != undefined
          ) as FilterFn<TRowData>[];

          if (columnFilters.length < 1) {
            return undefined;
          }

          return (rowData: TRowData) => {
            return columnFilters.every((f) => f!(rowData));
          };
        })
      )
      .subscribe(this.filterFn$);

    this.topLevelRows$ = new BehaviorSubject<RowNode<TRowData>[]>([]);
    this.visibleRows$ = new BehaviorSubject<RowNode<TRowData>[]>([]);

    this.data$.subscribe((data) => {
      const rows = data.map((rowData, index) => {
        const key = this.rowKeyGetter(rowData);
        return new LeafRowNode(key, rowData);
      });
      const filterFn = this.filterFn$.getValue();
      const filteredRows =
        filterFn != undefined
          ? rows.filter((rowNode) => {
              return filterFn(rowNode.data$.getValue());
            })
          : rows;

      this.leafRows$.next(rows);
      this.filteredLeafRows$.next(filteredRows);
    });

    this.filterFn$.subscribe((filterFn) => {
      const rows = this.leafRows$.getValue();
      const filteredRows =
        filterFn != undefined
          ? rows.filter((rowNode) => {
              return filterFn(rowNode.data$.getValue());
            })
          : rows;
      this.filteredLeafRows$.next(filteredRows);
    });

    combineLatest([
      this.filteredLeafRows$,
      this.rowGroup$,
      this.leafNodeGroupNameField$,
    ])
      .pipe(
        map(([filteredRows, rowGroup, leafNodeGroupNameField]) => {
          if (rowGroup == undefined || rowGroup.length < 1) {
            return filteredRows;
          }
          return groupRows(filteredRows, rowGroup, leafNodeGroupNameField);
        }),
        distinctUntilChanged()
      )
      .subscribe(this.topLevelRows$);

    this.topLevelRows$.subscribe((topLevelRows) => {
      const newVisibleRows: RowNode<TRowData>[] =
        flattenVisibleRows(topLevelRows);
      this.visibleRows$.next(newVisibleRows);
    });

    this.expandEvents$.subscribe((event) => {
      const { rowNode, expand = true } = event;
      rowNode.setExpanded(expand);
      const newVisibleRows = flattenVisibleRows(this.topLevelRows$.getValue());
      this.visibleRows$.next(newVisibleRows);
    });

    this.visibleRows$.subscribe((visibleRows) => {
      this.gridModel.setData(visibleRows);
    });

    // this.filteredLeafRows$.subscribe((filteredRows) => {
    //   this.gridModel.setData(filteredRows);
    // });
  }
}
