import { ComponentProps, memo } from "react";

import {
  Combobox,
  ComboboxProps,
  escapeRegExp,
  FormField,
  Highlighter,
  ListItem,
  ListItemProps,
  ListItemType,
} from "@jpmorganchase/uitk-lab";

import { ComponentMeta, Story } from "@storybook/react";

export default {
  title: "Lab/Combobox",
  component: Combobox,
} as ComponentMeta<typeof Combobox>;

const shortColorData = [
  "Baby blue",
  "Black",
  "Blue",
  "Brown",
  "Green",
  "Orange",
  "Pink",
  "Purple",
  "Red",
  "White",
  "Yellow",
];

const statesData = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

type LargeCity = {
  name: string;
  countryCode: string;
};

const largestCities: LargeCity[] = [
  { name: "Tokyo", countryCode: "JP" },
  { name: "Delhi", countryCode: "IN" },
  { name: "Shanghai", countryCode: "CN" },
  { name: "São Paulo", countryCode: "BR" },
  { name: "Mexico City", countryCode: "MX" },
  { name: "Cairo", countryCode: "EG" },
  { name: "Mumbai", countryCode: "IN" },
  { name: "Beijing", countryCode: "CN" },
  { name: "Dhaka", countryCode: "BD" },
  { name: "Osaka", countryCode: "JP" },
  { name: "New York City", countryCode: "US" },
  { name: "Karachi", countryCode: "PK" },
  { name: "Buenos Aires", countryCode: "AR" },
  { name: "Chongqing", countryCode: "CN" },
  { name: "Istanbul", countryCode: "TR" },
  { name: "Kolkata", countryCode: "IN" },
  { name: "Manila", countryCode: "PH" },
  { name: "Lagos", countryCode: "NG" },
  { name: "Rio de Janeiro", countryCode: "BR" },
  { name: "Tianjin", countryCode: "CN" },
];

const MemoizedCityItem = memo(function MemoizedItem({
  item,
  itemTextHighlightPattern,
  ...restProps
}: ListItemProps<LargeCity>) {
  return (
    <ListItem {...restProps}>
      {item?.countryCode && (
        <img
          src={`https://flagcdn.com/${item.countryCode.toLowerCase()}.svg`}
          width={20}
          alt={`${item.countryCode} flag`}
        />
      )}
      <span style={{ marginLeft: 10 }}>
        <Highlighter
          matchPattern={itemTextHighlightPattern}
          text={item?.name}
        />
      </span>
    </ListItem>
  );
});

const CityListItem: ListItemType<LargeCity> = (props) => {
  return <MemoizedCityItem {...props} />;
};

const cityItemToString = ({ name }: LargeCity) => name;

const ComboBoxTemplate: Story<ComboboxProps> = (args) => {
  return <Combobox {...args} />;
};

const FormFieldComboBoxTemplate: Story<
  ComponentProps<typeof Combobox> &
    Pick<
      ComponentProps<typeof FormField>,
      "labelPlacement" | "label" | "required" | "LabelProps"
    >
> = (args) => {
  const {
    source,
    width,
    labelPlacement,
    label,
    required,
    LabelProps,
    ...rest
  } = args;
  return (
    <FormField
      label={label}
      labelPlacement={labelPlacement}
      required={required}
      style={{ width }}
      LabelProps={LabelProps}
    >
      <Combobox source={source} width={width} {...rest} />
    </FormField>
  );
};

export const Default = ComboBoxTemplate.bind({});
Default.args = {
  // onSelectionChange: (e, value) =>
  //   console.log(`onSelection change called ${value}`),
  source: statesData,
  width: 292,
};

export const WithCustomizedFilter = ComboBoxTemplate.bind({});
const getFilterRegex: (text: string) => RegExp = (value) =>
  new RegExp(`\\b(${escapeRegExp(value)})`, "gi");
WithCustomizedFilter.args = {
  ...Default.args,
  getFilterRegex,
};

export const ItemRenderer: Story<ComboboxProps<LargeCity>> = (args) => {
  return (
    <FormField label="Select a large city" style={{ maxWidth: 292 }}>
      <Combobox {...args} />
    </FormField>
  );
};

ItemRenderer.args = {
  ListItem: CityListItem,
  ListProps: {
    displayedItemCount: 5,
  },
  // TODO how do we specify the Item type is LargeCity ?
  itemToString: cityItemToString as (item: unknown) => string,
  source: largestCities,
};

export const WithFormField = FormFieldComboBoxTemplate.bind({});
WithFormField.args = {
  label: "Select",
  width: 292,
  source: shortColorData,
  labelPlacement: "top",
};

export const WithFreeText = FormFieldComboBoxTemplate.bind({});
WithFreeText.args = {
  ...WithFormField.args,
  label: "Enter a value",
  allowFreeText: true,
};

export const WithInitialSelection = FormFieldComboBoxTemplate.bind({});
WithInitialSelection.args = {
  ...WithFormField.args,
  defaultValue: shortColorData[3],
};
