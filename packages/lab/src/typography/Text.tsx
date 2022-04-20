import {
  ElementType,
  HTMLAttributes,
  useEffect,
  useState,
  useRef,
  ReactNode,
  CSSProperties,
  forwardRef,
  useMemo,
  memo,
} from "react";
import cx from "classnames";
import {
  makePrefixer,
  useIsomorphicLayoutEffect,
  debounce,
} from "@brandname/core";
import { Tooltip, TooltipProps } from "@brandname/lab";

import { useForkRef } from "../utils";
import { getComputedStyles } from "./getComputedStyles";

import "./Text.css";

const withBaseName = makePrefixer("uitkText");

export interface TextProps extends HTMLAttributes<HTMLElement> {
  children?: string | ReactNode;
  /**
   * Represents the semantic element tag name as a string.
   * Defaults to 'div'
   */
  elementType?: ElementType;
  /**
   * When set, this will enforce the text to be truncated.
   */
  maxRows?: number;
  /**
   * If 'false' then text will be displayed at 100% height and will show scrollbar if the parent restricts it's height.
   * Defaults to 'true'
   */
  truncate?: boolean;
  /**
   * If 'true' it will show the Tooltip only if the text is truncated.
   * Defaults to 'true'
   */
  showTooltip?: boolean;
  /**
   * Customise Tooltip
   */
  tooltipProps?: Partial<TooltipProps>;
  /**
   * If 'true' the text will expand to 100% height, if 'false' text will collapse to 'maxRows'.
   *
   * When set, maxRows defaults to 1.
   *
   * When set, it will not show the tooltip when text is truncated.
   */
  expanded?: boolean;
  /**
   * Customise styling.
   */
  style?: CSSProperties;
  /**
   * Callback function triggered when overflow state changes.
   * @params [boolean] isOverflowed
   */
  onOverflow?: (isOverflowed: boolean) => unknown;
  /**
   * Override style for margin-top
   */
  marginTop?: number;
  /**
   * Override style for margin-bottom
   */
  marginBottom?: number;
}

const TOOLTIP_DELAY = 150;

const useRefValue = <T extends unknown>(value: T) => {
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef;
};

type GetIsOverflowedConfig = {
  maxRows?: number;
  expanded?: boolean;
  truncate?: boolean;
  element?: HTMLElement;
};

const getIsOverflowed = ({
  maxRows,
  expanded,
  truncate,
  element,
}: GetIsOverflowedConfig) => {
  let shouldOverflow = false;
  const rows = maxRows;

  if (element && !expanded && truncate) {
    const { offsetHeight, scrollHeight, offsetWidth, scrollWidth } = element;
    const { lineHeight } = getComputedStyles(element);

    const parent = element.parentElement;

    if (rows) {
      const maxRowsHeight = rows * lineHeight;

      if (maxRowsHeight < scrollHeight || maxRowsHeight < offsetHeight) {
        shouldOverflow = true;
      }
    }
    // we check for wrapper size only if it's the only child, otherwise we depend on too much styling
    else if (parent && !element.nextSibling && !element.previousSibling) {
      const { width: widthParent, height: heightParent } =
        getComputedStyles(parent);

      if (
        heightParent < scrollHeight ||
        heightParent < offsetHeight ||
        offsetWidth < scrollWidth ||
        Math.ceil(widthParent) < scrollWidth
      ) {
        shouldOverflow = true;
      }
    }
  }

  return shouldOverflow;
};

