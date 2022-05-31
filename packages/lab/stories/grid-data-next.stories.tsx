import { Story } from "@storybook/react";
import { ColDefNext, DataGrid, DataGridNext } from "../src";
import { Blotter, BlotterRecord, makeFakeBlotterRecord } from "./grid/blotter";

const rowGroupOptions = new Map<string, string[] | undefined>([
  ["No Grouping", undefined],
  ["Client", ["client"]],
  ["Client->Side", ["client", "side"]],
  ["Desk Owner->Client->Side", ["deskOwner", "client", "side"]],
]);

export default {
  title: "Lab/Data Grid Next",
  component: DataGrid,
  argTypes: {
    showTreeLines: { control: "boolean" },
    rowGroup: {
      control: "select",
      options: [...rowGroupOptions.keys()],
    },
  },
};

const blotter = new Blotter();

for (let i = 0; i < 100; ++i) {
  const record = makeFakeBlotterRecord();
  record.identifier = `${i}-${record.identifier}`;
  blotter.addRecord(record);
}

const columnDefinitions: ColDefNext<BlotterRecord>[] = [
  {
    key: "identifier",
    type: "text",
    field: "identifier",
  },
  {
    key: "client",
    type: "text",
    field: "client",
  },
  {
    key: "side",
    type: "text",
    field: "side",
  },
  {
    key: "deskOwner",
    type: "text",
    field: "deskOwner",
  },
  {
    key: "quantity",
    type: "numeric",
    field: "quantity",
  },
  {
    key: "averagePx",
    type: "numeric",
    field: "averagePx",
  },
  {
    key: "price",
    type: "price",
    field: "price",
  },
];

const rowKeyGetter = (rowData: BlotterRecord) => rowData.key;

interface DataGridNestStoryProps {
  showTreeLines: boolean;
  rowGroup: string;
}

const DataGridNextStoryTemplate: Story<DataGridNestStoryProps> = (props) => {
  const { showTreeLines, rowGroup: rowGroupOption } = props;
  const rowGroup = rowGroupOptions.get(rowGroupOption);
  return (
    <DataGridNext
      rowKeyGetter={rowKeyGetter}
      data={blotter.visibleRecords}
      columnDefinitions={columnDefinitions}
      rowGroup={rowGroup}
      leafNodeGroupNameField={"identifier"}
      showTreeLines={showTreeLines}
    />
  );
};

export const DataGridNextExample = DataGridNextStoryTemplate.bind({});

DataGridNextExample.args = {};
