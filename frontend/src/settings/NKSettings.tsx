import { Button, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { ChangeOptionEnum } from "../types/enums/ChangeOptionsEnum.tsx";
import NKChangeData from "./changeData/NKChangeData.tsx";
import Divider from "@mui/material/Divider";
import NKResetData from "./resetData/NKResetData.tsx";
import NKDeleteAccount from "./deleteAccount/NKDeleteAccount.tsx";
import ChangeDefaultBudgets from "./changeDefaultBudgets/ChangeDefaultBudgets.tsx";

const NKSettings = () => {
  const [changeOption, setChangeOption] = useState<ChangeOptionEnum>(
    ChangeOptionEnum.NONE,
  );

  const renderComponent = () => {
    switch (changeOption) {
      case ChangeOptionEnum.LOGIN:
      case ChangeOptionEnum.PASSWORD:
      case ChangeOptionEnum.EMAIL:
      case ChangeOptionEnum.NONE:
        return <NKChangeData changeOption={changeOption} />;
      case ChangeOptionEnum.RESET_CATEGORIES:
      case ChangeOptionEnum.RESET_DATA:
        return <NKResetData changeOption={changeOption} />;
      case ChangeOptionEnum.DELETE_ACCOUNT:
        return <NKDeleteAccount />;
      case ChangeOptionEnum.SET_DEFAULT_BUDGETS:
        return <ChangeDefaultBudgets />;
      default:
        return null;
    }
  };

  return (
    <Grid container spacing={3} sx={{ padding: 3, marginTop: 10 }}>
      <Grid size={3}>
        <Paper sx={{ padding: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            onClick={() => setChangeOption(ChangeOptionEnum.NONE)}
            sx={{ cursor: "pointer" }}
          >
            Ustawienia konta
          </Typography>
          <Divider sx={{ marginBottom: 4, marginTop: 4 }} />
          <Button
            fullWidth
            sx={{ marginBottom: 1 }}
            variant="outlined"
            onClick={() =>
              setChangeOption(ChangeOptionEnum.SET_DEFAULT_BUDGETS)
            }
          >
            Ustaw domyślne budżety
          </Button>
          <Divider sx={{ marginBottom: 4, marginTop: 4 }} />
          <Button
            fullWidth
            sx={{ marginBottom: 1 }}
            variant="outlined"
            onClick={() => setChangeOption(ChangeOptionEnum.LOGIN)}
          >
            Zmień login
          </Button>
          <Button
            fullWidth
            sx={{ marginBottom: 1 }}
            variant="outlined"
            onClick={() => setChangeOption(ChangeOptionEnum.PASSWORD)}
          >
            Zmień hasło
          </Button>
          <Button
            fullWidth
            sx={{ marginBottom: 1 }}
            variant="outlined"
            onClick={() => setChangeOption(ChangeOptionEnum.EMAIL)}
          >
            Zmień email
          </Button>
          <Divider sx={{ marginBottom: 4, marginTop: 4 }} />
          <Button
            fullWidth
            sx={{ marginBottom: 1 }}
            variant="outlined"
            color="warning"
            onClick={() => setChangeOption(ChangeOptionEnum.RESET_DATA)}
          >
            Resetuj dane
          </Button>
          <Button
            fullWidth
            sx={{ marginBottom: 1 }}
            variant="outlined"
            color="warning"
            onClick={() => setChangeOption(ChangeOptionEnum.RESET_CATEGORIES)}
          >
            Resetuj wybrane kategorie
          </Button>
          <Divider sx={{ marginBottom: 4, marginTop: 4 }} />
          <Button
            fullWidth
            sx={{ marginBottom: 1 }}
            variant="outlined"
            color="error"
            onClick={() => setChangeOption(ChangeOptionEnum.DELETE_ACCOUNT)}
          >
            Usuń konto
          </Button>
        </Paper>
      </Grid>

      <Grid size={9}>
        <Paper sx={{ padding: 3 }}>{renderComponent()}</Paper>
      </Grid>
    </Grid>
  );
};

export default NKSettings;
