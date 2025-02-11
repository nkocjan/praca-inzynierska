import { NKTextInput } from "../lib/Input/TextInput.tsx";
import { NKButton } from "../lib/button/Button.tsx";
import Grid from "@mui/material/Grid2";

const Login = () => (
  <Grid
    container
    justifyContent="center"
    alignItems="center"
    sx={{ minHeight: "100vh" }}
  >
    <Grid size={4}>
      <Grid container direction="column" spacing={2} alignItems="center">
        <Grid size={4} style={{ width: "100%" }}>
          <NKTextInput label="Login" required={true} />
        </Grid>
        <Grid size={4} style={{ width: "100%" }}>
          <NKTextInput label="Hasło" required={true} type="password" />
        </Grid>
        <Grid container size={4} style={{ width: "100%" }} direction="row">
          <Grid size={4}>
            <NKButton title={"Zaloguj się"} />
          </Grid>
          <Grid size={4}>
            <NKButton title={"Nie pamiętam hasła"} />
          </Grid>
          <Grid size={4}>
            <NKButton title={"Zarejestruj się"} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

export default Login;
