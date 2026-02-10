import {ChangeOptionEnum} from "../../types/enums/ChangeOptionsEnum.tsx";
import {Box, Paper, Typography} from "@mui/material";
import {NKTextInput} from "../../lib/Input/TextInput.tsx";
import Grid from "@mui/material/Grid2";
import {useEffect, useState} from "react";
import {NKButton} from "../../lib/button/Button.tsx";
import {useFormik} from "formik";
import * as Yup from "yup";
import {apiClient} from "../../api/apiClient";
import {useSnackbar} from "notistack";

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

    const [changeDataValues, setChangeDataValues] = useState<changeDataValues>({label: "", title1: "", title2: "", title3: "", buttonTitle: ""});
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        switch (props.changeOption) {
            case ChangeOptionEnum.LOGIN:
                setChangeDataValues({
                    label: "Ustaw nowy login",
                    title1: "Nowy login",
                    title2: "Aktualne hasło",
                    title3: "Powtórz hasło",
                    buttonTitle: "Ustaw nowy login",
                });
                break;
            case ChangeOptionEnum.PASSWORD:
                setChangeDataValues({
                    label: "Ustaw nowe hasło",
                    title1: "Aktualne hasło",
                    title2: "Nowe hasło",
                    title3: "Potwierdź nowe hasło",
                    buttonTitle: "Zapisz nowe hasło",
                });
                break;
            case ChangeOptionEnum.EMAIL:
                setChangeDataValues({
                    label: "Ustaw nowy email",
                    title1: "Nowy adres e-mail",
                    title2: "Potwierdź nowy e-mail",
                    title3: "Wpisz hasło dla potwierdzenia",
                    buttonTitle: "Zapisz nowy email",
                });
                break;
            default:
                setChangeDataValues({
                    label: "Ustaw nowy login",
                    title1: "",
                    title2: "",
                    title3: "",
                    buttonTitle: "",
                });
        }
    }, [props.changeOption]);

    const getValidationSchema = () => {
        switch (props.changeOption) {
            case ChangeOptionEnum.LOGIN:
                return Yup.object({
                    field1: Yup.string().required("Musisz podać nowy login"),
                    field2: Yup.string().required("Musisz podać hasło"),
                    field3: Yup.string()
                        .required("Musisz powtórzyć hasło")
                        .oneOf([Yup.ref("field2")], "Hasła muszą być takie same"),
                });
            case ChangeOptionEnum.PASSWORD:
                return Yup.object({
                    field1: Yup.string().required("Musisz podać aktualne hasło"),
                    field2: Yup.string().required("Musisz podać nowe hasło"),
                    field3: Yup.string()
                        .required("Musisz potwierdzić nowe hasło")
                        .oneOf([Yup.ref("field2")], "Hasła muszą być takie same"),
                });
            case ChangeOptionEnum.EMAIL:
                return Yup.object({
                    field1: Yup.string()
                        .email("Musisz podać poprawny adres e-mail")
                        .required("Musisz podać nowy adres e-mail"),
                    field2: Yup.string()
                        .email("Musisz podać poprawny adres e-mail")
                        .required("Musisz potwierdzić nowy e-mail")
                        .oneOf([Yup.ref("field1")], "Adresy e-mail muszą być takie same"),
                    field3: Yup.string().required("Musisz podać hasło"),
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
        onSubmit: async (values, {resetForm, setSubmitting}) => {
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

                enqueueSnackbar("Zapisano zmiany", {variant: "success"});
                resetForm();
            } catch (error) {
                console.error("Błąd zapisu ustawień:", error);
                enqueueSnackbar("Nie udało się zapisać zmian", {variant: "error"});
            } finally {
                setSubmitting(false);
            }
        },
    });

    const getFieldType = (field: "field1" | "field2" | "field3") => {
        if (props.changeOption === ChangeOptionEnum.PASSWORD) return "password";
        if (props.changeOption === ChangeOptionEnum.LOGIN && (field === "field2" || field === "field3")) {
            return "password";
        }
        if (props.changeOption === ChangeOptionEnum.EMAIL && field === "field3") {
            return "password";
        }
        return "text";
    };

    if(props.changeOption === ChangeOptionEnum.NONE) {
        return <Grid size={9} ><Paper sx={{padding: 3}}>
            W razie problemów skontaktuj się z administratorem
        </Paper></Grid>;
    }

    return (
        <>
            <Typography variant="h5" gutterBottom>
                Edycja profilu
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
                        title={"Resetuj"}
                        type="button"
                        onClick={() => formik.resetForm()}
                    />
                </Box>
            </form>
        </>
    );
}

export default NKChangeData ;