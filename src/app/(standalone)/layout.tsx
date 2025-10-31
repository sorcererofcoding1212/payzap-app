import { StandaloneNavbar } from "@/features/standalone/components/StandaloneNavbar";
import React from "react";
import { Poppins } from "next/font/google";

interface StandaloneLayoutProps {
  children: React.ReactNode;
}

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "500", "800"],
});

const StandaloneLayout = ({ children }: StandaloneLayoutProps) => {
  return (
    <div>
      <StandaloneNavbar />
      <div>{children}</div>
    </div>
  );
};

export default StandaloneLayout;
