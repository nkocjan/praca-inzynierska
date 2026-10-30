import { ReactNode } from "react";
import { Box, InputAdornment } from "@mui/material";

export const Dot = ({ color }: { color: string }) => (
  <Box
    aria-hidden
    sx={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, backgroundColor: color }}
  />
);

export const FilterAdornment = ({ children }: { children: ReactNode }) => (
  <InputAdornment
    position="start"
    sx={{ color: "text.secondary", "& svg": { fontSize: 20 } }}>
    {children}
  </InputAdornment>
);
