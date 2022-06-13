import { BehaviorSubject } from "rxjs";
import { createHandler, createHook } from "../../grid";

export type FilterRowKind = "where" | "and" | "or";
export type TextFilterRowOperator = "contains" | "starts with" | "ends with";
export type NumericFilterRowOperator = "less than" | "equals" | "greater than";

export class FilterRowModel {
  public readonly kind$: BehaviorSubject<FilterRowKind>;
  public readonly column$: BehaviorSubject<string>;
  public readonly columns$: BehaviorSubject<string[]>;
  public readonly operator$: BehaviorSubject<string>;
  public readonly operators$: BehaviorSubject<string[]>;
  public readonly query$: BehaviorSubject<string>;

  public readonly useKind: () => FilterRowKind;
  public readonly setKind: (kind: FilterRowKind) => void;
  public readonly useColumn: () => string;
  public readonly setColumn: (column: string) => void;
  public readonly useColumns: () => string[];
  public readonly useOperator: () => string;
  public readonly setOperator: (operator: string) => void;
  public readonly useOperators: () => string[];
  public readonly useQuery: () => string;
  public readonly setQuery: (query: string) => void;

  constructor(columns: string[], kind: FilterRowKind = "where") {
    this.kind$ = new BehaviorSubject<FilterRowKind>(kind);
    this.column$ = new BehaviorSubject<string>("");
    this.columns$ = new BehaviorSubject<string[]>(columns);
    this.operator$ = new BehaviorSubject<string>("contains");
    this.operators$ = new BehaviorSubject<string[]>([
      "contains",
      "starts with",
      "ends with",
    ]);
    this.query$ = new BehaviorSubject<string>("");
    this.useKind = createHook(this.kind$);
    this.setKind = createHandler(this.kind$);
    this.useColumn = createHook(this.column$);
    this.setColumn = createHandler(this.column$);
    this.useColumns = createHook(this.columns$);
    this.useOperator = createHook(this.operator$);
    this.setOperator = createHandler(this.operator$);
    this.useOperators = createHook(this.operators$);
    this.useQuery = createHook(this.query$);
    this.setQuery = createHandler(this.query$);
  }
}

export class FilterModel<T> {
  public readonly rows$: BehaviorSubject<FilterRowModel[]>;
  public readonly useRows: () => FilterRowModel[];
  public readonly columns: string[];

  constructor(columns: string[]) {
    this.columns = columns;
    this.rows$ = new BehaviorSubject<FilterRowModel[]>([
      new FilterRowModel(this.columns),
    ]);
    this.useRows = createHook(this.rows$);
  }

  public addRow(rowIndex: number) {
    const row = new FilterRowModel(this.columns, "and");
    let rows = this.rows$.getValue();
    rows = [...rows.slice(0, rowIndex + 1), row, ...rows.slice(rowIndex + 1)];
    this.rows$.next(rows);
  }

  public deleteRow(rowIndex: number) {
    let rows = this.rows$.getValue();
    if (rows.length === 1) {
      return;
    }
    rows = [...rows.slice(0, rowIndex), ...rows.slice(rowIndex + 1)];
    if (rowIndex === 0) {
      rows[0].setKind("where");
    }
    this.rows$.next(rows);
  }
}
