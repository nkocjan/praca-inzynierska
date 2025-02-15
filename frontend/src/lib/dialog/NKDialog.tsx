import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import * as React from "react";

interface properties {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const NKDialog = (props: properties) => {
  return (
    <Dialog
      disableEscapeKeyDown
      open={props.open}
      onClose={(_event, reason) => {
        if (reason !== "backdropClick") {
          props.onClose();
        }
      }}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>{props.children}</DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button type="submit">Subscribe</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NKDialog;
