import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

// Keep in sync with db/sql/demo-data.sql (accounts are recreated by db/reset-demo-data.sh).
// Titles and descriptions live in the "auth" translations under demo.accounts.<username>.
export const DEMO_PASSWORD = "demo1234";
const DEMO_USERNAMES = ["demo", "student", "rodzina"];

interface Props {
  disabled: boolean;
  onLogin: (username: string, password: string) => void;
}

const DemoAccountsPanel = ({ disabled, onLogin }: Props) => {
  const { t } = useTranslation("auth");

  return (
    <Paper
      component="section"
      aria-labelledby="demo-heading"
      variant="outlined"
      sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Box>
          <Chip
            label={t("demo.badge")}
            color="info"
            size="small"
            sx={{ mb: 1 }}
          />
          <Typography
            id="demo-heading"
            variant="h6"
            component="h2">
            {t("demo.heading")}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary">
            {t("demo.intro")}
          </Typography>
        </Box>

        <Stack
          spacing={1.5}
          divider={<Divider flexItem />}>
          {DEMO_USERNAMES.map(username => (
            <Stack
              key={username}
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2">
                  {t(`demo.accounts.${username}.title`)}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary">
                  {t(`demo.accounts.${username}.description`)}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary">
                  {t("demo.loginLabel")}: <strong>{username}</strong>
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                disabled={disabled}
                aria-label={t("demo.loginAs", { username })}
                onClick={() => onLogin(username, DEMO_PASSWORD)}
                sx={{ flexShrink: 0 }}>
                {t("demo.loginButton")}
              </Button>
            </Stack>
          ))}
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary">
          {t("demo.password")} <strong>{DEMO_PASSWORD}</strong>.{" "}
          {t("demo.notice")}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default DemoAccountsPanel;
