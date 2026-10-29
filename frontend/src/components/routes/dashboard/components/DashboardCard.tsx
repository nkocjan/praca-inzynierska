import { ReactNode } from "react";
import { Box, Card, Stack, Typography } from "@mui/material";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

const DashboardCard = ({ title, subtitle, action, children }: DashboardCardProps) => (
  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
      spacing={2}
      sx={{ px: 3, pt: 2.5, pb: 1.5 }}>
      <Box>
        <Typography
          variant="subtitle1"
          component="h3">
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
      {action}
    </Stack>
    <Box sx={{ px: 3, pb: 3, flexGrow: 1 }}>{children}</Box>
  </Card>
);

export default DashboardCard;
