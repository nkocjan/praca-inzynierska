import { Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";

interface BrandLogoProps {
  inverted?: boolean;
}

const BrandLogo = ({ inverted = false }: BrandLogoProps) => {
  const { t } = useTranslation("common");

  return (
    <Stack
      direction="row"
      spacing={1.25}
      alignItems="center">
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "11px",
          display: "grid",
          placeItems: "center",
          color: inverted ? "primary.main" : "#ffffff",
          background: inverted
            ? "#ffffff"
            : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        }}>
        <AccountBalanceWalletRoundedIcon sx={{ fontSize: 22 }} />
      </Box>
      <Typography
        variant="h6"
        component="span"
        sx={{ fontWeight: 700, letterSpacing: "-0.01em", color: inverted ? "#ffffff" : "text.primary" }}>
        {t("appName")}
      </Typography>
    </Stack>
  );
};

export default BrandLogo;
