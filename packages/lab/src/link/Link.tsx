import {
  AnchorHTMLAttributes,
  forwardRef,
  ReactNode,
  useCallback,
} from "react";
import cx from "classnames";
import { TearOutIcon } from "@jpmorganchase/uitk-icons";

import style from "./Link.css";
import { useStyleInject } from "@jpmorganchase/uitk-core";

/**
 * Links are a fundamental navigation element. When clicked, they take the user to an entirely different page.
 *
 * @example
 * <LinkExample to="#link">Action</LinkExample>
 */

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * The content of the link.
   */
  children?: ReactNode;
  /**
   * The className(s) of the component
   */
  className?: string;
  /**
   * If `true`, the link will be disabled.
   */
  disabled?: boolean;
  /**
   * A string to indicate the link url
   */
  href?: string;
  /**
   * A string to indicate the link target
   * Creates an Icon to the right of link if '_blank'
   */
  target?: string;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, className, disabled, children, target = "_self", ...rest },
  ref
) {
  const stopPropagation = useCallback((evt) => evt.stopPropagation(), []);
  const clxPrefix = "uitk";

  useStyleInject(style);

  return (
    <a
      className={cx(className, clxPrefix + "Link", {
        [clxPrefix + "Link-disabled"]: disabled,
      })}
      href={disabled ? undefined : href}
      onClick={stopPropagation}
      ref={ref}
      target={target}
      {...rest}
    >
      {children}
      {target && target === "_blank" && (
        <TearOutIcon
          aria-label="External Link"
          className={clxPrefix + "Link-icon"}
        />
      )}
    </a>
  );
});
