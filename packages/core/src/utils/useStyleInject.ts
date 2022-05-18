import { useCurrentDocument } from "../toolkit-provider";
import { useStyleInsertionEffect } from "./useStyleInsertionEffect";
import { injectStyleIntoGivenDocument } from "./styleInjectWithContext";

export const useStyleInject = (css: string) => {
  const documentToApplyStyleTo = useCurrentDocument();
  useStyleInsertionEffect(() => {
    injectStyleIntoGivenDocument(css, documentToApplyStyleTo);
  }, []);
};
