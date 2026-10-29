import { GridColDef } from "@mui/x-data-grid";
import { formatPolishDate } from "../../../../lib/dateUtils.ts";
import i18n, { normalizeLanguage } from "../../../../i18n/i18n.ts";
import { formatCurrencyPLN } from "../../../../i18n/locale.ts";
import ExpenseActionMenu from "./ExpenseActionMenu.tsx";

// --- DEFINICJA KOLUMN STAJE SIĘ FUNKCJĄ ---
const getExpensesColumns = (onSuccess: () => void): GridColDef[] => [
  { field: "name", headerName: i18n.t("expenses:columns.name"), flex: 3 },
  {
    field: "category",
    headerName: i18n.t("expenses:columns.category"),
    renderCell: params => `${params.value?.name}`,
    flex: 2,
  },
  {
    field: "amount",
    headerName: i18n.t("expenses:columns.amount"),
    flex: 1,
    renderCell: params =>
      formatCurrencyPLN(Number(params.value), normalizeLanguage(i18n.language)),
  },
  {
    field: "date",
    headerName: i18n.t("expenses:columns.date"),
    flex: 1.5,
    renderCell: params => formatPolishDate(params.value),
  },
  // {
  //   field: "planned",
  //   headerName: "Status",
  //   flex: 1.2,
  //   renderCell: (params) => {
  //     const { label, color } = getStatusLabel(
  //       params.value as ExpanseStatusEnum,
  //     );
  //     return <Chip label={label} color={color as never} variant="outlined" />;
  //   },
  // },
  {
    field: "actions",
    headerName: i18n.t("expenses:columns.actions"),
    flex: 0.3,
    sortable: false,
    filterable: false,
    align: "center",
    // --- RENDERCELL PRZEKAZUJE onSuccess DO ActionMenu ---
    renderCell: params => (
      <ExpenseActionMenu
        row={params.row}
        onSuccess={onSuccess}
      />
    ),
  },
];

// --- ZMIANA EKSPORTU ---
export default getExpensesColumns;
