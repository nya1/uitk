import { Story } from "@storybook/react";
import {
  ColDefNext,
  DataGrid,
  DataGridNext,
  DataGridRowGroupCellComponentProps,
  DataGridRowGroupSettings,
} from "../src";
import { Blotter, BlotterRecord, makeFakeBlotterRecord } from "./grid/blotter";
import { FC } from "react";
import { UserBadgeIcon } from "../../icons";
import "./data-grid-next.stories.css";

const DeskOwnerGroupValue: FC<
  DataGridRowGroupCellComponentProps<BlotterRecord>
> = (props) => {
  const name = props.rowNode.name;
  return (
    <div className="desk-owner-cell">
      <UserBadgeIcon />
      <span style={{ marginLeft: "8px" }}>{name}</span>
    </div>
  );
};

const rowGroupingOptions = new Map<
  string,
  DataGridRowGroupSettings<BlotterRecord> | undefined
>([
  ["No Grouping", undefined],
  [
    "Client",
    {
      title: "Client",
      groupLevels: [
        {
          field: "client",
        },
      ],
    },
  ],
  [
    "Client->Side",
    {
      title: "Client-Side",
      groupLevels: [
        {
          field: "client",
        },
        {
          field: "side",
        },
      ],
    },
  ],
  [
    "Desk Owner -> Client -> Side",
    {
      title: "Desk Owner -> Client -> Side",
      width: 300,
      groupLevels: [
        {
          field: "deskOwner",
          groupCellComponent: DeskOwnerGroupValue,
        },
        {
          field: "client",
        },
        {
          field: "side",
        },
      ],
    },
  ],
]);

export default {
  title: "Lab/Data Grid Next",
  component: DataGrid,
  argTypes: {
    showTreeLines: { control: "boolean" },
    rowGrouping: {
      control: "select",
      options: [...rowGroupingOptions.keys()],
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
    title: "Identifier",
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
  rowGrouping: string;
}

const DataGridNextStoryTemplate: Story<DataGridNestStoryProps> = (props) => {
  const { showTreeLines, rowGrouping: rowGroupingOption } = props;
  const rowGrouping = rowGroupingOptions.get(rowGroupingOption);
  return (
    <DataGridNext
      rowKeyGetter={rowKeyGetter}
      data={blotter.visibleRecords}
      columnDefinitions={columnDefinitions}
      rowGrouping={rowGrouping}
      leafNodeGroupNameField={"identifier"}
      showTreeLines={showTreeLines}
    />
  );
};

export const DataGridNextExample = DataGridNextStoryTemplate.bind({});

DataGridNextExample.args = {};
