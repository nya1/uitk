import type { DecoratorFn } from "@storybook/react-webpack5";

/** A storybook decorator that adds a gap between elements of a story */
export const withFlexGap: DecoratorFn = (Story, context) => {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Story {...context} />
    </div>
  );
};
