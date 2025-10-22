import { Typography } from "../typography/Typography";
import "./Checkbox.css";

interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export function Checkbox({ label, ...rest }: Props) {
  return (
    <label className="checkbox-component">
      <Typography as="span" size="small" bold>
        {label}
      </Typography>
      <input type="checkbox" {...rest} />
    </label>
  );
}
