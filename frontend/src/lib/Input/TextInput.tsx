import { TextField, FormHelperText, Box, Tooltip } from "@mui/material";
import { useState } from "react";

interface Properties {
  label: string;
  required?: boolean;
  type?: string;
  errorTitle?: string;
  tooltip?: string;
}

const NKTextInput = (props: Properties) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const isRequired = props.required === undefined ? true : props.required;

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Tooltip title={props.tooltip || ""} placement="right">
        <TextField
          required={isRequired}
          error={isRequired && error}
          color="primary"
          type={props.type ? props.type : "text"}
          label={props.label}
          variant="filled"
          fullWidth
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (isRequired) setError(e.target.value.trim() === "");
          }}
          sx={{
            borderRadius: "8px 8px 0 0",
          }}
        />
      </Tooltip>
      {/* Reserve space for the error message */}
      <FormHelperText
        sx={{
          visibility: isRequired && error ? "visible" : "hidden",
          height: "20px",
          margin: 0,
          padding: "4px 0 0 12px",
          color: "error.main",
          position: "absolute",
          bottom: "-20px",
          left: 0,
        }}
      >
        {isRequired && error ? "To pole jest wymagane" : ""}
      </FormHelperText>
    </Box>
  );
};

export { NKTextInput };
