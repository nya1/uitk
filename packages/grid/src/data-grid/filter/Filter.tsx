import { FilterModel, FilterRowKind, FilterRowModel } from "./FilterModel";
import { makePrefixer, Button } from "@jpmorganchase/uitk-core";
import {
  Dropdown,
  DropdownButton,
  FormField,
  Input,
} from "@jpmorganchase/uitk-lab";
import { DeleteIcon, AddIcon } from "@jpmorganchase/uitk-icons";
import { ChangeEvent } from "react";
import { ListChangeHandler } from "@jpmorganchase/uitk-lab";
import "./Filter.css";

const withBaseName = makePrefixer("uitkDataGridFilter");

export interface FilterRowProps {
  index: number;
  model: FilterRowModel;
  onAdd: (index: number) => void;
  onDelete: (index: number) => void;
}

export const FilterRow = function FilterRow(props: FilterRowProps) {
  const { model, index, onAdd, onDelete } = props;
  const kind = model.useKind();
  const column = model.useColumn();
  const columns = model.useColumns();
  const operator = model.useOperator();
  const operators = model.useOperators();
  const query = model.useQuery();

  const onKindChange: ListChangeHandler = (event, selectedItem) => {
    if (selectedItem != null) {
      model.setKind(selectedItem as FilterRowKind);
    }
  };

  const onOperatorChange: ListChangeHandler = (event, selectedItem) => {
    if (selectedItem != null) {
      model.setOperator(selectedItem);
    }
  };

  const onColumnChange: ListChangeHandler = (event, selectedItem) => {
    if (selectedItem != null) {
      model.setColumn(selectedItem);
    }
  };

  const onQueryChange = (
    event: ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    model.setQuery(value);
  };

  const onAddRow = () => {
    onAdd(index);
  };

  const onDeleteRow = () => {
    onDelete(index);
  };

  return (
    <div className={withBaseName("row")}>
      {kind === "where" ? (
        <span className={withBaseName("row-kind")}>{kind}</span>
      ) : (
        <Dropdown
          source={["and", "or"]}
          selectedItem={kind}
          onChange={onKindChange}
          WindowProps={{
            className: withBaseName("window"),
          }}
        />
      )}
      {/*<FormField className={withBaseName("row-column")}>*/}
      <Dropdown
        source={columns}
        selectedItem={column}
        onChange={onColumnChange}
        WindowProps={{
          className: withBaseName("window"),
        }}
      />
      {/*</FormField>*/}
      {/*<FormField className={withBaseName("row-column")}>*/}
      <Dropdown
        source={operators}
        selectedItem={operator}
        onChange={onOperatorChange}
        WindowProps={{
          className: withBaseName("window"),
        }}
      />
      {/*</FormField>*/}
      {/*<FormField className={withBaseName("row-query")}>*/}
      <Input value={query} onChange={onQueryChange} />
      {/*</FormField>*/}
      <Button
        className={withBaseName("row-delete")}
        variant={"secondary"}
        onClick={onDeleteRow}
      >
        <DeleteIcon />
      </Button>
      <Button variant={"secondary"} onClick={onAddRow}>
        <AddIcon />
      </Button>
    </div>
  );
};

export interface FilterProps {
  model: FilterModel;
}

export const Filter = function Filter(props: FilterProps) {
  const { model } = props;
  const rows = model.useRows();

  const onAddRow = (rowIndex: number) => {
    model.addRow(rowIndex);
  };

  const onDeleteRow = (rowIndex: number) => {
    model.deleteRow(rowIndex);
  };

  return (
    <div className={withBaseName()}>
      {rows.map((row, index) => {
        return (
          <FilterRow
            key={index}
            model={row}
            index={index}
            onAdd={onAddRow}
            onDelete={onDeleteRow}
          />
        );
      })}
    </div>
  );
};
