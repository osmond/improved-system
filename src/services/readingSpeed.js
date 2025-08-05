const MAX_WPM = 2000;
const MIN_DURATION_MILLIS = 60 * 1000;

function calculateReadingSpeeds(sessions) {
  return sessions
    .filter((s) => {
      const ts = s.start_timestamp || s.end_timestamp;
      const millis = Number(s.total_reading_millis || 0);
      return ts && ts !== 'Not Available' && millis >= MIN_DURATION_MILLIS;
    })
    .map((s) => {
      const start =
        s.start_timestamp && s.start_timestamp !== 'Not Available'
          ? s.start_timestamp
          : s.end_timestamp;
      const minutes = Number(s.total_reading_millis || 0) / 60000;
      const pages = Number(s.number_of_page_flips || 0);
      const words = pages * 250;
      const wpm = minutes > 0 ? Math.min(words / minutes, MAX_WPM) : 0;
      const hour = new Date(start).getHours();
      const period = hour < 12 ? 'morning' : 'evening';
      return {
        start,
        asin: s.ASIN,
        wpm,
        period,
      };
    })
    .sort((a, b) => a.start.localeCompare(b.start));
}

module.exports = { calculateReadingSpeeds };
