import React from "react";
import MobileTabBar from "@/components/layout/MobileTabBar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

interface MobileTabLayoutProps {
  children: React.ReactNode;
}

export default function MobileTabLayout({ children }: MobileTabLayoutProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto p-4">
        <Breadcrumbs />
        {children}
      </div>
      <MobileTabBar className="md:hidden" />
    </div>
  );
}

