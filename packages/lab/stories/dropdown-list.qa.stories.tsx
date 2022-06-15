import { Story } from "@storybook/react";
import { QAContainer } from "docs/components";

import { Panel, ToolkitProvider } from "@jpmorganchase/uitk-core";

import {
  DropdownList,
  DropdownListProps,
  FormField,
} from "@jpmorganchase/uitk-lab";
import { usa_states } from "./list.data";

export default {
  title: "Lab/DropdownList/QA",
  component: DropdownList,
};

const DensityValues = ["high", "medium", "low", "touch"] as const;
const DisplayRows = [5, 4, 3, 2] as const;

export const AllExamples: Story<DropdownListProps> = () => (
  <div>
    <ToolkitProvider theme="light">
      <Panel style={{ height: 250 }}>
        <div style={{ display: "flex", gap: 20 }}>
          {DensityValues.map((d, i) => (
            <ToolkitProvider key={`density-light-${d}`} density={d}>
              <FormField
                helperText="This is some help text"
                label="ADA compliant label"
              >
                <DropdownList
                  ListProps={{
                    displayedItemCount: DisplayRows[i],
                  }}
                  aria-label="Listbox example"
                  defaultIsOpen
                  defaultSelected={usa_states[1]}
                  source={usa_states}
                />
              </FormField>
            </ToolkitProvider>
          ))}
        </div>
      </Panel>
    </ToolkitProvider>
    <ToolkitProvider theme="dark">
      <Panel style={{ height: 250 }}>
        <div style={{ display: "flex", gap: 20 }}>
          {DensityValues.map((d, i) => (
            <ToolkitProvider key={`density-light-${d}`} density={d}>
              <FormField
                helperText="This is some help text"
                label="ADA compliant label"
              >
                <DropdownList
                  ListProps={{
                    displayedItemCount: DisplayRows[i],
                  }}
                  aria-label="Listbox example"
                  defaultIsOpen
                  defaultSelected={usa_states[1]}
                  source={usa_states}
                />
              </FormField>
            </ToolkitProvider>
          ))}
        </div>
      </Panel>
    </ToolkitProvider>

    <ToolkitProvider theme="light">
      <Panel>
        <div style={{ display: "flex", gap: 20 }}>
          {DensityValues.map((d, i) => (
            <ToolkitProvider key={`density-light-${d}`} density={d}>
              <DropdownList
                ListProps={{
                  displayedItemCount: DisplayRows[i],
                }}
                aria-label="Listbox example"
                defaultSelected={usa_states[2]}
                source={usa_states}
              />
            </ToolkitProvider>
          ))}
        </div>
      </Panel>
    </ToolkitProvider>
    <ToolkitProvider theme="dark">
      <Panel>
        <div style={{ display: "flex", gap: 20 }}>
          {DensityValues.map((d, i) => (
            <ToolkitProvider key={`density-dark-${d}`} density={d}>
              <DropdownList
                ListProps={{
                  displayedItemCount: DisplayRows[i],
                }}
                aria-label="Listbox example"
                defaultSelected={usa_states[2]}
                source={usa_states}
              />
            </ToolkitProvider>
          ))}
        </div>
      </Panel>
    </ToolkitProvider>
    <ToolkitProvider theme="light">
      <Panel>
        <div style={{ display: "flex", gap: 20 }}>
          {DensityValues.map((d, i) => (
            <ToolkitProvider key={`density-light-${d}`} density={d}>
              <FormField
                helperText="This is some help text"
                label="ADA compliant label"
              >
                <DropdownList
                  ListProps={{
                    displayedItemCount: DisplayRows[i],
                  }}
                  aria-label="Listbox example"
                  source={usa_states}
                />
              </FormField>
            </ToolkitProvider>
          ))}
        </div>
      </Panel>
    </ToolkitProvider>
    <ToolkitProvider theme="dark">
      <Panel>
        <div style={{ display: "flex", gap: 20 }}>
          {DensityValues.map((d, i) => (
            <ToolkitProvider key={`density-dark-${d}`} density={d}>
              <FormField
                helperText="This is some help text"
                label="ADA compliant label"
              >
                <DropdownList
                  ListProps={{
                    displayedItemCount: DisplayRows[i],
                  }}
                  aria-label="Listbox example"
                  source={usa_states}
                />
              </FormField>
            </ToolkitProvider>
          ))}
        </div>
      </Panel>
    </ToolkitProvider>
  </div>
);

export const CompareWithBaseline: Story<DropdownListProps> = (props) => {
  return (
    <QAContainer
      width={1272}
      height={1100}
      className="uitkFormFieldQA"
      imgSrc="/visual-regression-screenshots/DropdownList-vr-snapshot.png"
    >
      <AllExamples />
    </QAContainer>
  );
};
