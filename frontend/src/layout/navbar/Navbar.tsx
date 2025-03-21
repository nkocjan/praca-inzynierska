import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import NKLogoIcon from "../../lib/icons/NKLogoIcon.tsx";
import NKExpansesIcon from "../../lib/icons/menu/NKExpansesIcon.tsx";
import NKBudgetIcon from "../../lib/icons/menu/NKBudgetIcon.tsx";
import NKCategoryIcon from "../../lib/icons/menu/NKCategoryIcon.tsx";
import NKInfoIcon from "../../lib/icons/menu/NKInfoIcon.tsx";
import NKSettingsIcon from "../../lib/icons/menu/NKSettingsIcon.tsx";
import NKLogoutIcon from "../../lib/icons/menu/NKLogoutIcon.tsx";
import NKMainIcon from "../../lib/icons/menu/NKMainIcon.tsx";
import {NavLink} from "react-router-dom";
import NKDarkLightSwitch from "./dark-light-switch/NKDarkLightSwitch.tsx";
import NKLanguageSelect from "./language-select/NKLanguageSelect.tsx";

const drawerWidth = 240;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

    const menuItems = [
        { text: "Strona główna", path: "/" },
        { text: "Wydatki", path: "/expenses" },
        { text: "Budżet", path: "/budget" },
        { text: "Kategorie", path: "/categories" },
    ];

    const secondaryItems = [
        { text: "Informacje", path: "/information" },
        { text: "Ustawienia", path: "/settings" },
        { text: "Wyloguj się", path: "/logout" },
    ];

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const getMainIcon = (id: number) => {
      switch (id) {
          case 0:
              return <NKMainIcon />
          case 1:
              return <NKExpansesIcon />
          case 2:
              return <NKBudgetIcon />
          case 3:
              return <NKCategoryIcon />
      }
  }

  const getSecondaryIcon = (id: number) => {
      switch (id) {
          case 0:
              return <NKInfoIcon />
          case 1:
              return <NKSettingsIcon />
          case 2:
              return <NKLogoutIcon />
      }
  }

  const drawer = (
    <div>
      <Toolbar />
      <Box sx={{ display: "flex", flexDirection: "column", height: "90vh" }}>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={NavLink}
                                to={item.path}
                                sx={{
                                    "&.active": {
                                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                                        fontWeight: "bold",
                                    },
                                    "& .MuiSvgIcon-root": {
                                        transition: "transform 0.3s ease-in-out",
                                    },
                                    "&:hover .MuiSvgIcon-root": {
                                        transform: "scale(1.1)",
                                    },
                                }}>
                  <ListItemIcon >
                    {getMainIcon(index)}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ),
          )}
        </List>
        <Divider />
        <Divider />
        <List>
          {secondaryItems.map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={NavLink}
                              to={item.path}
                              sx={{
                                  "&.active": {
                                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                                      fontWeight: "bold",
                                  },"& .MuiSvgIcon-root": {
                                      transition: "transform 0.3s ease-in-out",
                                  },
                                  "&:hover .MuiSvgIcon-root": {
                                      transform: "scale(1.1)",
                                  },
                              }}>
                <ListItemIcon>
                  {getSecondaryIcon(index)}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </div>
  );

  const container = window !== undefined ? () => document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <NKLogoIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Strona główna
          </Typography>
            <Box
                sx={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    height: "100%"
                }}
            >
                <Box
                    sx={{
                        width: { xs: "80px", sm: "100px", md: "120px" },
                        minWidth: "80px",
                        display: "flex",
                        alignItems: "center",
                        '& .MuiSelect-root': { 
                            height: "40px",
                        }
                    }}
                >
                    <NKLanguageSelect />
                </Box>
                <NKDarkLightSwitch />
            </Box>

        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
      </Box>
    </Box>
  );
}
