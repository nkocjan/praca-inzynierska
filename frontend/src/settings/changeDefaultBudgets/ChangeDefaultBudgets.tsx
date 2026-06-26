import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { NKTextInput } from "../../lib/Input/TextInput.tsx";
import { NKButton } from "../../lib/button/Button.tsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  CategoryUiDTO,
  GetDefaultBudgetsResponseUiDTO,
  SetDefaultBudgetsRequestUiDTO,
} from "../../api/generated";
import { apiClient } from "../../api/apiClient.ts";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

const ChangeDefaultBudgets = () => {
  const { t } = useTranslation("settings");
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object({
    categoryId: Yup.string().required(
      t("defaultBudgets.validation.categoryRequired"),
    ),
    weeklyBudget: Yup.number()
      .positive(t("defaultBudgets.validation.positive"))
      .typeError(t("defaultBudgets.validation.number"))
      .nullable(),
    monthlyBudget: Yup.number()
      .positive(t("defaultBudgets.validation.positive"))
      .typeError(t("defaultBudgets.validation.number"))
      .nullable(),
    yearlyBudget: Yup.number()
      .positive(t("defaultBudgets.validation.positive"))
      .typeError(t("defaultBudgets.validation.number"))
      .nullable(),
  });

  const [categories, setCategories] = useState<CategoryUiDTO[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    apiClient
      .get<CategoryUiDTO[]>("/api/bff/categories/combo")
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error("Błąd pobierania kategorii:", error);
        enqueueSnackbar(t("defaultBudgets.snackbar.fetchCategoriesError"), {
          variant: "error",
        });
      })
      .finally(() => {
        setLoadingCategories(false);
      });
  }, [enqueueSnackbar, t]);

  const formik = useFormik({
    initialValues: {
      categoryId: "",
      weeklyBudget: "",
      monthlyBudget: "",
      yearlyBudget: "",
    },
    validationSchema: validationSchema,

    onSubmit: (values, { setSubmitting, resetForm }) => {
      const parseAmount = (amount: string): number | undefined => {
        if (amount === null || amount === "") return undefined;
        const num = parseFloat(amount);
        return isNaN(num) ? undefined : num;
      };

      const payload: SetDefaultBudgetsRequestUiDTO = {
        categoryId: values.categoryId,
        weeklyAmount: parseAmount(values.weeklyBudget),
        monthlyAmount: parseAmount(values.monthlyBudget),
        yearlyAmount: parseAmount(values.yearlyBudget),
      };

      apiClient
        .post("/api/bff/budgets/set-default", payload)
        .then(() => {
          resetForm();
          enqueueSnackbar(t("defaultBudgets.snackbar.saveSuccess"), {
            variant: "success",
          });
        })
        .catch(error => {
          console.error("Błąd podczas aktualizacji budżetów:", error);
          enqueueSnackbar(t("defaultBudgets.snackbar.saveError"), {
            variant: "error",
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  const { setFieldValue, values } = formik;
  const selectedCategoryId = values.categoryId;

  useEffect(() => {
    if (!selectedCategoryId) {
      setFieldValue("weeklyBudget", "");
      setFieldValue("monthlyBudget", "");
      setFieldValue("yearlyBudget", "");
      return;
    }

    const fetchDefaultBudgets = async () => {
      try {
        const response = await apiClient.get<GetDefaultBudgetsResponseUiDTO>(
          `/api/bff/budgets/get-defaults/${selectedCategoryId}`,
        );

        const budgets = response.data;

        setFieldValue("weeklyBudget", budgets.weeklyAmount || "");
        setFieldValue("monthlyBudget", budgets.monthlyAmount || "");
        setFieldValue("yearlyBudget", budgets.yearlyAmount || "");
      } catch (error) {
        console.error("Błąd pobierania domyślnych budżetów:", error);
        enqueueSnackbar(t("defaultBudgets.snackbar.fetchDefaultsError"), {
          variant: "error",
        });
        setFieldValue("weeklyBudget", "");
        setFieldValue("monthlyBudget", "");
        setFieldValue("yearlyBudget", "");
      }
    };

    void fetchDefaultBudgets();
  }, [enqueueSnackbar, selectedCategoryId, setFieldValue, t]);

  return (
    <>
      <Typography
        variant="h5"
        gutterBottom>
        {t("defaultBudgets.title")}
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ mb: 4 }}>
          <FormControl
            fullWidth
            variant="filled"
            disabled={loadingCategories}
            error={
              formik.touched.categoryId && Boolean(formik.errors.categoryId)
            }>
            <InputLabel id="category-select-label">
              {t("defaultBudgets.categoryLabel")}
            </InputLabel>
            <Select
              labelId="category-select-label"
              label={t("defaultBudgets.categoryLabel")}
              name="categoryId"
              value={formik.values.categoryId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              variant={"standard"}>
              <MenuItem value="">
                <em>
                  {loadingCategories
                    ? t("defaultBudgets.loadingCategories")
                    : t("defaultBudgets.chooseCategory")}
                </em>
              </MenuItem>
              {categories.map(category => (
                <MenuItem
                  key={category.id}
                  value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {formik.touched.categoryId && formik.errors.categoryId}
            </FormHelperText>
          </FormControl>
        </Box>

        {/* Pola tekstowe bez zmian */}
        <Box sx={{ mb: 4 }}>
          <NKTextInput
            label={t("defaultBudgets.weeklyBudget")}
            type="number"
            name="weeklyBudget"
            value={formik.values.weeklyBudget}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.weeklyBudget && Boolean(formik.errors.weeklyBudget)
            }
            helperText={
              formik.touched.weeklyBudget && formik.errors.weeklyBudget
            }
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <NKTextInput
            label={t("defaultBudgets.monthlyBudget")}
            type="number"
            name="monthlyBudget"
            value={formik.values.monthlyBudget}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.monthlyBudget &&
              Boolean(formik.errors.monthlyBudget)
            }
            helperText={
              formik.touched.monthlyBudget && formik.errors.monthlyBudget
            }
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <NKTextInput
            label={t("defaultBudgets.yearlyBudget")}
            type="number"
            name="yearlyBudget"
            value={formik.values.yearlyBudget}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.yearlyBudget && Boolean(formik.errors.yearlyBudget)
            }
            helperText={
              formik.touched.yearlyBudget && formik.errors.yearlyBudget
            }
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <NKButton
            title={t("defaultBudgets.submit")}
            type="submit"
            disabled={formik.isSubmitting}
          />
          <NKButton
            title={t("defaultBudgets.reset")}
            type="button"
            onClick={() => formik.resetForm()}
          />
        </Box>
      </form>
    </>
  );
};

export default ChangeDefaultBudgets;
