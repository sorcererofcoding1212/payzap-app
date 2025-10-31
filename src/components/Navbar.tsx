"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserAvatar } from "./UserAvatar";
import { MobileSidebar } from "./MobileSidebar";
import { onLogout } from "@/lib/utils";
import { Button } from "./ui/button";
import { useSocketStore } from "@/store/socketStore";
import { Skeleton } from "./ui/skeleton";

export const Navbar = () => {
  const pathName = usePathname();
  const { data, status } = useSession();
  const isSigninPage = pathName === "/signin";
  const isMobile = useIsMobile();
  const setSocket = useSocketStore((state) => state.setSocket);
  const socket = useSocketStore((state) => state.socket);
  return (
    <nav className="flex items-center w-full justify-between px-3 md:px-4 py-2 h-14.5 lg:h-16 border-b border-base-300 shadow-xs bg-base-100">
      <div className="italic font-bold text-base-content text-lg md:text-xl">
        Payzap
      </div>
      <div className="flex gap-x-3 md:gap-x- items-center">
        {data?.user && !isMobile && <UserAvatar name={data.user.name} />}

        {status === "loading" ? (
          <div className="block lg:flex lg:gap-x-3">
            <div className="hidden lg:block">
              <Skeleton className="size-8.5 rounded-full" />
            </div>
            <div>
              <Skeleton className="h-6 lg:h-8.5 rounded lg:rounded-md w-6 lg:w-22" />
            </div>
          </div>
        ) : status === "authenticated" && data.user ? (
          <Button
            className="hidden lg:block"
            size={"variable"}
            variant={"destructive"}
            onClick={() => {
              socket?.close();
              setSocket(null);
              onLogout();
            }}
          >
            Logout
          </Button>
        ) : (
          <Link href={isSigninPage ? "/signup" : "/signin"}>
            <Button variant={"primary"} size={"variable"}>
              {isSigninPage ? "Register" : "Login"}
            </Button>
          </Link>
        )}

        {status === "authenticated" && data.user ? (
          <div className="lg:hidden">
            <MobileSidebar name={data.user.name} />
          </div>
        ) : null}
      </div>
    </nav>
  );
};
