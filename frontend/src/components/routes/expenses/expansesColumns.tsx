import { GridColDef } from "@mui/x-data-grid";
import { Chip, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { ExpanseStatusEnum } from "../../../types/enums/ExpanseStatusEnum.tsx";
import { useDialog } from "../../../lib/dialog/NKDialogContext.tsx";
import AddExpanseForm from "./forms/AddEditExpanseForm.tsx";
import { IExpanse } from "../../../types/interfaces/IExpanse.tsx";
import * as React from "react";
import dayjs from "dayjs";
import ApproveStatusChange from "./forms/ApproveStatusChange.tsx";
import ConfirmDelete from "./forms/ConfirmDelete.tsx";

const getStatusLabel = (status: ExpanseStatusEnum) => {
  switch (status) {
    case ExpanseStatusEnum.PLANNED:
      return { label: "Zaplanowany", color: "warning" };
    case ExpanseStatusEnum.APPROVED:
      return { label: "Zatwierdzony", color: "success" };
    case ExpanseStatusEnum.NORMAL:
      return { label: "Dynamiczny", color: "info" };
    default:
      return { label: "Nieznany", color: "default" };
  }
};

const expansesColumns: GridColDef[] = [
  { field: "name", headerName: "Nazwa", flex: 3 },
  {
    field: "category",
    renderCell: (params) => `${params.value.value}`,
    headerName: "Kategoria",
    flex: 2,
  },
  {
    field: "amount",
    headerName: "Kwota",
    flex: 1,
    renderCell: (params) => `${params.value} zł`,
  },
  { field: "date", headerName: "Data", flex: 1.5 },
  {
    field: "planned",
    headerName: "Status",
    flex: 1.2,
    renderCell: (params) => {
      const { label, color } = getStatusLabel(
        params.value as ExpanseStatusEnum,
      );
      return <Chip label={label} color={color as never} variant="outlined" />;
    },
  },
  {
    field: "actions",
    headerName: "Akcje",
    flex: 0.3,
    sortable: false,
    filterable: false,
    align: "center",
    renderCell: (params) => <ActionMenu row={params.row} />,
  },
];

const ActionMenu = ({ row }: { row: IExpanse }) => {
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
    openDialog(
      {
        title: "Edytuj wydatek",
        saveButtonTitle: "Zatwierdź",
        cancelButtonTitle: "Anuluj",
      },
      <AddExpanseForm
        isEdit={true}
        amount={row.amount}
        planned={row.planned}
        name={row.name}
        category={row.category}
        date={dayjs(row.date)}
      ></AddExpanseForm>,
    );
  };

  const handleDelete = () => {
    openDialog(
      {
        title: "Czy na pewno chcesz usunąć wydatek?",
        saveButtonTitle: "Usuń",
        cancelButtonTitle: "Anuluj",
      },
      <ConfirmDelete />,
    );
  };

  const handleApprove = () => {
    openDialog(
      {
        title: "Zatwierdź wydatek",
        saveButtonTitle: "Zatwierdź",
        cancelButtonTitle: "Anuluj",
      },
      <ApproveStatusChange newOperation={row.planned} />,
    );
  };

  const handleWithdrawApprove = () => {
    openDialog(
      {
        title: "Wycofaj zatwierdzanie wydatku",
        saveButtonTitle: "Potwierdź wycofanie",
        cancelButtonTitle: "Anuluj",
      },
      <ApproveStatusChange newOperation={row.planned} />,
    );
  };

  const handleSetAsPlanned = () => {
    openDialog(
      {
        title: "Ustaw jako zaplanowany",
        saveButtonTitle: "Zatwierdź",
        cancelButtonTitle: "Anuluj",
      },
      <ApproveStatusChange newOperation={row.planned} />,
    );
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>Edytuj</MenuItem>

        {row.planned === ExpanseStatusEnum.PLANNED && (
          <MenuItem onClick={handleApprove}>Zatwierdź</MenuItem>
        )}

        {row.planned === ExpanseStatusEnum.APPROVED && (
          <MenuItem onClick={handleWithdrawApprove}>
            Wycofaj zatwierdzanie
          </MenuItem>
        )}

        {row.planned === ExpanseStatusEnum.NORMAL && (
          <MenuItem onClick={handleSetAsPlanned}>
            Ustaw jako zaplanowany
          </MenuItem>
        )}

        <MenuItem onClick={handleDelete} style={{ color: "red" }}>
          Usuń
        </MenuItem>
      </Menu>
    </>
  );
};

export default { columns: expansesColumns };
