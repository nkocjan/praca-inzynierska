import {
  Avatar,
  Box,
  Chip,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { NavLink, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { NAV_SECTIONS } from "../navigation.tsx";
import { useCurrentUser } from "../../auth/useCurrentUser.ts";
import { clearSession } from "../../auth/session.ts";
import BrandLogo from "../BrandLogo.tsx";

interface NavbarProps {
  onNavigate?: () => void;
}

// Sidebar content: brand, navigation and the signed-in user.
export default function Navbar({ onNavigate }: NavbarProps) {
  const { t } = useTranslation("nav");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useCurrentUser();

  const handleLogout = () => {
    clearSession();
    enqueueSnackbar(t("snackbar.logoutSuccess"), { variant: "success" });
    navigate("/login", { replace: true });
  };

  const initials = `${user?.name?.[0] ?? ""}${user?.surname?.[0] ?? ""}`;

  return (
    <Stack sx={{ height: "100%", px: 2, py: 2.5 }}>
      <Box sx={{ px: 1, mb: 3 }}>
        <BrandLogo />
      </Box>

      <Box
        component="nav"
        sx={{ flexGrow: 1 }}>
        {NAV_SECTIONS.map(section => (
          <Box
            key={section.titleKey}
            sx={{ mb: 2 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ px: 1.5, fontSize: "0.7rem" }}>
              {t(section.titleKey)}
            </Typography>
            <List
              dense
              disablePadding>
              {section.items.map(item => (
                <ListItemButton
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  end
                  onClick={onNavigate}
                  sx={theme => ({
                    mb: 0.5,
                    py: 1,
                    color: "text.secondary",
                    "& .MuiListItemIcon-root": { color: "inherit", minWidth: 36 },
                    "&:hover": { color: "text.primary" },
                    "&.active": {
                      color: "primary.main",
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      "& .MuiListItemText-primary": { fontWeight: 650 },
                    },
                  })}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={t(item.labelKey)}
                    primaryTypographyProps={{ fontSize: "0.92rem", fontWeight: 500 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          p: 1.5,
          borderRadius: "14px",
          border: 1,
          borderColor: "divider",
        }}>
        <Avatar
          sx={{ width: 38, height: 38, bgcolor: "primary.main", color: "primary.contrastText", fontSize: "0.9rem", fontWeight: 700 }}>
          {initials || "?"}
        </Avatar>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography
            variant="subtitle2"
            noWrap>
            {user ? `${user.name} ${user.surname}` : " "}
          </Typography>
          {user?.isDemo ? (
            <Chip
              label={t("demoAccount")}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.68rem" }}
            />
          ) : (
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              component="div">
              {user?.username}
            </Typography>
          )}
        </Box>
        <Tooltip title={t("secondary.logout")}>
          <IconButton
            onClick={handleLogout}
            aria-label={t("secondary.logout")}
            size="small">
            <LogoutOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
