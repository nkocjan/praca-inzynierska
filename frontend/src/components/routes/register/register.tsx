import { NKTextInput } from "../../../lib/Input/TextInput.tsx";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { NKButton } from "../../../lib/button/Button.tsx";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const NKRegister = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Normalize CSS and apply dark theme */}
      <Grid container spacing={6} size={12}>
        <Grid
          container
          size={12}
          direction="column"
          sx={{
            alignItems: "center",
            minWidth: "100vh",
            marginTop: "2rem",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Utwórz nowe konto
          </Typography>
          <Grid size={5}>
            <NKTextInput
              label={"Login"}
              tooltip={"Login musi zawierać minimum 3 znaki"}
            ></NKTextInput>
          </Grid>
          <Grid size={5}>
            <NKTextInput
              label={"Hasło"}
              tooltip={
                "Hasło musi zawierać minimum 8 znaków, jedną cyfrę i jedną dużą literę"
              }
            ></NKTextInput>
          </Grid>
          <Grid size={5}>
            <NKTextInput
              label={"Powtórz hasło"}
              tooltip={"Hasła muszą być identyczne"}
            ></NKTextInput>
          </Grid>
          <Grid size={5}>
            <NKTextInput label={"Email"}></NKTextInput>
          </Grid>
          <Grid size={5}>
            <NKTextInput label={"Powtórz email"}></NKTextInput>
          </Grid>
          <Grid size={5}>
            <NKButton title={"Zarejestruj się"}></NKButton>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default NKRegister;
