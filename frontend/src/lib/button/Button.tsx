import { JSX } from "react";
import "./Button.css";
import { Button } from "@mui/material";

interface props {
  title: string;
  required?: boolean;
}

function NKButton(properties: props): JSX.Element {
  return <Button variant="contained">{properties.title}</Button>;
}

export { NKButton };
