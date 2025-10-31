"use client";

import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { MenuIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarHeader, SidebarMenu, SidebarMenuItem } from "./ui/sidebar";
import { UserAvatar } from "./UserAvatar";
import { useRoutes } from "@/hooks/useRoutes";
import { cn, generateWalletId } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";

interface MobileSidebarProps {
  name: string;
}

export const MobileSidebar = ({ name }: MobileSidebarProps) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    setIsOpen(false);
  }, [pathName]);
  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <MenuIcon className="size-6 text-base-content" />
      </SheetTrigger>
      <SheetContent side="right" className="pt-14 flex">
        <SidebarHeader className="text-lg text-base-content font-medium">
          <div className="flex gap-x-3 px-6 items-center">
            <UserAvatar name={name} />
            <div className="text-base-content">{name}</div>
          </div>
          {session.status === "loading" ? (
            <div className="h-12 mt-2 mb-4 rounded-md px-8">
              <Skeleton className="h-[80%]" />
            </div>
          ) : (
            <div className="h-12 mt-2 mb-4 rounded-md flex items-center justify-center text-sm bg-base-300 font-medium">
              {generateWalletId(
                session.data?.user.email || "johndoe@gmail.com"
              )}
            </div>
          )}
        </SidebarHeader>
        <SidebarMenu className="mt-2">
          {routes.map((route) => {
            const isActive = pathName === route.href;
            return (
              <SidebarMenuItem
                onClick={() => {
                  if (route.onClick) {
                    route.onClick();
                    router.push("/signin");
                    return;
                  }

                  if (pathName === route.href) return;
                  if (!route.href) {
                    return;
                  }
                  router.push(route.href);
                }}
                className={cn(
                  "flex px-6 mx-4 rounded-md text-base-content gap-x-5 items-center py-3",
                  isActive && "bg-base-300",
                  route.color && `${route.color}`
                )}
                key={route.label}
              >
                <route.icon size={19} />
                <div>{route.label}</div>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SheetContent>
    </Sheet>
  );
};
