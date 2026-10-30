import { IconButton, Tooltip } from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useTranslation } from "react-i18next";
import { useColorMode } from "../../../theme/useColorMode";

const NKDarkLightSwitch = () => {
  const { mode, toggleMode } = useColorMode();
  const { t } = useTranslation("common");
  const label = mode === "dark" ? t("theme.toLight") : t("theme.toDark");

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={toggleMode}
        aria-label={label}
        sx={{ border: 1, borderColor: "divider" }}>
        {mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default NKDarkLightSwitch;
