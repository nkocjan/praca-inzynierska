import { Box, LinearProgress, Typography } from "@mui/material";
import i18n, { normalizeLanguage } from "../../i18n/i18n";
import { formatCurrencyPLN } from "../../i18n/locale";
import { toneFor, usagePercent } from "../budgetStatus";

const NKStaticLinearProgressBar = ({
  value,
  maxValue,
}: {
  value: number;
  maxValue: number;
}) => {
  const percent = usagePercent(value, maxValue);
  const language = normalizeLanguage(i18n.language);

  return (
    <Box sx={{ width: "85%", py: 1 }}>
      <LinearProgress
        variant="determinate"
        color={toneFor(percent)}
        value={Math.min(percent, 100)}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        component="p"
        sx={{ mt: 0.5, lineHeight: 1.4, fontVariantNumeric: "tabular-nums" }}>
        <Box
          component="span"
          sx={{ color: "text.primary", fontWeight: 600 }}>
          {formatCurrencyPLN(value, language, 0)}
        </Box>{" "}
        / {formatCurrencyPLN(maxValue, language, 0)}
      </Typography>
    </Box>
  );
};

export default NKStaticLinearProgressBar;
