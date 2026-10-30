import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";

// The category's first letter on a tile tinted with its colour: the row icon in every list.
const CategoryAvatar = ({ name, color }: { name?: string; color: string }) => (
  <Box
    aria-hidden
    sx={{
      width: 36,
      height: 36,
      flexShrink: 0,
      borderRadius: "10px",
      display: "grid",
      placeItems: "center",
      fontWeight: 700,
      fontSize: "0.85rem",
      lineHeight: 1,
      color: "text.primary",
      backgroundColor: alpha(color, 0.2),
    }}>
    {name?.[0] ?? "?"}
  </Box>
);

export default CategoryAvatar;
