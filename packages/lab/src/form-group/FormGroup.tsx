import { forwardRef, HTMLAttributes } from "react";
import cx from "classnames";

import style from "./FormGroup.css";
import { useStyleInject } from "@jpmorganchase/uitk-core";

export interface FormGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Display group of elements in a compact row.
   */
  row?: boolean;
}

const baseName = "uitkFormGroup";

export const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  function FormGroup({ className, row, ...other }, ref) {
    useStyleInject(style);
    return (
      <div
        className={cx(baseName, { [`${baseName}-row`]: row }, className)}
        ref={ref}
        {...other}
      />
    );
  }
);
