import { FC, useCallback, useState } from "react";
import { Story } from "@storybook/react";

import { Button } from "@jpmorganchase/uitk-core";
import {
  DoubleChevronDownIcon,
  DoubleChevronUpIcon,
} from "@jpmorganchase/uitk-icons";

import {
  DropdownButton,
  DropdownList,
  DropdownListProps,
  FormField,
  ListItem,
  ListItemType,
  Tooltip,
  useTooltip,
} from "@jpmorganchase/uitk-lab";
import { usa_states } from "./list.data";

import { SelectionChangeHandler } from "../src/common-hooks";

export default {
  title: "Lab/DropdownList",
  component: DropdownList,
};

export const DefaultDropdownList: Story<DropdownListProps> = () => {
  const handleChange: SelectionChangeHandler = (event, selectedItem) => {
    console.log("selection changed", selectedItem);
  };
  return (
    <DropdownList
      defaultSelected={usa_states[0]}
      onSelectionChange={handleChange}
      source={usa_states}
    />
  );
};

export const MultiSelectDropdownExample: Story<DropdownListProps> = () => {
  const handleChange: SelectionChangeHandler<string, "multiple"> = (
    _e,
    [items]
  ) => {
    console.log({ selected: items });
  };
  return (
    <DropdownList
      defaultSelected={["California", "Colorado"]}
      onSelectionChange={handleChange}
      selectionStrategy="multiple"
      source={usa_states}
    />
  );
};

interface objectOptionType {
  value: number;
  text: string;
  id: number;
}
const objectOptionsExampleData: objectOptionType[] = [
  { value: 10, text: "A Option", id: 1 },
  { value: 20, text: "B Option", id: 2 },
  { value: 30, text: "C Option", id: 3 },
  { value: 40, text: "D Option", id: 4 },
];

export const ItemToString: Story<DropdownListProps<objectOptionType>> = () => {
  const itemToString = (item: objectOptionType) => {
    return item ? item.text : "";
  };
  return (
    <DropdownList<objectOptionType>
      defaultSelected={objectOptionsExampleData[0]}
      itemToString={itemToString}
      source={objectOptionsExampleData}
    />
  );
};

export const CustomButton: Story<DropdownListProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Arkansas");
  const handleChange: SelectionChangeHandler = (event, selectedItem) => {
    if (selectedItem) {
      setSelectedValue(selectedItem);
    }
  };

  return (
    <DropdownList
      selected={selectedValue}
      onOpenChange={setIsOpen}
      onSelectionChange={handleChange}
      placement="bottom-end"
      source={usa_states}
      triggerComponent={
        <DropdownButton
          IconComponent={isOpen ? DoubleChevronUpIcon : DoubleChevronDownIcon}
          label={selectedValue}
        />
      }
    ></DropdownList>
  );
};

export const CustomWidth: Story<DropdownListProps> = () => (
  <DropdownList
    ListProps={{ width: 300 }}
    defaultSelected={usa_states[0]}
    source={usa_states}
    width={200}
  />
);

const ItalicListItem: ListItemType<string> = ({ item, ...props }) => {
  return (
    // Make sure to spread the props onto custom item
    <ListItem {...props}>
      <i>{item}</i>
    </ListItem>
  );
};

export const CustomRowRenderer: Story<DropdownListProps> = () => (
  <DropdownList
    ListItem={ItalicListItem}
    defaultSelected={usa_states[0]}
    source={usa_states}
  />
);

const ListItemWithTooltip: ListItemType<string> = ({
  item = "uknown",
  ...props
}) => {
  const { getTriggerProps, getTooltipProps } = useTooltip({
    placement: "right",
  });
  const { ref: triggerRef, ...triggerProps } =
    getTriggerProps<typeof ListItem>(props);

  return (
    <ListItem ref={triggerRef} {...triggerProps}>
      <label style={{ width: "100%" }}>{item}</label>
      <Tooltip {...getTooltipProps({ title: `I am a tooltip for ${item}` })} />
    </ListItem>
  );
};

export const CustomRowRendererWithTooltip: Story<DropdownListProps> = () => (
  <DropdownList
    ListItem={ListItemWithTooltip}
    source={usa_states}
    defaultSelected={usa_states[0]}
  />
);

export const WithFormFieldLabelTop: Story<DropdownListProps> = () => {
  return (
    <div style={{ width: 250 }}>
      <FormField helperText="Select a value" label="ADA compliant label">
        <DropdownList defaultSelected={usa_states[2]} source={usa_states} />
      </FormField>
    </div>
  );
};

export const WithFormFieldLabelLeft: Story<DropdownListProps> = () => {
  return (
    <div style={{ width: 250 }}>
      <FormField
        helperText="This is some help text"
        label="ADA compliant label"
        labelPlacement="left"
      >
        <DropdownList defaultSelected={usa_states[2]} source={usa_states} />
      </FormField>
    </div>
  );
};

// We supply `height` to the div so that the popper can be captured in visual
// regression test
export const InitialIsOpen: Story<DropdownListProps> = () => {
  return (
    <div style={{ width: 250, height: 500 }}>
      <FormField
        helperText="This is some help text"
        label="ADA compliant label"
      >
        <DropdownList
          defaultSelected={usa_states[2]}
          defaultIsOpen
          source={usa_states}
        />
      </FormField>
    </div>
  );
};

const constArray = ["A", "B", "C"] as const;

/** Illustration of using readonly source */
export const ConstReadonlySource: Story<DropdownListProps> = () => (
  <DropdownList defaultSelected={constArray[0]} source={constArray} />
);

export const DisabledDropdownList: Story<DropdownListProps> = () => {
  const handleChange: SelectionChangeHandler = (event, selectedItem) => {
    console.log("selection changed", selectedItem);
  };
  return (
    <DropdownList
      disabled
      id="test"
      onSelectionChange={handleChange}
      source={["Bar", "Foo", "Foo Bar", "Baz"]}
      style={{ width: 180 }}
    />
  );
};

export const ControlledOpenDropdown: Story<DropdownListProps> = () => {
  const [isOpen, setIsOpen] = useState(true);
  const handleChange: any = (open: boolean) => {
    console.log({ openChanged: open });
  };
  const toggleDropdown = useCallback(() => {
    console.log(`toggleDropdoen isOpen = ${isOpen}`);
    setIsOpen(!isOpen);
  }, [isOpen]);
  return (
    <>
      <Button onClick={toggleDropdown}>
        {isOpen ? "Hide Dropdown" : "Show Dropdown"}
      </Button>
      <DropdownList
        isOpen={isOpen}
        defaultSelected="Alaska"
        onOpenChange={handleChange}
        source={usa_states}
        style={{ width: 180 }}
      />
    </>
  );
};
