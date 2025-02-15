import * as React from "react";
import { ReactNode, useContext, useState } from "react";
import NKDialog from "./NKDialog.tsx";

interface DialogContextType {
  openDialog: (title: string, content: ReactNode) => void;
  closeDialog: () => void;
}

const DialogContext = React.createContext<DialogContextType | null>(null);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<ReactNode>(null);

  const openDialog = (dialogTitle: string, dialogContent: ReactNode) => {
    setContent(dialogContent);
    setTitle(dialogTitle);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setContent(null);
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <NKDialog
        children={content}
        title={title}
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
