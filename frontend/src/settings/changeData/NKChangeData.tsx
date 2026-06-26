import { ChangeOptionEnum } from "../../types/enums/ChangeOptionsEnum.tsx";
import { Box, Paper, Typography } from "@mui/material";
import { NKTextInput } from "../../lib/Input/TextInput.tsx";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { NKButton } from "../../lib/button/Button.tsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiClient } from "../../api/apiClient";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

interface properties {
  changeOption: ChangeOptionEnum;
}

interface changeDataValues {
  label: string;
  title1: string;
  title2: string;
  title3: string;
  buttonTitle: string;
}

type FormValues = {
  field1: string;
  field2: string;
  field3: string;
};

const NKChangeData = (props: properties) => {
  const { t } = useTranslation("settings");

  const [changeDataValues, setChangeDataValues] = useState<changeDataValues>({
    label: "",
    title1: "",
    title2: "",
    title3: "",
    buttonTitle: "",
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    switch (props.changeOption) {
      case ChangeOptionEnum.LOGIN:
        setChangeDataValues({
          label: t("changeData.login.label"),
          title1: t("changeData.login.title1"),
          title2: t("changeData.login.title2"),
          title3: t("changeData.login.title3"),
          buttonTitle: t("changeData.login.submit"),
        });
        break;
      case ChangeOptionEnum.PASSWORD:
        setChangeDataValues({
          label: t("changeData.password.label"),
          title1: t("changeData.password.title1"),
          title2: t("changeData.password.title2"),
          title3: t("changeData.password.title3"),
          buttonTitle: t("changeData.password.submit"),
        });
        break;
      case ChangeOptionEnum.EMAIL:
        setChangeDataValues({
          label: t("changeData.email.label"),
          title1: t("changeData.email.title1"),
          title2: t("changeData.email.title2"),
          title3: t("changeData.email.title3"),
          buttonTitle: t("changeData.email.submit"),
        });
        break;
      default:
        setChangeDataValues({
          label: t("changeData.login.label"),
          title1: "",
          title2: "",
          title3: "",
          buttonTitle: "",
        });
    }
  }, [props.changeOption, t]);

  const getValidationSchema = () => {
    switch (props.changeOption) {
      case ChangeOptionEnum.LOGIN:
        return Yup.object({
          field1: Yup.string().required(
            t("changeData.validation.newLoginRequired"),
          ),
          field2: Yup.string().required(
            t("changeData.validation.passwordRequired"),
          ),
          field3: Yup.string()
            .required(t("changeData.validation.repeatPasswordRequired"))
            .oneOf(
              [Yup.ref("field2")],
              t("changeData.validation.passwordsMustMatch"),
            ),
        });
      case ChangeOptionEnum.PASSWORD:
        return Yup.object({
          field1: Yup.string().required(
            t("changeData.validation.oldPasswordRequired"),
          ),
          field2: Yup.string().required(
            t("changeData.validation.newPasswordRequired"),
          ),
          field3: Yup.string()
            .required(t("changeData.validation.confirmNewPasswordRequired"))
            .oneOf(
              [Yup.ref("field2")],
              t("changeData.validation.passwordsMustMatch"),
            ),
        });
      case ChangeOptionEnum.EMAIL:
        return Yup.object({
          field1: Yup.string()
            .email(t("changeData.validation.invalidEmail"))
            .required(t("changeData.validation.newEmailRequired")),
          field2: Yup.string()
            .email(t("changeData.validation.invalidEmail"))
            .required(t("changeData.validation.confirmEmailRequired"))
            .oneOf(
              [Yup.ref("field1")],
              t("changeData.validation.emailsMustMatch"),
            ),
          field3: Yup.string().required(
            t("changeData.validation.passwordRequired"),
          ),
        });
      default:
        return Yup.object({
          field1: Yup.string(),
          field2: Yup.string(),
          field3: Yup.string(),
        });
    }
  };

  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      field1: "",
      field2: "",
      field3: "",
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        if (props.changeOption === ChangeOptionEnum.LOGIN) {
          await apiClient.put("/api/bff/users/me/nickname", {
            newNickname: values.field1,
            password: values.field2,
            confirmPassword: values.field3,
          });
        }

        if (props.changeOption === ChangeOptionEnum.PASSWORD) {
          await apiClient.put("/api/bff/users/me/password", {
            oldPassword: values.field1,
            newPassword: values.field2,
            confirmNewPassword: values.field3,
          });
        }

        if (props.changeOption === ChangeOptionEnum.EMAIL) {
          await apiClient.put("/api/bff/users/me/email", {
            newEmail: values.field1,
            confirmNewEmail: values.field2,
            password: values.field3,
          });
        }

        enqueueSnackbar(t("changeData.snackbar.saved"), { variant: "success" });
        resetForm();
      } catch (error) {
        console.error("Błąd zapisu ustawień:", error);
        enqueueSnackbar(t("changeData.snackbar.saveError"), {
          variant: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getFieldType = (field: "field1" | "field2" | "field3") => {
    if (props.changeOption === ChangeOptionEnum.PASSWORD) return "password";
    if (
      props.changeOption === ChangeOptionEnum.LOGIN &&
      (field === "field2" || field === "field3")
    ) {
      return "password";
    }
    if (props.changeOption === ChangeOptionEnum.EMAIL && field === "field3") {
      return "password";
    }
    return "text";
  };

  if (props.changeOption === ChangeOptionEnum.NONE) {
    return (
      <Grid size={9}>
        <Paper sx={{ padding: 3 }}>{t("changeData.contactAdmin")}</Paper>
      </Grid>
    );
  }

  return (
    <>
      <Typography
        variant="h5"
        gutterBottom>
        {t("changeData.profileTitle")}
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ marginBottom: 4 }}>
          <NKTextInput
            label={changeDataValues.title1}
            name="field1"
            type={getFieldType("field1")}
            value={formik.values.field1}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.field1 && Boolean(formik.errors.field1)}
            helperText={formik.touched.field1 && formik.errors.field1}
          />
        </Box>
        <Box sx={{ marginBottom: 4 }}>
          <NKTextInput
            label={changeDataValues.title2}
            name="field2"
            type={getFieldType("field2")}
            value={formik.values.field2}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.field2 && Boolean(formik.errors.field2)}
            helperText={formik.touched.field2 && formik.errors.field2}
          />
        </Box>
        <Box sx={{ marginBottom: 4 }}>
          <NKTextInput
            label={changeDataValues.title3}
            name="field3"
            type={getFieldType("field3")}
            value={formik.values.field3}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.field3 && Boolean(formik.errors.field3)}
            helperText={formik.touched.field3 && formik.errors.field3}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <NKButton
            title={changeDataValues.buttonTitle}
            type="submit"
            disabled={formik.isSubmitting}
          />
          <NKButton
            title={t("changeData.reset")}
            type="button"
            onClick={() => formik.resetForm()}
          />
        </Box>
      </form>
    </>
  );
};

export default NKChangeData;
