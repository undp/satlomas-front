import { FormControl, InputLabel, Input } from "@material-ui/core";

const InputControl = ({
  id,
  type,
  label,
  onChange,
  value,
  disabled,
  placeholder,
}) => (
  <FormControl margin="normal" required fullWidth>
    <InputLabel htmlFor={id}>{label}</InputLabel>
    <Input
      id={id}
      type={type}
      name={id}
      autoFocus
      onChange={onChange}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
    />
  </FormControl>
);

export default InputControl;
