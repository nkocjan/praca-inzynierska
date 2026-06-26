import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiClient } from "../../api/apiClient";
import { CategoryUiDTO } from "../../api/generated";
import { useSnackbar } from "notistack";
import { useDialog } from "../../lib/dialog/useDialog";
import type { AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";

interface Props {
  formId?: string;
}

const NKResetSelectedCategoriesForm = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { closeDialog } = useDialog();
  const { t } = useTranslation("settings");

  const validationSchema = Yup.object({
    categoryIds: Yup.array()
      .of(Yup.string().required())
      .min(1, t("resetSelectedCategories.validation.minOne")),
  });

  const [categories, setCategories] = useState<CategoryUiDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<CategoryUiDTO[]>("/api/bff/categories/combo")
      .then((response: AxiosResponse<CategoryUiDTO[]>) =>
        setCategories(response.data),
      )
      .catch((error: unknown) => {
        console.error("Błąd pobierania kategorii:", error);
        enqueueSnackbar(t("resetSelectedCategories.snackbar.fetchError"), {
          variant: "error",
        });
      })
      .finally(() => setLoading(false));
  }, [enqueueSnackbar, t]);

  type FormValues = { categoryIds: string[] };

  const formik = useFormik<FormValues>({
    initialValues: { categoryIds: [] },
    validationSchema,
    onSubmit: async (
      values: FormValues,
      {
        setSubmitting,
        resetForm,
      }: {
        setSubmitting: (isSubmitting: boolean) => void;
        resetForm: () => void;
      },
    ) => {
      try {
        await apiClient.post("/api/bff/users/me/categories/reset", {
          categoryIds: values.categoryIds,
        });

        enqueueSnackbar(t("resetSelectedCategories.snackbar.resetSuccess"), {
          variant: "success",
        });
        resetForm();
        closeDialog();
      } catch (error) {
        console.error("Błąd resetu kategorii:", error);
        enqueueSnackbar(t("resetSelectedCategories.snackbar.resetError"), {
          variant: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const toggleCategory = (id: string) => {
    const current = formik.values.categoryIds;
    if (current.includes(id)) {
      formik.setFieldValue(
        "categoryIds",
        current.filter((x: string) => x !== id),
      );
    } else {
      formik.setFieldValue("categoryIds", [...current, id]);
    }
  };

  return (
    <form
      id={props.formId}
      onSubmit={formik.handleSubmit}>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1 }}>
        {t("resetSelectedCategories.title")}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <FormGroup>
          {categories.map((cat: CategoryUiDTO) => (
            <FormControlLabel
              key={cat.id}
              control={
                <Checkbox
                  checked={formik.values.categoryIds.includes(String(cat.id))}
                  onChange={() => toggleCategory(String(cat.id))}
                  disabled={formik.isSubmitting}
                />
              }
              label={cat.name}
            />
          ))}
        </FormGroup>
      )}

      {formik.touched.categoryIds && formik.errors.categoryIds ? (
        <FormHelperText
          error
          sx={{ mt: 1 }}>
          {String(formik.errors.categoryIds)}
        </FormHelperText>
      ) : null}
    </form>
  );
};

export default NKResetSelectedCategoriesForm;
