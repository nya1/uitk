import { forwardRef, memo } from "react";

import { Text, TextProps } from "./Text";

export const Div = memo(
  forwardRef<HTMLDivElement, Omit<TextProps, "elementType">>(function Div(
    { children, ...rest },
    ref
  ) {
    return (
      <Text ref={ref} {...rest}>
        {children}
      </Text>
    );
  })
);
