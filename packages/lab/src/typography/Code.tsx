import { forwardRef, memo } from "react";

import { Text, TextProps } from "./Text";

export const Code = memo(
  forwardRef<HTMLElement, Omit<TextProps, "elementType">>(function Code(
    { children, ...rest },
    ref
  ) {
    return (
      <Text elementType="code" ref={ref} {...rest}>
        {children}
      </Text>
    );
  })
);
