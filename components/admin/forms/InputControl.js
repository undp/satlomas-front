import {
  FormControl,
  InputLabel,
  Input
} from "@material-ui/core"

const InputControl = ({ id, label, onChange, value, disabled }) => (
  <FormControl margin="normal" required fullWidth>
    <InputLabel htmlFor={id}>
      {label}
    </InputLabel>
    <Input
      id={id}
      name={id}
      autoFocus
      onChange={onChange}
      value={value}
      disabled={disabled}
    />
  </FormControl>
)

export default InputControl;