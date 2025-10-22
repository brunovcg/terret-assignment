import { useId, type PropsWithChildren } from "react";
import { Typography } from "../typography/Typography";
import "./Select.css";

type Props = PropsWithChildren<
  React.InputHTMLAttributes<HTMLSelectElement> & {
    label: string;
  }
>;

function SelectOption({
  children,
  ...rest
}: PropsWithChildren<React.InputHTMLAttributes<HTMLOptionElement>>) {
  return <option {...rest}>{children}</option>;
}

export function Select({ label, ...rest }: Props) {
  const id = useId();
  return (
    <label htmlFor={id} className="select-label">
      <Typography as="span" size="regular" bold variant="secondary">
        {label}
      </Typography>

      <select id={id} {...rest} className="select"></select>
    </label>
  );
}

Select.Option = SelectOption;
