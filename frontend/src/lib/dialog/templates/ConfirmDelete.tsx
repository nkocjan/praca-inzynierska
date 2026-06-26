import { Box } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface properties {
  translation: string;
  formId?: string;
  onConfirm?: () => void | Promise<void>;
  onSuccess?: () => void;
}

const ConfirmDelete = (props: properties) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t } = useTranslation("common");

  const content = (
    <Box>{t("dialog.confirmDelete", { item: props.translation })}</Box>
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
