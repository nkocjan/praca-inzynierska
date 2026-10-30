import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Card, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { DataGrid, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../api/apiClient.ts";
import { CategoryUiDTO } from "../../../api/generated";
import { normalizeLanguage } from "../../../i18n/i18n";
import { useDialog } from "../../../lib/dialog/useDialog";
import { useCategoryColors } from "../../../theme/chartColors";
import {
  CATEGORY_PERIODS,
  CategoryFilterState,
  CategoryPeriod,
  EMPTY_FILTERS,
  hasActiveFilters,
  matchesFilters,
} from "./categoryFilters";
import AddCategoryForm from "./forms/AddCategoryForm";
import CategoriesEmptyState from "./grid/CategoriesEmptyState";
import CategoryFiltersBar from "./grid/CategoryFiltersBar";
import useCategoryColumns from "./grid/useCategoryColumns";

const NKCategories = () => {
  const { t, i18n } = useTranslation("categories");
  const language = normalizeLanguage(i18n.language);
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down("sm"));
  const { enqueueSnackbar } = useSnackbar();
  const { openDialog, closeDialog } = useDialog();

  const [categories, setCategories] = useState<CategoryUiDTO[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filters, setFilters] = useState<CategoryFilterState>(EMPTY_FILTERS);
  const [period, setPeriod] = useState<CategoryPeriod>("monthlyBudget");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: "name", sort: "asc" }]);

  // Colours come from the full list, so a filtered-out category does not shift the others.
  const { colorFor } = useCategoryColors(categories, language);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    apiClient
      .get<CategoryUiDTO[]>("/api/bff/categories")
      .then(response => {
        if (ignore) return;
        setCategories(response.data);
        setLoaded(true);
      })
      .catch(error => {
        if (ignore) return;
        console.error("Błąd podczas pobierania kategorii:", error);
        enqueueSnackbar(t("snackbar.categoriesFetchError"), { variant: "error" });
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [refreshTrigger, enqueueSnackbar, t]);

  const refresh = useCallback(() => setRefreshTrigger(value => value + 1), []);

  const rows = useMemo(() => categories.filter(category => matchesFilters(category, filters)), [categories, filters]);

  const changeFilters = (patch: Partial<CategoryFilterState>) => {
    setFilters(previous => ({ ...previous, ...patch }));
    setPaginationModel(previous => ({ ...previous, page: 0 }));
  };

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setPaginationModel(previous => ({ ...previous, page: 0 }));
  }, []);

  const columns = useCategoryColumns({ compact, colorFor, onChanged: refresh });
  // Phones keep the name and the period picked above the list.
  const columnVisibilityModel = compact
    ? Object.fromEntries(CATEGORY_PERIODS.map(value => [value, value === period]))
    : {};

  const openAddCategory = () => {
    const formId = "category-form";
    openDialog(
      {
        title: t("page.addCategoryTitle"),
        saveButtonTitle: t("page.add"),
        cancelButtonTitle: t("page.cancel"),
        formId,
        maxWidth: "sm",
      },
      <AddCategoryForm
        formId={formId}
        onSuccess={() => {
          closeDialog();
          refresh();
        }}
      />,
    );
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}>
        <Box>
          <Typography
            variant="h4"
            component="h2">
            {t("page.heading")}
          </Typography>
          <Typography color="text.secondary">{t("page.subtitle")}</Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddRoundedIcon />}
          onClick={openAddCategory}>
          {t("page.addCategory")}
        </Button>
      </Stack>

      <Card sx={{ overflow: "hidden" }}>
        <CategoryFiltersBar
          filters={filters}
          onChange={changeFilters}
          onReset={resetFilters}
          resultCount={loaded ? rows.length : null}
          period={compact ? period : undefined}
          onPeriodChange={setPeriod}
        />
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          loading={loading}
          rowHeight={64}
          columnHeaderHeight={44}
          columnVisibilityModel={columnVisibilityModel}
          disableRowSelectionOnClick
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          disableColumnMenu
          slots={{ noRowsOverlay: CategoriesEmptyState }}
          slotProps={{
            noRowsOverlay: { filtered: hasActiveFilters(filters), onReset: resetFilters },
            loadingOverlay: { variant: "skeleton", noRowsVariant: "skeleton" },
          }}
          sx={{
            border: 0,
            borderRadius: 0,
            borderTop: 1,
            borderColor: "divider",
            "--DataGrid-overlayHeight": "320px",
            // Without a checkbox column the first column lines up with the filters above.
            "& .MuiDataGrid-columnHeader[aria-colindex='1'], & .MuiDataGrid-cell[aria-colindex='1']": {
              pl: { xs: 2, sm: 2.5 },
            },
          }}
        />
      </Card>
    </Box>
  );
};

export default NKCategories;
