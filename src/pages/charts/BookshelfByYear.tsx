import React from "react";
import useReadingSessions from "@/hooks/useReadingSessions";
import BookshelfByYear from "@/components/bookshelf/BookshelfByYear";

export default function BookshelfByYearPage() {
  const { data, error, isLoading } = useReadingSessions();
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Bookshelf by Year</h1>
      {error ? (
        <div>Failed to load sessions</div>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : (
        <BookshelfByYear sessions={data || []} />
      )}
    </div>
  );
}
