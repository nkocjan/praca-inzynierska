import { ReactNode } from "react";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export const DRAWER_WIDTH = 264;

export interface NavItem {
  path: string;
  labelKey: string;
  icon: ReactNode;
}

export const NAV_SECTIONS: { titleKey: string; items: NavItem[] }[] = [
  {
    titleKey: "sections.finance",
    items: [
      { path: "/", labelKey: "menu.home", icon: <SpaceDashboardOutlinedIcon /> },
      { path: "/expenses", labelKey: "menu.expenses", icon: <ReceiptLongOutlinedIcon /> },
      { path: "/budget", labelKey: "menu.budget", icon: <AccountBalanceWalletOutlinedIcon /> },
      { path: "/categories", labelKey: "menu.categories", icon: <CategoryOutlinedIcon /> },
    ],
  },
  {
    titleKey: "sections.account",
    items: [
      { path: "/information", labelKey: "secondary.information", icon: <InfoOutlinedIcon /> },
      { path: "/settings", labelKey: "secondary.settings", icon: <SettingsOutlinedIcon /> },
    ],
  },
];

export const findNavItem = (pathname: string) =>
  NAV_SECTIONS.flatMap(section => section.items).find(item => item.path === pathname);
