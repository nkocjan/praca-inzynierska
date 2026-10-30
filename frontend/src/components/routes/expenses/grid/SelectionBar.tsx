import { Button, Fade, Paper, Typography } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useTranslation } from "react-i18next";
import { DRAWER_WIDTH } from "../../../../layout/navigation";

interface SelectionBarProps {
  count: number;
  onClear: () => void;
  onDelete: () => void;
}

// Floats over the list while rows are selected, so the filters above do not jump.
const SelectionBar = ({ count, onClear, onDelete }: SelectionBarProps) => {
  const { t } = useTranslation("expenses");

  return (
    <Fade
      in={count > 0}
      unmountOnExit>
      <Paper
        role="region"
        aria-label={t("selection.label")}
        variant="outlined"
        sx={theme => ({
          position: "fixed",
          zIndex: theme.zIndex.appBar,
          bottom: 24,
          left: { xs: 16, md: `calc(50% + ${DRAWER_WIDTH / 2}px)` },
          right: { xs: 16, md: "auto" },
          transform: { md: "translateX(-50%)" },
          display: "flex",
          alignItems: "center",
          gap: 1,
          pl: 2.5,
          pr: 1,
          py: 1,
          borderRadius: "14px",
          boxShadow: theme.palette.mode === "light" ? "0 12px 32px rgba(15, 23, 42, 0.18)" : "0 12px 32px rgba(0, 0, 0, 0.5)",
        })}>
        <Typography
          variant="body2"
          aria-live="polite"
          sx={{ fontWeight: 600, flexGrow: 1, mr: { md: 2 }, whiteSpace: "nowrap" }}>
          {t("selection.selected", { count })}
        </Typography>
        <Button
          color="inherit"
          onClick={onClear}>
          {t("selection.clear")}
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteOutlineRoundedIcon />}
          onClick={onDelete}>
          {t("selection.delete")}
        </Button>
      </Paper>
    </Fade>
  );
};

export default SelectionBar;
