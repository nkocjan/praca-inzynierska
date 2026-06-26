import * as React from "react";
import { ReactNode } from "react";
import { DialogTitles } from "../../types/interfaces/others/IDialogTitle.tsx";

export interface DialogContextType {
  dialogTitles: DialogTitles;
  openDialog: (dialogTitle: DialogTitles, content: ReactNode) => void;
  closeDialog: () => void;
}

export const DialogContext = React.createContext<DialogContextType | null>(
  null,
);
