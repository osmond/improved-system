import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { dashboardRoutes } from "@/routes";

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const allRoutes = dashboardRoutes.flatMap((group) => group.items);
  const filtered = allRoutes.filter((route) =>
    route.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    setOpen(false);
    setQuery("");
    navigate(path);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0">
        <div className="p-2">
          <input
            autoFocus
            className="mb-2 w-full border-b bg-transparent px-2 py-1 outline-none"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ul className="max-h-60 overflow-y-auto">
            {filtered.map((route) => (
              <li key={route.to}>
                <button
                  className="block w-full px-2 py-1 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleSelect(route.to)}
                >
                  {route.label}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-2 py-1 text-sm text-muted-foreground">
                No results found.
              </li>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
