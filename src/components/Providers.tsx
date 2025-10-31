"use client";

import { ReactNode, useState } from "react";
import { Toaster } from "./ui/sonner";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProvdersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvdersProps) => {
  const [client] = useState(() => new QueryClient());
  const isMobile = useIsMobile();
  return (
    <>
      <QueryClientProvider client={client}>
        <SessionProvider>
          <Toaster position={isMobile ? "top-center" : "top-right"} />
          {children}
        </SessionProvider>
      </QueryClientProvider>
    </>
  );
};
