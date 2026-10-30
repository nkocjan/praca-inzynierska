import { ReactNode } from "react";
import { Box, Card, LinearProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { BudgetTone } from "../../../../lib/budgetStatus";

interface StatCardProps {
  label: string;
  value: string;
  caption: string;
  icon: ReactNode;
  tone?: BudgetTone;
  progress?: number;
  progressLabel?: string;
  overLabel?: string;
}

const StatCard = ({ label, value, caption, icon, tone = "primary", progress, progressLabel, overLabel }: StatCardProps) => (
  <Card sx={{ height: "100%", p: 2.5 }}>
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center">
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
      <Box
        aria-hidden
        sx={theme => ({
          width: 36,
          height: 36,
          borderRadius: "10px",
          display: "grid",
          placeItems: "center",
          color: `${tone}.main`,
          backgroundColor: alpha(theme.palette[tone].main, 0.12),
          "& svg": { fontSize: 20 },
        })}>
        {icon}
      </Box>
    </Stack>
    <Typography
      variant="h4"
      component="p"
      sx={{ mt: 1.5, fontSize: { xs: "1.6rem", xl: "1.85rem" } }}>
      {value}
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary">
      {caption}
    </Typography>
    {progress !== undefined && (
      <Box sx={{ mt: 2 }}>
        <LinearProgress
          variant="determinate"
          color={tone}
          value={Math.min(progress, 100)}
          aria-label={progressLabel}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary">
            {progressLabel}
          </Typography>
          {tone === "error" && overLabel && (
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ color: "error.main" }}>
              <ErrorOutlineRoundedIcon sx={{ fontSize: 16 }} />
              <Typography
                variant="caption"
                sx={{ fontWeight: 600 }}>
                {overLabel}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Box>
    )}
  </Card>
);

export default StatCard;
