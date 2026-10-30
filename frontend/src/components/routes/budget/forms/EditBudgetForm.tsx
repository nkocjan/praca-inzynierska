import { Box, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { apiClient } from "../../../../api/apiClient.ts";
import type { BudgetUiDTO, BudgetUpdateRequestUiDTO } from "../../../../api/generated";
import { normalizeLanguage } from "../../../../i18n/i18n";
import { getCurrencySymbol } from "../../../../i18n/locale";
import { formatBudgetPeriod } from "../../../../lib/budgetPeriod";
import CategoryAvatar from "../../../../lib/category/CategoryAvatar";

interface EditBudgetFormProps {
  formId: string;
  budget: BudgetUiDTO;
  color: string;
  onSuccess: () => void;
}

const EditBudgetForm = ({ formId, budget, color, onSuccess }: EditBudgetFormProps) => {
  const { t, i18n } = useTranslation("budgets");
  const language = normalizeLanguage(i18n.language);
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: { amount: budget.amount ?? ("" as number | "") },
    validationSchema: Yup.object({
      amount: Yup.number().min(0.01, t("validation.amountMin")).required(t("validation.amountRequired")),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const request: BudgetUpdateRequestUiDTO = { amount: Number(values.amount) };
        await apiClient.put(`/api/bff/budgets/${budget.id}`, request);
        enqueueSnackbar(t("snackbar.budgetSaved"), { variant: "success" });
        onSuccess();
      } catch (error) {
        console.error("Błąd podczas zapisywania budżetu:", error);
        enqueueSnackbar(t("snackbar.budgetSaveError"), { variant: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const amountError = formik.touched.amount && formik.errors.amount ? formik.errors.amount : undefined;

  return (
    <Box
      component="form"
      id={formId}
      onSubmit={formik.handleSubmit}
      noValidate
      sx={{ pt: 1 }}>
      <Stack spacing={2.5}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ border: 1, borderColor: "divider", borderRadius: "12px", px: 2, py: 1.5 }}>
          <CategoryAvatar
            name={budget.category?.name}
            color={color}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{ fontWeight: 600 }}
              noWrap>
              {budget.category?.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary">
              {formatBudgetPeriod(budget.period, budget.periodStart, budget.periodEnd, language)} ·{" "}
              {t(`periodType.${budget.period}`)}
            </Typography>
          </Box>
        </Stack>

        <TextField
          label={t("form.amount")}
          type="number"
          fullWidth
          autoFocus
          name="amount"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(amountError)}
          helperText={amountError}
          disabled={formik.isSubmitting}
          slotProps={{
            input: { endAdornment: <InputAdornment position="end">{getCurrencySymbol(language)}</InputAdornment> },
            htmlInput: { min: 0, step: "0.01", inputMode: "decimal" },
          }}
        />

        <Stack
          direction="row"
          spacing={1}
          sx={{ color: "text.secondary" }}>
          <InfoOutlinedIcon sx={{ fontSize: 18, mt: "2px" }} />
          <Typography variant="body2">{t("form.editHint")}</Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default EditBudgetForm;
