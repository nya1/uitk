import { forwardRef, HTMLAttributes } from "react";
import classnames from "classnames";
import { makePrefixer, useStyleInject } from "@jpmorganchase/uitk-core";

import style from "./DialogActions.css";

export interface DialogActionsProps extends HTMLAttributes<HTMLDivElement> {}

const withBaseName = makePrefixer("uitkDialogActions");

export const DialogActions = forwardRef<HTMLDivElement, DialogActionsProps>(
  function DialogActions(props, ref) {
    const { className, children, ...rest } = props;

    useStyleInject(style);

    return (
      <div
        {...rest}
        className={classnames(withBaseName(), className)}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);
