import { JSX } from "react";
import "./Button.css";
import { Button } from "@mui/material";

interface props {
  title: string;
  type?: "button" | "submit" | "reset" | undefined;
  required?: boolean;
  disabled?: boolean;
  formId?: string; // Ten props będzie teraz używany
  onClick?: () => void;
}

function NKButton(properties: props): JSX.Element {
  return (
    <Button
      variant="contained"
      onClick={properties.onClick}
      disabled={properties.disabled}
      type={properties.type ? properties.type : "button"}
      form={properties.formId}
    >
      {properties.title}
    </Button>
  );
}

export { NKButton };
