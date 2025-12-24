"use client";

import { poppins } from "@/fonts/poppins";
import { validateSession } from "@/actions/validateSession";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const DashboardButton = () => {
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const route = useRouter();
  const navigateToDashboard = async () => {
    try {
      setIsNavigating(true);
      const session = await validateSession();
      if (!session.user.id) route.push("/signin");
      else route.push("/dashboard");
    } catch (error) {
      console.log(error);
    } finally {
      setIsNavigating(false);
    }
  };
  return (
    <div className="lg:relative bg-base-content h-full overflow-hidden group">
      <div className="lg:absolute inset-0 lg:bg-purple-600 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
      <button
        disabled={isNavigating}
        onClick={navigateToDashboard}
        className={cn(
          `relative z-10 flex items-center text-sm text-base-100 lg:text-base lg:hover:cursor-pointer h-full px-4 lg:px-6 lg:text-base-transition-colors duration-300 lg:group-hover:text-white ${poppins.className}`,
          isNavigating && "animate-pulse"
        )}
      >
        Dashboard
      </button>
    </div>
  );
};
