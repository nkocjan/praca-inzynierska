import { Box, Button, Card, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useLocation } from "react-router-dom";

const NKNotFound = () => {
  const { t } = useTranslation("common");
  const { pathname } = useLocation();

  return (
    <Card
      sx={{
        maxWidth: 560,
        mx: "auto",
        mt: { xs: 2, md: 8 },
        p: { xs: 3, sm: 5 },
        textAlign: "center",
      }}>
      <Box
        aria-hidden
        sx={theme => ({
          width: 64,
          height: 64,
          mx: "auto",
          mb: 2,
          borderRadius: "18px",
          display: "grid",
          placeItems: "center",
          color: "primary.main",
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          "& svg": { fontSize: 32 },
        })}>
        <SearchOffRoundedIcon />
      </Box>
      <Typography
        variant="overline"
        color="text.secondary">
        {t("notFound.code")}
      </Typography>
      <Typography
        variant="h4"
        component="h2"
        sx={{ mb: 1 }}>
        {t("notFound.title")}
      </Typography>
      <Box
        component="code"
        sx={{
          display: "inline-block",
          maxWidth: "100%",
          mb: 2,
          px: 1,
          py: 0.25,
          borderRadius: 1,
          bgcolor: "action.hover",
          fontSize: "0.875rem",
          overflowWrap: "anywhere",
        }}>
        {pathname}
      </Box>
      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}>
        {t("notFound.text")}
      </Typography>
      <Button
        component={RouterLink}
        to="/"
        variant="contained">
        {t("notFound.home")}
      </Button>
    </Card>
  );
};

export default NKNotFound;
