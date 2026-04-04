import rss from "@astrojs/rss";
import {
  GAPP_PUBLISH_DELAY_DAYS,
  RSS_POST_COUNT,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "../consts";
import {
  formatISODate,
  formatReadableDate,
  range,
  startOfDate,
} from "../utils";

export async function GET(context) {
  const today = new Date();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    stylesheet: "/styles.xsl",
    items: range(0, RSS_POST_COUNT - 1).map((i) => {
      const date = startOfDate(
        new Date(
          +today -
            (GAPP_PUBLISH_DELAY_DAYS + (RSS_POST_COUNT - i - 1)) *
              24 *
              60 *
              60 *
              1000,
        ),
      );
      return {
        title: formatReadableDate(date),
        link: `/archive/${formatISODate(date)}`,
        pubDate: startOfDate(
          new Date(+today - (RSS_POST_COUNT - i - 1) * 24 * 60 * 60 * 1000),
        ).toISOString(),
				// TODO: add content? idk i dont feel like thinking about it rn
      };
    }).toReversed(),
  });
}