export const Text = memo(
  forwardRef<HTMLElement, TextProps>(function Text(
    {
      children,
      className,
      elementType = "div",
      maxRows,
      showTooltip = true,
      truncate = true,
      tooltipProps,
      expanded,
      style,
      onOverflow,
      marginTop,
      marginBottom,
      ...restProps
    },
    ref
  ) {
    const [element, setElement] = useState<HTMLElement | null>(null);
    const setContainerRef = useForkRef(ref, setElement);
    const [isOverflowed, setIsOverflowed] = useState(false);
    const onOverflowRef = useRefValue(onOverflow);

    const [isIntersecting, setIsIntersecting] = useState(false);

    const onScroll = useMemo(
      () =>
        debounce((entries: IntersectionObserverEntry[]) => {
          entries.forEach((entry) => {
            if (entry.target.isConnected) {
              setIsIntersecting(entry.isIntersecting);
            }
          });
        }),
      []
    );

    useIsomorphicLayoutEffect(() => {
      const scrollObserver = new IntersectionObserver(
        (entries) => {
          onScroll(entries);
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0,
        }
      );

      if (element) {
        scrollObserver.observe(element);
      }

      return () => {
        scrollObserver.disconnect();
      };
    }, [element, onScroll]);

    // Resizing
    // Check which is better
    // - Option 1
    // const elementRef = useRefValue(element);
    // const maxRowsRef = useRefValue(maxRows);
    // const expandedRef = useRefValue(expanded);
    // const truncateRef = useRefValue(truncate);
    // const isOverflowedRef = useRefValue(truncate);

    // const onResize = useMemo(() => debounce(() => {
    //   if (elementRef.current) {
    //     const currentIsOverflowed = getIsOverflowed({
    //       element: elementRef.current,
    //       maxRows: maxRowsRef.current,
    //       expanded: expandedRef.current,
    //       truncate: truncateRef.current,
    //     });

    //     setIsOverflowed(currentIsOverflowed);

    //     if (
    //       onOverflowRef.current &&
    //       isOverflowedRef.current !== currentIsOverflowed
    //     ) {
    //       onOverflowRef.current(currentIsOverflowed);
    //     }
    //   }
    // }), [
    //   elementRef,
    //   maxRowsRef,
    //   expandedRef,
    //   truncateRef,
    //   onOverflowRef,
    //   isOverflowedRef,
    // ]);

    // - Option 2
    const onResize = useMemo(
      () =>
        debounce(() => {
          if (element) {
            const currentIsOverflowed = getIsOverflowed({
              element,
              maxRows,
              expanded,
              truncate,
            });

            if (onOverflowRef.current && isOverflowed !== currentIsOverflowed) {
              onOverflowRef.current(currentIsOverflowed);
            }
            setIsOverflowed(currentIsOverflowed);
          }
        }),
      [element, maxRows, expanded, truncate, onOverflowRef, isOverflowed]
    );

    useIsomorphicLayoutEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
        if (
          entries.length > 0 &&
          entries[0].contentRect &&
          entries[0].target.isConnected
        ) {
          onResize();
        }
      });
      if (element && isIntersecting) {
        resizeObserver.observe(element);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, [element, isIntersecting]);

    const componentStyle = useMemo(() => {
      if (element) {
        let rows = maxRows;
        let textMaxRows = maxRows;
        let textHeight: string | undefined;

        if (!maxRows && expanded !== undefined) {
          rows = 1;
          textMaxRows = 1;
        } else if (maxRows === 0) {
          // mostly for accommodating reset maxRows in stories
          return {};
        }

        if (expanded) {
          textMaxRows = 0;
          textHeight = `100%`;
        } else if (truncate) {
          const { offsetHeight, scrollHeight, offsetWidth, scrollWidth } =
            element;
          const { lineHeight } = getComputedStyles(element);

          const parent = element.parentElement;

          if (rows) {
            const maxRowsHeight = rows * lineHeight;

            if (maxRowsHeight < scrollHeight || maxRowsHeight < offsetHeight) {
              textHeight = `${maxRowsHeight}px`;
            }
          }
          // we check for wrapper size only if it's the only child, otherwise we depend on too much styling
          else if (parent && !element.nextSibling && !element.previousSibling) {
            const { width: widthParent, height: heightParent } =
              getComputedStyles(parent);

            if (
              heightParent < scrollHeight ||
              heightParent < offsetHeight ||
              offsetWidth < scrollWidth ||
              Math.ceil(widthParent) < scrollWidth
            ) {
              const newRows = Math.floor(heightParent / lineHeight);

              textMaxRows = newRows;
              textHeight = `${newRows * lineHeight}px`;
            }
          }
        }

        const returnedStyle = {
          "--text-max-rows": textMaxRows,
          "--text-height": textHeight,
        };

        return returnedStyle;
      }
    }, [maxRows, expanded, truncate, element]);

    // Tooltip
    const hasTooltip =
      element &&
      isOverflowed &&
      truncate &&
      showTooltip &&
      expanded === undefined;

    // Rendering
    const Component: ElementType = elementType;
    const content = (
      <Component
        className={cx(withBaseName(), className, {
          [withBaseName("lineClamp")]: isOverflowed && truncate,
          [withBaseName("overflow")]: !truncate,
        })}
        {...restProps}
        tabIndex={hasTooltip ? 0 : -1}
        ref={setContainerRef}
        style={{ marginTop, marginBottom, ...componentStyle, ...style }}
      >
        {children}
      </Component>
    );

    return hasTooltip ? (
      <Tooltip
        enterNextDelay={TOOLTIP_DELAY}
        placement="top"
        title={
          typeof children === "string" ? children : element?.textContent || ""
        }
        {...tooltipProps}
      >
        {content}
      </Tooltip>
    ) : (
      content
    );
  })
);
