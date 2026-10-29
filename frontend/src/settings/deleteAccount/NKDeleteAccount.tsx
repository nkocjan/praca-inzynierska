import { Button, Typography } from "@mui/material";
import { useDialog } from "../../lib/dialog/useDialog";
import NKDeleteResetDataForm from "../resetData/NKDeleteResetDataForm";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NKDeleteAccount = () => {
  const { openDialog } = useDialog();
  const navigate = useNavigate();
  const { t } = useTranslation("settings");

  return (
    <>
      <Typography
        variant="h5"
        gutterBottom>
        {t("deleteAccount.title")}
      </Typography>

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ color: "red", marginBottom: 2 }}>
        {t("deleteAccount.warning")}
      </Typography>

      <Button
        fullWidth
        sx={{ marginBottom: 1 }}
        variant="contained"
        color="error"
        onClick={() =>
          openDialog(
            {
              title: t("deleteAccount.dialogTitle"),
              saveButtonTitle: t("deleteAccount.confirm"),
              cancelButtonTitle: t("deleteAccount.cancel"),
              formId: "delete-account-form",
            },
            <NKDeleteResetDataForm
              formId="delete-account-form"
              mode="delete-account"
              onSuccess={() => {
                localStorage.removeItem("jwtToken");
                navigate("/login", { replace: true });
              }}
            />,
          )
        }>
        {t("deleteAccount.button")}
      </Button>
    </>
  );
};

export default NKDeleteAccount;
