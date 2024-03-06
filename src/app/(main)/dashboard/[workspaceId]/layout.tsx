import MobileSidebar from "@/components/sidebar/mobile-sidebar";
import Sidebar from "@/components/sidebar/sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: any;
}

const Layout = ({ children, params }: LayoutProps) => {
  return (
    <main
      className="flex overflow-hidden
      h-screen
      w-screen
  "
    >
      <Sidebar params={params} />
      <MobileSidebar>
        <Sidebar params={params} className="w-screen sm:hidden inline-block" />
      </MobileSidebar>
      <div
        className="dark:border-neutrals/neutrals-12/70
        border-l-[1px]
        w-full
        relative
      "
      >
        {children}
      </div>
    </main>
  );
};

export default Layout;
