import { ReactNode } from "react";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import { useTranslation } from "react-i18next";
import BrandLogo from "../../layout/BrandLogo.tsx";
import NKLanguageSelect from "../../layout/navbar/language-select/NKLanguageSelect.tsx";
import NKDarkLightSwitch from "../../layout/navbar/dark-light-switch/NKDarkLightSwitch.tsx";

const FEATURES = [
  { key: "budgets", icon: <SavingsOutlinedIcon /> },
  { key: "charts", icon: <InsightsOutlinedIcon /> },
  { key: "tech", icon: <DnsOutlinedIcon /> },
];

// Decorative only: shows what the app is about, not real data.
const PREVIEW = [
  { key: "food", value: 82 },
  { key: "transport", value: 54 },
  { key: "fun", value: 100 },
];

const BrandPanel = () => {
  const { t } = useTranslation("auth");

  return (
    <Box
      sx={{
        display: { xs: "none", lg: "flex" },
        flexDirection: "column",
        justifyContent: "space-between",
        p: 6,
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(150deg, #4338ca 0%, #6d28d9 55%, #7c3aed 100%)",
        "&::before, &::after": {
          content: "''",
          position: "absolute",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.08)",
        },
        "&::before": { width: 420, height: 420, top: -140, right: -160 },
        "&::after": { width: 300, height: 300, bottom: -120, left: -100 },
      }}>
      <Box sx={{ position: "relative" }}>
        <BrandLogo inverted />
      </Box>

      <Box sx={{ position: "relative", maxWidth: 480 }}>
        <Typography
          variant="h3"
          component="p"
          sx={{ fontSize: "2.4rem", lineHeight: 1.15, mb: 2 }}>
          {t("brand.headline")}
        </Typography>
        <Typography sx={{ opacity: 0.85, fontSize: "1.05rem", mb: 4 }}>
          {t("brand.subtitle")}
        </Typography>
        <Stack
          component="ul"
          spacing={2}
          sx={{ listStyle: "none", p: 0, m: 0 }}>
          {FEATURES.map(feature => (
            <Stack
              component="li"
              key={feature.key}
              direction="row"
              spacing={1.5}
              alignItems="center">
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.14)",
                }}>
                {feature.icon}
              </Box>
              <Typography sx={{ fontWeight: 500 }}>{t(`brand.features.${feature.key}`)}</Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      <Box
        aria-hidden
        sx={{
          position: "relative",
          maxWidth: 380,
          p: 2.5,
          borderRadius: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(8px)",
        }}>
        <Typography sx={{ fontWeight: 600, mb: 2 }}>{t("brand.preview.title")}</Typography>
        <Stack spacing={1.5}>
          {PREVIEW.map(row => (
            <Box key={row.key}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                <span>{t(`brand.preview.${row.key}`)}</span>
                <span>{row.value}%</span>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={row.value}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  "& .MuiLinearProgress-bar": { backgroundColor: row.value >= 100 ? "#fca5a5" : "#ffffff" },
                }}
              />
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

interface AuthLayoutProps {
  children: ReactNode;
  contentWidth?: number;
}

const AuthLayout = ({ children, contentWidth = 460 }: AuthLayoutProps) => {
  const { t } = useTranslation("auth");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) minmax(0, 1fr)" },
      }}>
      <BrandPanel />
      <Stack sx={{ minHeight: "100vh", px: { xs: 2, sm: 4 }, py: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}>
          <Box sx={{ display: { lg: "none" }, flexGrow: 1 }}>
            <BrandLogo />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", lg: "block" } }} />
          <NKLanguageSelect />
          <NKDarkLightSwitch />
        </Stack>
        <Box
          component="main"
          sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", py: 4 }}>
          <Box sx={{ width: "100%", maxWidth: contentWidth }}>{children}</Box>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: "center" }}>
          {t("brand.footer")}
        </Typography>
      </Stack>
    </Box>
  );
};

export default AuthLayout;
