import { Button } from "@jpmorganchase/uitk-core";
import { FLEX_ALIGNMENT_BASE, SplitLayout } from "@jpmorganchase/uitk-lab";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { FlexContent } from "./flex-item.stories";
import { ExportIcon, ImportIcon } from "@jpmorganchase/uitk-icons";

export default {
  title: "Layout/SplitLayout",
  component: SplitLayout,
} as ComponentMeta<typeof SplitLayout>;
const leftItem = (
  <>
    {Array.from({ length: 3 }, (_, index) => (
      <FlexContent key={index}>{`item ${index + 1}`}</FlexContent>
    ))}
  </>
);

const rightItem = (
  <>
    <FlexContent>item 4</FlexContent>
    <FlexContent>
      Item
      <br />5
    </FlexContent>
  </>
);

const Template: ComponentStory<typeof SplitLayout> = (args) => {
  return <SplitLayout {...args} />;
};
export const ToolkitSplitLayout = Template.bind({});

ToolkitSplitLayout.args = {
  leftSplitItem: leftItem,
  rightSplitItem: rightItem,
};

ToolkitSplitLayout.argTypes = {
  align: {
    options: [...FLEX_ALIGNMENT_BASE, "stretch", "baseline"],
    control: { type: "select" },
  },
  gap: {
    type: "number",
  },
  separators: {
    options: ["start", "center", "end", true],
    control: { type: "select" },
  },
  wrap: {
    type: "boolean",
  },
};

const ButtonBarExample: ComponentStory<typeof SplitLayout> = (args) => {
  const LeftItem = () => (
    <>
      <Button variant="secondary">
        <ExportIcon style={{ marginRight: 5 }} />
        Export
      </Button>
      <Button variant="secondary">
        <ImportIcon style={{ marginRight: 5 }} />
        Import
      </Button>
    </>
  );
  const RightItem = () => (
    <>
      <Button variant="cta">Save</Button> <Button>Cancel</Button>
    </>
  );
  return (
    <SplitLayout
      {...args}
      leftSplitItem={<LeftItem />}
      rightSplitItem={<RightItem />}
    />
  );
};
export const ButtonBarInSplitLayout = ButtonBarExample.bind({});

ButtonBarInSplitLayout.argTypes = {
  align: {
    options: [...FLEX_ALIGNMENT_BASE, "stretch", "baseline"],
    control: { type: "select" },
  },
  gap: {
    type: "number",
  },
  separators: {
    options: ["start", "center", "end", true],
    control: { type: "select" },
  },
  wrap: {
    type: "boolean",
  },
};
