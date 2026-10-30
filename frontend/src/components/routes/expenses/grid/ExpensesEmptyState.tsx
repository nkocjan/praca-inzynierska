import { Box, Button, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { GridSlotProps } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

declare module "@mui/x-data-grid" {
  interface NoRowsOverlayPropsOverrides {
    filtered?: boolean;
    onReset?: () => void;
  }
}

const ExpensesEmptyState = ({ filtered, onReset }: GridSlotProps["noRowsOverlay"]) => {
  const { t } = useTranslation("expenses");

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1}
      sx={{ height: "100%", p: 4, textAlign: "center" }}>
      <Box
        aria-hidden
        sx={theme => ({
          width: 56,
          height: 56,
          mb: 1,
          borderRadius: "16px",
          display: "grid",
          placeItems: "center",
          color: "primary.main",
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
        })}>
        <ReceiptLongOutlinedIcon />
      </Box>
      <Typography
        variant="subtitle1"
        component="p">
        {t("empty.title")}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary">
        {filtered ? t("empty.filtered") : t("empty.none")}
      </Typography>
      {filtered && onReset && (
        <Button
          onClick={onReset}
          sx={{ mt: 1 }}>
          {t("filters.clear")}
        </Button>
      )}
    </Stack>
  );
};

export default ExpensesEmptyState;
