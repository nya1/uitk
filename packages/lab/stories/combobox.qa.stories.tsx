import { ComponentMeta, Story } from "@storybook/react";

import { ToolkitProvider } from "@jpmorganchase/uitk-core";
import {
  Combobox as ComboBox,
  ComboboxProps,
  escapeRegExp,
  FormField,
  ListItem,
  ListItemProps,
  ListItemType,
  Panel,
} from "@jpmorganchase/uitk-lab";

import { usa_states } from "./list.data";

export default {
  title: "Lab/Combobox/QA",
  component: ComboBox,
} as ComponentMeta<typeof ComboBox>;

const DensityValues = ["high", "medium", "low", "touch"] as const;
const DisplayRows = [5, 4, 3, 2] as const;
// const DensityValues = ['high', 'medium'] as const;

export const AllExamples: Story<ComboboxProps> = () => (
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
                <ComboBox
                  ListProps={{
                    defaultSelected: usa_states[1],
                    displayedItemCount: DisplayRows[i],
                  }}
                  aria-label="Listbox example"
                  defaultIsOpen
                  defaultValue="al"
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
                <ComboBox
                  ListProps={{
                    displayedItemCount: DisplayRows[i],
                  }}
                  aria-label="Listbox example"
                  defaultIsOpen
                  initialSelectedItem={usa_states[1]}
                  inputValue="al"
                  source={usa_states}
                />
              </FormField>
            </ToolkitProvider>
          ))}
        </div>
      </Panel>
    </ToolkitProvider>
    <ToolkitProvider theme="light">
      <Panel style={{ height: "auto" }}>
        <div style={{ display: "flex", gap: 20 }}>
          {DensityValues.map((d, i) => (
            <ToolkitProvider key={`density-light-${d}`} density={d}>
              <ComboBox
                ListProps={{
                  displayedItemCount: DisplayRows[i],
                }}
                aria-label="Listbox example"
                initialSelectedItem={usa_states[2]}
                source={usa_states}
              />
            </ToolkitProvider>
          ))}
        </div>
      </Panel>
    </ToolkitProvider>
    <ToolkitProvider theme="dark">
      <Panel style={{ height: "auto" }}>
        <div style={{ display: "flex", gap: 20 }}>
          {DensityValues.map((d, i) => (
            <ToolkitProvider key={`density-dark-${d}`} density={d}>
              <ComboBox
                ListProps={{
                  displayedItemCount: DisplayRows[i],
                }}
                aria-label="Listbox example"
                initialSelectedItem={usa_states[2]}
                source={usa_states}
              />
            </ToolkitProvider>
          ))}
        </div>
      </Panel>
    </ToolkitProvider>
    <ToolkitProvider theme="light">
      <Panel style={{ height: "auto" }}>
        <div style={{ display: "flex", gap: 20 }}>
          {DensityValues.map((d, i) => (
            <ToolkitProvider key={`density-light-${d}`} density={d}>
              <FormField
                helperText="This is some help text"
                label="ADA compliant label"
              >
                <ComboBox
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
      <Panel style={{ height: "auto" }}>
        <div style={{ display: "flex", gap: 20 }}>
          {DensityValues.map((d, i) => (
            <ToolkitProvider key={`density-dark-${d}`} density={d}>
              <FormField
                helperText="This is some help text"
                label="ADA compliant label"
              >
                <ComboBox
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
