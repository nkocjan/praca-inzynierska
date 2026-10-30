import { ReactNode } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

// Extra props of the grids' noRowsOverlay slot: whether filters hide the rows, and how to clear them.
declare module "@mui/x-data-grid" {
  interface NoRowsOverlayPropsOverrides {
    filtered?: boolean;
    onReset?: () => void;
  }
}

interface GridEmptyStateProps {
  icon: ReactNode;
  title: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

const GridEmptyState = ({ icon, title, text, actionLabel, onAction }: GridEmptyStateProps) => (
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
      {icon}
    </Box>
    <Typography
      variant="subtitle1"
      component="p">
      {title}
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary">
      {text}
    </Typography>
    {actionLabel && onAction && (
      <Button
        onClick={onAction}
        sx={{ mt: 1 }}>
        {actionLabel}
      </Button>
    )}
  </Stack>
);

export default GridEmptyState;
