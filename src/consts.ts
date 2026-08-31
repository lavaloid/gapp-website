export const SITE_TITLE = "GAPP";
export const SITE_DESCRIPTION =
  "A daily series of pencil puzzles designed to require little to no prior experience to solve. It is hosted on the Cracking the Cryptic's Discord server.";

export const GAPP_START_DATE = new Date(2021, 9, 27); // 2021 Oct 27
export const GAPP_PUBLISH_DELAY_DAYS = 7;
/**
 * This is the date of the first GAPP post that is posted in #daily-pencil-puzzles, and not
 * copy-pasted from #other-testing-submissions
 */
export const GAPP_CHANNEL_START_DATE = new Date("2021-11-21T00:00:00.000Z"); // 2021 Nov 21

/**
 * Specifies offsets for posts that are very late/early
 * start: + cuts off, - adds earlier posts (TODO)
 * end: + adds later posts, - removes posts
 */
export const POST_COUNT_OFFSETS: {
  [date: string]: { start?: number; end?: number };
} = {
  "2026-02-03": { end: 1 },
  "2026-02-04": { start: 1 },
  "2026-02-05": { end: 1 },
  "2026-02-06": { start: 1 },
};

export const RSS_POST_COUNT = 32;
