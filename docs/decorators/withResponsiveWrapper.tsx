import { DecoratorFn } from "@storybook/react-webpack5";
import { ResponsiveContainer } from "docs/components/ResponsiveContainer";

export const withResponsiveWrapper: DecoratorFn = (Story, context) => {
  const { responsive } = context.globals;

  return responsive === "wrap" ? (
    <ResponsiveContainer>
      <Story {...context} />
    </ResponsiveContainer>
  ) : (
    <Story {...context} />
  );
};
