import { Story } from "@storybook/react";
import { ColDefNext, DataGrid, Filter, FilterModel } from "../src";
import "./data-grid-capital-connect.stories.css";
import { useState } from "react";
import { GridToolbar } from "../src/data-grid/toolbar";

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
  },
  {
    key: "cohort",
    type: "multiList",
    field: "cohort",
    title: "Cohort",
  },
  {
    key: "notes",
    type: "text",
    field: "notes",
    title: "Notes",
  },
];

const dummyInvestors = createDummyInvestors();

const rowKeyGetter = (rowData: Investor) => rowData.name;

interface DataGridStoryProps {
  showTreeLines: boolean;
  rowGrouping: string;
}

const DataGridStoryTemplate: Story<DataGridStoryProps> = (props) => {
  return (
    <div className={"gridStory"}>
      <GridToolbar />
      <DataGrid
        className={"grid"}
        rowKeyGetter={rowKeyGetter}
        data={dummyInvestors}
        columnDefinitions={columnDefinitions}
      />
    </div>
  );
};

const FilterStoryTemplate: Story<{}> = () => {
  const [model] = useState(
    () => new FilterModel(columnDefinitions.map((c) => c.title || c.field))
  );
  return <Filter model={model} />;
};

const ToolbarStoryTemplate: Story<{}> = () => {
  return <GridToolbar />;
};

export const DataGridExample = DataGridStoryTemplate.bind({});

DataGridExample.args = {};

export const FilterExample = FilterStoryTemplate.bind({});

FilterExample.args = {};

export const ToolbarExample = ToolbarStoryTemplate.bind({});

ToolbarExample.args = {};
