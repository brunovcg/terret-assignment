import { icons } from "./register";
import { CreateComponent } from "../create-component/CreateComponent";
import { type ColorsVariant } from "../../styles/colorsVariant";
import { mergeClass } from "../../utils/class-name/className.utils";

export type IconName = keyof typeof icons;
export type IconWeight = "duotone" | "regular" | "bold" | "thin" | "fill";

export type IconProps = {
  icon: IconName;
  variant?: ColorsVariant;
  notifications?: number;
  weight?: IconWeight;
  mirrored?: boolean;
  className?: string;
};

export function Icon({
  icon,
  variant = "primary",
  mirrored,
  weight = "regular",
  className,
}: IconProps) {
  const props = {
    weight,
    size: "15px",
    mirrored,
  };

  return (
    <span
      id={`icon-${icon}`}
      className={mergeClass(
        "icon-component",
        `color-variant-${variant}`,
        className,
      )}
    >
      <CreateComponent component={icons[`${icon}`]} props={props} />
    </span>
  );
}
