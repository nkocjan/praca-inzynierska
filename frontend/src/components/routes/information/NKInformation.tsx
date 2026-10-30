import { ReactNode } from "react";
import { Box, Button, Card, Chip, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { alpha } from "@mui/material/styles";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

const STEPS: { key: string; icon: ReactNode; to?: string }[] = [
  { key: "account", icon: <PersonAddAltOutlinedIcon /> },
  { key: "categories", icon: <CategoryOutlinedIcon />, to: "/categories" },
  { key: "expenses", icon: <ReceiptLongOutlinedIcon />, to: "/expenses" },
  { key: "budgets", icon: <AccountBalanceWalletOutlinedIcon />, to: "/budget" },
  { key: "dashboard", icon: <SpaceDashboardOutlinedIcon />, to: "/" },
  { key: "settings", icon: <SettingsOutlinedIcon />, to: "/settings" },
];

const SERVICES = [
  { key: "userService", databases: ["userdb"] },
  { key: "budgetService", databases: ["budgetdb"] },
  { key: "expenseService", databases: ["expenseA", "expenseB"] },
];

const TECHNOLOGIES: Record<string, string[]> = {
  frontend: ["react", "mui", "forms", "charts", "i18n", "vite"],
  backend: ["spring", "security", "jpa", "feign", "mapstruct", "openapi"],
  infra: ["postgres", "sharding", "fdw", "docker", "deploy"],
};

const Section = ({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) => (
  <Box
    component="section"
    sx={{ mt: 5 }}>
    <Typography
      variant="h6"
      component="h3">
      {title}
    </Typography>
    <Typography
      color="text.secondary"
      sx={{ mb: 2.5 }}>
      {subtitle}
    </Typography>
    {children}
  </Box>
);

const IconTile = ({ children }: { children: ReactNode }) => (
  <Box
    aria-hidden
    sx={theme => ({
      width: 40,
      height: 40,
      flexShrink: 0,
      borderRadius: "12px",
      display: "grid",
      placeItems: "center",
      color: "primary.main",
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      "& svg": { fontSize: 22 },
    })}>
    {children}
  </Box>
);

// One box of the architecture diagram: a part of the system with what it is built with.
const Node = ({ title, caption, children }: { title: string; caption: string; children?: ReactNode }) => (
  <Card sx={{ p: 2, height: "100%", boxShadow: "none" }}>
    <Typography
      variant="subtitle2"
      component="p">
      {title}
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary">
      {caption}
    </Typography>
    {children}
  </Card>
);

const Arrow = () => (
  <Box
    aria-hidden
    sx={{ display: "flex", justifyContent: "center", color: "text.secondary", py: 0.5 }}>
    <ArrowDownwardRoundedIcon fontSize="small" />
  </Box>
);

const NKInformation = () => {
  const { t } = useTranslation("information");

  return (
    <Box>
      <Typography
        variant="h4"
        component="h2">
        {t("page.heading")}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ maxWidth: 760 }}>
        {t("page.subtitle")}
      </Typography>

      <Section
        title={t("steps.title")}
        subtitle={t("steps.subtitle")}>
        <Grid
          container
          spacing={2}>
          {STEPS.map((step, index) => (
            <Grid
              key={step.key}
              size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column" }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ mb: 1.5 }}>
                  <IconTile>{step.icon}</IconTile>
                  <Typography
                    variant="overline"
                    color="text.secondary">
                    {t("steps.step", { number: index + 1 })}
                  </Typography>
                </Stack>
                <Typography
                  variant="subtitle1"
                  component="h4">
                  {t(`steps.items.${step.key}.title`)}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ flexGrow: 1 }}>
                  {t(`steps.items.${step.key}.text`)}
                </Typography>
                {step.to && (
                  <Box sx={{ mt: 1.5 }}>
                    <Button
                      component={RouterLink}
                      to={step.to}
                      size="small"
                      endIcon={<ChevronRightRoundedIcon />}
                      sx={{ ml: -1 }}>
                      {t(`steps.items.${step.key}.link`)}
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Section>

      <Section
        title={t("architecture.title")}
        subtitle={t("architecture.subtitle")}>
        <Grid
          container
          spacing={3}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                role="img"
                aria-label={t("architecture.diagramLabel")}>
                <Node
                  title={t("architecture.nodes.frontend.title")}
                  caption={t("architecture.nodes.frontend.caption")}
                />
                <Arrow />
                <Node
                  title={t("architecture.nodes.bff.title")}
                  caption={t("architecture.nodes.bff.caption")}
                />
                <Arrow />
                <Grid
                  container
                  spacing={1.5}>
                  {SERVICES.map(service => (
                    <Grid
                      key={service.key}
                      size={{ xs: 12, sm: 4 }}>
                      <Node
                        title={t(`architecture.nodes.${service.key}.title`)}
                        caption={t(`architecture.nodes.${service.key}.caption`)}>
                        <Stack
                          direction="row"
                          useFlexGap
                          flexWrap="wrap"
                          spacing={0.75}
                          sx={{ mt: 1.25 }}>
                          {service.databases.map(database => (
                            <Chip
                              key={database}
                              size="small"
                              variant="outlined"
                              label={t(`architecture.databases.${database}`)}
                              sx={{ fontWeight: 500 }}
                            />
                          ))}
                        </Stack>
                      </Node>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <Stack spacing={2}>
              {["gateway", "data", "security"].map(point => (
                <Card
                  key={point}
                  sx={{ p: 2.5 }}>
                  <Typography
                    variant="subtitle2"
                    component="h4">
                    {t(`architecture.points.${point}.title`)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary">
                    {t(`architecture.points.${point}.text`)}
                  </Typography>
                </Card>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Section>

      <Section
        title={t("technologies.title")}
        subtitle={t("technologies.subtitle")}>
        <Grid
          container
          spacing={3}>
          {Object.entries(TECHNOLOGIES).map(([group, items]) => (
            <Grid
              key={group}
              size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 2.5, height: "100%" }}>
                <Typography
                  variant="subtitle1"
                  component="h4"
                  sx={{ mb: 1.5 }}>
                  {t(`technologies.groups.${group}`)}
                </Typography>
                <Stack spacing={1.5}>
                  {items.map(item => (
                    <Box key={item}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600 }}>
                        {t(`technologies.items.${item}.name`)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary">
                        {t(`technologies.items.${item}.text`)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Section>
    </Box>
  );
};

export default NKInformation;
