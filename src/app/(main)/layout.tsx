import { DesktopSidebar } from "@/components/DesktopSidebar";
import { Navbar } from "@/components/Navbar";
import { SocketProvider } from "@/components/SocketProvider";
import React from "react";

const MainAppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SocketProvider>
      <div className="min-h-screen relative">
        <div>
          <Navbar />
        </div>
        <aside className="h-full w-full hidden lg:block fixed overflow-y-auto lg:w-72">
          <DesktopSidebar />
        </aside>
        <main className="lg:mt-8 mt-5 lg:pl-72">{children}</main>
      </div>
    </SocketProvider>
  );
};

export default MainAppLayout;
