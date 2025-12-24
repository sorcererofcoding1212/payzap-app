"use client";

import { useRoutes } from "@/hooks/useRoutes";
import { cn, generateWalletId } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { RefreshCcw, XIcon } from "lucide-react";
import { InteractiveScrollArea } from "./InteractiveScrollArea";
import { NotificationComponent } from "../features/notification/components/NotificationComponent";
import { ComponentLoader } from "./ComponentLoader";
import { useRealtimeNotifications } from "@/features/notification/hooks/useRealtimeNotifications";
import { useRef } from "react";

export const DesktopSidebar = () => {
  const routes = useRoutes();
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

  const scrollRef = useRef<null | HTMLDivElement>(null);

  const scrollTowardsEnd = () => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  return (
    <div className="w-full h-full border-r border-base-300">
      {isNotificationOpen ? (
        <div className="w-full h-full relative pt-18 px-2">
          <div className="text-center text-white text-lg font-medium">
            <XIcon
              onClick={() => {
                setIsNotificationOpen(false);
              }}
              className="absolute top-5 right-5 text-base-content size-5 hover:cursor-pointer"
            />
            <div className="flex justify-center items-center relative">
              <div className="text-base-content text-lg">Notifications</div>
              <RefreshCcw
                onClick={() => {
                  if (!newNotificationsAvailable || loading) return;
                  setNewNotificationsAvailable(false);
                  refetch();
                }}
                className={cn(
                  "absolute right-4 cursor-pointer size-4 text-base-content",
                  newNotificationsAvailable && "animate-bounce"
                )}
              ></RefreshCcw>
            </div>
          </div>
          <InteractiveScrollArea
            onClick={scrollTowardsEnd}
            className="mt-8 flex pb-4 items-center px-4 justify-center h-[75vh] w-full flex-col"
          >
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
            <div className="h-2" ref={scrollRef}></div>
          </InteractiveScrollArea>
        </div>
      ) : (
        <div className="w-full h-full">
          <div className="w-full flex justify-center pt-18 items-center text-base-content">
            {session.status === "loading" ? (
              <Skeleton className="h-12" />
            ) : (
              session.data &&
              session.data.user && (
                <div className="h-12 rounded-md flex items-center text-sm px-8 bg-base-300 font-medium">
                  {generateWalletId(session.data.user.email)}
                </div>
              )
            )}
          </div>
          <div className="pt-10 w-full flex items-center gap-y-2 flex-col">
            {routes.map((route) => {
              const isActive = pathName === route.href;
              return (
                <div
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
                  key={route.label}
                  className={cn(
                    "flex gap-x-3 w-[80%] relative justify-start items-center hover:cursor-pointer hover:bg-base-200 py-3 rounded-md px-4",
                    isActive && "bg-base-300"
                  )}
                >
                  <route.icon
                    size={20}
                    className={cn(
                      route.color ? `${route.color}` : "text-base-content"
                    )}
                  />
                  <div
                    className={cn(
                      route.color ? `${route.color}` : "text-base-content"
                    )}
                  >
                    {route.label}
                  </div>
                  {route.label === "Notifications" &&
                    unreadNotifications > 0 && (
                      <div className="absolute right-5 rounded-full size-2.5 bg-orange-500/80" />
                    )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
