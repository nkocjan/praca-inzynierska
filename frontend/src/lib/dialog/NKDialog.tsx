import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import * as React from "react";
import { useTranslation } from "react-i18next";

interface properties {
  open: boolean;
  title: string;
  saveButtonTitle: string;
  cancelButtonTitle: string;
  onClose: () => void;
  children: React.ReactNode;
  formId?: string;
  maxWidth?: "xs" | "sm" | "md";
  destructive?: boolean;
}

const NKDialog = (props: properties) => {
  const { t } = useTranslation("common");

  return (
    <Dialog
      open={props.open}
      fullWidth
      maxWidth={props.maxWidth ?? "xs"}
      aria-labelledby="nk-dialog-title"
      onClose={(_event, reason) => {
        // A stray click outside must not throw away a half-filled form.
        if (reason !== "backdropClick") {
          props.onClose();
        }
      }}>
      <DialogTitle
        id="nk-dialog-title"
        sx={{ pr: 7, pt: 2.5 }}>
        {props.title}
      </DialogTitle>
      <IconButton
        aria-label={t("dialog.close")}
        onClick={props.onClose}
        sx={{ position: "absolute", right: 12, top: 14, color: "text.secondary" }}>
        <CloseRoundedIcon />
      </IconButton>
      <DialogContent>{props.children}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
        <Button
          color="inherit"
          onClick={props.onClose}>
          {props.cancelButtonTitle}
        </Button>
        {/* The button sits outside the form, so it submits it through the form's id. */}
        <Button
          type="submit"
          form={props.formId}
          variant="contained"
          color={props.destructive ? "error" : "primary"}>
          {props.saveButtonTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NKDialog;
