import type { ComponentType, ReactNode, JSX } from "react";

export type AttributesOptionalChildren = Omit<
  JSX.IntrinsicAttributes,
  "children"
> & {
  children?: ReactNode;
};

export type Props<ComponentProps> = {
  component: ComponentType<ComponentProps>;
  props: ComponentProps;
  children?: ReactNode;
};

export function CreateComponent<
  ComponentProps extends AttributesOptionalChildren,
>({ component: Component, props, children }: Props<ComponentProps>) {
  return (
    <Component className="create-component" {...props}>
      {children}
    </Component>
  );
}
