import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/ui/sheet";
import NavItems from "./NavItems";

export default function TopNavigation() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  return (
    <nav className="flex items-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="md:hidden p-2">
            <Menu className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">Open navigation menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-4">
          <NavItems
            className="flex flex-col gap-4"
            onNavigate={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
      <NavItems className="hidden md:flex gap-4" />
    </nav>
  );
}

