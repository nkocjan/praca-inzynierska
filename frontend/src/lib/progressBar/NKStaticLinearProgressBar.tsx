import { Box, LinearProgress, Typography } from "@mui/material";
import i18n, { normalizeLanguage } from "../../i18n/i18n";
import { formatCurrencyPLN } from "../../i18n/locale";

const NKStaticLinearProgressBar = ({
  value,
  maxValue,
}: {
  value: number;
  maxValue: number;
}) => {
  const percent = (value * 100) / maxValue;
  const progressValue = Math.min(percent, 100);
  const language = normalizeLanguage(i18n.language);

  return (
    <Box sx={{ position: "relative", width: "80%", textAlign: "center" }}>
      <LinearProgress
        variant="determinate"
        value={progressValue}
        sx={{
          marginTop: "10%",
          height: 10,
          borderRadius: 5,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 5,
            backgroundColor:
              percent > 100
                ? "#ff4c4c"
                : `rgba(77, 166, 255, ${0.3 + (percent / 100) * 0.7})`,
          },
        }}
      />
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          width: "100%",
          left: "50%",
          transform: "translate(-50%, -0%)",
          fontWeight: "bold",
          fontSize: "smaller",
          color: "rgba(255,255,255,1.0)",
          textShadow: "0px 0px 5px rgba(0,0,0,0.7)",
        }}>
        {formatCurrencyPLN(value, language)} /{" "}
        {formatCurrencyPLN(maxValue, language)}
      </Typography>
    </Box>
  );
};

export default NKStaticLinearProgressBar;
