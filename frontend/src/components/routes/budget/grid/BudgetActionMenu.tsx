import { useState } from "react";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../api/apiClient.ts";
import type { BudgetUiDTO } from "../../../../api/generated";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { budgetTiming, formatBudgetPeriod } from "../../../../lib/budgetPeriod";
import ConfirmDelete from "../../../../lib/dialog/templates/ConfirmDelete.tsx";
import { useDialog } from "../../../../lib/dialog/useDialog";
import EditBudgetForm from "../forms/EditBudgetForm";

const BudgetActionMenu = ({ row, color, onSuccess }: { row: BudgetUiDTO; color: string; onSuccess: () => void }) => {
  const { t, i18n } = useTranslation("budgets");
  const language = normalizeLanguage(i18n.language);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { openDialog, closeDialog } = useDialog();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const menuId = `budget-actions-${row.id}`;
  const period = formatBudgetPeriod(row.period, row.periodStart, row.periodEnd, language);
  const name = row.category?.name ?? "";

  const handleClose = () => setAnchorEl(null);

  const handleEdit = () => {
    handleClose();
    const formId = "budget-edit-form";
    openDialog(
      {
        title: t("page.editBudgetTitle"),
        saveButtonTitle: t("page.save"),
        cancelButtonTitle: t("page.cancel"),
        formId,
      },
      <EditBudgetForm
        formId={formId}
        budget={row}
        color={color}
        onSuccess={() => {
          closeDialog();
          onSuccess();
        }}
      />,
    );
  };

  // The expenses page opens with this category and period already filtered.
  const handleShowExpenses = () => {
    handleClose();
    navigate("/expenses", {
      state: {
        prefillCategoryIds: row.category?.id ? [row.category.id] : [],
        prefillPeriod: { from: row.periodStart, to: row.periodEnd },
      },
    });
  };

  const handleDelete = () => {
    handleClose();
    const formId = `delete-budget-form-${row.id}`;
    openDialog(
      {
        title: t("delete.title"),
        saveButtonTitle: t("delete.confirm"),
        cancelButtonTitle: t("page.cancel"),
        formId,
        destructive: true,
      },
      <ConfirmDelete
        message={t("delete.text", { name, period })}
        // A running period gets its budget back from the category's limit the next time it is needed.
        hint={budgetTiming(row.periodStart, row.periodEnd) === "current" ? t("delete.hintCurrent") : t("delete.hintOther")}
        formId={formId}
        onConfirm={async () => {
          try {
            await apiClient.delete(`/api/bff/budgets/${row.id}`);
            enqueueSnackbar(t("snackbar.budgetDeleted"), { variant: "success" });
          } catch (error) {
            console.error("Błąd podczas usuwania budżetu:", error);
            enqueueSnackbar(t("snackbar.budgetDeleteError"), { variant: "error" });
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
        aria-label={t("actions.menuFor", { name, period })}
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
          <ListItemText>{t("actions.editAmount")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShowExpenses}>
          <ListItemIcon>
            <ReceiptLongOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("actions.showExpenses")}</ListItemText>
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

export default BudgetActionMenu;
