import React, { DependencyList, EffectCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
const useInsertionEffectReact = (React as any)["useInsertionEffect"] as (
  effect: EffectCallback,
  deps?: DependencyList
) => void;

export const useStyleInsertionEffect =
  useInsertionEffectReact || React.useLayoutEffect;
