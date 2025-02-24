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
import { mockCategories } from "../../../../assets/mocks/CategoriesMock.ts";
import { ICategory } from "../../../../types/interfaces/ICategory.tsx";

const validationSchema = Yup.object({
  name: Yup.string().required("Nazwa jest wymagana"),
  category: Yup.string().required("Kategoria jest wymagana"),
  amount: Yup.number()
    .min(0.01, "Kwota musi być większa niż 0")
    .required("Kwota jest wymagana"),
  date: Yup.mixed<Dayjs>().nullable().required("Data jest wymagana"),
  planned: Yup.boolean().required("Wybierz opcję"),
});

interface properties {
  isEdit?: boolean;
  id?: string;
  name?: string;
  category?: ICategory;
  amount?: number;
  date?: Dayjs;
  planned?: ExpanseStatusEnum;
}

const AddExpenseForm = (props: properties) => {
  const formik = useFormik({
    initialValues: {
      name: props.name ?? "",
      category: props.category?.id ?? "",
      amount: props.amount ?? "",
      date: props.date ? dayjs(props.date) : dayjs(),
      planned: props.planned != ExpanseStatusEnum.NORMAL,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Dodano wydatek:", values);
    },
  });

  return (
    <form
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
      />

      <FormControl
        sx={{ width: "100%" }}
        size="small"
        error={formik.touched.category && Boolean(formik.errors.category)}
      >
        <InputLabel>Kategoria</InputLabel>
        <Select
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          input={<OutlinedInput label="Kategoria" />}
        >
          {mockCategories.map((category) => (
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
      />

      <DatePicker
        label="Data"
        value={formik.values.date}
        onChange={(date: Dayjs | null) =>
          formik.setFieldValue("date", date ? dayjs(date) : null)
        }
        slotProps={{
          textField: {
            variant: "outlined",
            size: "small",
            fullWidth: true,
            error: formik.touched.date && Boolean(formik.errors.date),
            helperText: formik.touched.date
              ? String(formik.errors.date || "")
              : "",
          },
        }}
      />

      <FormControl
        sx={{ marginTop: "8px" }}
        component="fieldset"
        error={formik.touched.planned && Boolean(formik.errors.planned)}
      >
        <FormLabel component="legend">Czy planowany?</FormLabel>
        <RadioGroup
          row
          name="planned"
          value={formik.values.planned}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <FormControlLabel value="true" control={<Radio />} label="Tak" />
          <FormControlLabel value="false" control={<Radio />} label="Nie" />
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
