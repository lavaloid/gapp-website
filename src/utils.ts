import { GAPP_PUBLISH_DELAY_DAYS, GAPP_START_DATE } from "./consts";

/**
 * Get all integers from `from` to `to` inclusive
 */
export const range = (from: number, to: number) =>
  Array.from({
    length: to - from + 1,
  }).map((_, i) => i + from);

export const formatISODate = (date: Date) => {
  // using .toLocaleDateString("sv") will output the date formatted
  // as ISO 8601. thank you sweden
  return date.toLocaleDateString("sv");
};

export const formatReadableDate = (date: Date) =>
  date.toLocaleDateString("en-UK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const canDisplayPost = (date: Date) =>
  date >= GAPP_START_DATE &&
  (+new Date() - +date) / (24 * 60 * 60 * 1000) > GAPP_PUBLISH_DELAY_DAYS;
