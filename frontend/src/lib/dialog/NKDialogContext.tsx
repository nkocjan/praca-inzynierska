import { ReactNode, useState } from "react";
import NKDialog from "./NKDialog.tsx";
import { DialogTitles } from "../../types/interfaces/others/IDialogTitle.tsx";
import { DialogContext } from "./dialogContext";

export const DialogProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [dialogTitles, setDialogTitles] = useState<DialogTitles>({
    cancelButtonTitle: "",
    saveButtonTitle: "",
    title: "",
    formId: undefined,
  });
  const [content, setContent] = useState<ReactNode>(null);

  const openDialog = (dialogTitle: DialogTitles, dialogContent: ReactNode) => {
    setContent(dialogContent);
    setDialogTitles(dialogTitle);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setTimeout(() => {
      setContent(null);
    }, 400);
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog, dialogTitles }}>
      {children}
      <NKDialog
        saveButtonTitle={dialogTitles.saveButtonTitle}
        children={content}
        cancelButtonTitle={dialogTitles.cancelButtonTitle}
        title={dialogTitles.title}
        open={open}
        onClose={closeDialog}
        formId={dialogTitles.formId}
      />
    </DialogContext.Provider>
  );
};
