import {ChangeOptionEnum} from "../changeOptionsEnum.tsx";
import {useEffect, useState} from "react";
import {Button, Typography} from "@mui/material";
import Divider from "@mui/material/Divider";

interface properties {
    changeOption: ChangeOptionEnum;
}

interface labels {
    label: string
    info: string;
    stepsInfo: string;
    buttonTitle: string;
}

const NKResetData = (props: properties) => {
    const [labels, setLabels] = useState<labels>({info: "", label: "", buttonTitle: "", stepsInfo: ""});

    useEffect(() => {
        switch (props.changeOption){
            case ChangeOptionEnum.RESET_DATA:
                setLabels({label: "Resetuj wszystkie dane",stepsInfo: "Zostaniesz poproszony o podanie swojego maila, oraz hasła w celu potwierdzenia usunięcia danych", buttonTitle: "Potwierdzam usunięcie danych", info: "Wszystkie twoje dane: uzupełnione budżety, wprowadzone wydatki, zapisane kategorie, zostaną usunięte. Będziesz mógł zacząć prowadzić swoje konto na nowo. Jeżeli chcesz zresetować dane tylko z konkretnych kategorii, wybierz opcję, resetuj wybrane kategorie"});
                break;
            case ChangeOptionEnum.RESET_CATEGORIES:
                setLabels({label: "Resetuj dane z wybranych kategorii",stepsInfo: "Wybierz co ma się stać z wydatkami podpiętymi do danej kategorii:" , info: "Dane dotyczące zaznaczonych kategorii zostaną usunięte:", buttonTitle: "Potwierdzam usunięcie danych z wybranych kategorii"});
                break;
            default:

        }
    }, [props.changeOption]);

    return (<>
        <Typography variant="h5" gutterBottom>
            {labels.label}
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{color: 'red'}}>
            {labels.info}
        </Typography>
        <Divider sx={{ marginBottom: 2, marginTop: 4 }} />
        <Typography variant="caption" gutterBottom sx={{color: 'red'}}>
            {labels.stepsInfo}
        </Typography>
        <Divider sx={{ marginBottom: 4, marginTop: 2 }} />
        <Button fullWidth sx={{ marginBottom: 1 }} variant="contained" color="error" >
            {labels.buttonTitle}
        </Button>
    </>)
}

export default NKResetData;