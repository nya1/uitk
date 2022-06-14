import { useState } from "react";
import { Button } from "@jpmorganchase/uitk-core";
import {
  Dropdown as Dropdown,
  DropdownProps as DropdownProps,
  DropdownButton,
} from "@jpmorganchase/uitk-lab";

import { Story } from "@storybook/react";

export default {
  title: "Lab/Dropdown",
  component: Dropdown,
};

export const DefaultDropdown: Story<DropdownProps> = () => {
  const handleChange = (isOpen: boolean) => {
    console.log("isOpen changed", isOpen);
  };

  const callbackRef = (el: HTMLDivElement) => {
    console.log(`ref on Button set to ${el.className}`);
  };
  return (
    <div style={{ display: "flex", gap: 20 }}>
      <Dropdown onOpenChange={handleChange} style={{ width: 180 }}>
        <DropdownButton label="Bottom Start " ref={callbackRef} />
        <div style={{ backgroundColor: "red", width: 200, height: 100 }} />
      </Dropdown>
      <Dropdown
        onOpenChange={handleChange}
        placement="bottom-end"
        style={{ width: 180 }}
      >
        <DropdownButton label="Bottom End" />
        <div style={{ backgroundColor: "red", width: 200, height: 100 }} />
      </Dropdown>
    </div>
  );
};

export const ControlledDropdown: Story<DropdownProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleChange: DropdownProps["onOpenChange"] = (open: boolean) => {
    setIsOpen(open);
  };

  const showDropdown = () => {
    setIsOpen(true);
  };
  const hideDropdown = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={showDropdown}>Show</Button>
      <Button onClick={hideDropdown}>Hide</Button>
      <Dropdown
        onOpenChange={handleChange}
        isOpen={isOpen}
        style={{ width: 180 }}
      >
        <DropdownButton label="Click Here" />
        <div style={{ backgroundColor: "red", width: 200, height: 100 }} />
      </Dropdown>
    </>
  );
};
