import {
  Children,
  cloneElement,
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  useRef,
  useState,
} from "react";
import cx from "classnames";
import {
  flip,
  limitShift,
  shift,
  size,
} from "@floating-ui/react-dom-interactions";
import { makePrefixer } from "@jpmorganchase/uitk-core";
import { useFloatingUI } from "../popper";
import { Portal, PortalProps } from "../portal";
import { useWindow } from "../window";
import { forwardCallbackProps, useForkRef, useIdMemo as useId } from "../utils";

import { useDropdown } from "./useDropdown";

import "./Dropdown.css";

type MaybeProps = {
  className?: string;
  id?: string;
  role?: string;
  width: number | string;
};

type DropdownPlacement =
  | "bottom-start"
  | "bottom-end"
  | "top-start"
  | "top-end"; // do any others make sense ?
export interface DropdownProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect">,
    Pick<PortalProps, "disablePortal" | "container"> {
  defaultIsOpen?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  isOpen?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
  onOpenChange?: (isOpen: boolean) => void;
  openOnFocus?: boolean;
  placement?: DropdownPlacement;
  popupWidth?: number;
  triggerComponent?: JSX.Element;
  width?: number | string;
}

const withBaseName = makePrefixer("uitkDropdown");

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  function Dropdown(
    {
      children,
      className: classNameProp,
      container,
      defaultIsOpen,
      disabled,
      disablePortal,
      fullWidth,
      id: idProp,
      isOpen: isOpenProp,
      onKeyDown,
      onOpenChange,
      openOnFocus,
      placement = "bottom-start",
      popupWidth,
      width,
      ...htmlAttributes
    },
    forwardedRef
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const className = cx(withBaseName(), classNameProp, {
      [withBaseName("fullWidth")]: fullWidth,
      [withBaseName("disabled")]: disabled,
    });
    const [trigger, popupComponent] = Children.toArray(
      children
    ) as JSX.Element[];
    const id = useId(idProp);
    const Window = useWindow();

    const { componentProps, popperRef, isOpen, triggerProps } = useDropdown({
      defaultIsOpen,
      disabled,
      fullWidth,
      id,
      isOpen: isOpenProp,
      onOpenChange,
      onKeyDown,
      openOnFocus,
      popupComponent,
      popupWidth,
      rootRef,
      width,
    });
    const [maxPopupHeight, setMaxPopupHeight] = useState<number | undefined>(
      undefined
    );
    const { reference, floating, x, y, strategy } = useFloatingUI({
      placement,
      middleware: [
        flip({
          fallbackPlacements: ["bottom-start", "top-start"],
        }),
        shift({ limiter: limitShift() }),
        size({
          apply({ availableHeight }) {
            setMaxPopupHeight(availableHeight);
          },
        }),
      ],
    });

    const handlePopperListAdapterRef = useForkRef<HTMLDivElement>(
      reference,
      forwardedRef
    );
    const handleRootRef = useForkRef(rootRef, handlePopperListAdapterRef);
    const handleFloatingRef = useForkRef<HTMLDivElement>(floating, popperRef);
    // TODO maybe we should pass style, with maxHeight, to the popupComponent

    const getTriggerComponent = () => {
      const {
        id: defaultId,
        role: defaultRole,
        ...restTriggerProps
      } = triggerProps;

      const {
        id = defaultId,
        role = defaultRole,
        ...ownProps
      } = trigger.props as MaybeProps;

      return cloneElement(
        trigger,
        forwardCallbackProps(ownProps, {
          ...restTriggerProps,
          id,
          role,
        })
      );
    };

    const getPopupComponent = () => {
      const { id: defaultId, width } = componentProps;
      const {
        className,
        id = defaultId,
        width: ownWidth,
        ...ownProps
      } = popupComponent.props as MaybeProps;
      return cloneElement(popupComponent, {
        ...ownProps,
        className: cx(className, withBaseName("popup-component")),
        id,
        width: ownWidth ?? width,
      });
    };

    return (
      <div
        {...htmlAttributes}
        className={className}
        id={id}
        ref={handleRootRef}
      >
        {getTriggerComponent()}
        {isOpen && (
          <Portal disablePortal={disablePortal} container={container}>
            <Window
              className={withBaseName("popup")}
              id={`${id}-popup`}
              style={{
                top: y ?? "",
                left: x ?? "",
                position: strategy,
                maxHeight: maxPopupHeight ?? "",
              }}
              ref={handleFloatingRef}
            >
              {getPopupComponent()}
            </Window>
          </Portal>
        )}
      </div>
    );
  }
);
