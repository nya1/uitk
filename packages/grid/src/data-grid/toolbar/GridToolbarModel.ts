import { FilterColumn, FilterModel } from "../filter";
import { SortModel } from "../sort";

export class GridToolbarModel<T> {
  public readonly filter: FilterModel<T>;
  public readonly sort: SortModel<T>;

  constructor(columns: FilterColumn<T>[]) {
    this.filter = new FilterModel<T>(columns);
    this.sort = new SortModel<T>(columns);
  }
}
