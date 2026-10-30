import { ReactNode } from "react";
import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface SettingsCardProps {
  title: string;
  subtitle?: string;
  danger?: boolean;
  children: ReactNode;
  // A main button below the rows, without a divider above it.
  footer?: ReactNode;
}

// A settings section; the dangerous one (deleting the account) gets a red outline.
export const SettingsCard = ({ title, subtitle, danger = false, children, footer }: SettingsCardProps) => (
  <Card
    sx={theme => ({
      ...(danger && { borderColor: alpha(theme.palette.error.main, theme.palette.mode === "light" ? 0.4 : 0.5) }),
    })}>
    <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2.5, pb: 1.5 }}>
      <Typography
        variant="subtitle1"
        component="h3"
        sx={{ color: danger ? "error.main" : undefined }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body2"
          color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
    <Stack
      divider={<Divider flexItem />}
      sx={{ px: { xs: 2, sm: 3 }, pb: footer ? 0 : 1 }}>
      {children}
    </Stack>
    {/* Indented past the row icon, so the button lines up with the row text. */}
    {footer && <Box sx={{ px: { xs: 2, sm: 3 }, pt: 0.5, pb: 2.5, "& > *": { ml: 6 } }}>{footer}</Box>}
  </Card>
);

interface SettingRowProps {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  tone?: "primary" | "warning" | "error";
}

// Icon, what the setting is (with its current value), and the control or button that changes it.
export const SettingRow = ({ icon, title, description, action, tone = "primary" }: SettingRowProps) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    alignItems={{ xs: "stretch", sm: "center" }}
    spacing={{ xs: 1.5, sm: 2 }}
    sx={{ py: 1.75 }}>
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ flexGrow: 1, minWidth: 0 }}>
      <Box
        aria-hidden
        sx={theme => ({
          width: 36,
          height: 36,
          flexShrink: 0,
          borderRadius: "10px",
          display: "grid",
          placeItems: "center",
          color: `${tone}.main`,
          backgroundColor: alpha(theme.palette[tone].main, 0.12),
          "& svg": { fontSize: 20 },
        })}>
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            component="div"
            sx={{ overflowWrap: "anywhere" }}>
            {description}
          </Typography>
        )}
      </Box>
    </Stack>
    {action && <Box sx={{ flexShrink: 0, alignSelf: { xs: "flex-start", sm: "center" }, pl: { xs: 6, sm: 0 } }}>{action}</Box>}
  </Stack>
);
