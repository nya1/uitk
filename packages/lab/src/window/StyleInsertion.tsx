import { useStyleInject } from "@jpmorganchase/uitk-core";

export const StyleInsertion = ({ style }: { style: string }): null => {
  console.log(style);
  useStyleInject(style);

  return null;
};
