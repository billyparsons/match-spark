// the last time a real entry (not a recorded gap) was added to the guestbook.
// keep this in sync by hand when a new entry actually lands — everything
// downstream of it (days-since, gap language) is computed at build time
// so it can never again go stale silently.
const LAST_ENTRY_DATE = new Date("2026-04-02T00:00:00Z");

module.exports = () => {
  const now = new Date();
  const daysSince = Math.floor((now - LAST_ENTRY_DATE) / (1000 * 60 * 60 * 24));
  return {
    lastEntryDate: "april 2, 2026",
    daysSince
  };
};
