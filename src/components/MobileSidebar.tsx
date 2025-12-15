"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ArrowLeft, MenuIcon, RefreshCcw } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarHeader, SidebarMenu, SidebarMenuItem } from "./ui/sidebar";
import { UserAvatar } from "./UserAvatar";
import { useRoutes } from "@/hooks/useRoutes";
import { cn, generateWalletId } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";
import { InteractiveScrollArea } from "./InteractiveScrollArea";
import { NotificationComponent } from "../features/notification/components/NotificationComponent";
import { ComponentLoader } from "./ComponentLoader";
import { useRealtimeNotifications } from "@/features/notification/hooks/useRealtimeNotifications";

interface MobileSidebarProps {
  name: string;
}

export const MobileSidebar = ({ name }: MobileSidebarProps) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const session = useSession();

  const {
    isNotificationOpen,
    setIsNotificationOpen,
    setNewNotificationsAvailable,
    newNotificationsAvailable,
    notifications,
    refetch,
    unreadNotifications,
    loading,
  } = useRealtimeNotifications();

  return (
    <Sheet
      modal={false}
      open={isOpen}
      onOpenChange={(value) => {
        if (isNotificationOpen) {
          setIsNotificationOpen(false);
        }
        setIsOpen(value);
      }}
    >
      <SheetTrigger asChild>
        <MenuIcon className="size-6 text-base-content" />
      </SheetTrigger>
      {isNotificationOpen ? (
        <SheetContent side="right" className="pt-14 flex">
          <SidebarHeader className="text-lg text-base-content font-medium">
            <div className="flex justify-center items-center relative">
              <div className="text-base-content text-lg">Notifications</div>
              <RefreshCcw
                onClick={() => {
                  if (!newNotificationsAvailable || loading) return;
                  setNewNotificationsAvailable(false);
                  refetch();
                }}
                className={cn(
                  "absolute right-2.5 cursor-pointer size-4 text-base-content",
                  newNotificationsAvailable && "animate-bounce"
                )}
              ></RefreshCcw>
            </div>
            <ArrowLeft
              onClick={() => {
                setIsNotificationOpen(false);
              }}
              className="absolute text-base-content top-5 left-5 size-5"
            />
          </SidebarHeader>
          <SidebarMenu className="mt-2">
            <InteractiveScrollArea className="mt-8 flex pb-4 items-center px-4 justify-center h-[75vh] w-full flex-col">
              {loading ? (
                <div className="w-full flex justify-center">
                  <ComponentLoader />
                </div>
              ) : notifications.length < 1 ? (
                <div className="text-base-content text-center">
                  No new notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <NotificationComponent
                    key={n.id}
                    notification={n}
                    refetch={refetch}
                  />
                ))
              )}
            </InteractiveScrollArea>
          </SidebarMenu>
        </SheetContent>
      ) : (
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
              session.data &&
              session.data.user && (
                <div className="h-12 mt-2 mb-4 rounded-md flex items-center justify-center text-sm bg-base-300 font-medium">
                  {generateWalletId(session.data.user.email)}
                </div>
              )
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

                    if (route.label === "Notifications") {
                      setIsNotificationOpen(true);
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
                  {route.label === "Notifications" &&
                    unreadNotifications > 0 && (
                      <div className="absolute right-5 rounded-full size-2.5 bg-orange-500/80" />
                    )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SheetContent>
      )}
    </Sheet>
  );
};
