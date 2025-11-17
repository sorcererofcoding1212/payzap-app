"use client";

import { useRoutes } from "@/hooks/useRoutes";
import { cn, generateWalletId } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

export const DesktopSidebar = () => {
  const routes = useRoutes();
  const pathName = usePathname();
  const router = useRouter();
  const session = useSession();
  return (
    <div className="w-full h-full border-r border-base-300">
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
                  if (pathName === route.href) return;
                  if (!route.href) {
                    return;
                  }
                  router.push(route.href);
                }}
                key={route.label}
                className={cn(
                  "flex gap-x-3 w-[80%] justify-start items-center hover:cursor-pointer hover:bg-base-200 py-3 rounded-md px-4",
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
