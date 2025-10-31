import { Navbar } from "@/components/Navbar";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen">
      <div>
        <Navbar />
      </div>
      <main className="mt-10">{children}</main>
    </div>
  );
};

export default AuthLayout;
