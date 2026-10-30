import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppBar, Box, Drawer, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslation } from "react-i18next";
import Navbar from "./navbar/Navbar.tsx";
import NKDarkLightSwitch from "./navbar/dark-light-switch/NKDarkLightSwitch.tsx";
import NKLanguageSelect from "./navbar/language-select/NKLanguageSelect.tsx";
import { DRAWER_WIDTH, findNavItem } from "./navigation.tsx";

const NKLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation("nav");
  const { pathname } = useLocation();
  const current = findNavItem(pathname);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{ width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { md: `${DRAWER_WIDTH}px` } }}>
        <Toolbar sx={{ gap: 1.5 }}>
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(true)}
            aria-label={t("openMenu")}
            sx={{ display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="h1"
            noWrap
            sx={{ flexGrow: 1, fontSize: "1.05rem" }}>
            {current ? t(current.labelKey) : ""}
          </Typography>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center">
            <NKLanguageSelect />
            <NKDarkLightSwitch />
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        component="aside"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}>
          <Navbar onNavigate={() => setMobileOpen(false)} />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}>
          <Navbar />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, minWidth: 0, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1480, mx: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default NKLayout;
