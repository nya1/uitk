import {
  cloneElement,
  forwardRef,
  ForwardedRef,
  ReactElement,
  useCallback,
  useRef,
} from "react";

import { List, ListProps } from "../list";
import { useForkRef, useIdMemo as useId } from "../utils";
import { Dropdown, DropdownProps } from "./Dropdown";
import { DropdownButton } from "./DropdownButton";
import { useDropdownList } from "./useDropdownList";
import {
  CollectionItem,
  CollectionProvider,
  itemToString as defaultItemToString,
  useCollectionItems,
  SelectionStrategy,
  SelectionProps,
  SingleSelectionStrategy,
} from "../common-hooks";

export interface DropdownListProps<
  Item = "string",
  Selection extends SelectionStrategy = "default"
> extends DropdownProps,
    Pick<
      ListProps<Item, Selection>,
      "ListItem" | "itemToString" | "source" | "width"
    >,
    SelectionProps<Item, Selection> {
  ListProps?: Omit<
    ListProps<Item, Selection>,
    "ListItem" | "itemToString" | "source"
  >;
}

export const DropdownList = forwardRef(function DropdownList<
  Item = "string",
  Selection extends SelectionStrategy = "default"
>(
  {
    "aria-label": ariaLabel,
    children,
    defaultIsOpen,
    defaultSelected,
    id: idProp,
    isOpen: isOpenProp,
    itemToString = defaultItemToString,
    onOpenChange,
    onSelectionChange,
    selected: selectedProp,
    selectionStrategy,
    source,
    triggerComponent,
    ListItem,
    ListProps,
    width = 180,
    ...props
  }: DropdownListProps<Item, Selection>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  const id = useId(idProp);
  const rootRef = useRef<HTMLDivElement>(null);
  const forkedRef = useForkRef<HTMLDivElement>(rootRef, forwardedRef);

  const collectionHook = useCollectionItems<Item>({
    id,
    source,
    children,
    options: {
      itemToString,
    },
  });

  const {
    highlightedIndex: highlightedIdx,
    triggerLabel,
    listHandlers,
    listControlProps,
    selected,
    ...dropdownListHook
  } = useDropdownList<Item, Selection>({
    collectionHook,
    defaultIsOpen,
    defaultSelected: collectionHook.itemToCollectionItem<
      Selection,
      typeof defaultSelected
    >(defaultSelected),
    isOpen: isOpenProp,
    itemToString,
    label: "DropdownList",
    onOpenChange,
    onSelectionChange,
    selected: collectionHook.itemToCollectionItem<
      Selection,
      typeof selectedProp
    >(selectedProp),
    selectionStrategy,
  });

  const collectionItemsToItem = useCallback(
    (
      sel?: CollectionItem<Item> | null | CollectionItem<Item>[]
    ):
      | undefined
      | (Selection extends SingleSelectionStrategy ? Item | null : Item[]) => {
      type returnType = Selection extends SingleSelectionStrategy
        ? Item | null
        : Item[];
      if (Array.isArray(sel)) {
        return sel.map((i) => i.value) as returnType;
      } else if (sel) {
        return sel.value as returnType;
      }
    },
    []
  );

  const getTriggerComponent = () => {
    const ariaProps = {
      "aria-activedescendant": dropdownListHook.isOpen
        ? listControlProps?.["aria-activedescendant"]
        : undefined,
      "aria-label": ariaLabel,
    };
    if (triggerComponent) {
      return cloneElement(triggerComponent, {
        ...listControlProps,
        ...ariaProps,
      });
    } else {
      console.log(`render DropdownButtonNext`, { triggerLabel });
      return (
        <DropdownButton
          label={triggerLabel}
          {...listControlProps}
          {...ariaProps}
        />
      );
    }
  };

  return (
    <CollectionProvider<Item> collectionHook={collectionHook}>
      <Dropdown
        {...props}
        id={id}
        isOpen={dropdownListHook.isOpen}
        onOpenChange={dropdownListHook.onOpenChange}
        ref={forkedRef}
        width={width}
      >
        {getTriggerComponent()}
        <List<Item, Selection>
          ListItem={ListItem}
          itemToString={itemToString}
          {...ListProps}
          highlightedIndex={highlightedIdx}
          listHandlers={listHandlers}
          onSelectionChange={onSelectionChange}
          selected={collectionItemsToItem(selected)}
          selectionStrategy={selectionStrategy}
          data-testid="dropdown-list"
        />
      </Dropdown>
    </CollectionProvider>
  );
}) as <Item, Selection extends SelectionStrategy = "default">(
  props: DropdownListProps<Item, Selection> & {
    ref?: ForwardedRef<HTMLDivElement>;
  }
) => ReactElement<DropdownListProps<Item, Selection>>;
