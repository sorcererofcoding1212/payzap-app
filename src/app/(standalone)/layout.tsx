import { StandaloneNavbar } from "@/features/standalone/components/StandaloneNavbar";
import React from "react";

interface StandaloneLayoutProps {
  children: React.ReactNode;
}

const StandaloneLayout = ({ children }: StandaloneLayoutProps) => {
  return (
    <div>
      <StandaloneNavbar />
      <div>{children}</div>
    </div>
  );
};

export default StandaloneLayout;
