import {
  FocusEvent,
  HTMLAttributes,
  MouseEvent,
  useCallback,
  useRef,
  KeyboardEvent,
  ReactElement,
  RefObject,
  useState,
} from "react";
import { useControlled } from "../utils";
import { useClickAway } from "./useClickAway";
import { measurements, useResizeObserver, WidthOnly } from "../responsive";
import { useFormFieldProps } from "../form-field-context";

const NO_OBSERVER: string[] = [];

export interface DropdownHookProps {
  defaultIsOpen?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  id: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
  openOnFocus?: boolean;
  popupComponent: ReactElement;
  popupWidth?: number;
  rootRef: RefObject<HTMLDivElement>;
  width?: number | string;
}

export interface DropdownHookTriggerProps {
  "aria-expanded"?: boolean;
  "aria-owns"?: string;
  id: string;
  onClick?: (e: MouseEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  role: string;
  onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
  style?: any;
}

// We don't know what the popup component will be, but for those that
// support a width prop ...
interface ComponentProps extends HTMLAttributes<HTMLElement> {
  width?: number | string;
}

// TODO add onButtonClick
export interface DropdownHookResult {
  componentProps: ComponentProps;
  isOpen: boolean;
  label: string;
  popperRef: (node: HTMLElement | null) => void;
  triggerProps: DropdownHookTriggerProps;
}

export const useDropdown = ({
  defaultIsOpen,
  disabled,
  // TODO check how we're using fullWidth, do we need a separate value for the popup component
  fullWidth: fullWidthProp,
  id,
  isOpen: isOpenProp,
  onOpenChange,
  onKeyDown: onKeyDownProp,
  openOnFocus,
  popupComponent: { props: componentProps },
  popupWidth: popupWidthProp,
  rootRef,
  width,
}: DropdownHookProps): DropdownHookResult => {
  const justFocused = useRef<number | null>(null);
  const popperRef = useRef<HTMLElement | null>(null);
  const popperCallbackRef = useCallback((element: HTMLElement | null) => {
    popperRef.current = element;
  }, []);
  const [isOpen, setIsOpen] = useControlled({
    controlled: isOpenProp,
    default: defaultIsOpen,
    name: "useDropdown",
    state: "isOpen",
  });

  const {
    inFormField,
    onFocus: formFieldOnFocus,
    onBlur: formFieldOnBlur,
    a11yProps: { "aria-labelledby": ariaLabelledBy, ...restA11yProps } = {},
  } = useFormFieldProps();

  const [popup, setPopup] = useState<measurements>({
    width: popupWidthProp ?? width ?? 0,
  });

  const showDropdown = useCallback(() => {
    setIsOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange, setIsOpen]);

  const hideDropdown = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange, setIsOpen]);

  useClickAway({
    popperRef,
    rootRef,
    isOpen,
    onClose: hideDropdown,
  });

  const handleTriggerFocus = useCallback(() => {
    setIsOpen(true);
    onOpenChange?.(true);
    // Suppress response to click if click was the cause of focus
    justFocused.current = window.setTimeout(() => {
      justFocused.current = null;
    }, 1000);
  }, [onOpenChange, setIsOpen]);

  const handleTriggerToggle = useCallback(
    (e) => {
      // Do not trigger menu open for 'Enter' and 'SPACE' key as they're handled in `handleKeyDown`
      if (
        ["Enter", " "].indexOf((e as KeyboardEvent<HTMLDivElement>).key) === -1
      ) {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        onOpenChange?.(newIsOpen);
      }
    },
    [isOpen, setIsOpen, onOpenChange]
  );

  const handleKeydown = useCallback(
    (evt: KeyboardEvent<HTMLElement>) => {
      if ((evt.key === "Tab" || evt.key === "Escape") && isOpen) {
        // No preventDefault here, this behaviour does not need to be exclusive
        hideDropdown();
      } else if (
        (evt.key === "Enter" || evt.key === "ArrowDown" || evt.key === " ") &&
        !isOpen
      ) {
        evt.preventDefault();
        showDropdown();
      } else {
        onKeyDownProp?.(evt);
      }
    },
    [hideDropdown, isOpen, onKeyDownProp, showDropdown]
  );

  const fullWidth = fullWidthProp ?? inFormField;
  const measurements = fullWidth ? WidthOnly : NO_OBSERVER;
  useResizeObserver(rootRef, measurements, setPopup, fullWidth);

  const componentId = `${id}-dropdown`;

  // TODO do we use aria-popup - valid values are menu, disloag, grid, tree, listbox
  const triggerProps = {
    "aria-expanded": isOpen,
    "aria-owns": isOpen ? componentId : undefined,
    id: `${id}-control`,
    onClick: disabled || openOnFocus ? undefined : handleTriggerToggle,
    onFocus: openOnFocus && !disabled ? handleTriggerFocus : undefined,
    role: "listbox",
    onKeyDown: disabled ? undefined : handleKeydown,
    style: { width: fullWidth ? undefined : width },
  };

  const dropdownComponentProps = {
    id: componentId,
    width: popup.width,
  };

  return {
    componentProps: dropdownComponentProps,
    popperRef: popperCallbackRef,
    isOpen,
    label: "Dropdown Button",
    triggerProps,
  };
};
