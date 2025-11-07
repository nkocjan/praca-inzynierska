import { GridColDef } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { ExpanseStatusEnum } from "../../../../types/enums/ExpanseStatusEnum.tsx";
import { useDialog } from "../../../../lib/dialog/NKDialogContext.tsx";
import AddExpanseForm from "../forms/AddEditExpanseForm.tsx";
import { Chip, IconButton, Menu, MenuItem } from "@mui/material";
import { IExpanse } from "../../../../types/interfaces/IExpanse.tsx";
import * as React from "react";
import dayjs from "dayjs";
import ApproveStatusChange from "../forms/ApproveStatusChange.tsx";
import ConfirmDelete from "../../../../lib/dialog/templates/ConfirmDelete.tsx";
import { formatPolishDate } from "../../../../lib/dateUtils.ts";

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

const ActionMenu = ({
  row,
  onSuccess,
}: {
  row: IExpanse;
  onSuccess: () => void;
}) => {
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
    handleClose();
    openDialog(
      {
        title: "Edytuj wydatek",
        saveButtonTitle: "Zatwierdź",
        cancelButtonTitle: "Anuluj",
        formId: "expense-form",
      },
      <AddExpanseForm
        isEdit={true}
        id={row.id}
        amount={row.amount}
        planned={row.planned}
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
    openDialog(
      {
        title: "Czy na pewno chcesz usunąć wydatek?",
        saveButtonTitle: "Usuń",
        cancelButtonTitle: "Anuluj",
      },
      <ConfirmDelete translation="wydatku" />,
    );
  };

  const handleApprove = () => {
    handleClose();
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
    handleClose();
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
    handleClose();
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
        {/* Zamykanie menu po kliknięciu przez dodanie handleClose */}
        <MenuItem
          onClick={() => {
            handleEdit();
          }}
        >
          Edytuj
        </MenuItem>

        {row.planned === ExpanseStatusEnum.PLANNED && (
          <MenuItem
            onClick={() => {
              handleApprove();
            }}
          >
            Zatwierdź
          </MenuItem>
        )}

        {row.planned === ExpanseStatusEnum.APPROVED && (
          <MenuItem
            onClick={() => {
              handleWithdrawApprove();
            }}
          >
            Wycofaj zatwierdzanie
          </MenuItem>
        )}

        {row.planned === ExpanseStatusEnum.NORMAL && (
          <MenuItem
            onClick={() => {
              handleSetAsPlanned();
            }}
          >
            Ustaw jako zaplanowany
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            handleDelete();
          }}
          style={{ color: "red" }}
        >
          Usuń
        </MenuItem>
      </Menu>
    </>
  );
};

// --- DEFINICJA KOLUMN STAJE SIĘ FUNKCJĄ ---
const getExpensesColumns = (onSuccess: () => void): GridColDef[] => [
  { field: "name", headerName: "Nazwa", flex: 3 },
  {
    field: "category",
    headerName: "Kategoria",
    renderCell: (params) => `${params.value?.name}`,
    flex: 2,
  },
  {
    field: "amount",
    headerName: "Kwota",
    flex: 1,
    renderCell: (params) => `${params.value} zł`,
  },
  {
    field: "date",
    headerName: "Data",
    flex: 1.5,
    renderCell: (params) => formatPolishDate(params.value),
  },
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
    // --- RENDERCELL PRZEKAZUJE onSuccess DO ActionMenu ---
    renderCell: (params) => (
      <ActionMenu row={params.row} onSuccess={onSuccess} />
    ),
  },
];

// --- ZMIANA EKSPORTU ---
export default getExpensesColumns;
