import { Box, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { apiClient } from "../../../../api/apiClient.ts";
import type { CategoryCreateRequestUiDTO, UpdateCategoryUiDTO } from "../../../../api/generated";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { getCurrencySymbol } from "../../../../i18n/locale";

interface AddCategoryFormProps {
  isEdit?: boolean;
  id?: string;
  name?: string;
  weeklyBudget?: number | null;
  monthlyBudget?: number | null;
  yearlyBudget?: number | null;
  onSuccess: () => void;
  formId?: string;
}

type LimitField = "weekBudget" | "monthBudget" | "yearBudget";

const LIMIT_FIELDS: LimitField[] = ["weekBudget", "monthBudget", "yearBudget"];

const AddCategoryForm = (props: AddCategoryFormProps) => {
  const { t, i18n } = useTranslation("categories");
  const language = normalizeLanguage(i18n.language);
  const { enqueueSnackbar } = useSnackbar();

  const limit = Yup.number().min(0.01, t("validation.amountMin")).required(t("validation.amountRequired"));

  const formik = useFormik({
    // Inputs need "" rather than null, or React warns about switching to a controlled input.
    initialValues: {
      name: props.name ?? "",
      weekBudget: props.weeklyBudget ?? ("" as number | ""),
      monthBudget: props.monthlyBudget ?? ("" as number | ""),
      yearBudget: props.yearlyBudget ?? ("" as number | ""),
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .required(t("validation.nameRequired"))
        .min(2, t("validation.nameMin"))
        .max(60, t("validation.nameMax")),
      weekBudget: limit,
      monthBudget: limit,
      yearBudget: limit,
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const request: CategoryCreateRequestUiDTO & UpdateCategoryUiDTO = {
        name: values.name.trim(),
        weekBudget: Number(values.weekBudget),
        monthBudget: Number(values.monthBudget),
        yearBudget: Number(values.yearBudget),
      };
      try {
        if (props.isEdit) {
          if (!props.id) {
            throw new Error("Brak ID kategorii podczas próby edycji.");
          }
          await apiClient.put(`/api/bff/categories/${props.id}`, request);
          enqueueSnackbar(t("snackbar.categoryUpdated"), { variant: "success" });
        } else {
          await apiClient.post("/api/bff/categories", request);
          enqueueSnackbar(t("snackbar.categoryCreated"), { variant: "success" });
        }
        props.onSuccess();
      } catch (error) {
        console.error("Błąd podczas zapisywania kategorii:", error);
        enqueueSnackbar(t("snackbar.categorySaveError"), { variant: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fieldError = (field: "name" | LimitField) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : undefined;

  return (
    <Box
      component="form"
      id={props.formId}
      onSubmit={formik.handleSubmit}
      noValidate
      sx={{ pt: 1 }}>
      <Grid
        container
        spacing={2}>
        <Grid size={12}>
          <TextField
            label={t("form.name")}
            placeholder={t("form.namePlaceholder")}
            fullWidth
            autoFocus={!props.isEdit}
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(fieldError("name"))}
            helperText={fieldError("name")}
            disabled={formik.isSubmitting}
          />
        </Grid>

        <Grid size={12}>
          <Typography
            variant="subtitle2"
            component="h3">
            {t("form.limits")}
          </Typography>
        </Grid>

        {LIMIT_FIELDS.map(field => (
          <Grid
            key={field}
            size={{ xs: 12, sm: 4 }}>
            <TextField
              label={t(`form.${field}`)}
              type="number"
              fullWidth
              name={field}
              value={formik.values[field]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(fieldError(field))}
              helperText={fieldError(field)}
              disabled={formik.isSubmitting}
              slotProps={{
                input: { endAdornment: <InputAdornment position="end">{getCurrencySymbol(language)}</InputAdornment> },
                htmlInput: { min: 0, step: "0.01", inputMode: "decimal" },
              }}
            />
          </Grid>
        ))}

        <Grid size={12}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ color: "text.secondary" }}>
            <InfoOutlinedIcon sx={{ fontSize: 18, mt: "2px" }} />
            <Typography variant="body2">{props.isEdit ? t("form.editHint") : t("form.addHint")}</Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddCategoryForm;
