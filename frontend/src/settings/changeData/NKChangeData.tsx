import {ChangeOptionEnum} from "../../types/enums/ChangeOptionsEnum.tsx";
import {Box, Paper, Typography} from "@mui/material";
import {NKTextInput} from "../../lib/Input/TextInput.tsx";
import Grid from "@mui/material/Grid2";
import {useEffect, useState} from "react";
import {NKButton} from "../../lib/button/Button.tsx";

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

const NKChangeData = (props: properties) => {

    const [changeDataValues, setChangeDataValues] = useState<changeDataValues>({label: "", title1: "", title2: "", title3: "", buttonTitle: ""});

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
                    buttonTitle: "Wyślij maila z potwierdzeniem",
                });
                break;
            case ChangeOptionEnum.EMAIL:
                setChangeDataValues({
                    label: "Ustaw nowy email",
                    title1: "Nowy adres e-mail",
                    title2: "Potwierdź nowy e-mail",
                    title3: "Wpisz hasło dla potwierdzenia",
                    buttonTitle: "Wyślij maila z potwierdzeniem",
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

                <Box sx={{ marginBottom: 2 }}>
                    <NKTextInput label={changeDataValues.title1} />
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                    <NKTextInput label={changeDataValues.title2} />
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                    <NKTextInput label={changeDataValues.title3} />
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <NKButton title={changeDataValues.buttonTitle} />
                    <NKButton title={"Resetuj"} />
                </Box>
        </>
    );
}

export default NKChangeData ;