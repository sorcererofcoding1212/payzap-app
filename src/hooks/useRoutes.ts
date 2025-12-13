import { onLogout } from "@/lib/utils";
import { IconType } from "react-icons/lib";
import {
  LuArrowLeftRight,
  LuHouse,
  LuClock,
  LuLogOut,
  LuWallet,
  LuBell,
  LuArrowRightFromLine,
} from "react-icons/lu";

interface RouteProp {
  label: string;
  href?: string;
  icon: IconType;
  onClick?: () => void;
  color?: string;
}

export const useRoutes = () => {
  const routes: RouteProp[] = [
    {
      label: "Home",
      href: "/",
      icon: LuHouse,
    },
    {
      label: "Transfer",
      href: "/transfer",
      icon: LuArrowLeftRight,
    },
    {
      label: "Request",
      href: "/request",
      icon: LuArrowRightFromLine,
    },
    {
      label: "Transactions",
      href: "/transactions",
      icon: LuClock,
    },
    {
      label: "Balance",
      href: "/balance",
      icon: LuWallet,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: LuBell,
    },
    {
      label: "Logout",
      icon: LuLogOut,
      onClick: onLogout,
      color: "text-error",
    },
  ];

  return routes;
};
