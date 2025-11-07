import React, { useState } from "react";
import { useDialog } from "../../../../lib/dialog/NKDialogContext";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ICategoryBudgetSummary } from "../../../../types/interfaces/ICategory";
import ConfirmDelete from "../../../../lib/dialog/templates/ConfirmDelete";
import GenerateReportForSingleCategory from "../forms/GenerateReportForSingleCategoryForm";
import AddCategoryForm from "../forms/AddCategoryForm.tsx";

interface CategoriesActionMenuProps {
  row: ICategoryBudgetSummary;
  onRefresh: () => void;
}

const CategoriesActionMenu = ({
  row,
  onRefresh,
}: CategoriesActionMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { openDialog, closeDialog } = useDialog();

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
        title: "Edytuj budżet kategorii",
        saveButtonTitle: "Zapisz",
        cancelButtonTitle: "Anuluj",
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
        onSuccess={onSuccess}
      ></AddCategoryForm>,
    );
  };

  const handleDelete = () => {
    openDialog(
      {
        title: "Usuń kategorię",
        saveButtonTitle: "Usuń",
        cancelButtonTitle: "Anuluj",
      },
      <ConfirmDelete translation="kategorii" />,
    );
  };

  const handleShowOtherBudgets = () => {
    // TODO handle showBudgets - przeniesienie do grida budżetów z filtrem
  };

  const handleShowExpenses = () => {
    // TODO pokazanie wydatków dla danej kategorii
  };

  const handleGenerateReport = () => {
    openDialog(
      {
        title: "Generuj raport",
        saveButtonTitle: "Generuj",
        cancelButtonTitle: "Anuluj",
      },
      <GenerateReportForSingleCategory />,
    );
  };

  // TODO dodać obsługę akcji, dodać wymagania kiedy mają się pojawiać
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>Edytuj</MenuItem>
        <MenuItem onClick={handleDelete}>Usuń</MenuItem>
        <MenuItem onClick={handleGenerateReport}>Generuj raport</MenuItem>
        <MenuItem onClick={handleShowExpenses}>Pokaż wydatki</MenuItem>
        <MenuItem onClick={handleShowOtherBudgets}>
          Pokaż pozostałe budżety
        </MenuItem>
      </Menu>
    </>
  );
};

export default CategoriesActionMenu;
