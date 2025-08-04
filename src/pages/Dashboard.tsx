import React from "react";
import { Outlet } from "react-router-dom";
import SidebarLayout from "@/layouts/SidebarLayout";
import MobileTabLayout from "@/layouts/MobileTabLayout";

export default function Dashboard() {
  return (
    <>
      <div className="hidden h-full md:block">
        <SidebarLayout>
          <Outlet />
        </SidebarLayout>
      </div>
      <div className="h-full md:hidden">
        <MobileTabLayout>
          <Outlet />
        </MobileTabLayout>
      </div>
    </>
  );
}
