import { MouseEvent, SyntheticEvent, useState } from "react";
import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { useTranslation } from "react-i18next";
import { CATEGORY_PERIODS, CategoryPeriod } from "../categoryFilters";

interface PeriodHeaderMenuProps {
  value: CategoryPeriod;
  onChange: (period: CategoryPeriod) => void;
}

// The grid header sorts on click and on Enter; events from this menu must not reach it.
const stop = (event: SyntheticEvent) => event.stopPropagation();

// On phones only one period column fits, so its header picks which one is shown.
const PeriodHeaderMenu = ({ value, onChange }: PeriodHeaderMenuProps) => {
  const { t } = useTranslation("categories");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const choose = (period: CategoryPeriod) => {
    onChange(period);
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        size="small"
        color="inherit"
        endIcon={<ExpandMoreRoundedIcon />}
        aria-label={t("filters.periodMenu", { period: t(`columns.${value}`) })}
        aria-haspopup="menu"
        aria-expanded={open ? "true" : undefined}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          setAnchorEl(event.currentTarget);
        }}
        onKeyDown={stop}
        sx={{ ml: -1, px: 1, fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary", "& .MuiButton-endIcon": { ml: 0.25 } }}>
        {t(`columns.${value}`)}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        onClick={stop}
        onKeyDown={stop}
        slotProps={{ paper: { sx: { minWidth: 180, mt: 0.5 } } }}>
        {CATEGORY_PERIODS.map(period => (
          <MenuItem
            key={period}
            selected={period === value}
            onClick={() => choose(period)}>
            <ListItemIcon>{period === value && <CheckRoundedIcon fontSize="small" />}</ListItemIcon>
            <ListItemText>{t(`columns.${period}`)}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default PeriodHeaderMenu;
