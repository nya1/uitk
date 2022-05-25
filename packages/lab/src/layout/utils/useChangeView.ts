import { Breakpoints } from "@jpmorganchase/uitk-core";
import {
  useCurrentBreakpoint,
  useOrderedBreakpoints,
} from "@jpmorganchase/uitk-core";

export const useChangeView = (stackedAtBreakpoint: keyof Breakpoints) => {
  const orderedBreakpoints = useOrderedBreakpoints();

  const index = orderedBreakpoints.indexOf(stackedAtBreakpoint);
  const allPreviousBreakpoints = orderedBreakpoints.slice(0, index + 1);

  const currentBreakpoint = useCurrentBreakpoint();

  const view = allPreviousBreakpoints.includes(currentBreakpoint);

  return view;
};
