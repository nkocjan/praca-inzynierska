/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useDialog } from "../../../../lib/dialog/NKDialogContext";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ICategoryBudgetSummary } from "../../../../types/interfaces/ICategory";
import ConfirmDelete from "../../../../lib/dialog/templates/ConfirmDelete";
import GenerateReportForSingleCategory from "../forms/GenerateReportForSingleCategoryForm";

const CategoriesActionMenu = ({ row }: { row: ICategoryBudgetSummary }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { openDialog } = useDialog();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    // TODO handle edit
  };

  const handleDelete = () => {
    openDialog(
      {
        title: "Usuń kategorię",
        saveButtonTitle: "Usuń",
        cancelButtonTitle: "Anuluj",
      },
      <ConfirmDelete translation="kategorii" />
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
      <GenerateReportForSingleCategory />
    );
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
