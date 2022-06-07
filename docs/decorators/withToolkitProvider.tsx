import { DecoratorFn } from "@storybook/react-webpack5";
import { ToolkitProvider } from "@jpmorganchase/uitk-core";

export const withToolkitProvider: DecoratorFn = (Story, context) => {
  const { density, theme } = context.globals;
  return (
    <ToolkitProvider density={density} theme={theme}>
      <Story {...context} />
    </ToolkitProvider>
  );
};
