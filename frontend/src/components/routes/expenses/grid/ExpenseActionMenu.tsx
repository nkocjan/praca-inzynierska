import { useState } from "react";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

import { apiClient } from "../../../../api/apiClient.ts";
import type { ExpenseUiDTO } from "../../../../api/generated";
import ConfirmDelete from "../../../../lib/dialog/templates/ConfirmDelete.tsx";
import { useDialog } from "../../../../lib/dialog/useDialog";
import AddExpanseForm from "../forms/AddEditExpanseForm.tsx";

const ExpenseActionMenu = ({ row, onSuccess }: { row: ExpenseUiDTO; onSuccess: () => void }) => {
  const { t } = useTranslation("expenses");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { openDialog, closeDialog } = useDialog();
  const { enqueueSnackbar } = useSnackbar();
  const menuId = `expense-actions-${row.id}`;

  const handleClose = () => setAnchorEl(null);

  const handleEdit = () => {
    handleClose();
    openDialog(
      {
        title: t("page.editExpenseTitle"),
        saveButtonTitle: t("page.save"),
        cancelButtonTitle: t("page.cancel"),
        formId: "expense-form",
      },
      <AddExpanseForm
        formId="expense-form"
        isEdit={true}
        id={row.id}
        amount={row.amount}
        planned={row.isPlanned}
        name={row.name}
        description={row.description}
        category={row.category}
        date={dayjs(row.date)}
        onSuccess={() => {
          closeDialog();
          onSuccess();
        }}
      />,
    );
  };

  const handleDelete = () => {
    handleClose();
    const formId = `delete-expense-form-${row.id}`;
    openDialog(
      {
        title: t("delete.singleTitle"),
        saveButtonTitle: t("delete.confirm"),
        cancelButtonTitle: t("page.cancel"),
        formId,
        destructive: true,
      },
      <ConfirmDelete
        message={t("delete.singleText", { name: row.name })}
        hint={t("delete.cannotUndo")}
        formId={formId}
        onConfirm={async () => {
          try {
            await apiClient.delete(`/api/bff/expenses/${row.id}`);
            enqueueSnackbar(t("snackbar.expenseDeleted"), { variant: "success" });
          } catch (error) {
            console.error("Błąd podczas usuwania wydatku:", error);
            enqueueSnackbar(t("snackbar.expenseDeleteError"), { variant: "error" });
            throw error;
          }
        }}
        onSuccess={() => {
          closeDialog();
          onSuccess();
        }}
      />,
    );
  };

  const handleTogglePlanned = async () => {
    handleClose();
    const nextIsPlanned = !row.isPlanned;
    try {
      await apiClient.put(`/api/bff/expenses/${row.id}/planned`, null, {
        params: { isPlanned: nextIsPlanned },
      });
      enqueueSnackbar(nextIsPlanned ? t("snackbar.markedPlanned") : t("snackbar.markedPaid"), {
        variant: "success",
      });
      onSuccess();
    } catch (error) {
      console.error("Błąd podczas zmiany planowania wydatku:", error);
      enqueueSnackbar(t("snackbar.plannedUpdateError"), { variant: "error" });
    }
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label={t("actions.menuFor", { name: row.name })}
        aria-haspopup="true"
        aria-controls={open ? menuId : undefined}
        aria-expanded={open ? "true" : undefined}
        onClick={event => setAnchorEl(event.currentTarget)}>
        <MoreHorizRoundedIcon fontSize="small" />
      </IconButton>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 230, mt: 0.5 } } }}>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("actions.edit")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleTogglePlanned}>
          <ListItemIcon>
            {row.isPlanned ? (
              <CheckCircleOutlineRoundedIcon fontSize="small" />
            ) : (
              <ScheduleRoundedIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>{row.isPlanned ? t("actions.unsetPlanned") : t("actions.setAsPlanned")}</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleDelete}
          sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("actions.delete")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExpenseActionMenu;
