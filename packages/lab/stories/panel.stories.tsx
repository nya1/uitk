import { ToolkitProvider } from "@jpmorganchase/uitk-core";
import { Panel } from "@jpmorganchase/uitk-lab";
import { ComponentStory, ComponentMeta } from "@storybook/react-webpack5";
import { AllRenderer } from "docs/components";

import "./Panel.stories.newapp-panel.css";

export default {
  title: "Lab/Panel",
  component: Panel,
} as ComponentMeta<typeof Panel>;

const Template: ComponentStory<typeof Panel> = (args) => <Panel {...args} />;

export const Medium = Template.bind({});
Medium.args = {
  children: "Lorem Ipsum",
  className: "uitkEmphasisMedium",
};

export const High = Template.bind({});
High.args = {
  children: "Lorem Ipsum",
  className: "uitkEmphasisHigh",
};

export const All: ComponentStory<typeof Panel> = (props) => {
  return (
    <>
      <h1>Medium emphasis</h1>
      <AllRenderer>
        <Panel {...props} />
      </AllRenderer>
      <h1>High emphasis</h1>
      <AllRenderer>
        <Panel className="uitkEmphasisHigh" {...props} />
      </AllRenderer>
    </>
  );
};
All.args = {
  children: <p>Lorem Ipsum</p>,
};

export const CustomStyling: ComponentStory<typeof Panel> = () => (
  <>
    <ToolkitProvider density="high" theme={["light", "newapp"]}>
      <Panel>This is a panel with some text.</Panel>
    </ToolkitProvider>
    <ToolkitProvider density="medium" theme={["dark", "newapp"]}>
      <Panel>This is a panel with some text.</Panel>
    </ToolkitProvider>
  </>
);
