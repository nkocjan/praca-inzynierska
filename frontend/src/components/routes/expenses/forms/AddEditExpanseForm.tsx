import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs, { Dayjs } from "dayjs";
import { ExpanseStatusEnum } from "../../../../types/enums/ExpanseStatusEnum.tsx";
import { ICategory } from "../../../../types/interfaces/ICategory.tsx";

import { useSnackbar } from "notistack";
import { apiClient } from "../../../../api/apiClient.ts";
import {
  CreateExpenseRequestUiDTO,
  UpdateExpenseRequestUiDTO,
} from "../../../../api/generated";
import { useEffect, useState } from "react";

const validationSchema = Yup.object({
  name: Yup.string().required("Nazwa jest wymagana"),
  category: Yup.string().required("Kategoria jest wymagana"),
  amount: Yup.number()
    .min(0.01, "Kwota musi być większa niż 0")
    .required("Kwota jest wymagana"),
  date: Yup.mixed<Dayjs>().nullable().required("Data jest wymagana"),
  planned: Yup.boolean().required("Wybierz opcję"),
  description: Yup.string().max(
    255,
    "Opis nie może być dłuższy niż 255 znaków",
  ),
});

interface properties {
  isEdit?: boolean;
  id?: string;
  name?: string;
  description?: string;
  category?: ICategory;
  amount?: number;
  date?: Dayjs;
  planned?: ExpanseStatusEnum;
  onSuccess: () => void;
  formId?: string;
}

const AddExpenseForm = (props: properties) => {
  const { enqueueSnackbar } = useSnackbar();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await apiClient.get<ICategory[]>(
          "/api/bff/categories",
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Nie udało się pobrać kategorii:", error);
        enqueueSnackbar("Nie udało się pobrać listy kategorii", {
          variant: "error",
        });
      } finally {
        setLoadingCategories(false);
      }
    };

    void fetchCategories();
  }, [enqueueSnackbar]);

  const formik = useFormik({
    initialValues: {
      name: props.name ?? "",
      description: props.description ?? "",
      category: props.category?.id ?? "",
      amount: props.amount ?? "",
      date: props.date ? dayjs(props.date) : dayjs(),
      planned: props.planned
        ? props.planned !== ExpanseStatusEnum.NORMAL
        : false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const localDateTimeString = values.date.format("YYYY-MM-DDTHH:mm:ss");

        if (props.isEdit) {
          if (!props.id) {
            throw new Error("Brak ID wydatku podczas próby edycji.");
          }
          const requestBody: UpdateExpenseRequestUiDTO = {
            name: values.name,
            description: values.description,
            amount: Number(values.amount),
            date: localDateTimeString,
          };
          await apiClient.put(`/api/bff/expenses/${props.id}`, requestBody);
          enqueueSnackbar("Wydatek zaktualizowany pomyślnie", {
            variant: "success",
          });
        } else {
          const requestBody: CreateExpenseRequestUiDTO = {
            name: values.name,
            description: values.description,
            amount: Number(values.amount),
            date: localDateTimeString,
            categoryId: values.category,
            isPlanned: values.planned,
          };
          await apiClient.post("/api/bff/expenses", requestBody);
          enqueueSnackbar("Wydatek dodany pomyślnie", { variant: "success" });
        }
        props.onSuccess();
      } catch (error) {
        console.error("Błąd podczas zapisywania wydatku:", error);
        enqueueSnackbar("Wystąpił błąd. Spróbuj ponownie.", {
          variant: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form
      id={props.formId}
      onSubmit={formik.handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        maxWidth: "450px",
      }}
    >
      <TextField
        sx={{ marginTop: "8px" }}
        label="Nazwa"
        variant="outlined"
        fullWidth
        size="small"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={
          <span style={{ minHeight: "20px", display: "block" }}>
            {formik.touched.name && formik.errors.name}
          </span>
        }
        disabled={formik.isSubmitting}
      />

      <TextField
        label="Opis (opcjonalnie)"
        variant="outlined"
        fullWidth
        multiline
        rows={2}
        size="small"
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={
          <span style={{ minHeight: "20px", display: "block" }}>
            {formik.touched.description && formik.errors.description}
          </span>
        }
        disabled={formik.isSubmitting}
      />

      <FormControl
        sx={{ width: "100%" }}
        size="small"
        error={formik.touched.category && Boolean(formik.errors.category)}
        disabled={props.isEdit || formik.isSubmitting || loadingCategories}
      >
        <InputLabel>Kategoria</InputLabel>
        <Select
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          input={<OutlinedInput label="Kategoria" />}
        >
          {loadingCategories && (
            <MenuItem disabled value="">
              Ładowanie kategorii...
            </MenuItem>
          )}
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText sx={{ minHeight: "20px" }}>
          {formik.touched.category && formik.errors.category}
        </FormHelperText>
      </FormControl>

      <TextField
        label="Kwota"
        type="number"
        variant="outlined"
        fullWidth
        size="small"
        name="amount"
        value={formik.values.amount}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.amount && Boolean(formik.errors.amount)}
        helperText={
          <span style={{ minHeight: "20px", display: "block" }}>
            {formik.touched.amount && formik.errors.amount}
          </span>
        }
        disabled={formik.isSubmitting}
      />

      <DatePicker
        label="Data"
        value={formik.values.date}
        onChange={(date: Dayjs | null) =>
          formik.setFieldValue("date", date ? dayjs(date) : null)
        }
        disabled={formik.isSubmitting}
        slotProps={{
          textField: {
            variant: "outlined",
            size: "small",
            fullWidth: true,
            error: formik.touched.date && Boolean(formik.errors.date),
            helperText:
              (formik.touched.date && String(formik.errors.date || "")) || " ",
            sx: {
              "& .MuiFormHelperText-root": {
                minHeight: "20px",
              },
            },
          },
        }}
      />

      <FormControl
        sx={{ marginTop: "8px" }}
        component="fieldset"
        error={formik.touched.planned && Boolean(formik.errors.planned)}
        disabled={props.isEdit || formik.isSubmitting}
      >
        <FormLabel component="legend">Czy planowany?</FormLabel>
        <RadioGroup
          row
          name="planned"
          value={formik.values.planned}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <FormControlLabel value={true} control={<Radio />} label="Tak" />
          <FormControlLabel value={false} control={<Radio />} label="Nie" />
        </RadioGroup>
        {formik.touched.planned && formik.errors.planned && (
          <FormHelperText sx={{ minHeight: "20px" }}>
            {formik.errors.planned}
          </FormHelperText>
        )}
      </FormControl>
    </form>
  );
};

export default AddExpenseForm;
