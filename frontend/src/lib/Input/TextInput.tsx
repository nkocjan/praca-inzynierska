import { TextField, Tooltip } from "@mui/material";

interface Properties {
  label: string;
  required?: boolean;
  type?: string;
  name?: string;
  value?: string;
  tooltip?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: React.ReactNode;
}

const NKTextInput = (props: Properties) => {
  return (
    <Tooltip
      title={props.tooltip || ""}
      placement="right">
      <TextField
        required={props.required}
        fullWidth
        name={props.name}
        type={props.type ? props.type : "text"}
        label={props.label}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        error={props.error}
        helperText={props.helperText || " "}
      />
    </Tooltip>
  );
};

export { NKTextInput };
