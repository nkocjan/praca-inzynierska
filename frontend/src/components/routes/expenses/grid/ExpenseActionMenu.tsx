import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { apiClient } from "../../../../api/apiClient.ts";
import ConfirmDelete from "../../../../lib/dialog/templates/ConfirmDelete.tsx";
import { useDialog } from "../../../../lib/dialog/useDialog";
import type { ExpenseUiDTO } from "../../../../api/generated";
import AddExpanseForm from "../forms/AddEditExpanseForm.tsx";

const ExpenseActionMenu = ({
  row,
  onSuccess,
}: {
  row: ExpenseUiDTO;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation("expenses");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { openDialog } = useDialog();
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    openDialog(
      {
        title: t("page.editExpenseTitle"),
        saveButtonTitle: t("page.confirm"),
        cancelButtonTitle: t("page.cancel"),
        formId: "expense-form",
      },
      <AddExpanseForm
        isEdit={true}
        id={row.id}
        amount={row.amount}
        planned={row.isPlanned}
        name={row.name}
        description={row.description}
        category={row.category}
        date={dayjs(row.date)}
        onSuccess={onSuccess}
      />,
    );
  };

  const handleDelete = () => {
    handleClose();
    const formId = `delete-expense-form-${row.id}`;
    openDialog(
      {
        title: t("delete.singleTitle"),
        saveButtonTitle: t("delete.saveSingle"),
        cancelButtonTitle: t("page.cancel"),
        formId,
      },
      <ConfirmDelete
        translation={t("delete.expenseAcc")}
        formId={formId}
        onConfirm={async () => {
          try {
            await apiClient.delete(`/api/bff/expenses/${row.id}`);
            enqueueSnackbar(t("snackbar.expenseDeleted"), {
              variant: "success",
            });
          } catch (error) {
            console.error("Błąd podczas usuwania wydatku:", error);
            enqueueSnackbar(t("snackbar.expenseDeleteError"), {
              variant: "error",
            });
            throw error;
          }
        }}
        onSuccess={onSuccess}
      />,
    );
  };

  const handleTogglePlanned = async () => {
    handleClose();
    try {
      const nextIsPlanned = !row.isPlanned;
      await apiClient.put(`/api/bff/expenses/${row.id}/planned`, null, {
        params: { isPlanned: nextIsPlanned },
      });
      enqueueSnackbar(t("snackbar.plannedUpdated"), { variant: "success" });
      onSuccess();
    } catch (error) {
      console.error("Błąd podczas zmiany planowania wydatku:", error);
      enqueueSnackbar(t("snackbar.plannedUpdateError"), { variant: "error" });
    }
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleEdit();
          }}>
          {t("actions.edit")}
        </MenuItem>

        <MenuItem onClick={handleTogglePlanned}>
          {row.isPlanned
            ? t("actions.unsetPlanned")
            : t("actions.setAsPlanned")}
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleDelete();
          }}
          style={{ color: "red" }}>
          {t("actions.delete")}
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExpenseActionMenu;
