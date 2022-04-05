import { useEffect, useState } from "react";

export enum State {
  UNMOUNTED = "unmounted",
  UNMOUNTING = "unmounting",
  MOUNTING = "mounting",
  MOUNTED = "mounted",
}

export const useDelayedUnmounting = (
  time = 1000
): [State, () => void, () => void] => {
  const { UNMOUNTED, UNMOUNTING, MOUNTING, MOUNTED } = State;

  const [state, setState] = useState<State>(UNMOUNTED);
  const show = () => {
    if (state === UNMOUNTING) {
      return;
    }
    setState(MOUNTING);
  };
  const hide = () => {
    if (state === MOUNTING) {
      return;
    }
    setState(UNMOUNTING);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (state === UNMOUNTING) {
      timeoutId = setTimeout(() => {
        setState(UNMOUNTED);
      }, time);
    } else if (state === MOUNTING) {
      timeoutId = setTimeout(() => {
        setState(MOUNTED);
      }, time);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [state, time]);

  return [state, show, hide];
};
