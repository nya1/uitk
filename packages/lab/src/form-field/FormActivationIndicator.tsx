import { SVGAttributes } from "react";
import { FormFieldProps } from "./FormField";

import style from "./FormActivationIndicator.css";
import { useStyleInject } from "@jpmorganchase/uitk-core";

const ErrorIndicatorIcon = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 16 16"
      focusable={false}
      data-testid="ErrorIndicatorIcon"
      {...props}
    >
      <circle cx={8} cy={8} r={8} />
    </svg>
  );
};

const WarningIndicatorIcon = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 16 16"
      focusable={false}
      data-testid="WarningIndicatorIcon"
      {...props}
    >
      <polygon points="0, 16 16, 16 16, 0" />
    </svg>
  );
};

const ActivationIndicatorIcon = ({
  validationState,
  ...restSvgProps
}: Pick<FormFieldProps, "validationState"> & SVGAttributes<SVGSVGElement>) => {
  if (validationState === "error") {
    return <ErrorIndicatorIcon {...restSvgProps} />;
  } else if (validationState === "warning") {
    return <WarningIndicatorIcon {...restSvgProps} />;
  } else {
    return null;
  }
};

// Removed `enabled` prop, it's better to let parent to control render
export interface FormActivationIndicatorProps
  extends Pick<FormFieldProps, "validationState"> {
  hasIcon?: boolean;
}

export const FormActivationIndicator: React.FC<
  FormActivationIndicatorProps
> = ({ hasIcon, validationState }: FormActivationIndicatorProps) => {
  const rootClass = "uitkFormActivationIndicator";

  useStyleInject(style);

  return (
    <>
      <div className={rootClass}>
        {hasIcon && validationState && (
          <ActivationIndicatorIcon
            className={`${rootClass}-icon`}
            validationState={validationState}
          />
        )}
      </div>
    </>
  );
};
