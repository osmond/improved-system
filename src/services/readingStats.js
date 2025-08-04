function aggregateDailyReading(sessions) {
  const totals = {};
  for (const s of sessions) {
    const ts = s.start_timestamp && s.start_timestamp !== 'Not Available'
      ? s.start_timestamp
      : s.end_timestamp;
    if (!ts || ts === 'Not Available') continue;
    const date = ts.slice(0, 10);
    const minutes = Number(s.total_reading_millis || 0) / 60000;
    const pages = Number(s.number_of_page_flips || 0);
    if (!totals[date]) {
      totals[date] = { date, minutes: 0, pages: 0 };
    }
    totals[date].minutes += minutes;
    totals[date].pages += pages;
  }
  return Object.values(totals).sort((a, b) => a.date.localeCompare(b.date));
}

module.exports = { aggregateDailyReading };
