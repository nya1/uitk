import { Button, makePrefixer } from "@jpmorganchase/uitk-core";
import { FilterIcon, SearchIcon, SwapIcon } from "@jpmorganchase/uitk-icons";
import { Filter, Sort } from "@jpmorganchase/uitk-grid";
import {
  Portal,
  Toolbar,
  useFloatingUI,
  useId,
  useWindow,
} from "@jpmorganchase/uitk-lab";
import "./GridToolbar.css";
import { useState } from "react";
import { GridToolbarModel } from "./GridToolbarModel";

const withBaseName = makePrefixer("uitkDataGridToolbar");

export interface GridToolbarProps<T> {
  model: GridToolbarModel<T>;
}

export const GridToolbar = function GridToolbar<T>(props: GridToolbarProps<T>) {
  const { model } = props;
  const [isFilterOpen, setFilterOpen] = useState<boolean>(false);
  const [isSortOpen, setSortOpen] = useState<boolean>(false);

  const onFilterClick = () => {
    setFilterOpen((x) => !x);
    setSortOpen(false);
  };

  const onSortClick = () => {
    setSortOpen((x) => !x);
    setFilterOpen(false);
  };

  const id = useId();
  const Window = useWindow();
  const { reference, floating, x, y, strategy } = useFloatingUI({
    placement: "bottom-end",
    middleware: [],
  });

  return (
    <Toolbar className={withBaseName()} ref={reference}>
      <Button variant="secondary" onClick={onSortClick}>
        <SwapIcon className={withBaseName("sortIcon")} /> Sort
      </Button>
      <Button variant="secondary" onClick={onFilterClick}>
        <FilterIcon /> Filter
      </Button>
      <Button variant="secondary" disabled={true}>
        <SearchIcon /> Search
      </Button>
      {isFilterOpen || isSortOpen ? (
        <Portal>
          <Window
            id={id}
            style={{
              top: y ?? "",
              left: x ?? "",
              position: strategy,
              zIndex: 3,
            }}
            ref={floating}
          >
            {isFilterOpen ? <Filter model={model.filter} /> : null}
            {isSortOpen ? <Sort model={model.sort} /> : null}
          </Window>
        </Portal>
      ) : null}
    </Toolbar>
  );
};
