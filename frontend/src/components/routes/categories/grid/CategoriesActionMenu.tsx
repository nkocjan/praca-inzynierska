import React, { useState } from "react";
import { useDialog } from "../../../../lib/dialog/useDialog";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ICategoryBudgetSummary } from "../../../../types/interfaces/ICategory";
import ConfirmDelete from "../../../../lib/dialog/templates/ConfirmDelete";
import AddCategoryForm from "../forms/AddCategoryForm.tsx";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { apiClient } from "../../../../api/apiClient.ts";
import { useNavigate } from "react-router-dom";

interface CategoriesActionMenuProps {
  row: ICategoryBudgetSummary;
  onRefresh: () => void;
}

const CategoriesActionMenu = ({
  row,
  onRefresh,
}: CategoriesActionMenuProps) => {
  const { t } = useTranslation("categories");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { openDialog, closeDialog } = useDialog();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    const formId = "edit-budget-form";

    const onSuccess = () => {
      closeDialog();
      onRefresh();
    };

    openDialog(
      {
        title: t("dialogs.editTitle"),
        saveButtonTitle: t("page.save"),
        cancelButtonTitle: t("page.cancel"),
        formId: formId,
      },
      <AddCategoryForm
        formId={formId}
        isEdit={true}
        id={row.id}
        name={row.name}
        weeklyBudget={row.weeklyBudget?.amount}
        monthlyBudget={row.monthlyBudget?.amount}
        yearlyBudget={row.yearlyBudget?.amount}
        onSuccess={onSuccess}></AddCategoryForm>,
    );
  };

  const handleDelete = () => {
    handleClose();
    const formId = `delete-category-form-${row.id}`;

    openDialog(
      {
        title: t("dialogs.deleteTitle"),
        saveButtonTitle: t("dialogs.deleteSave"),
        cancelButtonTitle: t("page.cancel"),
        formId,
      },
      <ConfirmDelete
        translation={t("delete.categoryGen")}
        formId={formId}
        onConfirm={async () => {
          try {
            await apiClient.delete(`/api/bff/categories/${row.id}`);
            enqueueSnackbar(t("snackbar.categoryDeleted"), {
              variant: "success",
            });
          } catch (error) {
            console.error("Błąd podczas usuwania kategorii:", error);
            enqueueSnackbar(t("snackbar.categoryDeleteError"), {
              variant: "error",
            });
            throw error;
          }
        }}
        onSuccess={() => {
          closeDialog();
          onRefresh();
        }}
      />,
    );
  };

  const handleShowOtherBudgets = () => {
    handleClose();
    navigate("/budget", { state: { prefillCategoryIds: [row.id] } });
  };

  const handleShowExpenses = () => {
    handleClose();
    navigate("/expenses", { state: { prefillCategoryIds: [row.id] } });
  };

  const handleGenerateReport = () => {
    handleClose();
    enqueueSnackbar(t("snackbar.comingSoon"), { variant: "info" });
  };

  // TODO dodać obsługę akcji, dodać wymagania kiedy mają się pojawiać
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}>
        <MenuItem onClick={handleEdit}>{t("actions.edit")}</MenuItem>
        <MenuItem onClick={handleDelete}>{t("actions.delete")}</MenuItem>
        <MenuItem onClick={handleGenerateReport}>
          {t("actions.generateReport")}
        </MenuItem>
        <MenuItem onClick={handleShowExpenses}>
          {t("actions.showExpenses")}
        </MenuItem>
        <MenuItem onClick={handleShowOtherBudgets}>
          {t("actions.showOtherBudgets")}
        </MenuItem>
      </Menu>
    </>
  );
};

export default CategoriesActionMenu;
