import { onLogout } from "@/lib/utils";
import { IconType } from "react-icons/lib";
import {
  LuArrowLeftRight,
  LuHouse,
  LuClock,
  LuLogOut,
  LuWallet,
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
      label: "Logout",
      icon: LuLogOut,
      onClick: onLogout,
      color: "text-error",
    },
  ];

  return routes;
};
