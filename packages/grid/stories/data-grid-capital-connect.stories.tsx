import { Story } from "@storybook/react";
import {
  ColDefNext,
  DataGrid,
  Filter,
  FilterColumn,
  FilterModel,
} from "../src";
import "./data-grid-capital-connect.stories.css";
import { useState } from "react";
import { GridToolbar, GridToolbarModel } from "../src/data-grid/toolbar";
import { ListCellValue } from "../src/data-grid/ListCellValue";
import { PillCellValue } from "../src/data-grid/PillCellValue";

export default {
  title: "Grid/Data Grid Capital Connect",
  component: DataGrid,
  argTypes: {
    // showTreeLines: { control: "boolean" },
    // rowGrouping: {
    //   control: "select",
    //   options: [...rowGroupingOptions.keys()],
    // },
  },
};

interface Investor {
  name: string;
  addedInvestors: string[];
  location: string;
  strategy: string[];
  cohort: string[];
  notes: string;
}

function createDummyInvestors(): Investor[] {
  const a = [
    "Apple",
    "Orange",
    "Dragonfruit",
    "Coffee",
    "Fig",
    "Grape",
    "Hazelnut",
  ];
  const b = ["Investment", "Venture Capital", "Private Wealth"];
  const c = ["", "Inc."];
  const loc = [
    "New York, NY",
    "Jersey City, NJ",
    "Boston, MA",
    "San Francisco, CA",
  ];
  const str = [
    ["FO"],
    ["PE"],
    ["VC"],
    ["FO", "PE"],
    ["FO", "PE", "VC"],
    ["VC", "PE"],
  ];
  const coh = [
    ["Potential Leads"],
    ["Top VCs"],
    ["Potential Leads", "Top VCs"],
  ];

  const investors: Investor[] = [];
  let i = 0;
  for (let x of a) {
    for (let y of b) {
      for (let z of c) {
        investors.push({
          name: [x, y, z].join(" "),
          addedInvestors: [],
          location: loc[i % loc.length],
          cohort: coh[i % coh.length],
          strategy: str[i % str.length],
          notes: "",
        });
        ++i;
      }
    }
  }

  return investors;
}

const columnDefinitions: ColDefNext<Investor>[] = [
  {
    key: "name",
    type: "text",
    field: "name",
    title: "Name",
  },
  {
    key: "addedInvestors",
    type: "multiList",
    field: "addedInvestors",
    title: "Added Investors",
  },
  {
    key: "location",
    type: "text",
    field: "location",
    title: "Location",
  },
  {
    key: "strategy",
    type: "multiList",
    field: "strategy",
    title: "Strategy",
    cellComponent: ListCellValue,
  },
  {
    key: "cohort",
    type: "multiList",
    field: "cohort",
    title: "Cohort",
    cellComponent: PillCellValue,
  },
  {
    key: "notes",
    type: "text",
    field: "notes",
    title: "Notes",
  },
];

const filterColumns: FilterColumn<Investor>[] = columnDefinitions.map((c) => {
  return {
    name: c.title || c.field,
    field: c.field as keyof Investor,
  };
});

const dummyInvestors = createDummyInvestors();

const rowKeyGetter = (rowData: Investor) => rowData.name;

interface DataGridStoryProps {
  showTreeLines: boolean;
  rowGrouping: string;
}

const DataGridStoryTemplate: Story<DataGridStoryProps> = (props) => {
  const [toolbarModel] = useState<GridToolbarModel<Investor>>(
    () => new GridToolbarModel(filterColumns)
  );
  const filterFn = toolbarModel.filter.useFilterFn();
  // console.log(`useFilterFn returns ${filterFn}`);
  if (filterFn != undefined && typeof filterFn != "function") {
    debugger;
  }

  return (
    <div className={"gridStory"}>
      <GridToolbar model={toolbarModel} />
      <DataGrid
        className={"grid"}
        rowKeyGetter={rowKeyGetter}
        data={dummyInvestors}
        columnDefinitions={columnDefinitions}
        filterFn={filterFn}
      />
    </div>
  );
};

const FilterStoryTemplate: Story<{}> = () => {
  const [model] = useState(() => new FilterModel<Investor>(filterColumns));
  return <Filter model={model} />;
};

const ToolbarStoryTemplate: Story<{}> = () => {
  const [toolbarModel] = useState<GridToolbarModel<Investor>>(
    () => new GridToolbarModel(filterColumns)
  );
  return <GridToolbar model={toolbarModel} />;
};

export const DataGridExample = DataGridStoryTemplate.bind({});

DataGridExample.args = {};

export const FilterExample = FilterStoryTemplate.bind({});

FilterExample.args = {};

export const ToolbarExample = ToolbarStoryTemplate.bind({});

ToolbarExample.args = {};
