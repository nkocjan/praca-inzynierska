import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs, { Dayjs } from "dayjs";

const categories = [
  "Food",
  "Transport",
  "Rent",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

const validationSchema = Yup.object({
  name: Yup.string().required("Nazwa jest wymagana"),
  category: Yup.string().required("Kategoria jest wymagana"),
  amount: Yup.number()
    .min(0.01, "Kwota musi być większa niż 0")
    .required("Kwota jest wymagana"),
  date: Yup.mixed<Dayjs>().nullable().required("Data jest wymagana"),
  planned: Yup.boolean().required("Wybierz opcję"),
});

const AddExpenseForm = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      amount: "",
      date: dayjs(),
      planned: "false",
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
        gap: "50px",
        maxWidth: "450px",
      }}
    >
      {/* Nazwa */}
      <TextField
        label="Nazwa"
        variant="outlined"
        fullWidth
        size="small"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
      />

      <FormControl
        fullWidth
        size="small"
        error={formik.touched.category && Boolean(formik.errors.category)}
      >
        <InputLabel>Kategoria</InputLabel>
        <Select
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.category && formik.errors.category && (
          <FormHelperText>{formik.errors.category}</FormHelperText>
        )}
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
        helperText={formik.touched.amount && formik.errors.amount}
      />

      <DatePicker
        label="Data"
        value={formik.values.date}
        onChange={(date: Dayjs | null) => formik.setFieldValue("date", date)}
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
        component="fieldset"
        error={formik.touched.planned && Boolean(formik.errors.planned)}
      >
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
          <FormHelperText>{formik.errors.planned}</FormHelperText>
        )}
      </FormControl>
    </form>
  );
};

export default AddExpenseForm;
