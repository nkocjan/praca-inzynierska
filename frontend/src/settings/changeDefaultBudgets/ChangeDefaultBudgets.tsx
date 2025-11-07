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

const validationSchema = Yup.object({
  categoryId: Yup.string().required("Kategoria jest wymagana"),
  weeklyBudget: Yup.number()
    .positive("Wartość musi być dodatnia")
    .typeError("Wprowadź poprawną liczbę")
    .nullable(),
  monthlyBudget: Yup.number()
    .positive("Wartość musi być dodatnia")
    .typeError("Wprowadź poprawną liczbę")
    .nullable(),
  yearlyBudget: Yup.number()
    .positive("Wartość musi być dodatnia")
    .typeError("Wprowadź poprawną liczbę")
    .nullable(),
});

const ChangeDefaultBudgets = () => {
  const [categories, setCategories] = useState<CategoryUiDTO[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    apiClient
      .get<CategoryUiDTO[]>("/api/bff/categories/combo")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Błąd pobierania kategorii:", error);
        alert("Nie udało się pobrać listy kategorii.");
      })
      .finally(() => {
        setLoadingCategories(false);
      });
  }, []);

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

      console.log("Wysyłanie requestu API z danymi:", payload);

      apiClient
        .post("/api/bff/budgets/set-default", payload)
        .then(() => {
          resetForm();
        })
        .catch((error) => {
          console.error("Błąd podczas aktualizacji budżetów:", error);
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
        setFieldValue("weeklyBudget", "");
        setFieldValue("monthlyBudget", "");
        setFieldValue("yearlyBudget", "");
      }
    };

    void fetchDefaultBudgets();
  }, [selectedCategoryId, setFieldValue]);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Edycja domyślnych budżetów kategorii
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ mb: 4 }}>
          <FormControl
            fullWidth
            variant="filled"
            disabled={loadingCategories}
            error={
              formik.touched.categoryId && Boolean(formik.errors.categoryId)
            }
          >
            <InputLabel id="category-select-label">Kategoria *</InputLabel>
            <Select
              labelId="category-select-label"
              label="Kategoria *"
              name="categoryId"
              value={formik.values.categoryId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              variant={"standard"}
            >
              <MenuItem value="">
                <em>
                  {loadingCategories
                    ? "Ładowanie kategorii..."
                    : "Wybierz kategorię"}
                </em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
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
            label="Budżet tygodniowy"
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
            label="Budżet miesięczny"
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
            label="Budżet roczny"
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
            title="Zatwierdź"
            type="submit"
            disabled={formik.isSubmitting}
          />
          <NKButton
            title="Resetuj"
            type="button"
            onClick={() => formik.resetForm()}
          />
        </Box>
      </form>
    </>
  );
};

export default ChangeDefaultBudgets;
