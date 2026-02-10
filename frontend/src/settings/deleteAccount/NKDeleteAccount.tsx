import { Button, Typography } from "@mui/material";
import { useDialog } from "../../lib/dialog/NKDialogContext";
import NKDeleteResetDataForm from "../resetData/NKDeleteResetDataForm";
import { useNavigate } from "react-router-dom";

const NKDeleteAccount = () => {
  const { openDialog } = useDialog();
  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Usuń konto
      </Typography>

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ color: "red", marginBottom: 2 }}
      >
        Twoje konto zostanie permanentnie usunięte. W celu potwierdzenia
        zostaniesz poproszony o podane maila oraz hasła. Czy jesteś pewny, że
        chcesz usunąć konto?
      </Typography>

      <Button
        fullWidth
        sx={{ marginBottom: 1 }}
        variant="contained"
        color="error"
        onClick={() =>
          openDialog(
            {
              title: "Potwierdź usunięcie konta",
              saveButtonTitle: "Potwierdzam",
              cancelButtonTitle: "Anuluj",
              formId: "delete-account-form",
            },
            <NKDeleteResetDataForm
              formId="delete-account-form"
              mode="delete-account"
              onSuccess={() => {
                localStorage.removeItem("jwtToken");
                navigate("/login", { replace: true });
              }}
            />
          )
        }
      >
        Tak, chcę usunąć moje konto
      </Button>
    </>
  );
};

export default NKDeleteAccount;
