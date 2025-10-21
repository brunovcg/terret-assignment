import { icons } from "./register";
import { CreateComponent } from "../create-component/CreateComponent";
import { colorsVariants, type ColorsVariant } from "../../styles/colorsVariant";

export type IconName = keyof typeof icons;
export type IconWeight = "duotone" | "regular" | "bold" | "thin" | "fill";

export type IconProps = {
  icon: IconName;
  variant?: ColorsVariant;
  notifications?: number;
  weight?: IconWeight;
  mirrored?: boolean;
};

export function Icon({
  icon,
  variant = "primary",
  mirrored,
  weight = "regular",
}: IconProps) {
  const props = {
    weight,
    size: "15px",
    mirrored,
  };

  return (
    <span
      id={`icon-${icon}`}
      style={{ color: colorsVariants[variant] }}
      className="icon-component"
    >
      <CreateComponent component={icons[`${icon}`]} props={props} />
    </span>
  );
}
