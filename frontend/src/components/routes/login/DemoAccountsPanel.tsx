import { Avatar, Box, ButtonBase, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useTranslation } from "react-i18next";

// Keep in sync with db/sql/demo-data.sql (accounts are recreated by db/reset-demo-data.sh).
// Titles and descriptions live in the "auth" translations under demo.accounts.<username>.
export const DEMO_PASSWORD = "demo1234";
const DEMO_ACCOUNTS = [
  { username: "demo", initials: "AK" },
  { username: "student", initials: "JN" },
  { username: "rodzina", initials: "KW" },
];

interface Props {
  disabled: boolean;
  onLogin: (username: string, password: string) => void;
}

const DemoAccountsPanel = ({ disabled, onLogin }: Props) => {
  const { t } = useTranslation("auth");

  return (
    <Box
      component="section"
      aria-label={t("demo.heading")}>
      <Stack spacing={1.25}>
        {DEMO_ACCOUNTS.map(account => (
          <ButtonBase
            key={account.username}
            disabled={disabled}
            aria-label={t("demo.loginAs", { username: account.username })}
            onClick={() => onLogin(account.username, DEMO_PASSWORD)}
            sx={theme => ({
              justifyContent: "flex-start",
              textAlign: "left",
              gap: 1.5,
              p: 1.5,
              borderRadius: "14px",
              border: 1,
              borderColor: "divider",
              backgroundColor: "background.paper",
              transition: theme.transitions.create(["border-color", "background-color"]),
              "&:hover, &.Mui-focusVisible": {
                borderColor: "primary.main",
                backgroundColor: alpha(theme.palette.primary.main, 0.06),
              },
              "&:hover .demo-arrow, &.Mui-focusVisible .demo-arrow": {
                color: "primary.main",
                transform: "translateX(2px)",
              },
            })}>
            <Avatar
              sx={theme => ({
                width: 40,
                height: 40,
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "primary.main",
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
              })}>
              {account.initials}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle2">{t(`demo.accounts.${account.username}.title`)}</Typography>
              <Typography
                variant="body2"
                color="text.secondary">
                {t(`demo.accounts.${account.username}.description`)}
              </Typography>
            </Box>
            <ArrowForwardRoundedIcon
              className="demo-arrow"
              sx={{ color: "text.secondary", transition: "transform 150ms, color 150ms" }}
            />
          </ButtonBase>
        ))}
      </Stack>
      <Typography
        variant="caption"
        color="text.secondary"
        component="p"
        sx={{ mt: 1.5, textAlign: "center" }}>
        {t("demo.noticeShort", { password: DEMO_PASSWORD })}
      </Typography>
    </Box>
  );
};

export default DemoAccountsPanel;
