import React from "react";
import MobileTabBar from "@/components/layout/MobileTabBar";

interface MobileTabLayoutProps {
  children: React.ReactNode;
}

export default function MobileTabLayout({ children }: MobileTabLayoutProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">{children}</div>
      <MobileTabBar className="md:hidden" />
    </div>
  );
}

