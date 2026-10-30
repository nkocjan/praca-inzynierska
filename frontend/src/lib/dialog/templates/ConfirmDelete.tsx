import { Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface properties {
  // Either a ready message, or the noun for the generic "Do you confirm deleting ...?".
  message?: string;
  translation?: string;
  hint?: string;
  formId?: string;
  onConfirm?: () => void | Promise<void>;
  onSuccess?: () => void;
}

const ConfirmDelete = (props: properties) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t } = useTranslation("common");

  const content = (
    <>
      <Typography>{props.message ?? t("dialog.confirmDelete", { item: props.translation })}</Typography>
      {props.hint && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}>
          {props.hint}
        </Typography>
      )}
    </>
  );

  if (!props.formId) {
    return content;
  }

  return (
    <form
      id={props.formId}
      onSubmit={async e => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
          await props.onConfirm?.();
          props.onSuccess?.();
        } finally {
          setIsSubmitting(false);
        }
      }}>
      {content}
    </form>
  );
};

export default ConfirmDelete;
