import { forwardRef, memo } from "react";
import { Text, TextProps } from "./Text";

export const Span = memo(
  forwardRef<HTMLSpanElement, Omit<TextProps, "elementType">>(function Span(
    { children, ...rest },
    ref
  ) {
    return (
      <Text elementType="span" ref={ref} {...rest}>
        {children}
      </Text>
    );
  })
);
