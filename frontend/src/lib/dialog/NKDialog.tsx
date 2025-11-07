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
  saveButtonTitle: string;
  cancelButtonTitle: string;
  onClose: () => void;
  children: React.ReactNode;
  formId?: string;
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
      }}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>{props.children}</DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{props.cancelButtonTitle}</Button>
        {/*
          --- POPRAWKA TUTAJ ---
          Dodaj atrybut 'form={props.formId}', aby połączyć
          ten przycisk z formularzem o ID przekazanym w propsach.
        */}
        <Button
          type="submit"
          form={props.formId}>
          {props.saveButtonTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NKDialog;
