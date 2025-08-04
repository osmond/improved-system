import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/ui/sidebar";
import SidebarNavigation from "@/components/layout/sidebar-navigation";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarNavigation />
        <SidebarFooter />
      </Sidebar>
      <SidebarInset className="p-4">
        <Breadcrumbs />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

