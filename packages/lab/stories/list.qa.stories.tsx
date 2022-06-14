import { FC, Fragment } from "react";
import type { ComponentMeta, DecoratorFn, Story } from "@storybook/react";
import { QAContainer } from "docs/components";

import { ToolkitProvider } from "@jpmorganchase/uitk-core";
import { List, ListProps } from "@jpmorganchase/uitk-lab";

import { usa_states } from "./list.data";

import "./list.stories.css";

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  width: "calc(100vw - 2em)",
};

const withFullViewWidth: DecoratorFn = (Story) => (
  <div style={containerStyle}>
    <Story />
  </div>
);

export default {
  title: "Lab/List/QA",
  component: List,
  decorators: [withFullViewWidth],
} as ComponentMeta<typeof List>;

const DocGrid: FC = ({ children }) => (
  <div
    style={{
      display: "grid",
      alignItems: "start",
      gap: 8,
      gridTemplateColumns: "repeat(4, 180px)",
      gridTemplateRows: "min-content",
      background: "white",
      // Temporary measure, reset line height to avoid inherit from body causing issue
      lineHeight: 1,
      height: 1100,
    }}
  >
    {children}
  </div>
);

const DensityValues = ["high", "medium", "low", "touch"] as const;
const DisplayRows = [undefined, 7, 5, 4] as const;
// const DensityValues = ['high', 'medium'] as const;

export const AllExamples: Story<ListProps> = () => (
  <DocGrid>
    {DensityValues.map((d, i) => (
      <Fragment key={i}>
        <ToolkitProvider density={d} theme="light">
          <List
            aria-label="Listbox example"
            displayedItemCount={DisplayRows[i]}
            highlightedIndex={1}
            defaultSelected={usa_states[2]}
            source={usa_states}
          />
        </ToolkitProvider>
      </Fragment>
    ))}
    {DensityValues.map((d, i) => (
      <Fragment key={i}>
        <ToolkitProvider density={d} theme="dark">
          <List
            aria-label="Listbox example"
            displayedItemCount={DisplayRows[i]}
            highlightedIndex={1}
            defaultSelected={usa_states[2]}
            source={usa_states}
          />
        </ToolkitProvider>
      </Fragment>
    ))}
    {DensityValues.map((d, i) => (
      <Fragment key={i}>
        <ToolkitProvider density={d} theme="light">
          <List
            aria-label="Listbox example"
            displayedItemCount={DisplayRows[i]}
            highlightedIndex={1}
            defaultSelected={[usa_states[2], usa_states[3]]}
            selectionStrategy="multiple"
            source={usa_states}
          />
        </ToolkitProvider>
      </Fragment>
    ))}
    {DensityValues.map((d, i) => (
      <Fragment key={i}>
        <ToolkitProvider density={d} theme="dark">
          <List
            aria-label="Listbox example"
            displayedItemCount={DisplayRows[i]}
            highlightedIndex={1}
            defaultSelected={[usa_states[2], usa_states[3]]}
            selectionStrategy="multiple"
            source={usa_states}
          />
        </ToolkitProvider>
      </Fragment>
    ))}
  </DocGrid>
);

export const CompareWithBaseline: Story<ListProps> = (props) => {
  return (
    <QAContainer
      width={1272}
      height={1100}
      className="uitkFormFieldQA"
      imgSrc="/visual-regression-screenshots/List-vr-snapshot.png"
    >
      <AllExamples />
    </QAContainer>
  );
};
