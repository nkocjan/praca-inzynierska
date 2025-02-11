import {Button, Typography} from "@mui/material";

const NKDeleteAccount = () => {

    return (<>
        <Typography variant="h5" gutterBottom>
            Usuń konto
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{color: 'red', marginBottom: 2}}>
            Twoje konto zostanie permanentnie usunięte. W celu potwierdzenia zostaniesz poproszony o podane maila oraz hasła. Czy jesteś pewny, że chcesz usunąć konto?
        </Typography>

        <Button fullWidth sx={{ marginBottom: 1 }} variant="contained" color="error" >
            Tak, chcę usunąć moje konto
        </Button>
    </>)
}

export default NKDeleteAccount;