import { useState } from "react";
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../api/apiClient.ts";
import type { CategoryUiDTO } from "../../../../api/generated";
import ConfirmDelete from "../../../../lib/dialog/templates/ConfirmDelete";
import { useDialog } from "../../../../lib/dialog/useDialog";
import AddCategoryForm from "../forms/AddCategoryForm";

const CategoryActionMenu = ({ row, onSuccess }: { row: CategoryUiDTO; onSuccess: () => void }) => {
  const { t } = useTranslation("categories");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { openDialog, closeDialog } = useDialog();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const menuId = `category-actions-${row.id}`;
  const name = row.name ?? "";

  const handleClose = () => setAnchorEl(null);

  const handleEdit = () => {
    handleClose();
    const formId = "category-form";
    openDialog(
      {
        title: t("page.editCategoryTitle"),
        saveButtonTitle: t("page.save"),
        cancelButtonTitle: t("page.cancel"),
        formId,
        maxWidth: "sm",
      },
      <AddCategoryForm
        formId={formId}
        isEdit
        id={row.id}
        name={row.name}
        weeklyBudget={row.weeklyBudget?.amount}
        monthlyBudget={row.monthlyBudget?.amount}
        yearlyBudget={row.yearlyBudget?.amount}
        onSuccess={() => {
          closeDialog();
          onSuccess();
        }}
      />,
    );
  };

  // Both pages read the category from the navigation state and open already filtered by it.
  const handleShowExpenses = () => {
    handleClose();
    navigate("/expenses", { state: { prefillCategoryIds: [row.id] } });
  };

  const handleShowBudgets = () => {
    handleClose();
    navigate("/budget", { state: { prefillCategoryIds: [row.id] } });
  };

  const handleDelete = () => {
    handleClose();
    const formId = `delete-category-form-${row.id}`;
    openDialog(
      {
        title: t("delete.title"),
        saveButtonTitle: t("delete.confirm"),
        cancelButtonTitle: t("page.cancel"),
        formId,
        destructive: true,
      },
      <ConfirmDelete
        message={t("delete.text", { name })}
        hint={t("delete.cannotUndo")}
        formId={formId}
        onConfirm={async () => {
          try {
            await apiClient.delete(`/api/bff/categories/${row.id}`);
            enqueueSnackbar(t("snackbar.categoryDeleted"), { variant: "success" });
          } catch (error) {
            console.error("Błąd podczas usuwania kategorii:", error);
            enqueueSnackbar(t("snackbar.categoryDeleteError"), { variant: "error" });
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

  return (
    <>
      <IconButton
        size="small"
        aria-label={t("actions.menuFor", { name })}
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
        <MenuItem onClick={handleShowExpenses}>
          <ListItemIcon>
            <ReceiptLongOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("actions.showExpenses")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShowBudgets}>
          <ListItemIcon>
            <HistoryRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("actions.showBudgets")}</ListItemText>
        </MenuItem>
        <Divider />
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

export default CategoryActionMenu;
