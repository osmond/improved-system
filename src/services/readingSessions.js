function aggregateReadingSessions(sessions, highlights = [], orders = []) {
  const titleByAsin = {};
  for (const o of orders) {
    const asin = o.ASIN;
    const title = o['Product Name'];
    if (asin && title && !titleByAsin[asin]) {
      titleByAsin[asin] = title;
    }
  }

  const highlightsByAsin = {};
  for (const h of highlights) {
    const asin = h.ASIN;
    const ts = h.created_timestamp;
    if (!asin || !ts) continue;
    if (!highlightsByAsin[asin]) highlightsByAsin[asin] = [];
    highlightsByAsin[asin].push(ts);
  }

  return sessions
    .filter((s) => {
      const ts = s.start_timestamp || s.end_timestamp;
      return ts && ts !== 'Not Available';
    })
    .map((s) => {
      const start =
        s.start_timestamp && s.start_timestamp !== 'Not Available'
          ? s.start_timestamp
          : s.end_timestamp;
      const end =
        s.end_timestamp && s.end_timestamp !== 'Not Available'
          ? s.end_timestamp
          : s.start_timestamp;
      const asin = s.ASIN;
      const title = titleByAsin[asin] || asin;
      const duration = Number(s.total_reading_millis || 0) / 60000;
      const list = highlightsByAsin[asin] || [];
      const highlightsCount = list.filter((ts) => ts >= start && ts <= end).length;
      return {
        start,
        end,
        asin,
        title,
        duration,
        highlights: highlightsCount,
      };
    })
    .sort((a, b) => a.start.localeCompare(b.start));
}

module.exports = { aggregateReadingSessions };
