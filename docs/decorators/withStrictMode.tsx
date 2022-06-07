import { DecoratorFn } from "@storybook/react-webpack5";
import { StrictMode } from "react";

export const withStrictMode: DecoratorFn = (Story, context) => {
  const { strictMode } = context.globals;

  if (strictMode === "disable") {
    return <Story {...context} />;
  }

  return (
    <StrictMode>
      <Story {...context} />
    </StrictMode>
  );
};
