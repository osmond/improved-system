import React from "react";
import type { DashboardRoute } from "@/routes";

function fuzzyMatch(query: string, target: string) {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      qi++;
    }
  }
  return qi === q.length;
}

interface SearchBarProps {
  routes: DashboardRoute[];
  onResults: (matches: string[]) => void;
}

export default function SearchBar({ routes, onResults }: SearchBarProps) {
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (!query) {
      onResults([]);
      return;
    }
    const matches = routes
      .filter(
        (r) =>
          fuzzyMatch(query, r.label) ||
          (r.description && fuzzyMatch(query, r.description)) ||
          r.tags?.some((tag) => fuzzyMatch(query, tag))
      )
      .map((r) => r.to);
    onResults(matches);
  }, [query, routes, onResults]);

  return (
    <input
      type="search"
      placeholder="Search..."
      aria-label="Search routes"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="mb-2 w-full rounded-md border bg-background px-2 py-1 text-sm"
    />
  );
}

