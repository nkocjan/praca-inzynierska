import * as React from "react";
import { ReactNode, useContext, useState } from "react";
import NKDialog from "./NKDialog.tsx";
import { DialogTitles } from "../../types/interfaces/others/IDialogTitle.tsx";

interface DialogContextType {
  dialogTitles: DialogTitles;
  openDialog: (dialogTitle: DialogTitles, content: ReactNode) => void;
  closeDialog: () => void;
}

const DialogContext = React.createContext<DialogContextType | null>(null);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [dialogTitles, setDialogTitles] = useState<DialogTitles>({
    cancelButtonTitle: "",
    saveButtonTitle: "",
    title: "",
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
      />
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
