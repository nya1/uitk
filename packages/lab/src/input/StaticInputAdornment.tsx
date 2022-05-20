import { forwardRef, HTMLAttributes } from "react";
import cx from "classnames";
import { makePrefixer, useStyleInject } from "@jpmorganchase/uitk-core";

import style from "./StaticInputAdornment.css";

export interface StaticInputAdornmentProps
  extends HTMLAttributes<HTMLDivElement> {}

const withBaseName = makePrefixer("uitkStaticInputAdornment");

export const StaticInputAdornment = forwardRef<
  HTMLDivElement,
  StaticInputAdornmentProps
>(function StaticInputAdornment(props, ref) {
  const { children, className, ...other } = props;
  useStyleInject(style);
  return (
    <div className={cx(withBaseName(), className)} ref={ref} {...other}>
      {children}
    </div>
  );
});
