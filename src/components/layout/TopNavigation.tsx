import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardRouteMeta as dashboardRoutes } from "@/routes/meta";
import { Sheet, SheetContent, SheetTrigger } from "@/ui/sheet";
import NavItems from "./NavItems";

function MobileMenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-6 w-6 items-center justify-center">
      <Menu
        className={cn(
          "absolute h-6 w-6 transition-transform transition-opacity",
          open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
        )}
        aria-hidden="true"
      />
      <X
        className={cn(
          "absolute h-6 w-6 transition-transform transition-opacity",
          open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
        )}
        aria-hidden="true"
      />
    </span>
  );
}

export default function TopNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="p-2" aria-expanded={open}>
            <MobileMenuIcon open={open} />
            <span className="sr-only">Open navigation menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-4">
          <NavItems
            groups={dashboardRoutes}
            orientation="vertical"
            closeOnLinkClick
          />
        </SheetContent>
      </Sheet>
    </nav>
  );
}

