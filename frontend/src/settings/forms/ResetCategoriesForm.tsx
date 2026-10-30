import { useEffect, useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, FormHelperText, Skeleton, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { apiClient } from "../../api/apiClient";
import { CategoryUiDTO } from "../../api/generated";
import { normalizeLanguage } from "../../i18n/i18n";
import { Dot } from "../../lib/filters/FilterParts";
import { useCategoryColors } from "../../theme/chartColors";

interface ResetCategoriesFormProps {
  formId: string;
  onSuccess: () => void;
}

const ResetCategoriesForm = ({ formId, onSuccess }: ResetCategoriesFormProps) => {
  const { t, i18n } = useTranslation("settings");
  const language = normalizeLanguage(i18n.language);
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState<CategoryUiDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const { colorFor } = useCategoryColors(categories, language);

  useEffect(() => {
    apiClient
      .get<CategoryUiDTO[]>("/api/bff/categories/combo")
      .then(response => setCategories(response.data))
      .catch(error => {
        console.error("Błąd pobierania kategorii:", error);
        enqueueSnackbar(t("resetCategories.fetchError"), { variant: "error" });
      })
      .finally(() => setLoading(false));
  }, [enqueueSnackbar, t]);

  const formik = useFormik<{ categoryIds: string[] }>({
    initialValues: { categoryIds: [] },
    validationSchema: Yup.object({
      categoryIds: Yup.array().of(Yup.string().required()).min(1, t("resetCategories.minOne")),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await apiClient.post("/api/bff/users/me/categories/reset", { categoryIds: values.categoryIds });
        enqueueSnackbar(t("resetCategories.done", { count: values.categoryIds.length }), { variant: "success" });
        onSuccess();
      } catch (error) {
        console.error("Błąd czyszczenia kategorii:", error);
        enqueueSnackbar(t("resetCategories.error"), { variant: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const selected = formik.values.categoryIds;
  const sorted = [...categories].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", language));
  const allIds = sorted.map(category => category.id ?? "");
  const allSelected = allIds.length > 0 && selected.length === allIds.length;

  const toggle = (id: string) =>
    formik.setFieldValue("categoryIds", selected.includes(id) ? selected.filter(item => item !== id) : [...selected, id]);

  return (
    <Box
      component="form"
      id={formId}
      onSubmit={formik.handleSubmit}
      noValidate>
      <Typography>{t("resetCategories.dialogText")}</Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1, mb: 2 }}>
        {t("resetCategories.dialogHint")}
      </Typography>

      <Box sx={{ border: 1, borderColor: "divider", borderRadius: "12px", px: 1.5, py: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 0.5 }}>
          <Typography
            variant="body2"
            color="text.secondary">
            {t("resetCategories.selected", { count: selected.length })}
          </Typography>
          <Button
            size="small"
            disabled={loading || formik.isSubmitting}
            onClick={() => formik.setFieldValue("categoryIds", allSelected ? [] : allIds)}>
            {allSelected ? t("resetCategories.selectNone") : t("resetCategories.selectAll")}
          </Button>
        </Stack>
        {loading ? (
          <Stack
            spacing={1}
            sx={{ py: 1 }}>
            {[0, 1, 2].map(i => (
              <Skeleton
                key={i}
                height={32}
              />
            ))}
          </Stack>
        ) : (
          <Stack>
            {sorted.map(category => (
              <FormControlLabel
                key={category.id}
                sx={{ m: 0 }}
                control={
                  <Checkbox
                    checked={selected.includes(category.id ?? "")}
                    onChange={() => toggle(category.id ?? "")}
                    disabled={formik.isSubmitting}
                  />
                }
                label={
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}>
                    <Dot color={colorFor(category.id)} />
                    <span>{category.name}</span>
                  </Stack>
                }
              />
            ))}
          </Stack>
        )}
      </Box>
      {formik.touched.categoryIds && formik.errors.categoryIds && (
        <FormHelperText
          error
          sx={{ mt: 1 }}>
          {String(formik.errors.categoryIds)}
        </FormHelperText>
      )}
    </Box>
  );
};

export default ResetCategoriesForm;
