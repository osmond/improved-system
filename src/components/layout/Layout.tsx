import React from "react";
import { useLocation } from "react-router-dom";
import ThemeToggle from "@/components/ui/theme-toggle";
import CommandPalette from "@/components/ui/CommandPalette";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Command, Download, Info, Save, Share2 } from "lucide-react";
import GlobalNavigation from "@/components/global-navigation";
import {
  ChartActionsProvider,
  useChartActions,
} from "@/hooks/useChartActions";
import useRecentViews from "@/hooks/useRecentViews";

interface LayoutProps {
  children: React.ReactNode;
}

function ActionMenu() {
  const { actions } = useChartActions();
  const { onSaveView, onShare, onExport, info } = actions;

  return (
    <>
      {onSaveView && (
        <Button
          variant="outline"
          size="sm"
          onClick={onSaveView}
          aria-label="Save view"
        >
          <Save className="h-4 w-4" />
          <span className="sr-only">Save View</span>
        </Button>
      )}
      {onShare && (
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          aria-label="Share"
        >
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
      )}
      {onExport && (
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          aria-label="Export"
        >
          <Download className="h-4 w-4" />
          <span className="sr-only">Export</span>
        </Button>
      )}
      {info && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                aria-label="Chart info"
              >
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{info}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
}

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const { addRecentView } = useRecentViews();

  React.useEffect(() => {
    addRecentView(location.pathname);
  }, [location.pathname, addRecentView]);

  return (
    <ChartActionsProvider>
      <CommandPalette open={open} setOpen={setOpen} />
      <div className="relative flex w-full flex-1 flex-col bg-background">
        <header className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <GlobalNavigation />
          </div>
          <div className="flex items-center gap-2">
            <ActionMenu />
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(true)}
                >
                  <Command className="h-4 w-4" />
                  <span className="sr-only">Open command palette</span>
                </Button>
                </TooltipTrigger>
                <TooltipContent>Ctrl/⌘+K</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 pt-0">{children}</main>
      </div>
    </ChartActionsProvider>
  );
}
