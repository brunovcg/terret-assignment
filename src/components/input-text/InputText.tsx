import {
  useId,
  useState,
  useEffect,
  type PropsWithChildren,
  type ChangeEvent,
} from "react";
import "./InputText.css";

type Props = PropsWithChildren<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
    label: string;
    debounce?: number;
  }
>;

export function InputText({
  children,
  label,
  debounce = 0,
  onChange,
  value,
  ...rest
}: Props) {
  const id = useId();
  const [internalValue, setInternalValue] = useState(value ?? "");

  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  useEffect(() => {
    if (debounce <= 0) {
      return;
    }
    const handler = setTimeout(() => {
      if (onChange) {
        const syntheticEvent = {
          target: { value: internalValue },
        } as unknown as ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    }, debounce);
    return () => clearTimeout(handler);
  }, [internalValue, debounce, onChange]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setInternalValue(newValue);
    if (debounce <= 0 && onChange) {
      onChange(e);
    }
  }

  return (
    <label htmlFor={id} className="input-text-label">
      {label}
      <input
        id={id}
        {...rest}
        value={internalValue}
        onChange={handleChange}
        className="input-text"
        type="text"
      />
      {children}
    </label>
  );
}
