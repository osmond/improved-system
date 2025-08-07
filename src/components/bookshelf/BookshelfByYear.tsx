import React, { useEffect, useMemo, useState } from "react";
import type { KindleSession } from "@/lib/api";

interface BookshelfByYearProps {
  sessions: KindleSession[];
}

interface BookInfo {
  asin: string;
  title: string;
  year: number;
  firstDate: Date;
  totalMinutes: number;
  totalHighlights: number;
}

function BookCover({ title }: { title: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchCover() {
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1`,
          { signal: controller.signal }
        );
        const data = await res.json();
        const coverId = data?.docs?.[0]?.cover_i;
        if (coverId) {
          setUrl(`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`);
        }
      } catch {
        // ignore
      }
    }
    fetchCover();
    return () => {
      controller.abort();
    };
  }, [title]);

  return url ? (
    <img src={url} alt={title} className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full bg-muted flex items-center justify-center text-[10px] p-1 text-center">
      {title}
    </div>
  );
}

export default function BookshelfByYear({ sessions }: BookshelfByYearProps) {
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<number | "all">("all");

  const books = useMemo(() => {
    const map = new Map<string, BookInfo>();
    sessions.forEach((s) => {
      const startDate = new Date(s.start);
      const info = map.get(s.asin);
      if (!info) {
        map.set(s.asin, {
          asin: s.asin,
          title: s.title,
          year: startDate.getFullYear(),
          firstDate: startDate,
          totalMinutes: s.duration,
          totalHighlights: s.highlights,
        });
      } else {
        info.totalMinutes += s.duration;
        info.totalHighlights += s.highlights;
        if (startDate < info.firstDate) {
          info.firstDate = startDate;
          info.year = startDate.getFullYear();
        }
      }
    });
    return Array.from(map.values()).sort(
      (a, b) => a.firstDate.getTime() - b.firstDate.getTime()
    );
  }, [sessions]);

  const years = useMemo(
    () => Array.from(new Set(books.map((b) => b.year))).sort((a, b) => a - b),
    [books]
  );

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchesYear = yearFilter === "all" || b.year === yearFilter;
      const matchesSearch = b.title
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesYear && matchesSearch;
    });
  }, [books, yearFilter, search]);

  const grouped = useMemo(() => {
    const m = new Map<number, BookInfo[]>();
    filtered.forEach((b) => {
      if (!m.has(b.year)) m.set(b.year, []);
      m.get(b.year)!.push(b);
    });
    return Array.from(m.entries()).sort((a, b) => a[0] - b[0]);
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        />
        <select
          value={yearFilter}
          onChange={(e) =>
            setYearFilter(
              e.target.value === "all" ? "all" : parseInt(e.target.value, 10)
            )
          }
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="all">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      {grouped.map(([year, items]) => (
        <div key={year} className="space-y-2">
          {yearFilter === "all" && (
            <h2 className="text-lg font-semibold">{year}</h2>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {items.map((b) => (
              <div
                key={b.asin}
                className="relative group aspect-[2/3] overflow-hidden rounded shadow"
              >
                <BookCover title={b.title} />
                <div className="absolute inset-0 bg-black/70 text-white text-[10px] opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center p-2 text-center">
                  <div className="font-semibold mb-1">{b.title}</div>
                  <div>{b.totalMinutes.toFixed(1)} min</div>
                  <div>{b.totalHighlights} highlights</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
