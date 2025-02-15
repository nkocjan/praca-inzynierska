import { JSX } from "react";
import "./Button.css";
import { Button } from "@mui/material";

interface props {
  title: string;
  required?: boolean;
  onClick?: () => void;
}

function NKButton(properties: props): JSX.Element {
  return (
    <Button variant="contained" onClick={properties.onClick}>
      {properties.title}
    </Button>
  );
}

export { NKButton };
