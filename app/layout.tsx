import type { ReactNode } from "react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import AppNavbar from "@/components/app-navbar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main>
            <div className="flex items-center justify-between p-4">
              <SidebarTrigger className="md:hidden" />
              <AppNavbar className="hidden md:block" />
            </div>
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
