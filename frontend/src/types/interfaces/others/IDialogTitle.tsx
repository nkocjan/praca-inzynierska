export interface DialogTitles {
  title: string;
  saveButtonTitle: string;
  cancelButtonTitle: string;
  formId?: string;
  maxWidth?: "xs" | "sm" | "md";
  // Red confirm button, for actions that delete data.
  destructive?: boolean;
}
