import { FilterColumn, FilterModel } from "../filter";

export class GridToolbarModel<T> {
  public readonly filter: FilterModel<T>;

  constructor(columns: FilterColumn<T>[]) {
    this.filter = new FilterModel<T>(columns);
  }
}
