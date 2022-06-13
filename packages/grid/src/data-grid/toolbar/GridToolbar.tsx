import { makePrefixer } from "@jpmorganchase/uitk-core";
import { FilterIcon, SwapIcon, SearchIcon } from "@jpmorganchase/uitk-icons";
import { Button } from "@jpmorganchase/uitk-core";
import { Filter, FilterModel } from "@jpmorganchase/uitk-grid";
import {
  Portal,
  Toolbar,
  useFloatingUI,
  useId,
  useWindow,
} from "@jpmorganchase/uitk-lab";
import "./GridToolbar.css";
import { useState } from "react";

const withBaseName = makePrefixer("uitkDataGridToolbar");

export interface GridToolbarProps {}

const columns: string[] = [
  "Name",
  "Added Investors",
  "Location",
  "Strategy",
  "Cohort",
  "Notes",
];

export const GridToolbar = function GridToolbar(props: GridToolbarProps) {
  const [isFilterOpen, setFilterOpen] = useState<boolean>(false);

  const onFilterClick = () => {
    setFilterOpen((isOpen) => !isOpen);
  };

  const id = useId();
  const Window = useWindow();
  const { reference, floating, x, y, strategy } = useFloatingUI({
    placement: "bottom-end",
    middleware: [],
  });

  const [filterModel] = useState<FilterModel>(() => new FilterModel(columns));

  return (
    <Toolbar className={withBaseName()} ref={reference}>
      <Button variant="secondary">
        <SwapIcon className={withBaseName("sortIcon")} /> Sort
      </Button>
      <Button variant="secondary" onClick={onFilterClick}>
        <FilterIcon /> Filter
      </Button>
      <Button variant="secondary">
        <SearchIcon /> Search
      </Button>
      {isFilterOpen ? (
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
            <Filter model={filterModel} />
          </Window>
        </Portal>
      ) : null}
    </Toolbar>
  );
};
