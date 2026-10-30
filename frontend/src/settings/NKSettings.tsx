import { ReactNode } from "react";
import { Alert, Avatar, Box, Button, Chip, Skeleton, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { clearSession } from "../auth/session";
import { useCurrentUser } from "../auth/useCurrentUser";
import { AppLanguage, normalizeLanguage } from "../i18n/i18n";
import { useDialog } from "../lib/dialog/useDialog";
import { ThemeMode } from "../theme/colorModeContext";
import { useColorMode } from "../theme/useColorMode";
import { SettingRow, SettingsCard } from "./components/SettingsCard";
import ConfirmAccountForm, { AccountAction } from "./forms/ConfirmAccountForm";
import CredentialForm, { CredentialKind } from "./forms/CredentialForm";
import ResetCategoriesForm from "./forms/ResetCategoriesForm";

const LANGUAGES: AppLanguage[] = ["pl", "en"];

const NKSettings = () => {
  const { t, i18n } = useTranslation("settings");
  const language = normalizeLanguage(i18n.language);
  const user = useCurrentUser();
  const { mode, setMode } = useColorMode();
  const { openDialog, closeDialog } = useDialog();
  const navigate = useNavigate();
  // The backend refuses these on the shared demo accounts; the buttons say so up front.
  const demo = Boolean(user?.isDemo);

  const initials = `${user?.name?.[0] ?? ""}${user?.surname?.[0] ?? ""}`.toUpperCase() || "?";
  const value = (text?: string) => (user ? text || "-" : <Skeleton width={140} />);

  const openCredential = (kind: CredentialKind) => {
    const formId = `credential-${kind}-form`;
    openDialog(
      {
        title: t(`credentials.${kind}.title`),
        saveButtonTitle: t("common.save"),
        cancelButtonTitle: t("common.cancel"),
        formId,
      },
      <CredentialForm
        kind={kind}
        formId={formId}
        onSuccess={closeDialog}
      />,
    );
  };

  const openAccountAction = (action: AccountAction) => {
    const formId = `${action}-form`;
    openDialog(
      {
        title: t(`${action}.dialogTitle`),
        saveButtonTitle: t(`${action}.confirm`),
        cancelButtonTitle: t("common.cancel"),
        formId,
        destructive: true,
      },
      <ConfirmAccountForm
        action={action}
        formId={formId}
        onSuccess={() => {
          closeDialog();
          if (action === "deleteAccount") {
            clearSession();
            navigate("/login", { replace: true });
          }
        }}
      />,
    );
  };

  const openResetCategories = () => {
    const formId = "reset-categories-form";
    openDialog(
      {
        title: t("resetCategories.dialogTitle"),
        saveButtonTitle: t("resetCategories.confirm"),
        cancelButtonTitle: t("common.cancel"),
        formId,
        destructive: true,
      },
      <ResetCategoriesForm
        formId={formId}
        onSuccess={closeDialog}
      />,
    );
  };

  const changeButton = (kind: CredentialKind): ReactNode => (
    <Button
      variant="outlined"
      color="inherit"
      size="small"
      disabled={demo}
      aria-label={t(`credentials.${kind}.title`)}
      onClick={() => openCredential(kind)}
      sx={{ borderColor: "divider" }}>
      {t("common.change")}
    </Button>
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h2">
          {t("page.heading")}
        </Typography>
        <Typography color="text.secondary">{t("page.subtitle")}</Typography>
      </Box>

      {demo && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}>
          {t("page.demoNotice")}
        </Alert>
      )}

      <Grid
        container
        spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Stack spacing={3}>
            <SettingsCard
              title={t("profile.title")}
              subtitle={t("profile.subtitle")}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ py: 2 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 700 }}>
                  {initials}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    useFlexGap
                    flexWrap="wrap">
                    <Typography
                      variant="h6"
                      component="p">
                      {user ? `${user.name ?? ""} ${user.surname ?? ""}`.trim() : <Skeleton width={180} />}
                    </Typography>
                    {demo && (
                      <Chip
                        size="small"
                        color="primary"
                        variant="outlined"
                        label={t("profile.demo")}
                      />
                    )}
                  </Stack>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ overflowWrap: "anywhere" }}>
                    {user ? user.email : <Skeleton width={200} />}
                  </Typography>
                </Box>
              </Stack>
              <SettingRow
                icon={<BadgeOutlinedIcon />}
                title={t("profile.login")}
                description={value(user?.username)}
                action={changeButton("login")}
              />
              <SettingRow
                icon={<AlternateEmailRoundedIcon />}
                title={t("profile.email")}
                description={value(user?.email)}
                action={changeButton("email")}
              />
              <SettingRow
                icon={<LockOutlinedIcon />}
                title={t("profile.password")}
                description={t("profile.passwordHint")}
                action={changeButton("password")}
              />
              <SettingRow
                icon={<PhoneOutlinedIcon />}
                title={t("profile.phone")}
                description={value(user?.phoneNumber)}
              />
            </SettingsCard>

            <SettingsCard
              title={t("data.title")}
              subtitle={t("data.subtitle")}>
              <SettingRow
                icon={<DeleteSweepOutlinedIcon />}
                tone="warning"
                title={t("resetCategories.title")}
                description={t("resetCategories.description")}
                action={
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    onClick={openResetCategories}
                    sx={{ borderColor: "divider" }}>
                    {t("resetCategories.button")}
                  </Button>
                }
              />
              <SettingRow
                icon={<RestartAltRoundedIcon />}
                tone="warning"
                title={t("resetData.title")}
                description={t("resetData.description")}
                action={
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    disabled={demo}
                    onClick={() => openAccountAction("resetData")}
                    sx={{ borderColor: "divider" }}>
                    {t("resetData.button")}
                  </Button>
                }
              />
            </SettingsCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={3}>
            <SettingsCard
              title={t("appearance.title")}
              subtitle={t("appearance.subtitle")}>
              <SettingRow
                icon={<PaletteOutlinedIcon />}
                title={t("appearance.theme")}
                action={
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={mode}
                    aria-label={t("appearance.theme")}
                    onChange={(_event, next: ThemeMode | null) => next && setMode(next)}>
                    <ToggleButton
                      value="light"
                      sx={{ gap: 0.75, px: 1.5 }}>
                      <LightModeOutlinedIcon sx={{ fontSize: 18 }} />
                      {t("appearance.light")}
                    </ToggleButton>
                    <ToggleButton
                      value="dark"
                      sx={{ gap: 0.75, px: 1.5 }}>
                      <DarkModeOutlinedIcon sx={{ fontSize: 18 }} />
                      {t("appearance.dark")}
                    </ToggleButton>
                  </ToggleButtonGroup>
                }
              />
              <SettingRow
                icon={<TranslateRoundedIcon />}
                title={t("appearance.language")}
                action={
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={language}
                    aria-label={t("appearance.language")}
                    onChange={(_event, next: AppLanguage | null) => next && void i18n.changeLanguage(next)}>
                    {LANGUAGES.map(lang => (
                      <ToggleButton
                        key={lang}
                        value={lang}
                        sx={{ px: 1.5 }}>
                        {t(`appearance.languages.${lang}`)}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                }
              />
            </SettingsCard>

            <SettingsCard
              title={t("limits.title")}
              footer={
                <Button
                  component={RouterLink}
                  to="/categories"
                  variant="outlined"
                  size="small">
                  {t("limits.button")}
                </Button>
              }>
              <SettingRow
                icon={<AccountBalanceWalletOutlinedIcon />}
                title={t("limits.where")}
                description={t("limits.description")}
              />
            </SettingsCard>

            <SettingsCard
              title={t("deleteAccount.title")}
              danger
              footer={
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  disabled={demo}
                  onClick={() => openAccountAction("deleteAccount")}>
                  {t("deleteAccount.button")}
                </Button>
              }>
              <SettingRow
                icon={<DeleteForeverOutlinedIcon />}
                tone="error"
                title={t("deleteAccount.subtitle")}
                description={t("deleteAccount.description")}
              />
            </SettingsCard>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NKSettings;
