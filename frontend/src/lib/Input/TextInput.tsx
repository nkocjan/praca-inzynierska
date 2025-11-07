import { TextField, FormHelperText, Box, Tooltip } from "@mui/material";

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
    <Box sx={{ position: "relative", width: "100%" }}>
      <Tooltip title={props.tooltip || ""} placement="right">
        <TextField
          required={props.required}
          color="primary"
          variant="filled"
          fullWidth
          // 3. Przekazanie propsów z Formika bezpośrednio do TextField
          name={props.name}
          type={props.type ? props.type : "text"}
          label={props.label}
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
          error={props.error} // Użyj błędu z Formika
          sx={{
            borderRadius: "8px 8px 0 0",
          }}
        />
      </Tooltip>
      {/* 4. Wyświetlanie tekstu błędu (helperText) z Formika */}
      <FormHelperText
        sx={{
          visibility: props.error ? "visible" : "hidden",
          height: "20px",
          margin: 0,
          padding: "4px 0 0 12px",
          color: "error.main",
          position: "absolute",
          bottom: "-20px",
          left: 0,
        }}
      >
        {props.helperText}
      </FormHelperText>
    </Box>
  );
};

export { NKTextInput };
